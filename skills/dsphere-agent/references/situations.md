# Situations

A reply names what unexpected happened in one field, `situation`: on an error (`error.situation`), an action receipt,
a run read (`dsagent.execution.wait` / `get`), the wizard state, a monitor attention item and your task state
(`dsagent.agent.work.state`). No `situation` means nothing unexpected. Do the row of the Skill's situation table first,
then the reply's `nextActions`. When several apply, the reply names the one the person must handle.

Each example below is an excerpt of a reply (other fields left out) and the call that follows it. Ids are examples:
copy yours from your own results.

## sign-in-wall

A click landed on a sign-in page; only the person signs in.

```json
{"action": "click", "success": true, "authentication": {"status": "sign-in-required", "type": "LOGIN_FORM", "waitingOn": "person"}, "situation": "sign-in-wall"}
```

First a saved account the task names (page.open with `accountId`). None: tell the person once to sign in and click
Resume, then `dsagent_page_wait {pageContextId, until: "authentication-cleared"}` once. Still there: end your turn.

## challenge

A verification check you may try yourself (`waitingOn: "agent"`).

```json
{"authentication": {"status": "sign-in-required", "type": "CAPTCHA", "waitingOn": "agent", "attemptsLeft": 12}, "situation": "challenge"}
```

`dsagent.page.visual.observe`, then act on the check's observed controls within `attemptsLeft`. Cannot pass:
`dsagent.page.notify` hands it to the person.

## dialog-open

The browser shows a dialog only the person answers.

```json
{"code": "TARGET_BUSY", "businessCode": "PAGE_DIALOG_OPEN", "details": {"dialog": {"type": "confirm", "message": "Delete the draft?"}}, "situation": "dialog-open"}
```

`dsagent.page.ask {pageContextId, kind: "confirm", question}`, then `dsagent.page.ask.wait`. Never repeat the action.

## new-tab-opened

The click opened a new tab; the receipt already describes it.

```json
{"action": "click", "sourcePageContextId": "p1a2b3", "destinationPageContextId": "p4c5d6", "situation": "new-tab-opened"}
```

Go on with `pageContextId: "p4c5d6"` (read it, act on it); do not open the address again.

## target-stale

The target or revision is gone: nothing was sent.

```json
{"code": "STALE_OBSERVATION", "dispatchStatus": "not-dispatched", "situation": "target-stale", "nextActions": [{"tool": "dsagent_read", "method": "dsagent.page.observe", "args": {"pageContextId": "p1a2b3"}}]}
```

Read the page again, then act on the current target with a new `idempotencyKey`.

## no-effect

The action ran but changed nothing the task needs.

```json
{"action": "click", "success": true, "change": "unchanged", "effect": {"kind": "none"}, "situation": "no-effect"}
```

Not done. Read the page: the state may already be what you wanted (an open panel). Otherwise change the target or
the way (another control, a key); never repeat the same action.

## rate-limited

The website asked to slow down.

```json
{"code": "BROWSER_UNAVAILABLE", "details": {"failureCode": "rate-limited", "retryAfterMs": 5000}, "situation": "rate-limited"}
```

Wait `retryAfterMs` (`dsagent_page_wait`), read the page, then one action; no bursts of calls.

## run-paused

Your run waits at a repair handoff.

```json
{"lifecycle": "paused", "pause": {"kind": "agent-repair", "waitingOn": "agent", "handoffId": "handoff_0a1b"}, "situation": "run-paused", "nextActions": [{"tool": "dsagent_read", "method": "dsagent.execution.handoff.get", "args": {"handoffId": "handoff_0a1b"}}]}
```

`pause.waitingOn: "agent"`: `dsagent.execution.handoff.get`, then resume or abort. `"person"`: wait.

## run-ended-partial

The run ended with only part of the data.

```json
{"lifecycle": "partial", "terminal": true, "coverage": {"rowsSaved": 40, "collectionFulfillment": {"status": "partial", "expectedParents": 60}}, "situation": "run-ended-partial"}
```

Read the rows (`dsagent.artifact.read`) and tell the person what is missing (40 of 60). Never call it complete.

## run-ended

The run finished (completed, failed or stopped); waiting again returns the same.

```json
{"lifecycle": "completed", "terminal": true, "artifactId": "local-dataset:ZXhhbXBsZQ", "situation": "run-ended", "nextActions": [{"tool": "dsagent_read", "method": "dsagent.artifact.read", "args": {"artifactId": "local-dataset:ZXhhbXBsZQ"}}]}
```

Read the result (`dsagent.artifact.read`), or report the `endpoint` of a failed run; never wait again.

## wizard-waiting

The wizard waits for a click on the page.

```json
{"awaitingPerson": "click-one-record", "pagePick": {"pageContextId": "p1a2b3"}, "situation": "wizard-waiting"}
```

`dsagent.page.find` on `pagePick.pageContextId`, then `dsagent.wizard.pick {wizardId, wizardToken, expectedRevision,
targetId, targetRevision}`. Without `pagePick`: wait for the person (`dsagent.wizard.state`).

## browser-reloading

The DSphere extension is reloading; nothing is lost.

```json
{"code": "EXTENSION_OFFLINE", "businessCode": "EXTENSION_RELOADING", "details": {"retryAfterMs": 2000}, "situation": "browser-reloading"}
```

Wait `retryAfterMs`, `dsagent_list_instances`, then read. Verify an effect sent before the reload read-only first.

## task-ended

Your task ended (the person stopped it, or it finished while you were idle).

```json
{"code": "APPROVAL_DENIED", "businessCode": "STOPPED-BY-PERSON", "situation": "task-ended"}
```

Stop. Tell the person what is left. Resume only once they agree, with a new `taskDescription`.
