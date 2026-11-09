import { readFileSync } from 'node:fs'
import { posix, resolve, win32 } from 'node:path'
import { pathToFileURL } from 'node:url'

const LIFETIME = { 1: 1800000, 2: 86400000 }
const PLATFORM = /^(windows-(x64|x86|arm64)|macos-(x64|arm64))$/

// The program the receipt must name: beside connector.exe for schema 1, inside
// the Skill named by the request for schema 2.
function expectedNative(prepared) {
  const r = prepared.request
  if (r.schemaVersion === 1) return win32.join(win32.dirname(prepared.connectorPath ?? ''), 'dsphere-native-agent.exe')
  return r.platform.startsWith('windows-')
    ? win32.join(r.skillRoot, 'assets', 'native', r.platform, 'dsphere-native-agent.exe')
    : posix.join(r.skillRoot, 'assets', 'native', r.platform, 'dsphere-native-agent')
}

// A copied or browser-written result only verifies this setup handoff; live client checks remain mandatory.
export function verifyConnectResult(prepared, receipt, now = Date.now()) {
  const r = prepared.request
  const windows = r?.schemaVersion === 1 || String(r?.platform).startsWith('windows-')
  const path = windows ? win32 : posix
  const samePath = (a, b) => typeof a === 'string' && typeof b === 'string' && path.isAbsolute(a) && path.isAbsolute(b) &&
    (windows ? win32.normalize(a).toLowerCase() === win32.normalize(b).toLowerCase() : posix.normalize(a) === posix.normalize(b))
  const checked = Date.parse(receipt.checkedAt)
  const issued = Date.parse(r?.issuedAt)
  const expires = Date.parse(r?.expiresAt)
  const schema2 = r?.schemaVersion === 2
  // Releases without connector.exe write schema 2 requests with no connector hash, on every platform.
  const connectorOk = schema2 ? (r.connectorSha256 === undefined || /^[a-f0-9]{64}$/.test(r.connectorSha256)) : /^[a-f0-9]{64}$/.test(r?.connectorSha256)
  if (!r || !LIFETIME[r.schemaVersion] || !['production', 'test'].includes(prepared.channel) || !Number.isFinite(issued) || !Number.isFinite(expires) || expires - issued !== LIFETIME[r.schemaVersion] || issued > now + 60000 || !/^[a-f0-9]{64}$/.test(r.nativeSha256) || !connectorOk || !/^[a-f0-9]{48}$/.test(r.challenge) ||
    (schema2 && (r.version !== prepared.version || r.channel !== prepared.channel || !PLATFORM.test(r.platform) || !path.isAbsolute(r.skillRoot ?? ''))) ||
    receipt.schemaVersion !== 1 || receipt.status !== 'local-setup-complete' || receipt.challenge !== r.challenge ||
    receipt.version !== prepared.version || receipt.channel !== prepared.channel || receipt.nativeSha256 !== r.nativeSha256 || receipt.connectorSha256 !== r.connectorSha256 ||
    (schema2 && receipt.platform !== r.platform) ||
    !Number.isFinite(checked) || checked < Date.parse(r.issuedAt) || checked > now + 60000 || now >= Date.parse(r.expiresAt) || checked >= Date.parse(r.expiresAt)) throw new Error('Fresh matching setup evidence required')
  const registration = receipt.registration
  const descriptor = receipt.descriptor
  // The browser writes the key under its own product root (Software\<browser product>); macOS has no registry.
  const byBrowser = receipt.registeredBy === 'dsphere-browser'
  const rootOk = byBrowser
    ? (windows ? /^Software\\[A-Za-z0-9 ._-]{1,64}$/.test(registration?.registryRoot ?? '') : registration?.registryRoot === undefined)
    : registration?.registryRoot === 'Software\\Dsphere'
  if (registration?.status !== 'registered' || !rootOk || (byBrowser && !schema2) ||
      !samePath(registration.nativeAgentPath, descriptor?.command) || !samePath(registration.nativeAgentPath, expectedNative(prepared)) ||
      !/^[a-f0-9]{64}$/.test(receipt.manifestSha256 ?? '') || descriptor.transport !== 'stdio' || descriptor.name !== (prepared.channel === 'test' ? 'dsphere-agent-test' : 'dsphere-agent') ||
      JSON.stringify(descriptor.args) !== JSON.stringify(['mcp', 'serve', '--stdio']) || !path.isAbsolute(registration.manifestPath ?? '') ||
      !['C1', 'C2', 'C3'].every(id => receipt.checks?.filter(c => c.id === id).length === 1 && receipt.checks.find(c => c.id === id).status === 'passed') ||
      receipt.checks?.find(c => c.id === 'C5')?.status !== 'verify-in-codex') throw new Error('Registration evidence or descriptor does not match')
  return { ok: true, status: 'configured-awaiting-client-verification', descriptor }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    if (process.argv.length !== 4) throw new Error('Usage: node verify-connect-result.mjs prepared.json result.json')
    const read = path => { const bytes = readFileSync(path); if (bytes.length > 16384) throw new Error('Result exceeds limit'); return JSON.parse(bytes.toString('utf8').replace(/^﻿/, '')) }
    console.log(JSON.stringify(verifyConnectResult(read(process.argv[2]), read(process.argv[3]))))
  } catch (error) { console.error(JSON.stringify({ ok: false, message: error.message })); process.exitCode = 2 }
}
