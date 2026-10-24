# Release 1.9.0 - 2026-10-24

Built from Native source commit 2454455a043f893221f7ed554858cfad5ed1d1cb and promoted
with the source-owned channel packager (test wrapper, then production for this
repository's distribution). At the owner's request this release skipped the test-channel
publication and test acceptance: no dsphere-agent-test-v1.9.0 tag exists. Gitee and GitHub
carry identical Native binaries and identical canonical content; only the bilingual
installation/update references name their own repository.

Changes since 1.8.4:
- Only the DSphere browser (Dsphere) is supported for setup and for dsagent_launch_browser.
  DuokaiBrowser and DsWorkspace are no longer detected, registered or started; their existing
  registrations and already-connected browsers keep working. The Windows installer accepts
  only the Software\Dsphere registry root (now also its default) and macOS --user-brand only
  Dsphere.
- A person who installed the Skill before the browser is no longer stuck: detection results
  carry downloadUrl and websiteUrl, and setup, the BROWSER_NOT_INSTALLED error and the
  installation guide give the official download page
  https://work.dsphereai.com/download/index.html (website fallback https://www.dsphereai.com/),
  open it only with the person's consent, and resume setup once it is installed.
- References for edit-text, caret keys and caret context, and the in-place editing rule in
  both automation guides.
- A staged upload is freed once a page accepted it (upload.release.v1); the SDK's base64
  check no longer overflows on large payloads.
- Capability references regenerated from Extension 1.1.25.8 (92 capabilities; upload-file
  wording in dsagent.page.action/page.actions).

Native SHA-256:
- windows-x64 c1a74f77600a8ffa62c95bdefd388cdae695cb54aefc3e42eb22650b3f000d35
- windows-x86 c2ec42eb447c9b3dc9c12571ae4608868d3da98a67469a3f39ffd0469cfe3544
- macos-x64   7ce10d0be2d82198199b780efaabce9cbc2be9cb27fe763f2749836d1d4c2318
- macos-arm64 7c6cbd8abe084fa3193bc4bd3fbdc1f9e0da611d868fd1e328cd53899ca7d0b6

Validation: official skills-ref validate/read-properties; capability references (92 verified)
and Extension drift check in sync; bilingual detection contract; Skill, release-tooling and
WorkBuddy suites against this candidate (172 passed, 10 skipped, 4 failed only because this
host cannot create symlinks or because they read an older shared candidate directory);
Native Go suite passing except symlink-dependent tests; Native binaries and canonical
inventory preserved through test and production packaging; package verifier on the promoted
trees and on a fresh checkout of the tag.

This release adds no platform runtime certification or browser acceptance.
Previous tags are preserved.
