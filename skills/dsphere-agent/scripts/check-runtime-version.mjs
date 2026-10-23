#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { realpathSync } from 'node:fs'

// Compare a response from the client's CURRENT MCP connection. This script
// never launches a Connector, changes a binding, or stops a process.
// Accepts the status however the client saved it: the raw MCP reply
// ({result:{structuredContent}} or {result:{content:[{text}]}}), the tool
// result ({structuredContent} or {content:[{text}]}), the ToolOutput ({ok,data})
// or the bare payload ({schemaVersion:1,...}). Audit D21: only two shapes passed.
export function unwrapStatus(response) {
  let node = response
  for (let depth = 0; depth < 4 && node && typeof node === 'object'; depth++) {
    if (node.schemaVersion === 1 && node.connector) return node
    if (node.ok === true && node.data) { node = node.data; continue }
    if (node.result && typeof node.result === 'object') { node = node.result; continue }
    if (node.structuredContent && typeof node.structuredContent === 'object') { node = node.structuredContent; continue }
    if (Array.isArray(node.content)) {
      const text = node.content.find(part => part?.type === 'text' && typeof part.text === 'string')?.text
      try { node = JSON.parse(text) } catch { return undefined }
      continue
    }
    return undefined
  }
  return node && typeof node === 'object' && node.schemaVersion === 1 && node.connector ? node : undefined
}

// A short and a full commit of the same build match by prefix (≥ 7 hex);
// build dates match by instant, so an offset-formatted copy of the same time passes.
const sameCommit = (a, b) => typeof a === 'string' && typeof b === 'string' && a.length >= 7 && b.length >= 7 && (a.toLowerCase().startsWith(b.toLowerCase()) || b.toLowerCase().startsWith(a.toLowerCase()))
const sameInstant = (a, b) => Number.isFinite(Date.parse(a)) && Date.parse(a) === Date.parse(b)

export function checkRuntimeVersion(manifest, response, instanceId) {
  const result = (status, action) => ({ verified: status === 'verified', status, action })
  const expected = { version: manifest?.nativeVersion, commit: manifest?.sourceCommit, buildDate: manifest?.builtAt }
  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(expected.version ?? '') ||
      !/^[0-9a-f]{7,64}$/i.test(expected.commit ?? '') || !Number.isFinite(Date.parse(expected.buildDate))) {
    return result('expected-build-unknown', 'Validate or reinstall the complete Skill package.')
  }
  const data = unwrapStatus(response)
  if (data?.schemaVersion !== 1 || !data.connector || !Array.isArray(data.runtimes)) {
    return result('status-unavailable', 'Refresh the current MCP connection and query dsagent_get_runtime_status again.')
  }
  const matches = build => build?.version === expected.version && sameCommit(build?.commit, expected.commit) && sameInstant(build?.buildDate, expected.buildDate)
  if (!matches(data.connector)) return result('connector-update-required', 'Reconnect MCP; restart the AI client if its current server stays old.')
  if (data.discoveryStatus !== 'complete') return result('discovery-incomplete', 'Resolve incomplete runtime discovery before declaring the upgrade complete.')
  if (typeof instanceId !== 'string' || !instanceId || instanceId.length > 128) {
    return result('browser-not-confirmed', 'Select the intended online DSphere browser instance using dsagent_list_instances.')
  }
  const selected = data.runtimes.filter(r => r?.extension?.instanceId === instanceId)
  if (selected.length > 1) return result('runtime-ambiguous', 'Resolve multiple runtime claims for the selected browser.')
  if (!selected.length) {
    if (data.runtimes.some(r => r?.status === 'unsupported' || r?.status === 'unavailable')) {
      return result('runtime-version-unavailable', 'Check the browser binding and restart the selected browser; runtime version is not confirmed.')
    }
    return result('browser-offline', 'Check the selected browser and extension connection; preserve the pending task.')
  }
  const runtime = selected[0]
  if (runtime.status !== 'available') return result('runtime-version-unavailable', 'Check the browser runtime and re-query after reconnection.')
  if (!matches(runtime.build)) return result('runtime-update-required', 'Verify the selected browser binding, then fully quit and reopen that browser.')
  if (runtime.extension?.status !== 'online' || runtime.extension?.browserProduct !== 'dsphere') {
    return result('browser-not-confirmed', 'Verify that the selected DSphere browser extension is online.')
  }
  return result('verified', 'Both running builds match the bundled Native Agent and the selected browser is online.')
}

const invokedDirectly = () => { try { return process.argv[1] && realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(process.argv[1])) } catch { return false } }
if (invokedDirectly()) {
  try {
    const args = process.argv.slice(2)
    if (args.length !== 4 || args[0] !== '--status' || args[2] !== '--instance-id') throw new Error('usage')
    const manifest = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../assets/native/manifest.json'), 'utf8'))
    const response = JSON.parse(readFileSync(args[1], 'utf8'))
    const output = checkRuntimeVersion(manifest, response, args[3])
    console.log(JSON.stringify(output))
    process.exitCode = output.verified ? 0 : 2
  } catch {
    console.log(JSON.stringify({ verified: false, status: 'invalid-input', action: 'Use --status <saved MCP response.json> --instance-id <selected instance>; the installed Skill manifest must be valid.' }))
    process.exitCode = 2
  }
}
