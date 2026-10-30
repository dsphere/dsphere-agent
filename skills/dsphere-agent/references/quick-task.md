# Quick shapes for a one-time task

Copy a pattern and replace each `<…>` with a value from your own results. These are the common arguments only; the
full contract still applies ([form sheet](requests/form.md), [wizard sheet](requests/wizard.md)). Effects go through
`dsagent_invoke` with a fresh `idempotencyKey` beside `method` and `args`; reads go through `dsagent_read`.

`expectedRevision` is optional on `dsagent.page.action` and `dsagent.page.actions`. Left out, the newest read you
received of that page (open, observe, find, an action's receipt) that lists the target is used. The element is still
checked: one that changed or went away is refused before dispatch with `STALE_OBSERVATION` (find it again).

A step may name its control by its words instead of an id: `"target": {"name": "<label>", "role": "<role>"}`. Words
that match no control, or several, stop the sequence with `stopped.candidates` to pick from by `targetId`.

## 1. Search and open a result

```json
{"method":"dsagent.page.open","args":{"url":"<site entry page>","taskDescription":"<the person's request>"},"idempotencyKey":"open-<uuid>"}
```

```json
{"method":"dsagent.page.actions","args":{"pageContextId":"<id>","actions":[
  {"target":{"name":"<search box label>"},"action":"input","value":"<query>"},
  {"target":{"name":"<search box label>"},"action":"press-key","key":"Enter"},
  {"waitFor":{"until":"url-changed","timeoutMs":8000}},
  {"target":{"name":"<result title>","role":"link"},"action":"click"}
]},"idempotencyKey":"search-<uuid>"}
```

Read `final` (the page the sequence ended on). A `navigated` stop gives the new `pageContextId`.

## 2. Fill and submit a form

```json
{"method":"dsagent.page.actions","args":{"pageContextId":"<id>","actions":[
  {"targetId":"<name field>","action":"input","value":"<value>"},
  {"targetId":"<country select>","action":"select","selection":"<option text>","selectBy":"text"},
  {"targetId":"<terms checkbox>","action":"set-checkbox","checked":true},
  {"target":{"name":"Submit","role":"button"},"action":"click","waitAfter":{"until":"revision-changed"}}
]},"idempotencyKey":"form-<uuid>"}
```

Submit only what the person asked for; check the result page for the confirmation or the field errors.

## 3. Choose from a hover menu (sort, filter, account menu)

```json
{"method":"dsagent.page.actions","args":{"pageContextId":"<id>","actions":[
  {"targetId":"<menu opener>","action":"hover"},
  {"waitFor":{"until":"target-present","target":{"name":"<option>"},"timeoutMs":3000}},
  {"target":{"name":"<option>"},"action":"click"},
  {"waitFor":{"until":"settled"}}
]},"idempotencyKey":"menu-<uuid>"}
```

The wait is the evidence that the menu opened; `wait-timed-out` means it did not (click the opener instead). Then
check the selected option or the reordered list in `final`.

## 4. Collect a list once

Repeated records (cards, rows, posts, comments, results) are collected by the wizard, never by reading and scrolling.
For a one-time collection that keeps no workflow:

```json
{"method":"dsagent.wizard.start","args":{"kind":"scrape","pageContextId":"<id>","taskDescription":"<the person's request>","auto":{"once":true,"maxRecords":100}},"idempotencyKey":"wizard-<uuid>"}
```

- `auto.outcome` `run-started`: the run started on this page as it shows now (a sort or filter you applied stays);
  wait for it with `auto.executionId`.
- `auto.outcome` `stopped`: answer the pending choice (`dsagent.wizard.choose`, again with `auto: {"once": true}`),
  or wait for the person on a wall. At `ready-to-save`, `dsagent.wizard.run` with `"once": true` does the same run.

```json
{"method":"dsagent.execution.wait","args":{"executionId":"<auto.executionId>","timeoutMs":30000}}
```

At `terminal`, `rows` holds the first records (up to 20) and `artifactId` the whole dataset: read the rest with
`dsagent.artifact.read` (`format: jsonl`, page to `eof`). The dataset stays in the person's Data list; no workflow is
left behind. To keep a reusable workflow instead, leave out `once` and call `dsagent.wizard.save`.

## 5. Read and finish

```json
{"method":"dsagent.page.markdown","args":{"pageContextId":"<id>"}}
```

```json
{"method":"dsagent.agent.work.finish","args":{"pageContextId":"<id>","status":"succeeded","keep":[]},"idempotencyKey":"finish-<uuid>"}
```

After `OUTCOME_UNKNOWN`, `TIMEOUT` or `CANCELED`, verify with a read; never resend the effect.
