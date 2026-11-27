# Guidance: dsagent.accounts

Owner rules for planning with these methods, each paragraph once with the methods it applies to. They are projections of the owner descriptors (the live `guidance` field); the per-method references link here.

- (dsagent.accounts.application.create) Create a custom application only on user intent. Supply a name of 1 to 20 characters and a full HTTP(S) homepage without credentials. This stores application metadata through the existing owner; it never fetches the caller URL as an API endpoint.

- (dsagent.accounts.application.create) After succeeded, use data.application.appId with accounts.options.get and accounts.create. An application can exist with zero accounts. Account configuration, assignment, confirmation and secure credential input still use the normal account creation owner.

- (dsagent.accounts.application.create) An identical application is reused. After an unknown outcome, query accounts.operations.get and current application options; never replay the creation request.

- (dsagent.accounts.application.delete) Delete only on explicit user request. An application that still has accounts is refused: delete the accounts first, on the user's request. Platform template applications are refused.

- (dsagent.accounts.application.update) Rename or re-address only on user intent, using appId from accounts.options.get. A name-only change is direct. An address change always opens a confirmation in the DSphere SidePanel, because saved accounts sign in on that address.

- (dsagent.accounts.application.update) After an unknown outcome, read accounts.application.get; never replay the update.

- (dsagent.accounts.confirmations.answer, dsagent.accounts.confirmations.list) An account write that waits on a Confirm/Decline sheet answers waiting-user with an agent-may-answer warning when the person lets the asking agent answer it (a person-only setting, default on). Then read accounts.confirmations.list and answer the sheet whose operationId is that write's.

- (dsagent.accounts.confirmations.answer, dsagent.accounts.confirmations.list) Confirm only a change the person asked for in their own words, and decline one they did not ask for. When unsure, ask the person instead of answering, and poll accounts.operations.get. The person may answer the sheet first; the first answer stands.

- (dsagent.accounts.confirmations.answer, dsagent.accounts.confirmations.list) After the answer, read the write's result with accounts.operations.get under the same operationId; never resubmit the write. An account open's sign-in-site question has no operationId: its answer shows in the open's autofill receipt.

- (dsagent.accounts.confirmations.answer, dsagent.accounts.confirmations.list) Sheets that take a password, a cookie or proxy credentials, and the account configuration form, stay the person's; they are never listed. AGENT_ANSWER_OFF: the person keeps answers to themselves; tell them the sheet waits in the DSphere SidePanel.

- (dsagent.accounts.delete) For an explicit deletion request, use the unique accountId returned by list and call delete directly. No get, fingerprint read or settings-page visit is needed; ask a brief target-selection question only when the target is ambiguous.

- (dsagent.accounts.delete) An explicit user deletion request authorizes direct deletion for both built-in and external Agents. The extension does not show a deletion confirmation dialog. Do not ask for another confirmation, print an account-detail table or add a long warning. Current permissions, target occupancy and cancellation checks still apply.

- (dsagent.accounts.delete) On succeeded, report the deletion in one short sentence and stop; no extra read-back is needed. On partial with data.saved=true, report that the account was deleted and local environment cleanup is pending; never delete again. Only an unknown outcome needs operations.get and a current-state read; never replay deletion.

- (dsagent.accounts.devices.create) Add only a proxy the user asked for. Never ask the user to type a proxy username or password into the conversation and never pass them: set requestCredential and DSphere asks in its own SidePanel sheet.

- (dsagent.accounts.devices.create) Buying, renewing or paying for platform devices is not available through this capability. After an unknown outcome, read accounts.devices.list; never create again.

- (dsagent.accounts.devices.delete) Delete only on explicit user request. If accounts use the device, DSphere opens a Confirm sheet first. Platform devices are refused. After an unknown outcome, read accounts.devices.list; never delete again.

- (dsagent.accounts.devices.test) Runs the same check as the Work Device page, on a saved third-party device, and records the status, exit IP and location in Work. After changing a device, test it to confirm it works.

- (dsagent.accounts.devices.test) A result with reachable false is a finished test, not a tool failure: report it and check the address, port, protocol and credentials. A failed test alerts Work's operators, so test on need, not in a loop; one device can be tested once every 15 seconds.

- (dsagent.accounts.devices.test) UNAVAILABLE means the installed business extension does not offer the test yet; tell the user to update it.

- (dsagent.accounts.devices.update) Send only the setting to change: name, proxyType, ipProtocol, host, port, checkChannel and remark each change alone, and every other value is kept. Use accounts.network.set to change which accounts use the device.

- (dsagent.accounts.devices.update) The username and password are independent. replaceUsername or replacePassword asks the person for that one value in a DSphere SidePanel sheet, and clearUsername or clearPassword removes it. Never ask the user to type them into the conversation and never pass them.

- (dsagent.accounts.devices.update) To change the host, port or type of a device with saved credentials, also replace or clear each saved value: saved credentials are never sent to a new address unseen.

- (dsagent.accounts.devices.update) If accounts use the device, moving its address opens a confirmation in the DSphere SidePanel unless the person already entered new credentials there. After partial or unknown, read accounts.devices.get; never replay.

- (dsagent.accounts.fingerprint.update) Send only the setting to change; every other one is kept. Read accepted values from accounts.fingerprint.options.get. For an on/off metric use its _mode field (for example canvas_mode: noise), which generates the value the way Work does.

- (dsagent.accounts.fingerprint.update) Linked settings follow Work: a new os redraws the user agents and the screen size, a new webManufacturer picks a renderer, and WebGPU follows WebGL. WebRTC replace needs a network device on the account.

- (dsagent.accounts.fingerprint.update) Never ask the person to type a cookie into the conversation and never pass one: set replaceCookie and DSphere asks in its own SidePanel sheet, or set clearCookie to remove it. fingerprint.get reports only hasCookie.

- (dsagent.accounts.list, dsagent.accounts.open) Use only the account the person's words identify: its application and, when the application has several accounts, the account name. When either is unnamed or several accounts match, ask the person which one, naming the matching applications and accounts, before opening anything; never pick one yourself (first row, most recent, any) unless they explicitly let you choose any.

- (dsagent.accounts.network.set) Use deviceId from accounts.devices.list. Every change opens a confirmation in the DSphere SidePanel, because it moves the accounts' traffic. A device that is expired, disabled or still initializing is refused.

- (dsagent.accounts.network.set) Accounts already open keep their connection until reopened. After partial or unknown, read accounts.network.get for each account; never replay.
