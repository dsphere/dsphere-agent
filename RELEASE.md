# Release 2.0.4 - 2026-11-20

Production distribution: https://github.com/dsphere/dsphere-agent

Built from Native source commit 7d0a081 (sourceDirty false, built 2026-11-20T13:36:58.349Z) and promoted with the source-owned channel packager (package-channel-release.mjs: test wrapper, then production for this repository's distribution). Gitee and GitHub carry identical Native binaries and identical canonical content; only the installation and update references name their own repository first. The same release is on Aliyun OSS: https://dsphere-ai.oss-cn-hangzhou.aliyuncs.com/dsphere-agent/releases/dsphere-agent-v2.0.4/

Changes since 2.0.3:
- 2
- 2
- 3
- 3
- 3
- 3

Checks for this release:
- Each Windows program: Authenticode signature Valid, signer 6E3ADA071638A2A1FE6DD7915F601B97B410D2B7 (CN=数影星球（杭州）科技有限公司, O=数影星球（杭州）科技有限公司, L=杭州市, S=浙江省, C=CN), with a timestamp.
- Each macOS program: certificate signature with the hardened runtime over the whole program (identifier org.dsphere.mac-sign), and an Apple notarization ticket for its cdhash (macos-x64 cdhash 87cbbae45230b5a3ade6eb10b6e03a2d87e541d2; macos-arm64 cdhash 0365e5e7e69a657fa3135d36c5352a8f3a5f5518).
- verify-package.mjs passes for every platform on the candidate and on both production trees.
- All five executables and assets/native/manifest.json are byte-identical across the candidate, the test wrapper and both production distributions.

Known limits: no test-channel acceptance, Native Host registration from an installed package or live browser run is claimed for this release.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe 529ae4ed2cc234429bd54e4986a37208ee422176009d1ffca961ca7d47162238
- windows-x86/dsphere-native-agent.exe 1575239ccb73ad2f0a66e1e5f1126034265fe2b9c60519d2e602d8eb13c46c77
- windows-arm64/dsphere-native-agent.exe 03547f8aef1f86c35e27a063fc66cde9afd3add5c1aeb4545bb85703ef750938
- macos-x64/dsphere-native-agent 7a0310fbb594b248932e8ecef130ca1180754ccf1717c8919d8cb2ce74e8bffc
- macos-arm64/dsphere-native-agent 5fb77460fbf81fab69b4e48736e24c8dddac42b3a7801f57897a87a4d9d71cd9

The immutable tag is dsphere-agent-v2.0.4. The version pointer moves only after remote tag verification. Existing tags are preserved.
