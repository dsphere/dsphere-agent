# Release 1.11.1 - 2026-10-28

Built from Native source commit ad3957fb1b0c25eacf214f19e4af848bd0aaa151 and promoted
with the source-owned channel packager (test wrapper, then production for this
repository's distribution). At the owner's request this release skipped the test-channel
publication and test acceptance: no dsphere-agent-test-v1.11.1 tag exists. Gitee and GitHub
carry identical Native binaries and identical canonical content; only the bilingual
installation/update references name their own repository.

Changes since 1.11.0 (macOS setup fix):
- New DSphere browser releases no longer ship a Native Host manifest inside Dsphere.app, so a
  first macOS install from 1.11.0 stopped at upgrade-required with nothing written. The
  Native Agent now creates the user manifest itself, as on Windows:
  `integrations native-host install` writes
  ~/Library/Application Support/Dsphere/NativeMessagingHosts/<host>.json with the built-in
  DSphere extension, keeps an existing file's fields and only updates its path, and reports
  a file without the DSphere origin instead of broadening it.
- When macOS refuses the write (permissions, a client sandbox, a read-only volume), the
  Native Agent reports user-manifest-write-blocked and the macOS guide has the setup agent
  write the same manifest with one exact command, or hand the command to the user, and
  verify it before configuring MCP.
- detect-macos.sh reports diagnostic schema 3: it no longer looks inside the app;
  manifestSource is new or user-file, and an invalid, linked or unauthorized user manifest is
  registration-blocked.
- `configure --user-brand` and the seed-based macOS code are removed; the command exits with
  an error that names `install`.
- Capability references unchanged: 94 capabilities, in sync with Extension
  feature/agent_v2.0 25d9a5231.

Native SHA-256:
- windows-x64 49a505fde48fe49668207334d2bb916561ab6213756141318d009509bc93fedf
- windows-x86 8735826b96f3600db3f184cfa0292970c1611302ce27f831eb31b83da6ecff15
- macos-x64   55f6d2914f4a2f98585804457308b3a935223dce8a1e2aa3bb810a18d4c1cb32
- macos-arm64 0d35dcc45533446aa6ea90a5d68d2f26729f93973c163bf0d301fa410b6ee8c8

Validation: official skills-ref validate/read-properties; capability references (94 verified)
and Extension drift check in sync; bilingual detection contract; Skill suite against this
candidate (149 passed, 6 skipped, 0 failed), including the macOS setup regression that runs
the real detector and the guide's fallback command; release-tooling suite (passing except a
test that needs host symlink permission); WorkBuddy suite (27 passed); Native Go suite passing
except symlink-dependent and cross-drive tests; Native binaries and canonical inventory
preserved through test and production packaging; package verifier on the promoted trees and
on a fresh checkout of the tag.

Not yet run on a real Mac: the macOS install path is covered by tests on Windows, and the
Dsphere user-data folder name is taken from the existing detector. This release adds no
platform runtime certification or browser acceptance. Previous tags are preserved.
