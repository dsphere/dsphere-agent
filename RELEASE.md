# Release 2.0.1 - 2026-11-11

Production distribution: https://github.com/dsphere/dsphere-agent

Built from Native source commit 62a3a55 (sourceDirty false, built 2026-11-11T02:22:08.918Z) and promoted with the source-owned channel packager (package-channel-release.mjs: test wrapper, then production for this repository's distribution). At the owner's request this release skipped test-channel publication and test acceptance, as 1.16.x through 2.0.0 did: no dsphere-agent-test-v2.0.1 tag exists. Gitee and GitHub carry identical Native binaries and identical canonical content; only the installation and update references name their own repository first. The same release is on Aliyun OSS: https://dsphere-ai.oss-cn-hangzhou.aliyuncs.com/dsphere-agent/releases/dsphere-agent-v2.0.1/

Changes since 2.0.0:
- Signed Windows programs: windows-x64, windows-x86 and windows-arm64 are Authenticode-signed by 数影星球（杭州）科技有限公司 (certificate 6E3ADA071638A2A1FE6DD7915F601B97B410D2B7, issued by GlobalSign GCC R45 CodeSigning CA 2020) with a GlobalSign R45 RFC 3161 timestamp, so the signature stays valid after the certificate expires. 2.0.0's Windows programs were unsigned. The macOS programs are not signed or notarized.
- Capability references: dsagent.execution.get, dsagent.execution.wait and dsagent.execution.handoff.get describe the plan-check-unavailable failure place and the planRestriction detail (the plan limit the server named).

Checks for this release:
- Each Windows program: signtool verify /pa with the company signer and a timestamp, and Windows reports the signature Valid; each is the built program with only the signature added.
- Official skills-ref validate and read-properties: valid, dsphere-agent 2.0.1.
- Capability references: 115 verified. Bilingual detection contract: passed.
- tests/skills: 206 passed, 13 skipped; the 3 that failed read the source checkout's shared dist folder (which holds renamed older programs) rather than this candidate, and the candidate checks they make were run on this candidate by the packager and scripts/verify-package.mjs.
- scripts/skills: 65 of 66 passed; the remaining test needs host symbolic-link permission for a file link.
- workbuddy: 29 of 29 passed.
- Native Go suite (go test ./...): all 41 packages pass.
- All five executables and assets/native/manifest.json are byte-identical across the reviewed candidate, the test wrapper and both production distributions; scripts/verify-package.mjs is ok for both production trees.

Known limits: no test-channel acceptance, Native Host registration from an installed package or live browser run is claimed for this release; the macOS programs are not notarized.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe 976403964e8936b267276bfd4ccd6771bd5bcc99f1d3b49fb39fca2b56d261ff
- windows-x86/dsphere-native-agent.exe 42c9570bc158d6ae2d6e4cb9c85eb995beed08b14eb5c6d57561afca64928519
- windows-arm64/dsphere-native-agent.exe 0630073d4409fc9ee6a0e223bf17b2ae0779a8c2cb2045859b826b855ae39182
- macos-x64/dsphere-native-agent 305f63496979dc188972e21f809719e9a5b5e030262f33a478dbbbae4f297620
- macos-arm64/dsphere-native-agent f10b6bf723f4335e9a65801722b4dcbbd659b9bd8ba9af0447534da6a11c741d

The immutable tag is dsphere-agent-v2.0.1. The version pointer moves only after remote tag verification. Existing tags are preserved.
