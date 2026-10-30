# Skill sheet — running a person's own skill

The person has a skill of their own (a SKILL.md or similar that describes a workflow: "open the creator page, fill the
title, upload the cover, publish") and asks you to run it in DSphere. Plan the first run carefully, compile it, and make
every later run one call.

## 1. Before the first step

- Start one task for the whole skill: the first `dsagent.page.open` carries `taskDescription` (the person's request in
  full), `taskMode: "continue"` and `taskSteps` (the skill's steps, in its own words). Report each step once with
  `dsagent.agent.work.step`.
- Look beside the skill for a compiled script from an earlier run (for example `dsphere/<host>.script.js` with its
  `input`). If there is one, go to section 4.
- If the skill runs on a schedule, over many items, or for other people, read section 5 first.

## 2. Sort each step of the skill

| The skill says | Do |
|---|---|
| Open a site, go to a page | `dsagent.page.open` with the address the skill or the person names |
| Fill fields, choose options, click through a known sequence | one `dsagent.page.script` or `dsagent.page.actions` call for the whole stretch ([script sheet](script.md)) |
| A step that needs a judgment about the content (pick the right result, check a price) | single calls: observe or find, then act |
| Collect a list, a table, comments, repeated records | the wizard: `dsagent.wizard.start {kind: "scrape"}` ([wizard sheet](wizard.md)) |
| Sign in, pass a verification check | the person does it: say what is needed and wait (User control in SKILL.md) |
| Upload a file | `dsagent_upload_file`, then a single `dsagent.page.action` `upload-file` |
| Publish, pay, send, delete, submit a form someone else acts on | a single call at the end, or `dsagent.page.ask` first when the person has not clearly asked for it |

Values the skill takes (a title, a keyword, a date) are the script's `input`, never written into its source.

## 3. Finish and compile

End the task with `dsagent.agent.work.finish {pageContextId, status: "succeeded", keep: [], compileRun: true}`. The
result's `run.pages` holds one Playwright-style script per page the run used, in order, each with its starting `url`,
its `source` and its `input` (the values typed this time; sensitive fields such as passwords or codes are always empty).
`run.notes` names steps the scripts leave to single calls (dialogs, uploads) or could not name. A control with no
words of its own is named by its role and the record or group it sits in, as a `page.actions` step; one with neither is
named by role alone, and a note says the step stops with `TARGET_AMBIGUOUS` on a page with two such controls. Words
that changed between steps on the same control (a suggestion shown in a search box, a countdown) never become its name,
and the only search box on a page is named by its role. The run holds only this task's steps: name one of its pages in
the finish, and use the same `taskDescription` on every call of the task (another description starts another task).

Save each page's `url`, `source` and `input` beside the person's skill (for example `dsphere/<host>.script.js` and
`dsphere/<host>.input.json`), and tell the person you did. Before saving, read the source: rename input fields to the
skill's own names, and move an irreversible last step out of the script into a single call.

## 4. Later runs

1. `dsagent.page.open` the saved `url` (with the task fields of section 1).
2. `dsagent.page.script {pageContextId, description, source, input}` with this run's values in `input`.
3. `completed`: check `final`, then do any single-call steps from `run.notes` and the irreversible last step.
4. `failed` or `needs-person`: the page changed or needs the person. Follow the error's `hint`, continue from the failed
   step with single calls (the step receipts show what ran), and finish with `compileRun: true` again to replace the
   saved script.

## 5. Graduate to a saved workflow

Use a saved workflow instead of a script when the skill runs on a schedule, runs over many records or pages, collects
data the person wants as a dataset, or is shared with other people. Record it once with the wizard
(`dsagent.wizard.start {kind: "record"}`, [wizard sheet](wizard.md)), save it, and from then on run it with
`dsagent.workflows.list` → `dsagent.workflow.inputs.get` → `dsagent.execution.run` → `dsagent.execution.wait`. A saved
workflow has its own retries, monitoring and data output, and shows in the person's workflow list.
