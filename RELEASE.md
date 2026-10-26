# Release 1.10.0 - 2026-10-25

Built from Native source commit 002b4c44cbecd06a089abe3da0a6270c3242b593 and promoted
with the source-owned channel packager (test wrapper, then production for this
repository's distribution). At the owner's request this release skipped the test-channel
publication and test acceptance: no dsphere-agent-test-v1.10.0 tag exists. Gitee and GitHub
carry identical Native binaries and identical canonical content; only the bilingual
installation/update references name their own repository.

Changes since 1.9.0:
- Staged uploads of up to 1 GiB, served to the Extension in ranges (upload.range.v1); the
  Native Agent JS SDK is 0.13.0.
- page.action upload-file documents slotIndex for pages with several file inputs.
- page.markdown documents its maxChars range.
- The wizard references cover the case where a next-page control does not advance.
- Capability references match Extension 1.1.25.8 (92 capabilities).

Native SHA-256:
- windows-x64 79e6c257d572205547ea8ba85add70802e748ca7bc111d3bad0f43f0ed19d27e
- windows-x86 6dd970b609170095bfde69f78e5f9f07689429a0b0984b44dea28bae4e3f0981
- macos-x64   40f9b1b3b6a87185946881d92267cc8801393198d8d19ad17a856006c1cff6ff
- macos-arm64 f9e6bfd63cea286f6e804dee6e4dd8f83ca76c56bec393f91b23784e584bc996

Validation: official skills-ref validate/read-properties; capability references (92 verified)
and Extension drift check in sync; bilingual detection contract; Skill, release-tooling and
WorkBuddy suites against this candidate (173 passed, 10 skipped, 3 failed only because this
host cannot create symlinks or because they read an older shared candidate directory);
Native Go suite passing except symlink-dependent tests; Native binaries and canonical
inventory preserved through test and production packaging; package verifier on the promoted
trees and on a fresh checkout of the tag.

This release adds no platform runtime certification or browser acceptance.
Previous tags are preserved.
