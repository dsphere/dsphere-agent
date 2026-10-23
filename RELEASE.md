# Release 1.8.2

Rebuilt on 2026-10-23 from clean native-agent source commit 5d188012857b2733e7000c43a3fc4af582b3094f. Capability references match Extension bundle 1.1.25.6 (92 methods).

The local immutable test candidate tag dsphere-agent-test-v1.8.2 was packaged and integrity-checked before promotion. Production packaging preserves all four native binaries byte-for-byte; complete checksums and build time are in skills/dsphere-agent/assets/native/manifest.json. The candidate was not published to the test GitLab repository.

Validation:
- Four-platform cross-compilation passed.
- go test ./... passed.
- Official skills-ref validate and read-properties passed for the production package.
- Capability generation drift check and bilingual detection contract passed.
- Candidate and production integrity verification passed, including promotion inventory and native hashes.
- Windows x64 candidate integration descriptor executed successfully.
- Combined Skill tests: 138 passed, 2 failed, 9 skipped. The Windows missing-manifest install test passed when rerun alone after its parallel-run timeout. The remaining failure is an existing exact-text assertion expecting "close only pages you opened"; the current Skill says "Use page.close for immediate cleanup only on pages you opened" with Markdown formatting, preserving the ownership requirement.

Limits: no macOS runtime certification, Windows race-toolchain test, or new live browser/MCP acceptance was performed for this build. This release does not claim a fully green Skill test suite. Existing Gitee fallback URLs inside the package remain unchanged.
