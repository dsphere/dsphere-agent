# Release 1.11.0 - 2026-10-28

Built from Native source commit 94c18008c8d12843a76c67fb9533083c5a5827ba and promoted
with the source-owned channel packager (test wrapper, then production for this
repository's distribution). At the owner's request this release skipped the test-channel
publication and test acceptance: no dsphere-agent-test-v1.11.0 tag exists. Gitee and GitHub
carry identical Native binaries and identical canonical content; only the bilingual
installation/update references name their own repository.

Changes since 1.10.0:
- Update notice: the Native Agent advertises browser.control.skill-update.v1, and a browser
  Extension that supports it lists whether a newer DSphere Agent release exists in
  dsagent_list_instances (skillUpdate). The Native Agent JS SDK is 0.15.0.
- Page uploads from disk are staged by path reference instead of a copy, with a copy fallback
  for older runtimes.
- Error hints name their way on: INVALID_REQUEST names the field, its allowed values and the
  corrected arguments; a stopped task names the resume path; page dialogs, browser prompts and
  non-web documents say what to do next; a missing task description names continue mode.
- Skill guidance: continue task mode for agents working from their own skill, one finish call
  to end a task, compact page targets with short handles and links, fewer bookkeeping calls,
  one form read per task, and wizard auto mode for lists.
- Capability references match Extension feature/agent_v2.0 dd1a393f0 (94 capabilities),
  including page.ask.withdraw, page.open's compact view, page.actions across navigation,
  page.action paste and select, waitAfter, masked phone and ID numbers, account sign-in state,
  and the frames page.find and page.visual.observe report.

Native SHA-256:
- windows-x64 5af7a56c42fa8581e6d38c63b5e4ba6de3ca25fa2062903358094f00693b4c44
- windows-x86 28731de1f1c27baf09eeff09db3ba21cd3ce7b74de67536b0e882327a50bf29b
- macos-x64   d6151d8bd67d6afd392b8cc9cece18c9d070ca5bfccb3efc45bd757ca3cd928c
- macos-arm64 cef580152a23dafdd4aecdf30673db341a2f5a3a1adbfc5ec261dc48d14e8606

Validation: official skills-ref validate/read-properties; capability references (94 verified)
and Extension drift check in sync; bilingual detection contract; Skill suite against this
candidate (146 passed, 10 skipped, 0 failed); release-tooling suite (passing except tests that
need host symlink permission); WorkBuddy suite (27 passed); Native Go suite passing except
symlink-dependent, cross-drive and one pre-existing nativehost test; Native binaries and
canonical inventory preserved through test and production packaging; package verifier on the
promoted trees and on a fresh checkout of the tag.

This release adds no platform runtime certification or browser acceptance.
Previous tags are preserved.
