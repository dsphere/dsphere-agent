# Release 1.16.1 - 2026-11-04

Production distribution: https://github.com/dsphere/dsphere-agent

Built from Native source commit 65123c00d4aba36c448e1b23b5f1e84356c631ef (sourceDirty false, built 2026-11-04T13:36:02.144Z) and promoted with the source-owned channel packager (package-channel-release.mjs: test wrapper, then production for this repository's distribution). At the owner's request (2026-11-04) this release skipped test-channel publication and test acceptance, as 1.16.0 did: no dsphere-agent-test-v1.16.1 tag exists. Gitee and GitHub carry identical Native binaries and identical canonical content; only the installation and update references name their own repository first.

Changes since 1.16.0 (installation only; no capability or runtime change):
- The installation guide and the update references name both official mirrors, this repository first. Before reading the release, the installing agent times one bounded git ls-remote of each mirror and uses the faster one; if that mirror fails or stalls later, it retries once on the other. If neither answers, it asks the user to check the network or proxy.
- An install downloads one platform: one commit of the release tag, blob-less, with a sparse checkout that keeps only assets/native/<platform>/ (about 14 MB instead of the full history). A Mac never downloads Windows programs, and Windows never downloads macOS programs. The platform follows the setup guides' rule (Windows OS architecture; Apple Silicon also under Rosetta).
- scripts/verify-package.mjs takes --platform <platform> (default: this machine) and accepts a one-platform install: the selected platform's folder must be present and complete, other platforms' folders may be absent.
- This tag still holds all eight executables; both manifests still list every platform.
- 114 Extension capability contracts, unchanged from 1.16.0 (Extension feature/agent_v2.0 23d3512c1).

Checks for this release:
- Official skills-ref validate and read-properties: valid, dsphere-agent 1.16.1.
- Capability references: 114 verified. Bilingual detection contract: passed.
- tests/skills against this candidate, run outside a packaged desktop client so Windows registration is not redirected: 194 passed, 6 skipped, 0 failed.
- scripts/skills: 32 of 33 passed; the remaining test needs host symbolic-link permission for a file link.
- workbuddy: 29 of 29 passed.
- No Native Go source changed since 1.16.0; go test ./... passed there (41 packages).
- All eight executables and assets/native/manifest.json are byte-identical across the candidate, the test wrapper and both production distributions; scripts/verify-package.mjs is ok for both production trees.
- The new install steps were run end to end against the published 1.16.0 tag from both mirrors (probe, pointer read, one-platform download, verifier).

Known limits: no test-channel acceptance, Native Host registration from an installed package or live browser run is claimed for this release; the artifacts are unsigned and not notarized.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe e1c394e35401810584304193096ff552538423e05a596bbe2d197655fa18f02a
- windows-x86/dsphere-native-agent.exe 864873d133719ddb5ca15078c6407403e2ba581cfdd91090c94c07cbdf0a7355
- windows-arm64/dsphere-native-agent.exe c509339b5b1d0106ccaf63e60d7b97999d08978626c557ecdc07f1ed08ef7bea
- macos-x64/dsphere-native-agent c14a4a50dc4bb208297987e4ce4773a5648c22003421b4ef845969178121f00a
- macos-arm64/dsphere-native-agent 09ee979e2c35bab9c09c62c0e6e02d81b67f6e12e1cdcbf410cc784cbaf0b73d
- windows-x64/connector.exe 591c88c77747a6a2ac4d0310a3434d31824586cd708adfe5e95cfa8a6c8142ed
- windows-x86/connector.exe 778cfd7b7bcc37cf31bb90b7c14506bb545e45a07e6f06202024c197fdb14364
- windows-arm64/connector.exe 807e590de1baf8e2ba4d2b838eb3ecaae096b6c46aaa95b2e302e935526837b4

The immutable tag is dsphere-agent-v1.16.1. The version pointer moves only after remote tag verification. Existing tags are preserved.
