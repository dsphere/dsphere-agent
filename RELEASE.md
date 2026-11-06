# Release 1.17.0 - 2026-11-06

Production distribution: https://github.com/dsphere/dsphere-agent

Built from Native source commit c3991f5b6455f786ab267d6727b77906ecf99e57 (sourceDirty false, built 2026-11-06T14:39:33.050Z) and promoted with the source-owned channel packager (package-channel-release.mjs: test wrapper, then production for this repository's distribution). At the owner's request (2026-11-06) this release skipped test-channel publication and test acceptance, as 1.16.x did: no dsphere-agent-test-v1.17.0 tag exists. Gitee and GitHub carry identical Native binaries and identical canonical content; only the installation and update references name their own repository first.

Changes since 1.16.1:
- Page actions: dsagent.page.action and dsagent.page.actions take dropTargetId and a field fallback targetId, and page-target actions default to the page.
- Collecting: records-not-saved and noValues outcomes; wizard fieldReview and ambiguous-source; recording endedBy; collectionFulfillment.requestStoppedShort keeps a list that ends below the cap a success; form-table label stops and wizard.collect link text; pending execution and wizard contracts.
- Sessions: an Errors row and public hint for BROWSER_SESSION_OWNER_UNAVAILABLE: a named session DSphere has not confirmed yet says wait and repeat.
- Installation: when fetching the guide or the version pointer fails, the installing agent recovers on its own within bounded time and the same source. The Windows programs are not code-signed, and the guide and Windows setup say a missing signature is never a reason to stop; trust comes from the tag and the size and SHA-256 checks.
- 114 Extension capability contracts from the 2026-11-05 shared build (Extension 1.1.15.20).

Checks for this release:
- Official skills-ref validate and read-properties: valid, dsphere-agent 1.17.0.
- Capability references: 114 verified. Bilingual detection contract: passed.
- tests/skills against this candidate, run outside a packaged desktop client so Windows registration is not redirected: 197 passed, 6 skipped, 0 failed.
- scripts/skills: 35 of 36 passed; the remaining test needs host symbolic-link permission for a file link.
- workbuddy: 29 of 29 passed.
- Native Go suite (go test ./...): all 41 packages pass.
- All eight executables and assets/native/manifest.json are byte-identical across the candidate, the test wrapper and both production distributions; scripts/verify-package.mjs is ok for both production trees.

Known limits: no test-channel acceptance, Native Host registration from an installed package or live browser run is claimed for this release; the artifacts are unsigned and not notarized, and integrity is verified by the manifests' SHA-256 hashes.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe d1a7c50a942487f6bd0bfec6500aff397e963a6972a0fd4fb8d65c95062ab105
- windows-x86/dsphere-native-agent.exe 2ac3ce86a8a8f55378b72747842987baff25cde892a94ba70310c4101994c58c
- windows-arm64/dsphere-native-agent.exe a61788c39760904d06d1045fed61bb108d5b4984d84a12e6578e7a8e887d512a
- macos-x64/dsphere-native-agent 94488b8c0c205707181d2f512d748a377420c40a0d8d6616129d7fb0ff3c63b2
- macos-arm64/dsphere-native-agent fc8196f7c379365c3b37200a66c04d098ead0a43fe87878750df363c01ba4764
- windows-x64/connector.exe c742e937273a70c87a3e5df14e55e561854bc4b9090e73f1f52a9706772ffc81
- windows-x86/connector.exe 96ebce68028953fe3078a75623eb4a804fb33e871fccc825a677924819c32792
- windows-arm64/connector.exe 6ebbb9aabdc1dfa39d72652579856b94b45d6518aa988c089dfee3e4be2122df

The immutable tag is dsphere-agent-v1.17.0. The version pointer moves only after remote tag verification. Existing tags are preserved.
