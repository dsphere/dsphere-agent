import { readFileSync } from 'node:fs'
import { resolve, win32 } from 'node:path'
import { pathToFileURL } from 'node:url'

// A copied result only verifies this setup handoff; live client checks remain mandatory.
export function verifyConnectResult(prepared, receipt, now = Date.now()) {
  const r = prepared.request
  const samePath = (a, b) => typeof a === 'string' && typeof b === 'string' && win32.isAbsolute(a) && win32.isAbsolute(b) && win32.normalize(a).toLowerCase() === win32.normalize(b).toLowerCase()
  const checked = Date.parse(receipt.checkedAt)
  const issued = Date.parse(r?.issuedAt)
  const expires = Date.parse(r?.expiresAt)
  if (!r || r.schemaVersion !== 1 || !['production', 'test'].includes(prepared.channel) || !Number.isFinite(issued) || !Number.isFinite(expires) || expires - issued !== 1800000 || issued > now + 60000 || !/^[a-f0-9]{64}$/.test(r.nativeSha256) || !/^[a-f0-9]{64}$/.test(r.connectorSha256) || !/^[a-f0-9]{48}$/.test(r.challenge) || receipt.schemaVersion !== 1 || receipt.status !== 'local-setup-complete' || receipt.challenge !== r.challenge ||
    receipt.version !== prepared.version || receipt.channel !== prepared.channel || receipt.nativeSha256 !== r.nativeSha256 || receipt.connectorSha256 !== r.connectorSha256 ||
    !Number.isFinite(checked) || checked < Date.parse(r.issuedAt) || checked > now + 60000 || now >= Date.parse(r.expiresAt) || checked >= Date.parse(r.expiresAt)) throw new Error('Fresh matching setup evidence required')
  const registration = receipt.registration
  const descriptor = receipt.descriptor
  if (registration?.status !== 'registered' || registration.registryRoot !== 'Software\\Dsphere' ||
      !samePath(registration.nativeAgentPath, descriptor?.command) || !samePath(registration.nativeAgentPath, win32.join(win32.dirname(prepared.connectorPath), 'dsphere-native-agent.exe')) ||
      !/^[a-f0-9]{64}$/.test(receipt.manifestSha256 ?? '') || descriptor.transport !== 'stdio' || descriptor.name !== (prepared.channel === 'test' ? 'dsphere-agent-test' : 'dsphere-agent') ||
      JSON.stringify(descriptor.args) !== JSON.stringify(['mcp', 'serve', '--stdio']) || !win32.isAbsolute(registration.manifestPath ?? '') ||
      !['C1', 'C2', 'C3'].every(id => receipt.checks?.filter(c => c.id === id).length === 1 && receipt.checks.find(c => c.id === id).status === 'passed') ||
      receipt.checks?.find(c => c.id === 'C5')?.status !== 'verify-in-codex') throw new Error('Registration evidence or descriptor does not match')
  return { ok: true, status: 'configured-awaiting-client-verification', descriptor }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    if (process.argv.length !== 4) throw new Error('Usage: node verify-connect-result.mjs prepared.json copied-result.json')
    const read = path => { const bytes = readFileSync(path); if (bytes.length > 16384) throw new Error('Result exceeds limit'); return JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')) }
    console.log(JSON.stringify(verifyConnectResult(read(process.argv[2]), read(process.argv[3]))))
  } catch (error) { console.error(JSON.stringify({ ok: false, message: error.message })); process.exitCode = 2 }
}
