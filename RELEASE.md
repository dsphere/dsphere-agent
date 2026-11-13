# Release 2.0.3 - 2026-11-13

Production distribution: https://github.com/dsphere/dsphere-agent

Built from Native source commit 55d7782 (sourceDirty false, built 2026-11-13T13:41:12.616Z) and promoted with the source-owned channel packager (package-channel-release.mjs: test wrapper, then production for this repository's distribution). At the owner's request this release skipped test-channel publication and test acceptance: no dsphere-agent-test-v2.0.3 tag exists. Gitee and GitHub carry identical Native binaries and identical canonical content; only the installation and update references name their own repository first. The same release is on Aliyun OSS: https://dsphere-ai.oss-cn-hangzhou.aliyuncs.com/dsphere-agent/releases/dsphere-agent-v2.0.3/

Changes since 2.0.1:
- Signed and notarized macOS programs: macos-x64 and macos-arm64 are signed with the company Developer ID certificate and the hardened runtime (identifier org.dsphere.mac-sign) and notarized by Apple; Apple's ticket service holds a notarization ticket for both. Earlier releases' macOS programs were not notarized.
- Windows programs stay Authenticode-signed by 数影星球（杭州）科技有限公司 (certificate 6E3ADA071638A2A1FE6DD7915F601B97B410D2B7, GlobalSign GCC R45 CodeSigning CA 2020) with an RFC 3161 timestamp.
- Capability references (118 methods): workflow repair methods (dsagent.workflow.repairs.get / .answer) and the handoff's recorded group, run inputs and local times of schedules, dsagent.agent.work.amend and running-run listing, confirmed download locations, the wait a site asks for and a list that says it has more, action receipts and run outcomes for network data, and the slow-website hint.
- Wizard references for wizard.back, wizard.pick and the valueless-field option; scroll receipts that report movement and the end of a list; guidance to ask which application account to open instead of picking one.
- Step tools read list fields and scalars in their declared shapes; a refused call frees its idempotency key for a corrected call; an Extension install refusal ends a reload at once.

Checks for this release:
- Each Windows program: Windows reports the Authenticode signature Valid with the company signer and a timestamp.
- Each macOS program: a code-signed copy of the built program (only the code signature changed), a certificate signature with the hardened runtime over the whole program, and an Apple notarization ticket for its cdhash (macos-x64 ea85689b86ed3cb50065fc27899fdc5e3ff17f53, macos-arm64 fc74f1d9c6e11836d1508f37307aa6f86bc22c7e).
- Official skills-ref validate and read-properties: valid, dsphere-agent 2.0.3.
- Capability references: 118 verified. Bilingual detection contract: passed.
- tests/skills: 249 passed, 13 skipped (run on the candidate itself).
- scripts/skills: 86 of 87 passed; the remaining test needs host symbolic-link permission for a file link.
- workbuddy: 29 of 29 passed.
- Native Go suite (go test ./...): not run for this release.
- All five executables and assets/native/manifest.json are byte-identical across the candidate, the test wrapper and both production distributions.

Known limits: no test-channel acceptance, Native Host registration from an installed package or live browser run is claimed for this release. The macOS programs carry no stapled ticket (a bare program cannot), so Gatekeeper confirms notarization online on first launch.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe e9b8f63d60886d708ef4ddc32ed903bd59cff2636a2f93b9254b40ec00823741
- windows-x86/dsphere-native-agent.exe 9654db6f819706971fefaa9fdd5e2a3c6f7ca1a2a4aa87379bb8f1764c4202dc
- windows-arm64/dsphere-native-agent.exe 1cf4d4753ce1843bc56120ef5e65f89c622eb1473390fe54c0b5afdedd85e23f
- macos-x64/dsphere-native-agent 05697959197afe073f533c0543ad7046fb3a599f000c00c224040ff8850d9d5c
- macos-arm64/dsphere-native-agent 159c4d197b05c618d9062124a97e88ebdb895c56038174a03698ae24ebb5720f

The immutable tag is dsphere-agent-v2.0.3. The version pointer moves only after remote tag verification. Existing tags are preserved.
