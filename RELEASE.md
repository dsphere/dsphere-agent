# Release 2.0.5 - 2026-11-23

Production distribution: https://github.com/dsphere/dsphere-agent

Built from Native source commit 385c271 (sourceDirty false, built 2026-11-23T10:28:11.310Z) and promoted with the source-owned channel packager (package-channel-release.mjs: test wrapper, then production for this repository's distribution). Gitee and GitHub carry identical Native binaries and identical canonical content; only the installation and update references name their own repository first. The same release is on Aliyun OSS: https://dsphere-ai.oss-cn-hangzhou.aliyuncs.com/dsphere-agent/releases/dsphere-agent-v2.0.5/

Changes since 2.0.4:
- support individual images fetch mcp calls

Checks for this release:
- Each Windows program: Authenticode signature Valid, signer 6E3ADA071638A2A1FE6DD7915F601B97B410D2B7 (CN=数影星球（杭州）科技有限公司, O=数影星球（杭州）科技有限公司, L=杭州市, S=浙江省, C=CN), with a timestamp.
- Each macOS program: certificate signature with the hardened runtime over the whole program (identifier org.dsphere.mac-sign), and an Apple notarization ticket for its cdhash (macos-x64 cdhash dbddf6502427231aa4c123eb46efc511014ba7f4; macos-arm64 cdhash afc2419f370da931d3952026e319b8efb28df4d7).
- verify-package.mjs passes for every platform on the candidate and on both production trees.
- All five executables and assets/native/manifest.json are byte-identical across the candidate, the test wrapper and both production distributions.

Known limits: no test-channel acceptance, Native Host registration from an installed package or live browser run is claimed for this release.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe fcf273116034c97c52649f04285e3e0af5b4fa81c5a6fccda1863b997b688b13
- windows-x86/dsphere-native-agent.exe 4fb7a8ff52ea5b5c3766d231ffcf7e534d2c4f91fe7061dcf1635776208e3504
- windows-arm64/dsphere-native-agent.exe 308895054b3214f14f96ca552f40dff1c8b1bc4a35cf13d482b6127caf17fdce
- macos-x64/dsphere-native-agent b5ad0b23b0b92a548dd3efee1d66ae935414d1d8310d0ea21f6dd6c50b3ea0eb
- macos-arm64/dsphere-native-agent 344a5a25964c7d7deb534283b9b305a1feed200e3d13fab0d9ff767a54c1930a

The immutable tag is dsphere-agent-v2.0.5. The version pointer moves only after remote tag verification. Existing tags are preserved.
