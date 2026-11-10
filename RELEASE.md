# Release 2.0.0 - 2026-11-10

Production distribution: https://github.com/dsphere/dsphere-agent

Built from Native source commit 90f3cd8f193d376ec0e2d7239eff897405c105de (sourceDirty false, built 2026-11-10T03:26:42.611Z) and promoted with the source-owned channel packager (package-channel-release.mjs: test wrapper, then production for this repository's distribution). At the owner's request (2026-11-09) this release skipped test-channel publication and test acceptance, as 1.16.x through 1.18.0 did: no dsphere-agent-test-v2.0.0 tag exists. Gitee and GitHub carry identical Native binaries and identical canonical content; only the installation and update references name their own repository first.

2.0.0 is also the first release published to Aliyun OSS: https://dsphere-ai.oss-cn-hangzhou.aliyuncs.com/dsphere-agent/releases/dsphere-agent-v2.0.0/ holds one zip per platform and a release index, built from this tag. The DSphere browser reads the OSS package first and falls back to Gitee and GitHub.

Changes since 1.18.0:
- Updates in place: scripts/verify-package.mjs accepts files that an in-place update padded or blanked, so the side panel's Install MCP sheet can update a Skill folder where it is.
- Install and update guidance: never move a registered Skill folder while its program may run, so the browser always finds the program its registration names.
- Capability build stamps refreshed against Extension 1.1.16.40; the 115 capability contracts are unchanged.

Checks for this release:
- Official skills-ref validate and read-properties: valid, dsphere-agent 2.0.0.
- Capability references: 115 verified; build-capability-skills.mjs --check in sync with the Extension. Bilingual detection contract: passed.
- tests/skills: 206 passed, 13 skipped; the 3 that failed read the source checkout's shared dist folder (which holds renamed older programs) rather than this candidate, and the candidate checks they make were run on this candidate by the packager and scripts/verify-package.mjs.
- scripts/skills: 59 of 60 passed; the remaining test needs host symbolic-link permission for a file link.
- workbuddy: 29 of 29 passed.
- Native Go suite (go test ./...): all 41 packages pass.
- All five executables and assets/native/manifest.json are byte-identical across the candidate, the test wrapper and both production distributions; scripts/verify-package.mjs is ok for both production trees.

Known limits: no test-channel acceptance, Native Host registration from an installed package or live browser run is claimed for this release. The Windows programs were built without the Authenticode signing step (the signing service was not reachable; the owner chose to publish unsigned), and no program is notarized; integrity is verified by the manifests' SHA-256 hashes.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe 120eb7c5b70d519274c406914893b7eca59547bd271c75f7a5bb91876588ae17
- windows-x86/dsphere-native-agent.exe 419e12efcfb5a0da260e4ed07f311ce3d27eaee753fd8e45458ecb4ec79fabaf
- windows-arm64/dsphere-native-agent.exe 95d63ed5d6a39ec931e1a56756d70b5c3b1df07850de16482cf788105d5ebdd7
- macos-x64/dsphere-native-agent 07856b3dd729ee63f75f0e276a559d5f991c52511b8341c6d75d055dc6129284
- macos-arm64/dsphere-native-agent a77378ccaf575fe89a45a2448ee0785072820d6852947187fec9cc9894fd8f2f

The immutable tag is dsphere-agent-v2.0.0. The version pointer moves only after remote tag verification. Existing tags are preserved.
