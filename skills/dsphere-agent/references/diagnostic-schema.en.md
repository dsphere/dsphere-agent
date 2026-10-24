# DSphere Agent — diagnostic schema

## Windows schema 3

From 1.8.4, both `install` and legacy `configure` (including `--check`) share the Windows registration-context guard. Besides `packaged-client-virtualized`, errors include `registration-context-restricted` (restricted token), `registration-user-mismatch` (process SID differs from this desktop shell's user SID), and `registration-context-unverified` (missing/unreadable desktop identity). These return no success receipt and perform no manifest/registry access. Use external completion; no bypass flag exists. The external helper receipt includes `detectedTargets` (installed brand/root pairs from that user's scan) and `expectedManifestPath`; compare against those, never sandbox detection. Both come only from the helper's own scan: with caller-supplied `-RegistryRoots` they are `[]` and `null`, and such a receipt is not verification. It preserves the external scan's existing manifest and source and refuses a blocked scan.

Windows no longer requires or searches a browser-owned NativeMessagingHosts directory. Core fields below remain, but schemaVersion=3, statuses are browser-not-installed, registration-blocked or manifest-ready. nextAction is install-browser, repair-user-registration or install-user-native-host.

Only the DSphere browser is supported: Windows scans only Dsphere, so `candidates` and `registrationTargets` each contain the one Dsphere entry; setup registers it only with `installed=true`. Other browsers (DuokaiBrowser, DsWorkspace, Chromium) are neither scanned nor registered, and their existing registrations are left untouched. `selectionRequired` is always false and `selectedCandidate` is the Dsphere candidate when it is ready. An invalid Dsphere registration source blocks setup. Every result, on both platforms, carries `downloadUrl` (`https://work.dsphereai.com/download/index.html`, the official download page) and `websiteUrl` (`https://www.dsphereai.com/`, the fallback when that page cannot be found or opened); with `browser-not-installed` the agent gives these to the user as the setup guide describes.

Candidate manifestPath / hostDir identify the shared user installation destination, not a browser version. Added fields: sourceManifestPath (existing file read for configuration, optional), manifestSource (new, user-file or user-registry), registryRoot (HKCU-relative product root, always Software\Dsphere; the detector and the installer refuse any other root), registeredManifestPath, registryView (Registry32 before Registry64), extensionId (built-in dkpedeeoceglnpignjhiblgfgofpmmik, informational only), registrationCompatible and registrationIssue. Each candidate reads its own brand registration; Chromium is not a fallback. `registrationTargets` projects brand, installed state, root, manifest/readback fields and registration health for the setup loop. versionDir is informational only. Both per-user and standard Program Files browser locations are checked.

manifestCompatible means installation can proceed, even without any manifest. A new file automatically authorizes the built-in extension ID; the user is never asked to supply one. For `manifestSource=new`, the setup agent immediately performs the default check-then-install sequence without another confirmation; the detector itself remains read-only. Existing invalid registry values, malformed files, conflicting sources or unauthorized selected IDs yield user-registration-invalid / registration-blocked. No detection result proves a runtime is online. Detection never creates files, registry entries or directories.

Windows integrations native-host install returns schemaVersion 1 registration JSON: status, manifestPath, previousPath, nativeAgentPath, descriptor, registryRoot and optional previousRegistryPath. `--registry-root` accepts only Software\Dsphere, which is also the default; any other root fails before registry access. --check is read-only; registered/unchanged with zero exit confirms manifest and registry readback, not runtime readiness. Nonzero exit is failure; a registry failure may retain an already-published valid user file. Inside a packaged Windows client (MSIX), install and --check exit nonzero with packaged-client-virtualized before reading or writing anything. No HKLM or policy is modified.

When a restricted client cannot perform those HKCU writes/readbacks, `scripts/complete-windows-registration.ps1` rescans for the DSphere browser and performs the install and final check only when it is installed at execution time; when it is not, the helper stops and names the download page. Its one-line receipt adds `verification=passed`, the caller-provided `challenge`, `manifestSha256`, and one `registrations` entry per installed brand; it repeats the shared `status=registered`, `manifestPath`, `nativeAgentPath` and `descriptor`. The receipt is setup evidence only after the brand/root set exactly matches a fresh scan and all values match the verified Skill executable.

## macOS schema 2


```json
{
  "schemaVersion": 2,
  "os": "macos",
  "status": "browser-not-installed | upgrade-required | manifest-ready",
  "nextAction": "install-browser | upgrade-browser | configure-skill-native-host",
  "downloadUrl": "https://work.dsphereai.com/download/index.html",
  "websiteUrl": "https://www.dsphereai.com/",
  "selectionRequired": false,
  "selectedCandidate": null,
  "compatibleCandidates": [],
  "candidates": []
}
```

The macOS detector is read-only and looks only for the DSphere browser (`/Applications/Dsphere.app`). Each candidate contains `brand` (always Dsphere), `installed`, `running`, `appPath`, `version`, `versionDir`, `hostDir`, `manifestPath`, `nativeAgentPath`, `manifestCompatible`, and `issue`. macOS hostDir/manifestPath prefer the Dsphere user-level direct manifest; app-version resources are fallback only when it is absent. Windows uses schema 3 above. No arbitrary disk search.

`nativeAgentPath` describes the old manifest configuration (Windows relative values resolve against its directory); it may be empty or missing on disk and is never executed. `manifestCompatible` validates the host name, stdio type and extension Origins only. A stopped browser or missing old executable does not change the result. `manifest-ready` means registration can proceed, not that a runtime is already running.

Issue codes: `not-installed`, `version-unavailable`, `active-version-directory-missing`, `native-host-manifest-missing`, `native-host-manifest-invalid`. Unsupported operating systems return `unsupported-platform` with a nonzero exit.

Schema 2 replaces the old executable-readiness contract: no `agentCompatible` or `descriptor` is returned. The Skill-native `integrations native-host configure` command returns schemaVersion 1 registration JSON with `status`, `manifestPath`, `previousPath`, `nativeAgentPath`, and `descriptor`. Check status is `registration-required` or `registered`; write status is `registered` or `unchanged`. Only this validated configuration result supplies the client descriptor. Nonzero exit is failure, never a success object.

On macOS, pass the selected `brand` as `--user-brand` when configuring. The detected `manifestPath` is a read-only source when the user file is absent; the returned registration `manifestPath` is the actual user-level destination. Existing user files are authoritative.
