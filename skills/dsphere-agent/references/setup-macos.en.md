# macOS setup and troubleshooting

Use this page only on macOS. The browser supplies an existing Native Host manifest; the complete Skill supplies the executable. First use, updates and offline recovery must execute steps 1–4. Skip initialization only for confirmed-online routine tasks without an update.

## Execution order

Execute detection, registration and readback now, then configure MCP. These are initialization work, not steps to defer until after restart or hand to the user. Tool availability and reading this file do not prove configuration is complete.

- First use or a missing manifest: execute steps 1–4.
- Skill update or relocation: execute steps 1–4 even with the same path or matching manifest, then request restart to replace old processes.
- `EXTENSION_OFFLINE` or an empty instance list: execute steps 1–4 before requesting restart or login. An empty list does not establish Native Host health.
- Failure at any step: report the actual error and step. Do not claim configured or prescribe restart as a substitute.

## 1. Detect the browser automatically

Only the DSphere browser (`/Applications/Dsphere.app`) is supported. The detector looks only for it and setup configures only its user directory; DuokaiBrowser, DsWorkspace and other Chromium browsers are not set up, and their existing configuration is left untouched. Do not ask the user to choose a browser. Repair or report the DSphere browser's configuration error.

Run from the Skill root:

```bash
bash scripts/detect-macos.sh
```

Prefer `~/Library/Application Support/Dsphere/NativeMessagingHosts/com.dsworkspace.agent.json`. Only when absent, read the current app version’s nested then direct manifest as a creation source; the write destination is always the user directory. Report an invalid existing user manifest instead of selecting app resources. Do not modify a signed app or bypass system protection.

Follow the result:

- `browser-not-installed`: the DSphere browser must be installed before setup can continue. Tell the user, and give them the official download page from the result's `downloadUrl` (`https://work.dsphereai.com/download/index.html`); if it cannot be found or opened, the official website `websiteUrl` (`https://www.dsphereai.com/`) links to the download. Offer to open the page in their default browser and do so only if they agree (`open '<downloadUrl>'`). Never download or run an installer yourself, use any other address, or suggest another browser. Ask them to tell you when the installation has finished, wait for that, then run this step again and continue setup.
- `upgrade-required`: explain the candidate’s `issue`; the browser deployment owner must restore valid configuration. Do not invent extension permissions when no valid source exists.
- `manifest-ready`: retain `selectedCandidate.brand` and `selectedCandidate.manifestPath` and continue. An empty or missing old executable path does not prevent setup; never execute it.

Inspect only locations defined by the detector. Read the [diagnostic schema](diagnostic-schema.en.md) only for field details.

## 2. Verify the Skill executable

Use `uname -m` to select `assets/native/macos-arm64/dsphere-native-agent` (Apple Silicon) or `assets/native/macos-x64/dsphere-native-agent` (Intel). `sysctl -in sysctl.proc_translated` returning 1 identifies Rosetta translation. Check size and SHA-256 against `assets/native/manifest.json` using `shasum -a 256`.

Keep the complete Skill at a stable location. Missing files, version or checksum mismatches require restoring the same trusted complete release. Checksums detect corruption; trust comes from the release source. Never copy the executable into the browser or run its old bundled program.

If its executable bit is lost, restore `chmod 755` only on the Skill program. Do not remove quarantine or bypass Gatekeeper.

## 3. Create or update the user manifest

Set `BROWSER_BRAND` to the selected brand (always `Dsphere`; the program refuses any other), `BROWSER_MANIFEST` to the detected path and `SKILL_EXE` to the verified absolute Skill executable. Always write the user-level `NativeMessagingHosts/com.dsworkspace.agent.json`. Update only `path` when it exists; otherwise copy name, type, allowed_origins and all other source fields, setting `path` to the Skill program. App resources are read-only sources.

```bash
"$SKILL_EXE" integrations native-host configure --manifest "$BROWSER_MANIFEST" --user-brand "$BROWSER_BRAND" --check
"$SKILL_EXE" integrations native-host configure --manifest "$BROWSER_MANIFEST" --user-brand "$BROWSER_BRAND"
```

The first command is read-only; the second writes within the user-authorized setup/update. A check returning `registered` already matches; `registration-required` needs binding. Writing must return `registered` or `unchanged`. Read back the returned `manifestPath`: it must be in the selected brand’s user directory and its `path` must equal `nativeAgentPath`. Stop on nonzero exit, denied writes or concurrent changes; preserve the original configuration rather than trying a different manifest.

Then run the same command with `--check` again and require `status=registered`. Read the returned `manifestPath` JSON and confirm `path` points to the current Skill program. Both results are required before step 4.

## 4. Configure the client, then request restart and verify

Use the returned descriptor: MCP command equals `nativeAgentPath`, with args `mcp serve --stdio`. Continue to [shared MCP setup, restart prompt and verification](client-setup.en.md). Use the client’s native MCP settings; do not add a second service name or substitute another browser tool.

The browser launches the runtime through Native Messaging. Never start a bare executable as a second runtime or impersonate its handshake. After installation, update or rebinding, explicitly request a full restart of the selected browser using the shared guide, and wait for confirmation before verification. If the read-only instance query is empty, confirm they are logged in and the Extension is loaded; do not assume login is missing.

## Updates and relocation

Rediscover, bind and verify after Skill relocation or browser upgrades. Preserve the previous Skill until the new combination works. Roll back by binding a verified earlier Skill, not an invalid old path. To obtain a release, read [Skill installation and updates](skill-install-update.en.md).
