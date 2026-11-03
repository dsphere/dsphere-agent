# Release 1.15.0 - 2026-11-03

Production distribution: https://github.com/dsphere/dsphere-agent

Promoted unchanged from the accepted test candidate dsphere-agent-test-v1.15.0 (tag object 2fbe8ccd0f20b99c679c03002178d0c7abc8e7f6, package commit 81d229192ba58272248d7400383676043d75db0a on the test channel). Janky accepted test versions 1.14.0 and 1.15.0 on 2026-11-03 and instructed "Promote 1.15.0". Nothing was rebuilt and no reference was regenerated: package-channel-release --channel production consumed the complete Skill from a fresh detached checkout of the test tag. Version, Native source d6692c99a5601c96a4c6583d9f7996451a024d89 (sourceDirty false), build time 2026-11-02T09:33:09Z, all eight executables and assets/native/manifest.json are byte-identical to the test candidate.

Changes since 1.13.0:
- 1.14.0: one-call intent tools for outside agents (open a page, act on one or several targets, find, observe, read page text, start and answer the collect wizard, wait for a run), so a client no longer has to route every step through the generic invoke; SKILL.md back within its 15 KiB budget with wall and plan-quota detail moved to references.
- 1.15.0: dsagent.wizard.collect and its dsagent_wizard_collect intent tool read records by named fields once, with inline rows and columns, typed field results, plan refusals as POLICY_DENIED / plan-restricted, and the recording question waited out inside the call. An outside agent ranks candidate sources itself (choose-source, then wizard.choose with auto once); a region that keeps one source is the agent's pick. Hand-back no longer reports a detection error. The Skill quick path documents the read.
- 105 Extension capability contracts from Extension 21fb67a45 (bundle 1.1.14.33).

Checks for this promotion:
- Eight executable SHA-256 values in the test tag checkout match the test release record; cmp shows the production package executables and Native manifest byte-identical to the test tag.
- scripts/verify-package.mjs: ok for both production distributions and for fresh detached checkouts of each remote production tag.
- Official skills-ref validate and read-properties: valid, dsphere-agent 1.15.0.
- macOS executables and scripts/detect-macos.sh keep Git mode 100755.

Test-candidate gates (recorded at test release): skill budgets within limits; 105 capability references verified; detection contract passed; tests/skills 172 pass, 0 fail, 13 skipped; scripts/skills 22/23 (one Windows symlink-privilege fixture); workbuddy 27/27; Extension scraping-path 271 tests passed.

Known limits: no install-from-tag, native-host registration or live browser run from an installed production package is claimed; the artifacts are unsigned and not notarized; an outside agent spends one or two extra turns ranking sources on lone-list pages; an existing pagination readiness pause on the first read after a page change is tracked separately.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe 6cf59f59c2aae35e8c76214be28a3f0a6ff0ca028022189511fb2ef790d0e706
- windows-x86/dsphere-native-agent.exe a5709b5aea6bbcf87d68a00d2d17a9a1b488c52f9a383d830eb1a5ec66891104
- windows-arm64/dsphere-native-agent.exe cf618eb2c45d6dfcb59b121b687c59b76563d8983417b904cbe50e4a9b270215
- macos-x64/dsphere-native-agent ec0e1560471498597e0010d82a96feda694db71824c75271683207640abd5ee6
- macos-arm64/dsphere-native-agent 63908816a2989c1e0199990aff588e1fdc4fa4efe1b82832f1efd2320a1378be
- windows-x64/connector.exe 31d55edbee9dba4210fa86f0f3d0fb74182cf8eb7c5b56bcc3c2e29322e7abf2
- windows-x86/connector.exe 52f4f9be394c1990a30c15179521ba0596844f9820e16eaa425b3975bbcb9059
- windows-arm64/connector.exe a5c02d4975964c897b84501d6fb08421d47e3d1e17bad45ad2d7d8d9ac158303

The immutable tag is dsphere-agent-v1.15.0. The version pointer moves only after remote tag verification. Existing tags are preserved.
