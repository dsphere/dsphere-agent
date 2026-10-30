# Release 1.12.0 - 2026-10-29

Built from Native source commit 6d16153bc85a8c59e20934cfdaf71b041ceefa01 and promoted
with the source-owned channel packager (test wrapper, then production for this
repository's distribution). At the owner's request this release skipped the test-channel
publication and test acceptance: no dsphere-agent-test-v1.12.0 tag exists. Gitee and GitHub
carry identical Native binaries and identical canonical content; only the bilingual
installation/update references name their own repository.

Changes since 1.11.1:
- Agent scripts: the new dsagent.page.script runs a short sandboxed script of page actions
  with Playwright-style locators, actions and expect. A Playwright conversion sheet shows how
  to bring existing scripts over, and a hint explains when scripts are turned off.
- Run a person's own skill: when a task finishes, its verified steps compile into replay
  scripts that can graduate to saved workflows; compiled runs keep steady names and hold only
  the finishing task's steps.
- One-time tasks start from a copyable loop (quick-task sheet).
- Feishu data sources: a sheet for agents that combine lark-cli with dsphere-agent.
- Uploads: files can be staged from any folder except operating-system folders; page.actions
  lets fills run while an upload is sent, then reports each upload and re-checks the fields.
- Discovery on Windows works when APPDATA is missing, and a discovery failure is reported as
  DISCOVERY_UNAVAILABLE instead of an empty browser list.
- Native Host registration refuses to run from a process inside a packaged desktop client,
  where Windows would redirect the registry write; it names where to complete registration.
- Error hints: Extension errors name their operation, EXTENSION_RELOAD_REQUIRED is never
  retried, and TARGET_ACTION_UNSUPPORTED is an invalid request with the owner's hint.
- Logging continues when another connector blocks log rotation.
- Capability references match Extension feature/agent_v2.0 dd9f083f3 (95 capabilities),
  including page.script, form fills that overlap uploads, wizard replies that name page
  changes (a sort or filter) a saved workflow would not repeat with a run-once option, and the
  agent-scripts, chat-plan-approval and chat-memory settings sections.

Native SHA-256:
- windows-x64 f00caf6576bdf2e726d5d471edad3feab87fc1eb510242c00222df73e1cc60e2
- windows-x86 7215d5bff09bf6d359fb5be4b57000645dd36d8654989c0659049a391550a0a1
- macos-x64   1708d879937ff96b4adb27be7a28643ee460095bd7acfc3d0a195ca2e0ba73a2
- macos-arm64 d18c5e3e3a47b9fc9f013f150177b202ee3aec6281f601b4714287ec79cb3c60

Validation: official skills-ref validate/read-properties; capability references (95 verified)
and Extension drift check in sync; bilingual detection contract; Skill suite against this
candidate (152 passed, 6 skipped, 0 failed, run outside a packaged desktop client so Windows
registration is not redirected); release-tooling suite (passing except a test that needs
host symlink permission); WorkBuddy suite (27 passed); Native Go suite passing except
symlink-dependent and cross-drive tests; Native binaries and canonical inventory preserved
through test and production packaging; package verifier on the promoted trees and on a fresh
checkout of the tag.

This release adds no platform runtime certification or browser acceptance.
Previous tags are preserved.
