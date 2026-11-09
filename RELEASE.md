# Release 1.18.0 - 2026-11-09

Production distribution: https://github.com/dsphere/dsphere-agent

Built from Native source commit 99b9f408fb310a9ab8fac00e0d6a64202e448f9b (sourceDirty false, built 2026-11-09T11:05:21.909Z) and promoted with the source-owned channel packager (package-channel-release.mjs: test wrapper, then production for this repository's distribution). At the owner's request (2026-11-09) this release skipped test-channel publication and test acceptance, as 1.16.x and 1.17.0 did: no dsphere-agent-test-v1.18.0 tag exists. Gitee and GitHub carry identical Native binaries and identical canonical content; only the installation and update references name their own repository first.

Changes since 1.17.0:
- Connecting: the DSphere browser now writes the Native Messaging registration itself. Finish Connecting in the side panel answers a schema 2 setup request that the Skill prepares; the request carries the version, platform and Skill folder and lasts 24 hours.
- Packaging: the Windows graphical connector.exe is no longer built or shipped. A release carries five programs, one dsphere-native-agent per platform.
- Setup: the person is never asked to paste the Skill folder. The Skill must sit in one of the standard Skills folders under the home folder, where the browser looks.
- Offline agents: when several agents have DSphere Agent installed, an agent that stays offline with the browser open points the person to Activate beside that agent in the side panel's Install MCP sheet.
- Sign-in walls: dsagent.page.auth.not-a-wall reports a clearly false sign-in wall; the Skill says when to use it.
- Settings and page state: the agent-settable sign-in-consent-dialogs setting (leave, decline or accept; default leave), and the account page state "unknown" for pages without signed-in evidence.
- 115 Extension capability contracts (Extension 1.1.15.20).

Checks for this release:
- Official skills-ref validate and read-properties: valid, dsphere-agent 1.18.0.
- Capability references: 115 verified; build-capability-skills.mjs --check in sync with the Extension. Bilingual detection contract: passed.
- tests/skills: 195 passed, 13 skipped; the 4 that failed read the source checkout's shared dist folder rather than this candidate, and the candidate checks they make were run on this candidate by the packager and scripts/verify-package.mjs.
- scripts/skills: 45 of 46 passed; the remaining test needs host symbolic-link permission for a file link.
- workbuddy: 29 of 29 passed.
- Native Go suite (go test ./...): all packages pass.
- All five executables and assets/native/manifest.json are byte-identical across the candidate, the test wrapper and both production distributions; scripts/verify-package.mjs is ok for both production trees.

Known limits: no test-channel acceptance, Native Host registration from an installed package or live browser run is claimed for this release. The Windows programs were built without the Authenticode signing step at the owner's request, and no program is notarized; integrity is verified by the manifests' SHA-256 hashes.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe 592e6e50a350bf6a68f3d2418ad0f2e2d85b0937f49d04047ced5e3bd679ab83
- windows-x86/dsphere-native-agent.exe a1d293885dc294b684d5bc0a9630e0518aeeb4aec112e72afea87ff8ed5d35af
- windows-arm64/dsphere-native-agent.exe cb62d6ffd6042d9b8f62d9775f9b79b4a4959fbe3885d57315ec72ad3add7d6a
- macos-x64/dsphere-native-agent 3fa0ef7240f9fbf91a9e92d77e22dd7c6b7cd4b9ec598931725802d02e9e9afa
- macos-arm64/dsphere-native-agent d834a916f21a3f7a1692c2677e82d2e7985952c01b24901734e73dbeecb86b77

The immutable tag is dsphere-agent-v1.18.0. The version pointer moves only after remote tag verification. Existing tags are preserved.
