# macOS setup and troubleshooting

Use this page only on macOS. The complete Skill supplies the executable and creates the Native Host manifest itself; first use needs no browser-provided manifest. First use, updates and offline recovery must execute steps 1–4. Skip initialization only for confirmed-online routine tasks without an update.

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

The manifest always lives at `~/Library/Application Support/Dsphere/NativeMessagingHosts/com.dsworkspace.agent.json`. macOS has no registry: the DSphere browser reads Native Messaging hosts from this folder of its own user data, so writing the file there is the whole registration. The detector never looks inside `Dsphere.app`; never read, copy or modify anything in the signed app, and never bypass system protection.

The built-in extension ID is `dkpedeeoceglnpignjhiblgfgofpmmik`; never ask the user for it or use example IDs/wildcards. Existing permissions excluding it must be reported, not broadened.

Follow the result:

- `browser-not-installed`: the DSphere browser must be installed before setup can continue. Tell the user, and give them the official download page from the result's `downloadUrl` (`https://work.dsphereai.com/download/index.html`); if it cannot be found or opened, the official website `websiteUrl` (`https://www.dsphereai.com/`) links to the download. Offer to open the page in their default browser and do so only if they agree (`open '<downloadUrl>'`). Never download or run an installer yourself, use any other address, or suggest another browser. Ask them to tell you when the installation has finished, wait for that, then run this step again and continue setup.
- `registration-blocked`: the existing user manifest is invalid, a symbolic link, or does not authorize the built-in extension (`user-registration-invalid`). Report it; do not delete, overwrite or broaden it, and do not prescribe a browser upgrade.
- `manifest-ready`: continue. `selectedCandidate.manifestSource` is `new` when no manifest exists yet (step 3 creates it) or `user-file` when one exists (step 3 updates only its `path`). An empty or missing old executable path does not prevent setup; never execute it.

Inspect only locations defined by the detector. Read the [diagnostic schema](diagnostic-schema.en.md) only for field details.

## 2. Verify the Skill executable

Use `uname -m` to select `assets/native/macos-arm64/dsphere-native-agent` (Apple Silicon) or `assets/native/macos-x64/dsphere-native-agent` (Intel). `sysctl -in sysctl.proc_translated` returning 1 identifies Rosetta translation. Check size and SHA-256 against `assets/native/manifest.json` using `shasum -a 256`.

Keep the complete Skill at a stable location. Missing files, version or checksum mismatches require restoring the same trusted complete release. Checksums detect corruption; trust comes from the release source. Never copy the executable into the browser or run its old bundled program.

If its executable bit is lost, restore `chmod 755` only on the Skill program. Do not remove quarantine or bypass Gatekeeper.

## 3. Install or update the user manifest

A setup, connect, or repair request already authorizes this fixed user-scoped file: do not ask for a separate confirmation. `SKILL_EXE` is the verified absolute Skill executable. Pass no `--manifest`: the command always selects the DSphere user folder above and refuses any other location.

```bash
"$SKILL_EXE" integrations native-host install --check
"$SKILL_EXE" integrations native-host install
"$SKILL_EXE" integrations native-host install --check
```

When no manifest exists, install creates it with `name`, `type: stdio`, the built-in extension in `allowed_origins`, and `path` set to the Skill program. When one exists, it updates only `path` and preserves every other field. Never pass `--registry-root` on macOS.

The first `--check` is read-only and returns `registration-required` or `registered`. Writing must return `registered` or `unchanged`. The final `--check` must return `registered`. Read the returned `manifestPath` JSON: it must be the DSphere user folder file above and its `path` must equal `nativeAgentPath`. Stop on any other nonzero exit (for example `extension-origin-conflict`, an invalid file or a concurrent change); preserve the original file rather than trying a different location.

### When the Skill program cannot write the manifest

Without this file the browser can never start the runtime, so the MCP connector never works: the manifest must be written. When install or its `--check` exits nonzero with an error containing `write-blocked` (`user-manifest-write-blocked` or `browser-manifest-write-blocked`: permission denied, a client sandbox, a read-only file or volume), write the same file yourself. This fallback is only for those errors; validation, Origin and concurrency errors still stop setup.

1. Run this exactly, with `SKILL_EXE` set to the verified Skill program. It creates the manifest with the built-in extension, or changes only `path` in an existing one, and writes the physical program path:

```bash
SKILL_EXE="$(cd "$(dirname "$SKILL_EXE")" && pwd -P)/$(basename "$SKILL_EXE")"
HOST_DIR="$HOME/Library/Application Support/Dsphere/NativeMessagingHosts"
MANIFEST="$HOST_DIR/com.dsworkspace.agent.json"
mkdir -p "$HOST_DIR" && /usr/bin/osascript -l JavaScript -e 'ObjC.import("Foundation"); function run(a) { var s = $.NSString.stringWithContentsOfFileEncodingError(a[0], $.NSUTF8StringEncoding, null); var m = s ? JSON.parse(ObjC.unwrap(s)) : { name: "com.dsworkspace.agent", description: "DSphere Agent Native Agent", type: "stdio", allowed_origins: ["chrome-extension://dkpedeeoceglnpignjhiblgfgofpmmik/"] }; m.path = a[1]; return JSON.stringify(m, null, 2); }' -- "$MANIFEST" "$SKILL_EXE" > "$MANIFEST.tmp" && mv -f "$MANIFEST.tmp" "$MANIFEST"
```

2. If your own shell is also refused, ask for the client's normal approval to run that same command outside its sandbox. Never use `sudo`, disable security controls, remove quarantine or write anywhere else. If the client cannot grant it, give the user that command as one copy-ready block with the real absolute `SKILL_EXE` path in single quotes, ask them to paste it into Terminal, and to run `cat "$HOME/Library/Application Support/Dsphere/NativeMessagingHosts/com.dsworkspace.agent.json"` and send you the output. Do not accept “done” as verification.
3. Verify: `"$SKILL_EXE" integrations native-host install --check` must return `registered`. If that check is itself blocked, read the file instead (your shell or the user's `cat` output) and require `name` `com.dsworkspace.agent`, `type` `stdio`, `allowed_origins` containing `chrome-extension://dkpedeeoceglnpignjhiblgfgofpmmik/`, and `path` equal to the physical `SKILL_EXE`. Then take the descriptor from `"$SKILL_EXE" integrations descriptor --json` (its command must equal `SKILL_EXE`) and continue to step 4.

## 4. Configure the client, then request restart and verify

Use the returned descriptor: MCP command equals `nativeAgentPath`, with args `mcp serve --stdio`. Continue to [shared MCP setup, restart prompt and verification](client-setup.en.md). Use the client’s native MCP settings; do not add a second service name or substitute another browser tool.

The browser launches the runtime through Native Messaging. Never start a bare executable as a second runtime or impersonate its handshake. After installation, update or rebinding, explicitly request a full restart of the selected browser using the shared guide, and wait for confirmation before verification. If the read-only instance query is empty, confirm they are logged in and the Extension is loaded; do not assume login is missing.

## Updates and relocation

Rediscover, install and verify after Skill relocation or browser upgrades; a browser upgrade does not move the user manifest. Preserve the previous Skill until the new combination works. Roll back by installing a verified earlier Skill, not an invalid old path. To obtain a release, read [Skill installation and updates](skill-install-update.en.md).
