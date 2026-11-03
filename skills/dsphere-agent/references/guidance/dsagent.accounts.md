# Guidance: dsagent.accounts

Owner rules for planning with these methods, each paragraph once with the methods it applies to. They are projections of the owner descriptors (the live `guidance` field); the per-method references link here.

- (dsagent.accounts.application.create) Create a custom application only on user intent. Supply a name of 1 to 20 characters and a full HTTP(S) homepage without credentials. This stores application metadata through the existing owner; it never fetches the caller URL as an API endpoint.

- (dsagent.accounts.application.create) After succeeded, use data.application.appId with accounts.options.get and accounts.create. An application can exist with zero accounts. Account configuration, assignment, confirmation and secure credential input still use the normal account creation owner.

- (dsagent.accounts.application.create) An identical application is reused. After an unknown outcome, query accounts.operations.get and current application options; never replay the creation request.

- (dsagent.accounts.delete) For an explicit deletion request, use the unique accountId returned by list and call delete directly. No get, fingerprint read or settings-page visit is needed; ask a brief target-selection question only when the target is ambiguous.

- (dsagent.accounts.delete) An explicit user deletion request authorizes direct deletion for both built-in and external Agents. The extension does not show a deletion confirmation dialog. Do not ask for another confirmation, print an account-detail table or add a long warning. Current permissions, target occupancy and cancellation checks still apply.

- (dsagent.accounts.delete) On succeeded, report the deletion in one short sentence and stop; no extra read-back is needed. On partial with data.saved=true, report that the account was deleted and local environment cleanup is pending; never delete again. Only an unknown outcome needs operations.get and a current-state read; never replay deletion.
