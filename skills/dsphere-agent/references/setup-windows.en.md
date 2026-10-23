# Windows setup and troubleshooting

Use this page only on Windows. The complete Skill supplies the executable; first use needs no browser-provided manifest. First use, updates and offline recovery must execute steps 1–4. Skip initialization only for confirmed-online routine tasks without an update.

## Execution order

Execute detection, registration and readback now, then configure MCP. These are initialization work, not steps to defer until after restart. Attempt them automatically first; use the manual completion below only when the client security boundary blocks registry write or readback. Tool availability and reading this file do not prove configuration is complete.

Known packaged/sandboxed/different-user contexts go directly to external completion before browser detection. Otherwise use only the verified bundled installer: it checks package identity, restricted token and the process SID against the shell owner's SID on the current desktop, before manifest/registry access, for both install and `--check`. Missing/inaccessible desktop identity fails closed (including headless sessions). Environment usernames and Full Access are not identity evidence. Never substitute `reg add`, registry APIs, `configure`, another shell launched by the agent, HKLM/HKEY_USERS writes, impersonation or disabled security controls. This also applies to older packages lacking the checks.

- First use or a missing manifest: execute steps 1–4.
- Skill update or relocation: execute steps 1–4 even with the same path or matching manifest, then request restart to replace old processes.
- `EXTENSION_OFFLINE` or an empty instance list: execute steps 1–4 before requesting restart or login. An empty list does not establish Native Host health.
- Failure at any step: report the actual error and step. A permission/security failure follows the guarded manual completion below; other failures stop. Do not claim configured or prescribe restart as a substitute.

## 1. Detect the browser automatically

Scan Dsphere, DuokaiBrowser and DsWorkspace. Register only the brands whose browser executable is actually installed. Every installed brand needs its own registration; do not create or alter an absent brand's key. Do not ask the user to choose. The default task target is the first installed brand in that order (Dsphere, then DuokaiBrowser, then DsWorkspace), but registration health is verified independently for every installed brand.

Run from the Skill root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\detect-windows.ps1
```

Default manifest: `%LOCALAPPDATA%\dsphere\NativeMessagingHosts\com.dsworkspace.agent.json`. `registrationTargets` always describes all three supported brands and marks whether each is installed; setup filters it to `installed=true`:

| Browser | `Candidate.registryRoot` | Host registration |
|---|---|---|
| Dsphere | `Software\Dsphere` | `HKCU\Software\Dsphere\NativeMessagingHosts\com.dsworkspace.agent` |
| DuokaiBrowser | `Software\DuokaiBrowser` | `HKCU\Software\DuokaiBrowser\NativeMessagingHosts\com.dsworkspace.agent` |
| DsWorkspace | `Software\DsWorkspace` | `HKCU\Software\DsWorkspace\NativeMessagingHosts\com.dsworkspace.agent` |

Read the 32-bit HKCU view before the 64-bit view and preserve an existing supported user manifest. A registration under `Software\Chromium` does not register any supported brand. Always pass each installed target's root to install and every `--check`; the executable's legacy default is Chromium. An explicit `-RegistryRoot` overrides detection only for a verified custom build. Never search or write browser-version directories, HKLM or policy.

Retain `selectedCandidate.manifestPath` and `sourceManifestPath`, plus every installed entry in `registrationTargets`. First install needs no source file. The built-in extension ID is `dkpedeeoceglnpignjhiblgfgofpmmik`; never ask the user for it or use example IDs/wildcards. Existing permissions excluding it must be reported, not broadened.

Follow the result:

- `browser-not-installed`: use the organization’s official browser installation channel; do not invent URLs.
- `registration-blocked`: at least one installed brand has an invalid registration source; report that brand and the actual issue, such as `user-registration-invalid`. Do not overwrite permissions or prescribe a browser upgrade.
- `manifest-ready`: retain `selectedCandidate.manifestPath` and continue. An empty or missing old executable path does not prevent setup; never execute it.

Inspect only locations defined by the detector. Read the [diagnostic schema](diagnostic-schema.en.md) only for field details.

## 2. Verify the Skill executable

Use `[Environment]::Is64BitOperatingSystem` to select `assets/native/windows-x64/dsphere-native-agent.exe` or `assets/native/windows-x86/dsphere-native-agent.exe`, independent of shell bitness. Check size and SHA-256 against `assets/native/manifest.json` using `Get-FileHash -Algorithm SHA256`.

Keep the complete Skill at a stable location. Missing files, version or checksum mismatches require restoring the same trusted complete release. Checksums detect corruption; trust comes from the release source. Never copy the executable into the browser or run its old bundled program.

## 3. Install or update the user manifest and HKCU

Update only `path` in an existing manifest, preserving other fields; a new manifest authorizes the built-in extension. A setup, connect, or repair request already authorizes this fixed user-scoped registration: do not ask for a separate confirmation. If `manifestSource=new`, immediately run `native-host install` without `--manifest`; the command selects `%LOCALAPPDATA%\dsphere\NativeMessagingHosts\com.dsworkspace.agent.json`. `$Detection` is the detector result, `$Candidate = $Detection.selectedCandidate`, and `$SkillExe` is the verified current Skill program:

```powershell
$Targets = @($Detection.registrationTargets | Where-Object { $_.installed })
if ($Targets.Count -eq 0) { throw 'Detection did not find an installed supported browser.' }
for ($Index = 0; $Index -lt $Targets.Count; $Index++) {
  $InstallArgs = @('integrations', 'native-host', 'install', '--registry-root', $Targets[$Index].registryRoot)
  if ($Candidate.manifestSource -ne 'new') { $InstallArgs += @('--manifest', $Candidate.manifestPath) }
  if ($Index -eq 0 -and $Candidate.manifestSource -ne 'new' -and $Candidate.sourceManifestPath -and
      $Candidate.sourceManifestPath -ine $Candidate.manifestPath) {
    $InstallArgs += @('--template', $Candidate.sourceManifestPath)
  }
  & $SkillExe @InstallArgs --check
  if ($LASTEXITCODE -ne 0) { throw "Registration preflight failed for $($Targets[$Index].brand)." }
  & $SkillExe @InstallArgs
  if ($LASTEXITCODE -ne 0) { throw "Registration failed for $($Targets[$Index].brand)." }
  & $SkillExe @InstallArgs --check
  if ($LASTEXITCODE -ne 0) { throw "Registration readback failed for $($Targets[$Index].brand)." }
}
```

Preflight returns `registration-required` or `registered`; writing returns `registered` or `unchanged`; every final preflight must return `registered`. Require all installed targets to report the same `manifestPath`, `nativeAgentPath` and descriptor. Read the shared manifest JSON and require `path=nativeAgentPath` before step 4.

Sources are read-only; the user directory and registry are the actual destination. Never persist `NativeMessagingHosts` in a browser directory. Registry failure may leave valid JSON, but initialization failed. Resolve the actual error and rerun install instead of claiming success or only requesting restart.

### Restricted-client manual completion

`registration-user-mismatch`, `registration-context-restricted` and `registration-context-unverified` require this same external completion. Do not retry inside the client. The desktop user must also be the account running the browser; a browser deliberately run as another user is unsupported by this flow.

Use this fallback only when automatic installation or a final `--check` cannot write/read one or more installed-browser HKCU registrations because the current client is sandboxed or permission-restricted. Any install or `--check` returning `packaged-client-virtualized` also uses this fallback: the client is a packaged Windows app (MSIX, such as Codex Desktop) whose AppData and HKCU writes are redirected to private storage the browser cannot see, so it can neither install nor read back from inside that client; do not retry or try another write method. Validation, manifest conflicts, Origin mismatches and concurrent-change errors are not permission fallbacks; report them and stop.

1. Generate a fresh 16–64 character `[A-Za-z0-9_-]` challenge. Resolve absolute paths for the verified `$SkillExe` and `scripts\complete-windows-registration.ps1`. The complete Skill must be accessible to the desktop user; otherwise install and verify the complete release from their normal PowerShell first. Do not pass `-ManifestPath`, `-TemplatePath` or `-RegistryRoots` from sandbox detection. The helper independently rescans all brands and preserves the existing manifest/source discovered in the external user's context. Sandbox paths and a sandbox's empty browser list are not authoritative.
2. Render one copy-ready command from the template below. Replace every angle-bracket value, PowerShell single-quote literals by doubling any embedded `'`, and never show placeholders or environment variables to the user:

```powershell
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File '<absolute-skill>\scripts\complete-windows-registration.ps1' -SkillExe '<absolute-skill-exe>' -Challenge '<fresh-challenge>'
```

3. Ask the user to open a normal PowerShell window from Windows Start under the same Windows account that runs the selected browser, paste that exact command, and return only its final one-line JSON or the final error. Do not launch this window from the agent. Do not ask them to use Registry Editor, construct values manually, disable security controls or run as Administrator; HKCU normally needs no elevation. Do not accept “done” as verification.
4. Accept the receipt only when `verification=passed`, `status=registered`, `challenge` equals the fresh challenge, and `registrations` contains exactly the installed brands from its `detectedTargets` external scan—one entry per root, each with `status=registered`. Validate each brand/root pair against the table above. `manifestPath` must match the external scan's `expectedManifestPath`, never the sandbox's path; `nativeAgentPath`, manifest `path` evidence and `descriptor.command` must equal the verified Skill executable, with descriptor args exactly `mcp`, `serve`, `--stdio`. A missing/extra brand, duplicate root, mismatch, missing field or helper error remains blocked. Older helpers without external-scan evidence require the user to return the normal PowerShell detector output as well. Only a valid receipt permits step 4; browser/runtime verification remains mandatory.

## 4. Configure the client, then request restart and verify

Use the installed target set from the fresh scan. The two brands share one user manifest, but every installed brand needs its own verified registration. Do not create a key for an absent brand, infer that one registration covers both, or remove an existing Chromium registration during repair.

Use the returned descriptor: MCP command equals `nativeAgentPath`, with args `mcp serve --stdio`. Continue to [shared MCP setup, restart prompt and verification](client-setup.en.md). Use the client’s native MCP settings; do not add a second service name or substitute another browser tool.

The browser launches the runtime through Native Messaging. Never start a bare executable as a second runtime or impersonate its handshake. After installation, update or rebinding, explicitly request a full restart of the selected browser using the shared guide, and wait for confirmation before verification. If the read-only instance query is empty, confirm they are logged in and the Extension is loaded; do not assume login is missing.

## Updates and relocation

If the browser reports `Can't find manifest`, check the selected brand's key and manifest first. Do not infer that registry lookup is unsupported or move files into the browser installation. An empty instance list can also mean no browser runtime was launched; it does not prove a bridge handshake rejection. Registration readback and a direct executable launch cannot replace real browser discovery verification.

Rediscover, bind and verify after Skill relocation or browser upgrades. Preserve the previous Skill until the new combination works. Roll back by binding a verified earlier Skill, not an invalid old path. To obtain a release, read [Skill installation and updates](skill-install-update.en.md).
