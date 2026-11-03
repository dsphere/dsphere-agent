# Quick shapes for a one-time task

Copy a pattern and replace each `<…>` with a value from your own results. These are the common arguments only; the
full contract still applies ([form sheet](requests/form.md), [wizard sheet](requests/wizard.md)). Each shape is a step
tool and its flat arguments (`dsagent_page_act_many {…}`); an effect carries a fresh `idempotencyKey` among them. A
method without a step tool goes through `dsagent_invoke` (effects, `idempotencyKey` beside `method` and `args`) or
`dsagent_read`.

`expectedRevision` is optional on `dsagent_page_act` and `dsagent_page_act_many`. Left out, the newest read you
received of that page (open, observe, find, an action's receipt) that lists the target is used. The element is still
checked: one that changed or went away is refused before dispatch with `STALE_OBSERVATION` (find it again).

A step may name its control by its words instead of an id: `"target": {"name": "<label>", "role": "<role>"}`. Words
that match no control, or several, stop the sequence with `stopped.candidates` to pick from by `targetId`.

## 1. Search and open a result

```text
dsagent_page_open {"url":"<site entry page>","taskDescription":"<the person's request>","idempotencyKey":"open-<uuid>"}
```

```text
dsagent_page_act_many {"pageContextId":"<id>","actions":[
  {"target":{"name":"<search box label>"},"action":"input","value":"<query>"},
  {"target":{"name":"<search box label>"},"action":"press-key","key":"Enter"},
  {"waitFor":{"until":"url-changed","timeoutMs":8000}},
  {"target":{"name":"<result title>","role":"link"},"action":"click"}
],"idempotencyKey":"search-<uuid>"}
```

Read `final` (the page the sequence ended on). A `navigated` stop gives the new `pageContextId`.

## 2. Fill and submit a form

```text
dsagent_page_act_many {"pageContextId":"<id>","actions":[
  {"targetId":"<name field>","action":"input","value":"<value>"},
  {"targetId":"<country select>","action":"select","selection":"<option text>","selectBy":"text"},
  {"targetId":"<terms checkbox>","action":"set-checkbox","checked":true},
  {"target":{"name":"Submit","role":"button"},"action":"click","waitAfter":{"until":"revision-changed"}}
],"idempotencyKey":"form-<uuid>"}
```

Submit only what the person asked for; check the result page for the confirmation or the field errors.

## 3. Choose from a hover menu (sort, filter, account menu)

```text
dsagent_page_act_many {"pageContextId":"<id>","actions":[
  {"targetId":"<menu opener>","action":"hover"},
  {"waitFor":{"until":"target-present","target":{"name":"<option>"},"timeoutMs":3000}},
  {"target":{"name":"<option>"},"action":"click"},
  {"waitFor":{"until":"settled"}}
],"idempotencyKey":"menu-<uuid>"}
```

The wait is the evidence that the menu opened; `wait-timed-out` means it did not (click the opener instead). Then
check the selected option or the reordered list in `final`.

## 4. Collect a list once

Repeated records (cards, rows, posts, comments, results) are collected by the wizard, never by reading and scrolling.
Known fields: read them through the same wizard; you rank the sources. With `region` (a target in the
records, from find) keeping one source, one call returns the rows:

```text
dsagent_wizard_collect {"pageContextId":"<id>","records":"<which records, as the person said it>","fields":[{"name":"<field>"},{"name":"<field>"}],"maxRecords":50,"taskDescription":"<the person's request>","idempotencyKey":"collect-<uuid>"}
```

- `stopped`, `reason: choose-source`: nothing ran; `wizard.pendingChoice` lists every candidate source, even one.
  Pick yours with `dsagent_wizard_choose` and `auto: {"once": true}`, then `dsagent_execution_wait`; none fits:
  cancel or `dsagent_wizard_start`.
- `completed`: `rows` keyed by your names, in the order of `columns`. `ended`: the run failed (`status`). `running`:
  `dsagent_execution_wait` with its `executionId`.
- `stopped` for another reason: nothing ran; the wizard is yours (`wizardId`, `wizardToken`, `fieldResults`). Answer its pending choice
  with `dsagent_wizard_choose` and `auto: {"once": true}`, or cancel.
- `POLICY_DENIED`, `plan-restricted`: nothing collected, the wizard ended. Tell the person the limit
  ([plan quotas](plan-quotas.md)) and stop; no retry, no other way of reading.

Fields unknown, or a workflow to keep: start the wizard. Once, keeping no workflow:

```text
dsagent_wizard_start {"kind":"scrape","pageContextId":"<id>","taskDescription":"<the person's request>","auto":{"once":true,"maxRecords":100},"idempotencyKey":"wizard-<uuid>"}
```

- `auto.outcome` `run-started`: the run started on this page as it shows now (a sort or filter you applied stays);
  wait for it with `auto.executionId`.
- `auto.outcome` `stopped`: answer the pending choice (`dsagent_wizard_choose`, again with `auto: {"once": true}`),
  or wait for the person on a wall. At `ready-to-save`, `dsagent.wizard.run` with `"once": true` does the same run.

```text
dsagent_execution_wait {"executionId":"<auto.executionId>","timeoutMs":30000}
```

At `terminal`, `rows` holds the first records (up to 20) and `artifactId` the whole dataset: read the rest with
`dsagent.artifact.read` (`format: jsonl`, page to `eof`). The dataset stays in the person's Data list; no workflow is
left behind. To keep a reusable workflow instead, leave out `once` and call `dsagent.wizard.save`.

When the values to collect sit on each record's detail page (open each item and read its code, stock, specs), it is
still one wizard, never `page.open` / `page.markdown` per item: add `"detailPages":true` to `auto`. Auto stops at
`detail-pages`: choose the records' link field (with `auto: {"once": true}`), then on the opened detail page the
source that holds the values (a `form-group` reads a table of labelled values, one record per page) and its fields.

## 5. Read and finish

```text
dsagent_page_markdown {"pageContextId":"<id>"}
```

```json
{"method":"dsagent.agent.work.finish","args":{"pageContextId":"<id>","status":"succeeded","keep":[]},"idempotencyKey":"finish-<uuid>"}
```

After `OUTCOME_UNKNOWN`, `TIMEOUT` or `CANCELED`, verify with a read; never resend the effect.
