# DSphere Agent

Built Skill distribution for DSphere Agent. Version: **1.8.2**.

[Installation and update guide / 安装与更新指南](installation-guide.md)

Download the [immutable 1.8.2 package](https://github.com/dsphere/dsphere-agent/archive/refs/tags/dsphere-agent-v1.8.2.zip), extract it, and use `skills/dsphere-agent/`. Read its `SKILL.md` and the setup guide for your platform. Verify the extracted package with `node skills/dsphere-agent/scripts/verify-package.mjs skills/dsphere-agent` before installation.

The package includes Windows x64/x86 and macOS Intel/Apple Silicon native binaries, capability references, installation scripts, and integrity manifests. It contains no Native Agent source repository or source history.

The package's existing fallback update instructions still point to Gitee. For this GitHub distribution, use this repository's `latest-version.json` and the exact tag it names. Do not install from a mutable branch.

See [release validation](RELEASE.md) for build provenance and coverage.
