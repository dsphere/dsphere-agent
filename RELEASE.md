# Release 1.16.0 - 2026-11-04

Production distribution: https://github.com/dsphere/dsphere-agent

Built from Native source commit d767c5342292fb2c914f6cd45721f1ea5b817e43 (sourceDirty false, built 2026-11-04T12:04:04Z) and promoted with the source-owned channel packager (package-channel-release.mjs: test wrapper, then production for this repository's distribution). At the owner's request (2026-11-04) this release skipped test-channel publication and test acceptance: no dsphere-agent-test-v1.16.0 tag exists. The test candidates 1.15.1 and 1.15.2 were never accepted and are not published. Gitee and GitHub carry identical Native binaries and identical canonical content; only the installation and update references name their own repository.

Changes since 1.15.0:
- Site knowledge: an agent can read, record and give feedback on what it learned about a site (dsagent.site.knowledge.get, record, feedback). dsagent.page.open returns a short digest of that knowledge, finishing a task asks whether to record it, and a site key keeps a non-default port.
- Step tools: dsagent_page_*, dsagent_wizard_* and dsagent_execution_wait load up front, so a client no longer spends a tool-search turn before the first step. Rarely used intent tools load on demand behind a smaller fixed prompt, and the wizard is stepped with auto.
- Routing to the wizard: counting, summing or comparing records, finding one record, and opening items one by one go to the collect wizard; a read whose fields the task names goes to wizard.collect with a region; a record count the task names goes in wizard.start maxRecords.
- Reading: dsagent.page.markdown reads PDFs and names the parts it left out; dsagent.execution.get and dsagent.execution.wait report run status; with auto.detailPages the wizard's auto step answers the detail choices with their recommended options, and auto.detailReveal keeps the stop where reveal steps must be recorded; a visual.observe receipt carries cssScale and targetRect.
- dsagent.page.ask takes an unattended default option, settled after a 30 s countdown and never counted as consent; page writes and the wizard wait inside the call for the task-recording answer or its default.
- Smaller replies from page and wizard methods.
- Sign-in: dsagent.sign-in.check opens a sign-in or application address in a new tab and reports whether it asks the visitor to sign in. Arguments declared writeOnly, such as a sign-in password, are kept out of hints, errors and the idempotency record.
- Error hints name the field the owner expects and never offer the refused arguments back as a correction; a field the owner renamed says "use <field>"; a refused agent.work.finish names the open work it waits on.
- A browser started by dsagent_launch_browser keeps running after the MCP client's session ends.
- Logging: MCP failure lines name the envelope fields, logs are kept about 14 days, and runtime liveness lines reach native-agent.log.
- Installation from Gitee and the test channel uses HTTPS.
- 114 Extension capability contracts from Extension feature/agent_v2.0 23d3512c1 (bundle 1.1.14.33); no descriptor changed at the later head ff2fe47a7 (Extension 1.1.15.0).

Checks for this release:
- Official skills-ref validate and read-properties: valid, dsphere-agent 1.16.0.
- Capability references: 114 verified; build-capability-skills --check against a clean Extension quick build: in sync. Bilingual detection contract: passed.
- tests/skills against this candidate, run outside a packaged desktop client so Windows registration is not redirected: 189 passed, 6 skipped, 1 failed. The failure was a stale expectation (the registration test still expected only the seven gateway tools after the step tools started loading up front); the test was corrected in Native 1a231a2 and passes against this candidate.
- scripts/skills: 28 of 29 passed; the remaining test needs host symbolic-link permission for a file link.
- workbuddy: 27 of 27 passed.
- Native Go suite (go test ./...): all 41 packages pass on Windows without symbolic-link privilege (since Native cab1f39).
- All eight executables and assets/native/manifest.json are byte-identical across the candidate, the test wrapper and both production distributions; scripts/verify-package.mjs is ok for both production trees.

Known limits: no test-channel acceptance, install from the tag, Native Host registration from an installed package or live browser run is claimed for this release; the artifacts are unsigned and not notarized.

Native SHA-256:
- windows-x64/dsphere-native-agent.exe 67035f95b9795cfdb7ee8f8ae22db539e431e35548715aea817087d937dbce89
- windows-x86/dsphere-native-agent.exe d929e6b312273923725726e7bd82ac99b1108f8504f3343f47ba06a59ccec98a
- windows-arm64/dsphere-native-agent.exe 172da454ee04f3f0035aef73f9eb7e0e8dd48db14e3ad745ba888dc0334c7264
- macos-x64/dsphere-native-agent ec0de424127d51e7d7f22aec1817abed192a03c21de33e937a338662f0d2ccff
- macos-arm64/dsphere-native-agent fb08ce603ddc2ff816454b7fe89c9e432701e54fb90ae4fe8b147b57c6fbf6af
- windows-x64/connector.exe 703e94c60613d4f60e57a6298a78e391472f37dfb1dab6af651f7891715820cc
- windows-x86/connector.exe 5394d0ddb77753182e937ff6b01bffdfd14916add23572b918a287d1312b29ae
- windows-arm64/connector.exe 3a2cfdb1140bf5eba8cf72fa31ef4f4748a08a7bc898b1f8170dba2fa48e33ab

The immutable tag is dsphere-agent-v1.16.0. The version pointer moves only after remote tag verification. Existing tags are preserved.
