#!/usr/bin/env node
// Verify an installed copy of this Skill against the manifests it ships with.
// Node only, no dependencies, read-only:
//   node scripts/verify-package.mjs [--platform <platform>] [<skill directory>]
// Prints one JSON object and exits 0 when every check passes, 2 otherwise.
//
// A one-platform install is complete: the installation guide downloads only the
// current platform's assets/native/<platform>/ folder. Each platform folder that is
// present must hold every executable the manifest declares for it; absent folders
// are reported as omitted. The selected platform (--platform, or this machine's,
// chosen by the rule of the setup guides) must be present.
//
// What is checked, and how each hash is computed (the manifests say the same):
// - SKILL.md: name and metadata.version; the name must match the channel in
//   assets/release-channel.json (dsphere-agent ↔ production, dsphere-agent-test ↔ test).
// - assets/native/manifest.json: size and SHA-256 of each executable present, as bytes.
// - assets/capability-build.json: per contract, `sha256` = SHA-256 of
//   JSON.stringify(parsed contract) and (schema 2) `fileSha256` = SHA-256 of the
//   contract file bytes with CRLF→LF.
// - assets/promotion-manifest.json: schema 2 and 3 `shipped` = SHA-256 of each file
//   as published, with CRLF→LF for every file except the declared executables
//   (assets/native/<platform>/dsphere-native-agent[.exe]), so a Git checkout on any
//   platform verifies; a schema 1 receipt only carries the production-identity
//   hash, so its channel-wrapper files are reported, not failed.
//
// A copy the DSphere Extension updated in place: the browser's file API writes at an
// offset but can't shorten, rename or delete a file, so two kinds of files are
// accepted and listed (never silently):
// - padded: a non-program file whose release text is shorter than the old copy is
//   the release text, then spaces, then one LF, up to the old length. After CRLF→LF,
//   one trailing ` *\n` run is dropped and the hash taken again. Programs stay exact.
// - removed: a file of the old release that this one dropped holds a note, padded
//   the same way: `{"removedInDsphereAgent":"<version>"}` in a JSON file, otherwise
//   `Removed in dsphere-agent <version>: this file is not part of the Skill. Ignore it.`
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const lf = bytes => Buffer.from(bytes.toString('utf8').replaceAll('\r\n', '\n'))
const EXECUTABLE = /^assets\/native\/[^/]+\/(?:dsphere-native-agent(?:\.exe)?|connector\.exe)$/
const WRAPPERS =/^(?:SKILL\.md|agents\/openai\.yaml|references\/(?:guide|setup-macos|setup-windows|client-setup|skill-install-update)\.(?:en|zh-CN)\.md|scripts\/(?:detect-macos\.sh|detect-windows\.ps1|complete-windows-registration\.ps1))$/

// The release text of a file an in-place update padded: `bytes` (already CRLF→LF)
// without one trailing run of spaces followed by a single LF. Null when it doesn't
// end with LF.
export function withoutInPlacePadding(bytes) {
  if (bytes.length === 0 || bytes[bytes.length - 1] !== 0x0a) return null
  let end = bytes.length - 1
  while (end > 0 && bytes[end - 1] === 0x20) end--
  return bytes.subarray(0, end)
}

// How a non-program file matches its expected CRLF→LF hash: 'exact', 'padded' (by an
// in-place update) or false.
function textMatch(bytes, expected) {
  const text = lf(bytes)
  if (sha256(text) === expected) return 'exact'
  const unpadded = withoutInPlacePadding(text)
  return unpadded !== null && sha256(unpadded) === expected ? 'padded' : false
}

// Where an in-place update overwrites files the release dropped: the Skill's own
// folders and its top-level Markdown files, hidden entries skipped.
const REMOVED_SCOPE = /^(?:(?:references|scripts|assets|agents)\/.+|[^/]+\.md)$/i
const NOTE_VERSION = '([0-9A-Za-z][0-9A-Za-z.+-]{0,63})'
const REMOVED_JSON_NOTE = new RegExp(`^\\{"removedInDsphereAgent":"${NOTE_VERSION}"\\}$`)
const REMOVED_TEXT_NOTE = new RegExp(`^Removed in dsphere-agent ${NOTE_VERSION}: this file is not part of the Skill\\. Ignore it\\.$`)

// The version named by the note an in-place update wrote over a dropped file at
// `path`, or null when `bytes` (trailing spaces and newlines aside) is anything else.
export function removedNoteVersion(path, bytes) {
  if (!REMOVED_SCOPE.test(path) || path.split('/').some(segment => segment.startsWith('.'))) return null
  let end = bytes.length
  while (end > 0 && [0x20, 0x0a, 0x0d].includes(bytes[end - 1])) end--
  if (end > 256) return null
  const text = Buffer.from(bytes.subarray(0, end)).toString('utf8')
  const note = path.toLowerCase().endsWith('.json') ? REMOVED_JSON_NOTE : REMOVED_TEXT_NOTE
  return note.exec(text)?.[1] ?? null
}

const IN_PLACE_NOTE = 'an in-place update cannot shorten or delete files: padded files are the release text followed by spaces and one newline; removed files hold a note naming the release that dropped them'
const inPlaceDetails = (padded, removed) => (padded.length || removed.length
  ? { ...(padded.length ? { paddedByInPlaceUpdate: padded } : {}), ...(removed.length ? { removedByInPlaceUpdate: removed } : {}), inPlaceUpdateNote: IN_PLACE_NOTE }
  : {})

function listFiles(root) {
  const out = []
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name)
    if (entry.isDirectory()) out.push(...listFiles(path))
    else if (entry.isFile()) out.push(path)
  }
  return out.sort()
}

// The platform the setup guides select: on Windows the OS architecture, whatever
// the shell's bitness; on macOS Apple Silicon also when this process runs under
// Rosetta. Null elsewhere (no DSphere browser platform).
export function hostPlatform({ platform = process.platform, arch = process.arch, env = process.env, translated } = {}) {
  if (platform === 'win32') {
    const os = String(env.PROCESSOR_ARCHITEW6432 || env.PROCESSOR_ARCHITECTURE || '').toUpperCase()
    return { AMD64: 'windows-x64', X86: 'windows-x86', ARM64: 'windows-arm64' }[os] ?? null
  }
  if (platform === 'darwin') {
    if (arch === 'arm64') return 'macos-arm64'
    const rosetta = translated ?? (() => {
      try { return execFileSync('sysctl', ['-in', 'sysctl.proc_translated'], { encoding: 'utf8', timeout: 5000 }).trim() === '1' } catch { return false }
    })()
    return rosetta ? 'macos-arm64' : 'macos-x64'
  }
  return null
}

const platformOf = artifactPath => artifactPath.split('/')[0]

export function verifyPackage(skillDir, { platform } = {}) {
  const root = resolve(skillDir)
  const selected = platform === undefined ? hostPlatform() : platform
  const omittedPlatforms = new Set()
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
    const declared = [...new Set((native.artifacts ?? []).map(artifact => platformOf(artifact.path)))]
    const present = declared.filter(id => existsSync(join(root, 'assets/native', id)))
    for (const id of declared) if (!present.includes(id)) omittedPlatforms.add(id)
    if (selected !== null && !declared.includes(selected)) problems.push(`platform ${selected} is not declared in the manifest`)
    else if (selected !== null && !present.includes(selected)) problems.push(`${selected}: this platform's folder is missing`)
    else if (present.length === 0) problems.push('no platform folder is present')
    for (const artifact of native.artifacts ?? []) {
      if (omittedPlatforms.has(platformOf(artifact.path))) continue
      const path = join(root, 'assets/native', artifact.path)
      if (!existsSync(path)) { problems.push(`${artifact.path}: missing`); continue }
      const bytes = readFileSync(path)
      if (bytes.length !== artifact.size) problems.push(`${artifact.path}: size ${bytes.length} ≠ ${artifact.size}`)
      if (sha256(bytes) !== artifact.sha256) problems.push(`${artifact.path}: sha256 differs`)
    }
    check('native-manifest', problems.length === 0 && [4, 5, 8].includes((native.artifacts ?? []).length), { artifacts: (native.artifacts ?? []).length, platform: selected, present, omitted: [...omittedPlatforms], problems })
  } catch (error) { check('native-manifest', false, { error: error.message }) }

  try {
    const build = readJson('assets/capability-build.json')
    const problems = []
    const padded = []
    for (const entry of build.capabilities ?? []) {
      const path = join(root, 'references/contracts', `${entry.method}.json`)
      if (!existsSync(path)) { problems.push(`${entry.method}: contract file missing`); continue }
      const bytes = readFileSync(path)
      if (sha256(JSON.stringify(JSON.parse(bytes.toString('utf8')))) !== entry.sha256) problems.push(`${entry.method}: sha256 differs`)
      if (build.schemaVersion >= 2) {
        const match = textMatch(bytes, entry.fileSha256)
        if (!match) problems.push(`${entry.method}: fileSha256 differs`)
        else if (match === 'padded') padded.push(`references/contracts/${entry.method}.json`)
      }
    }
    const removed = []
    let contracts = 0
    if (existsSync(join(root, 'references/contracts'))) {
      for (const name of readdirSync(join(root, 'references/contracts')).filter(n => n.endsWith('.json'))) {
        const path = `references/contracts/${name}`
        const version = removedNoteVersion(path, readFileSync(join(root, path)))
        if (version) removed.push({ path, version })
        else contracts++
      }
    }
    if (contracts !== (build.capabilities ?? []).length) problems.push(`${contracts} contract files for ${(build.capabilities ?? []).length} manifest entries`)
    check('capability-build', problems.length === 0, { schemaVersion: build.schemaVersion, capabilities: (build.capabilities ?? []).length, sourceExtensionVersion: build.sourceExtensionVersion, problems, ...inPlaceDetails(padded, removed) })
  } catch (error) { check('capability-build', false, { error: error.message }) }

  if (existsSync(join(root, 'assets/promotion-manifest.json'))) {
    try {
      const receipt = readJson('assets/promotion-manifest.json')
      const problems = []
      const skipped = []
      const padded = []
      const seen = new Set()
      let omittedFiles = 0
      for (const [path, entry] of Object.entries(receipt.files ?? {})) {
        seen.add(path)
        const file = join(root, path)
        const platformFolder = path.match(/^assets\/native\/([^/]+)\//)?.[1]
        if (!existsSync(file) && platformFolder && omittedPlatforms.has(platformFolder)) { omittedFiles++; continue }
        if (!existsSync(file)) { problems.push(`${path}: missing`); continue }
        const bytes = readFileSync(file)
        if (receipt.schemaVersion >= 2) {
          // Schema 2 receipts said "outside assets/native/"; the only other file
          // there, manifest.json, is always written with LF, so the rule is the same.
          const match = EXECUTABLE.test(path) ? sha256(bytes) === entry.shipped : textMatch(bytes, entry.shipped)
          if (!match) problems.push(`${path}: shipped sha256 differs`)
          else if (match === 'padded') padded.push(path)
        } else if (WRAPPERS.test(path)) {
          // Schema 1 holds only the production-identity hash of a channel wrapper.
          skipped.push(path)
        } else if (sha256(bytes) !== entry && sha256(lf(bytes)) !== entry) {
          problems.push(`${path}: sha256 differs`)
        }
      }
      const removed = []
      const extra = []
      for (const p of listFiles(root).map(p => relative(root, p).split(sep).join('/'))) {
        if (seen.has(p) || p === 'assets/promotion-manifest.json' || p === 'assets/release-channel.json') continue
        const version = removedNoteVersion(p, readFileSync(join(root, p)))
        if (version) removed.push({ path: p, version })
        else extra.push(p)
      }
      if (extra.length) problems.push(`files not in the manifest: ${extra.join(', ')}`)
      check('promotion-manifest', problems.length === 0, { schemaVersion: receipt.schemaVersion, files: seen.size, ...(omittedFiles ? { omittedPlatformFiles: omittedFiles } : {}), problems, ...inPlaceDetails(padded, removed), ...(skipped.length ? { notVerifiable: skipped, note: 'schema 1 receipts record the production-identity hash of channel wrappers; upgrade to a release with a schema 2 receipt to verify them' } : {}) })
    } catch (error) { check('promotion-manifest', false, { error: error.message }) }
  } else {
    checks.push({ name: 'promotion-manifest', status: 'skipped', details: { note: 'no assets/promotion-manifest.json: an unpackaged source tree' } })
  }

  return { ok: checks.every(c => c.status !== 'fail'), skillDir: root, checks }
}

if (process.argv[1] && import.meta.url === new URL(`file:///${resolve(process.argv[1]).replaceAll('\\', '/')}`).href) {
  const args = process.argv.slice(2)
  const at = args.indexOf('--platform')
  const platform = at === -1 ? undefined : args[at + 1]
  if (at !== -1) args.splice(at, 2)
  if (platform !== undefined && !/^(?:windows-(?:x64|x86|arm64)|macos-(?:x64|arm64))$/.test(platform ?? '')) {
    console.log(JSON.stringify({ ok: false, error: 'usage: verify-package.mjs [--platform windows-x64|windows-x86|windows-arm64|macos-x64|macos-arm64] [<skill directory>]' }))
    process.exitCode = 2
  } else {
    const dir = args[0] ?? resolve(dirname(fileURLToPath(import.meta.url)), '..')
    const report = verifyPackage(dir, { platform })
    console.log(JSON.stringify(report, null, 2))
    process.exitCode = report.ok ? 0 : 2
  }
}
