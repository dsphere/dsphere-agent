# Capability reference index

Build provenance is recorded in assets/capability-build.json; it does not establish runtime compatibility.

Read only the reference for the method you need: `references/capabilities/<method>.md` (invocation, inputs with every enum value and id pattern, result fields; at most 12 KB), the lossless contract `references/contracts/<method>.json`, and the owner guidance for a family the first time a task needs it, `references/guidance/<family>.md`. These are build-time usage references; the live Extension remains authoritative.

Known methods are invoked directly. Look a contract up with `dsagent_list_capabilities` (`method` plus `detail=invoke`) only on CAPABILITY_UNAVAILABLE, or on an INVALID_REQUEST whose hint names no field (it usually names the field, what it accepts and corrected args); `detail=index` lists every live method on one page.

| Method | Purpose | Risk | Key |
|---|---|---|---|
| `dsagent.accounts.close` | Synchronize and close only the selected account environment. | reversible-write | yes |
| `dsagent.accounts.create` | Create a DSphere account record. | external-effect | yes |
| `dsagent.accounts.delete` | Delete the selected account and clear its environment directly on explicit user… | external-effect | yes |
| `dsagent.accounts.fingerprint.get` | Read the permitted fingerprint configuration without cookie or secret fields. | read-sensitive |  |
| `dsagent.accounts.fingerprint.regenerate` | Regenerate the currently enabled fingerprint items using Work rules and save th… | reversible-write | yes |
| `dsagent.accounts.fingerprint.update` | Merge the permitted fingerprint changes with the existing saved configuration. | reversible-write | yes |
| `dsagent.accounts.focus` | Focus an existing page of the account without opening a new environment. | reversible-write | yes |
| `dsagent.accounts.get` | Read a currently visible account without its password or cookies. | read-sensitive |  |
| `dsagent.accounts.list` | Search the current Work-visible account snapshot. | read-sensitive |  |
| `dsagent.accounts.open` | Open the account using its existing browser environment and fill owner. | reversible-write | yes |
| `dsagent.accounts.operations.get` | Read this caller's local operation record; never dispatch or retry it. | read-sensitive |  |
| `dsagent.accounts.options.get` | Read visible applications; select appId to read permission-derived creationFiel… | read-sensitive |  |
| `dsagent.accounts.pages.list` | Read current tabs belonging to this visible account: pageContextId, tabId, wind… | read-sensitive |  |
| `dsagent.accounts.set-enabled` | Set the desired enabled state using at most one existing toggle request. | external-effect | yes |
| `dsagent.accounts.update` | Update permitted account fields using the current Work complete save format. | reversible-write | yes |
| `dsagent.agent.work.finish` | Ends your task with its verified outcome, and with keep closes its pages in the… | reversible-write | yes |
| `dsagent.agent.work.list` | What this browser still holds for you between calls (decision F4, failure-endpo… | read-sensitive |  |
| `dsagent.agent.work.step` | For a task that follows your own skill or plan of several steps. | reversible-write | yes |
| `dsagent.app.accounts.list` | List bounded application-account labels using opaque account IDs. | read-sensitive |  |
| `dsagent.artifact.read` | Read a listed artifact. | read-sensitive |  |
| `dsagent.artifacts.list` | List logical execution result and generated binary artifacts; an agent-read cap… | read-sensitive |  |
| `dsagent.bookmarks.import` | Import the bookmarks of the chosen profiles into the DSphere browser, exactly a… | reversible-write | yes |
| `dsagent.bookmarks.sources` | List the Google Chrome, Microsoft Edge and Safari profiles on this computer who… | read-sensitive |  |
| `dsagent.browser.sessions.list` | List the browser sessions a task can open pages in, each with the websites it h… | read-sensitive |  |
| `dsagent.dataset.save-agent-read` | The last detection tier (failure-endpoint fallback D4): save records you read y… | reversible-write | yes |
| `dsagent.development.chat.send` | Development only: open the SidePanel of the person's focused window on the Chat… | external-effect | yes |
| `dsagent.development.chat.state` | Development only: the view the SidePanel of the person's focused window shows (… | read-sensitive |  |
| `dsagent.development.inject-fault` | Development only: reproduce on demand a fault the release gate must see handled… | reversible-write | yes |
| `dsagent.development.reload-extension` | Development only: reload this unpacked Extension from its dist folder so a fres… | reversible-write | yes |
| `dsagent.development.restart-service-worker` | Development only: let this Extension's service worker end the way the browser e… | reversible-write | yes |
| `dsagent.diagnostics.export` | Export current-user retained ActionEpisode, DecisionSpan and TaskRun facts as o… | reversible-write | yes |
| `dsagent.events.close` | Close one owned browser event channel and release its bounded event buffer. | reversible-write | yes |
| `dsagent.events.open` | Attach the current MCP control session to a bounded resumable channel for typed… | reversible-write | yes |
| `dsagent.events.wait` | Wait for typed Extension events after an opaque cursor; returns immediately on… | read-sensitive |  |
| `dsagent.execution.artifact.export` | Write an artifact to a local file in the export directory, for a client that ca… | reversible-write | yes |
| `dsagent.execution.data.export` | Write the records a finished execution collected (for example one started by ds… | reversible-write | yes |
| `dsagent.execution.get` | Read current workflow execution status. | read-sensitive |  |
| `dsagent.execution.handoff.abort` | End a run paused for your repair without resuming it: the run ends failed on th… | reversible-write | yes |
| `dsagent.execution.handoff.get` | Read the bounded, redacted context of a run paused for your repair (pause.kind… | read-sensitive |  |
| `dsagent.execution.handoff.resume` | Answer a run's repair handoff and resume it. | external-effect | yes |
| `dsagent.execution.run` | Create and dispatch one workflow execution. | external-effect | yes |
| `dsagent.execution.stop` | Stop one workflow execution. | reversible-write | yes |
| `dsagent.execution.wait` | Bounded wait (at most 30 s) until the execution is terminal, or until it pauses… | read-sensitive |  |
| `dsagent.executions.list` | List bounded execution summaries visible to the current extension identity. | read-sensitive |  |
| `dsagent.executions.running.list` | List pending and running execution summaries assigned to the current extension… | read-sensitive |  |
| `dsagent.mail.account` | The email address and display name of the account the person set up in the DSph… | read-sensitive |  |
| `dsagent.mail.read` | Read the plain text of up to 10 messages found with dsagent.mail.search, by the… | read-sensitive |  |
| `dsagent.mail.search` | Search the mail the person synced into the DSphere Agent Email panel from their… | read-sensitive |  |
| `dsagent.mail.send` | Send a new email from the account the person set up in the DSphere Agent Email… | external-effect | yes |
| `dsagent.mail.sync` | Fetch new mail for one folder (INBOX by default) from the person's mail server… | read-sensitive |  |
| `dsagent.manual.get` | Return one bounded section of the build-time DSphere Agent Extension user manua… | read-sensitive |  |
| `dsagent.monitor.assist` | Start or end your assist on a page another owner holds (the person, another age… | reversible-write | yes |
| `dsagent.monitor.snapshot` | Every page and task of the browser, whoever started it: your own and other agen… | read-sensitive |  |
| `dsagent.page.account.detect` | Read which account the web application on this page shows as signed in, from wh… | read-sensitive |  |
| `dsagent.page.action` | Execute one planned atomic action (see the action enum: click, input, hover, sc… | external-effect | yes |
| `dsagent.page.actions` | Up to 12 planned steps on one page, in order: actions on a targetId or on the c… | external-effect | yes |
| `dsagent.page.ask` | Ask a task clarification or confirmation in DSphere using the same runtime shee… | reversible-write | yes |
| `dsagent.page.ask.wait` | Read or wait up to 30 seconds for the person to answer the question in DSphere. | read-sensitive |  |
| `dsagent.page.ask.withdraw` | Withdraw your own pending dsagent.page.ask question on this page once it is out… | reversible-write | yes |
| `dsagent.page.close` | Close a browser tab opened for you, once you are done with it (for example when… | reversible-write | yes |
| `dsagent.page.emulation.clear` | Stop re-applying the script device preset after navigation. | reversible-write | yes |
| `dsagent.page.emulation.set` | Install an android, iphone, ipad or desktop script device preset on an agent-ow… | reversible-write | yes |
| `dsagent.page.files.detect` | Scan a page, its embedded frames included, for the files it links (pdf, excel,… | read-sensitive |  |
| `dsagent.page.files.download` | Download detected files or images of a page into the browser's Downloads folder… | external-effect | yes |
| `dsagent.page.files.locate` | Scroll the page (or its embedded frame) so a detected file's link or picture is… | reversible-write | yes |
| `dsagent.page.find` | Find the current page targets that read as a short query (a visible label, a pl… | read-sensitive |  |
| `dsagent.page.focus` | Bring a page's tab forward in its window and focus that window, for the rare st… | reversible-write | yes |
| `dsagent.page.markdown` | Read the current document of a page context as clean Markdown for reading, summ… | read-sensitive |  |
| `dsagent.page.notify` | Show the person a desktop notification asking them to come to this page, also w… | reversible-write | yes |
| `dsagent.page.observe` | Read bounded live evidence for the browser steps you plan. | read-sensitive |  |
| `dsagent.page.open` | Use the default user session for every agent task, preserving the person's exis… | reversible-write | yes |
| `dsagent.page.presentation.get` | Read actual window, viewport and device pixel ratio of an agent-owned page. | read-sensitive |  |
| `dsagent.page.script` | Runs a short JavaScript program in a sandbox in the extension on one page you o… | external-effect | yes |
| `dsagent.page.target.inspect` | Inspect one opaque target at a page revision. | read-sensitive |  |
| `dsagent.page.viewport.set` | Set the viewport size of an agent-owned page using normal browser APIs. | reversible-write | yes |
| `dsagent.page.visual.observe` | Return one bounded JPEG as MCP image content for the current viewport or one op… | read-sensitive |  |
| `dsagent.page.wait` | Wait, bounded, for one condition on the page instead of polling dsagent.page.ob… | read-sensitive |  |
| `dsagent.page.window.set-size` | Set the window size of an agent-owned page using normal browser APIs. | reversible-write | yes |
| `dsagent.pages.list` | List bounded, automatable browser pages using opaque page context IDs. | read-sensitive |  |
| `dsagent.settings.get` | Read the settings a person can change in the SidePanel and Options page, with t… | read-sensitive |  |
| `dsagent.settings.update` | Change one setting section exactly as the person would in the SidePanel or Opti… | reversible-write | yes |
| `dsagent.website.explore.capture` | ONLY when the user explicitly requests website exploration or an exploration re… | reversible-write | yes |
| `dsagent.website.explore.export` | ONLY for an explicit user request to explore a website or produce its report. | reversible-write | yes |
| `dsagent.wizard.back` | Undo the last answered choice so the agent or person can decide again, as the S… | reversible-write | yes |
| `dsagent.wizard.cancel` | End the wizard without saving, as the SidePanel's Cancel does: the scrape sessi… | reversible-write | yes |
| `dsagent.wizard.choose` | Choose wizard options autonomously from the requested task and current wizard/p… | reversible-write | yes |
| `dsagent.wizard.highlight` | Highlight one option of the pending choice on the page (a data block or table a… | reversible-write | yes |
| `dsagent.wizard.pick` | Make the click the wizard waits for on the page yourself, instead of the person… | reversible-write | yes |
| `dsagent.wizard.run` | Run the workflow this wizard saved, once, in the person's current browser envir… | external-effect | yes |
| `dsagent.wizard.save` | At phase ready-to-save, create the workflow through the wizard's own save chain… | reversible-write | yes |
| `dsagent.wizard.start` | Choose wizard options autonomously from the requested task and current wizard/p… | reversible-write | yes |
| `dsagent.wizard.state` | Read the wizard's current step, the pending choice with its options (opaque opt… | read-sensitive |  |
| `dsagent.workflow.definition.get` | Read one page of a saved workflow definition: its blocks in order (type, label,… | read-sensitive |  |
| `dsagent.workflow.inputs.get` | List editable run inputs using opaque field IDs. | read-sensitive |  |
| `dsagent.workflows.list` | List workflows visible to the current extension identity. | read-sensitive |  |
