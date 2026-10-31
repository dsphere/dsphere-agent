# Release 1.13.0 - 2026-10-31

Production distribution: https://github.com/dsphere/dsphere-agent

Built once from clean Native source commit de02284ee95f47f9307b91ce6aa378b81d8dd86c with Go 1.25.14 at 2026-10-31T11:26:24.359Z. The user explicitly requested a new version from latest source and direct publication to Gitee and GitHub, skipping test-channel publication and acceptance this time. No dsphere-agent-test-v1.13.0 tag was published. A local test-identity wrapper was used only by the source-owned packager to produce integrity-preserving production packages; it is not an accepted test candidate.

Changes since 1.12.0:
- Windows graphical browser connection setup, with package/user-context checks, registration readback and a verifiable result; DPI-aware UI and recovery location.
- Windows ARM64 runtime plus x64/x86/ARM64 graphical connector executables.
- Every browser task can ask whether to keep a workflow; task recording choices, state waits and recording draft editing are documented.
- Complete documentation learning and versioned memory refresh after installation or upgrade.
- Quota refusals name the relevant plan limit.
- 100 current Extension capability contracts, including per-run staged-file bindings for replay and recording methods, sourced from Extension 44ad748aa606bb3cd0b95a359c5e812319979f87 (bundle 1.1.14.22).

Automated checks run for this release:
- Official skills-ref validate and read-properties: passed for source and both production packages.
- Bilingual detection contract and generated capability references: passed (100 methods).
- Package verification: passed; all eight executable hashes and 272 inventory files verified.
- Canonical inventory and Native manifest: identical across the local channel wrapper and both production distributions; no rebuild during packaging.
- go vet ./...: passed.
- node --test workbuddy/test/*.test.mjs: 27 passed.
- node --test tests/skills/*.test.mjs: 149 passed, 5 failed, 13 skipped. The same five failures reproduce on the unchanged pre-release source: three entry-size assertions (17,252 bytes exceeds 15,360) and two assertions expecting superseded saved-workflow wording. Skips include platform-specific and packaged-client registration cases.
- node --test scripts/skills/test/*.test.mjs: 18 passed, 1 failed because this Windows process cannot create the fixture symlink.
- go test -count=1 -timeout=90s ./...: 34 packages passed; four tests failed in three packages (instancelease, localfs, session): three symlink fixtures require a privilege absent on this host, and one session fixture cannot resolve a C: temporary directory relative to the D: checkout. The bounded full rerun passed connectui; an earlier unbounded run was stopped in that package and is not counted as a pass.

The automated suite is not fully green. These limitations are recorded, not waived by a fabricated pass. No browser acceptance, cross-platform runtime certification, code signing, notarization or race-detector validation is claimed. Test-channel publication and acceptance were explicitly skipped for this release at the user's request.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe 7abda429569220c94ede8e925ae027cadc3b9a5f5f857aa38cc598a4606365fe
- windows-x86/dsphere-native-agent.exe 6d5a303ec60d8a0df44c58e2e3dfa817cfeaede967e793fb4fbfe990003e3ba4
- windows-arm64/dsphere-native-agent.exe cf24f0b9b001f164ac15943fe1f04659515d271787d0428a38ea5493553760ee
- macos-x64/dsphere-native-agent 45d314e6ee190ddfef86d87f9f3d81724f3cabef71b01563cc7b24938464d520
- macos-arm64/dsphere-native-agent 20b94c4d0ad905ef50858c8d3d7853e286dc75af8fbbfb96726ed31bc513ed25
- windows-x64/connector.exe 73e37c19b3d29effdb29324d120ae676f0f27a8f3372ec68d43afb5483baf36d
- windows-x86/connector.exe 1d187c1bcdbd1046391a84d6cc79b5161418115b3e2a3f84511ddb7dea20ddb7
- windows-arm64/connector.exe db0b384648bef25f5efcbb45aea79ba16c00d9581f7cde7eadf777cdd2f26a8b

The immutable tag is dsphere-agent-v1.13.0. The version pointer moves only after remote tag verification. Existing tags are preserved.
