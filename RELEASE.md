# Release 2.0.6 - 2026-11-27

Production distribution: https://github.com/dsphere/dsphere-agent

Built from Native source commit da87d30 (sourceDirty false, built 2026-11-27T11:00:07.017Z) and promoted with the source-owned channel packager (package-channel-release.mjs: test wrapper, then production for this repository's distribution). Gitee and GitHub carry identical Native binaries and identical canonical content; only the installation and update references name their own repository first. The same release is on Aliyun OSS: https://dsphere-ai.oss-cn-hangzhou.aliyuncs.com/dsphere-agent/releases/dsphere-agent-v2.0.6/

Changes since 2.0.5:
- allow background run browser tasks without steal user's focus

Checks for this release:
- Each Windows program: Authenticode signature Valid, signer 6E3ADA071638A2A1FE6DD7915F601B97B410D2B7 (CN=数影星球（杭州）科技有限公司, O=数影星球（杭州）科技有限公司, L=杭州市, S=浙江省, C=CN), with a timestamp.
- Each macOS program: certificate signature with the hardened runtime over the whole program (identifier org.dsphere.mac-sign), and an Apple notarization ticket for its cdhash (macos-x64 cdhash f1b45600a7b231042333350886bb17a8b7d944f6; macos-arm64 cdhash f445bdba349b6ee05e764384c1c5cfe1d8915bc0).
- verify-package.mjs passes for every platform on the candidate and on both production trees.
- All five executables and assets/native/manifest.json are byte-identical across the candidate, the test wrapper and both production distributions.

Known limits: no test-channel acceptance, Native Host registration from an installed package or live browser run is claimed for this release.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe 0fea6940de69f0d017c230fdb4c3555999cca55d48eb8fdafb595cdada1df608
- windows-x86/dsphere-native-agent.exe 4931ba66a5670b85741f12021aeea8d1f1f7beb5a60e29ece54736c0346464df
- windows-arm64/dsphere-native-agent.exe 817e837483b2e25487ecb0512d277eb70295c90b47ebcf166a8d6503ec9120c2
- macos-x64/dsphere-native-agent 952213dd044ee933c8b87c9b5de607417332793c7c60ecba86678cb222e9a631
- macos-arm64/dsphere-native-agent a4b4297e3b007a02f4454ab1793a118abbe0a416d271463d2ff6f349b055187a

The immutable tag is dsphere-agent-v2.0.6. The version pointer moves only after remote tag verification. Existing tags are preserved.
