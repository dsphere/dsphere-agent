#!/usr/bin/env node
// Verify an installed copy of this Skill against the manifests it ships with.
// Node only, no dependencies, read-only:
//   node scripts/verify-package.mjs [<skill directory>]
// Prints one JSON object and exits 0 when every check passes, 2 otherwise.
//
// What is checked, and how each hash is computed (the manifests say the same):
// - SKILL.md: name and metadata.version; the name must match the channel in
//   assets/release-channel.json (dsphere-agent ↔ production, dsphere-agent-test ↔ test).
// - assets/native/manifest.json: size and SHA-256 of each executable as bytes.
// - assets/capability-build.json: per contract, `sha256` = SHA-256 of
//   JSON.stringify(parsed contract) and (schema 2) `fileSha256` = SHA-256 of the
//   contract file bytes with CRLF→LF.
// - assets/promotion-manifest.json: schema 2 and 3 `shipped` = SHA-256 of each file
//   as published, with CRLF→LF for every file except the declared executables
//   (assets/native/<platform>/dsphere-native-agent[.exe]), so a Git checkout on any
//   platform verifies; a schema 1 receipt only carries the production-identity
//   hash, so its channel-wrapper files are reported, not failed.
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const lf = bytes => Buffer.from(bytes.toString('utf8').replaceAll('\r\n', '\n'))
const EXECUTABLE = /^assets\/native\/[^/]+\/(?:dsphere-native-agent(?:\.exe)?|connector\.exe)$/
const WRAPPERS =/^(?:SKILL\.md|agents\/openai\.yaml|references\/(?:guide|setup-macos|setup-windows|client-setup|skill-install-update)\.(?:en|zh-CN)\.md|scripts\/(?:detect-macos\.sh|detect-windows\.ps1|complete-windows-registration\.ps1))$/

function listFiles(root) {
  const out = []
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name)
    if (entry.isDirectory()) out.push(...listFiles(path))
    else if (entry.isFile()) out.push(path)
  }
  return out.sort()
}

export function verifyPackage(skillDir) {
  const root = resolve(skillDir)
  const checks = []
  const check = (name, ok, details) => { checks.push({ name, status: ok ? 'pass' : 'fail', ...(details ? { details } : {}) }); return ok }
  const readJson = path => JSON.parse(readFileSync(join(root, path), 'utf8'))

  const skill = readFileSync(join(root, 'SKILL.md'), 'utf8')
  const name = skill.match(/^name: (.+?)\r?$/m)?.[1]
  const version = skill.match(/^  version: "(\d+\.\d+\.\d+)"\r?$/m)?.[1]
  check('skill-identity', Boolean(name && version), { name, version })

  let channel = 'production'
  if (existsSync(join(root, 'assets/release-channel.json'))) {
    const sidecar = readJson('assets/release-channel.json')
    channel = sidecar.channel
    const expectedName = channel === 'test' ? 'dsphere-agent-test' : 'dsphere-agent'
    check('release-channel', sidecar.schemaVersion === 1 && ['test', 'production'].includes(channel) && name === expectedName, { channel, name, expectedName })
  } else {
    check('release-channel', name === 'dsphere-agent', { note: 'no assets/release-channel.json: an unpackaged source tree, treated as production', name })
  }

  try {
    const native = readJson('assets/native/manifest.json')
    const problems = []
    if (native.skillVersion !== version) problems.push(`manifest skillVersion ${native.skillVersion} ≠ SKILL.md ${version}`)
    for (const artifact of native.artifacts ?? []) {
      const path = join(root, 'assets/native', artifact.path)
      if (!existsSync(path)) { problems.push(`${artifact.path}: missing`); continue }
      const bytes = readFileSync(path)
      if (bytes.length !== artifact.size) problems.push(`${artifact.path}: size ${bytes.length} ≠ ${artifact.size}`)
      if (sha256(bytes) !== artifact.sha256) problems.push(`${artifact.path}: sha256 differs`)
    }
    check('native-manifest', problems.length === 0 && [4, 8].includes((native.artifacts ?? []).length), { artifacts: (native.artifacts ?? []).length, problems })
  } catch (error) { check('native-manifest', false, { error: error.message }) }

  try {
    const build = readJson('assets/capability-build.json')
    const problems = []
    for (const entry of build.capabilities ?? []) {
      const path = join(root, 'references/contracts', `${entry.method}.json`)
      if (!existsSync(path)) { problems.push(`${entry.method}: contract file missing`); continue }
      const bytes = readFileSync(path)
      if (sha256(JSON.stringify(JSON.parse(bytes.toString('utf8')))) !== entry.sha256) problems.push(`${entry.method}: sha256 differs`)
      if (build.schemaVersion >= 2 && sha256(lf(bytes)) !== entry.fileSha256) problems.push(`${entry.method}: fileSha256 differs`)
    }
    const contracts = existsSync(join(root, 'references/contracts')) ? readdirSync(join(root, 'references/contracts')).filter(n => n.endsWith('.json')).length : 0
    if (contracts !== (build.capabilities ?? []).length) problems.push(`${contracts} contract files for ${(build.capabilities ?? []).length} manifest entries`)
    check('capability-build', problems.length === 0, { schemaVersion: build.schemaVersion, capabilities: (build.capabilities ?? []).length, sourceExtensionVersion: build.sourceExtensionVersion, problems })
  } catch (error) { check('capability-build', false, { error: error.message }) }

  if (existsSync(join(root, 'assets/promotion-manifest.json'))) {
    try {
      const receipt = readJson('assets/promotion-manifest.json')
      const problems = []
      const skipped = []
      const seen = new Set()
      for (const [path, entry] of Object.entries(receipt.files ?? {})) {
        seen.add(path)
        const file = join(root, path)
        if (!existsSync(file)) { problems.push(`${path}: missing`); continue }
        const bytes = readFileSync(file)
        if (receipt.schemaVersion >= 2) {
          // Schema 2 receipts said "outside assets/native/"; the only other file
          // there, manifest.json, is always written with LF, so the rule is the same.
          const actual = EXECUTABLE.test(path) ? sha256(bytes) : sha256(lf(bytes))
          if (actual !== entry.shipped) problems.push(`${path}: shipped sha256 differs`)
        } else if (WRAPPERS.test(path)) {
          // Schema 1 holds only the production-identity hash of a channel wrapper.
          skipped.push(path)
        } else if (sha256(bytes) !== entry && sha256(lf(bytes)) !== entry) {
          problems.push(`${path}: sha256 differs`)
        }
      }
      const extra = listFiles(root).map(p => relative(root, p).split(sep).join('/'))
        .filter(p => !seen.has(p) && p !== 'assets/promotion-manifest.json' && p !== 'assets/release-channel.json')
      if (extra.length) problems.push(`files not in the manifest: ${extra.join(', ')}`)
      check('promotion-manifest', problems.length === 0, { schemaVersion: receipt.schemaVersion, files: seen.size, problems, ...(skipped.length ? { notVerifiable: skipped, note: 'schema 1 receipts record the production-identity hash of channel wrappers; upgrade to a release with a schema 2 receipt to verify them' } : {}) })
    } catch (error) { check('promotion-manifest', false, { error: error.message }) }
  } else {
    checks.push({ name: 'promotion-manifest', status: 'skipped', details: { note: 'no assets/promotion-manifest.json: an unpackaged source tree' } })
  }

  return { ok: checks.every(c => c.status !== 'fail'), skillDir: root, checks }
}

if (process.argv[1] && import.meta.url === new URL(`file:///${resolve(process.argv[1]).replaceAll('\\', '/')}`).href) {
  const dir = process.argv[2] ?? resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const report = verifyPackage(dir)
  console.log(JSON.stringify(report, null, 2))
  process.exitCode = report.ok ? 0 : 2
}
