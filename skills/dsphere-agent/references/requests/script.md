# Script sheet — `dsagent.page.script`

`dsagent.page.script` runs a short JavaScript program on one page you already opened, in one call. Its step tool is
`dsagent_page_script`: the same arguments flat, with `idempotencyKey` beside them. The program runs in
a sandbox inside the DSphere extension: there is no page DOM, network, cookies, storage, `console` or `setTimeout`.
It can only call the page functions below, each of which goes through the same checks as the single call it stands
for. The person can turn scripts off; then the call is refused with `AGENT_SCRIPTS_DISABLED` and you use single
calls.

## When to use a script

Choose by who makes the next decision, not by how many steps there are. A script removes only the turns in which you
had nothing to judge.

| Situation | Use |
|---|---|
| One action, or the next move needs you to look at the page and judge | `dsagent.page.action` |
| A straight line of up to 12 decided steps, also across a same-tab navigation (fill and submit; type, press Enter, wait, open a result) | `dsagent.page.actions` (`dsagent_page_act_many`) |
| The chain needs `if`, a loop, a retry, or a read that decides the next step | `dsagent.page.script` |

A script saves nothing inside the call: each page function runs the checks of the single call it stands for. It saves
the turns between the calls, and their results stay out of your context: you get the receipts, your `return` value
and the page it ended on. So it pays when it replaces two or more turns you would have spent without judging anything.

Use a script only when all three hold:

1. You have read the page and can name the targets by name and role: the view `dsagent.page.open` returned, an
   observe or a find all count. A script is never your first contact with a page.
2. The next three or more page calls can be written now, and the choices between them are mechanical: is this text
   present, was the target found, how many results came back.
3. A sequence cannot say it: the work repeats (the same steps for each of N rows), waits and checks (act, wait, read,
   try again), or branches (close a popup only when it is there; use the control named "Next" or "下一页").

Typical cases:

- Turn a pager, load more or wait until a text or a state appears, then go on.
- Do the same steps to each item of a list you pass as `input`: tick these options, fill these rows, expand these sections.
- A step that may not be there: a notice to close, an option already chosen.
- Repeat with other values what you just did step by step: the first item by single calls, the others in one script.
- Replay a run you compiled (`compileRun`), a person's skill or their Playwright script.

Stay with single calls when any of these holds:

- You have not read the page yet, or you are still exploring it.
- The next move needs judgment about the content: which result matches what the person meant, whether a price looks
  right, anything you need a screenshot to see.
- The action cannot be undone: placing an order, paying, sending a message, deleting, submitting a form someone else
  acts on. Stop the script right before that step and return; check the state, then do that step as a single call, or
  ask the person first with `dsagent.page.ask`.
- A person must act, a page dialog is open, or a file must be uploaded (scripts do not offer these).
- The same script failed twice on this page: the page is not what you assumed, so go back to looking.
- The goal is to collect data: use the wizard (`dsagent.wizard.start`), not a script that returns rows.

## Shapes

Copy one and change the names. Both ran as shown on real sites (recorded 2026-11-23 on the DSphere browser, Skill 2.0.5).

**A loop that acts, waits and checks.** Search, then turn the results pager to page 3. Twelve page calls, one call:

```js
const box = (await page.find('', { role: 'searchbox', limit: 1 })).matches[0]
await page.input(box, input.query)
await page.press('Enter', box)
await page.waitFor({ until: 'url-changed', timeoutMs: 10000 })
let shown = 1
while (shown < input.page) {
  let next
  for (const name of input.nextNames) {
    next = (await page.find(name, { role: 'link', limit: 1 })).matches[0]
    if (next) break
  }
  if (!next) return { shown, reason: 'no next-page link' }
  await page.click(next)
  await page.waitFor({ until: 'url-changed', timeoutMs: 10000 })
  shown += 1
}
return { shown }
```

with `"input": {"query": "<words>", "page": 3, "nextNames": ["下一页", "Next page"]}`. It returned `{"shown": 3}`,
twelve receipts and `final` on the third results page.

**An optional step, then the same steps for each item of `input`.** Close a notice only when it is there, then fill
each listed field and say which ones worked. Seven page calls, one call:

```js
const notice = (await page.find('Accept', { role: 'button', limit: 1 })).matches[0]
if (notice) await page.click(notice)
const done = []
for (const item of input.items) {
  const hit = (await page.find(item.name, { role: item.role, limit: 1 })).matches[0]
  if (!hit) { done.push({ name: item.name, ok: false, reason: 'not found' }); continue }
  try {
    if (item.value !== undefined) await page.input(hit, item.value)
    else await page.act(hit, item.role === 'checkbox' ? 'set-checkbox' : 'set-radio', { checked: true })
    done.push({ name: item.name, ok: true })
  } catch (error) {
    if (error.name !== 'PageError') throw error
    done.push({ name: item.name, ok: false, code: error.code })
  }
}
return { closedNotice: Boolean(notice), done }
```

with `"input": {"items": [{"name": "Text input", "role": "textbox", "value": "<text>"}, {"name": "Default checkbox", "role": "checkbox"}, {"name": "Default radio", "role": "radio"}]}`.
A find with no match returns an empty `matches`, so `matches[0]` is the test for "is it there".

## Request

The first shape as the call that was sent (`source` is the script with its line breaks as `\n`). With the step tool,
send the `args` object flat with the key beside it: `dsagent_page_script {"pageContextId": …, "description": …, "source": …, "input": …, "idempotencyKey": …}`.

```json
{"method":"dsagent.page.script","args":{"pageContextId":"<id>","description":"Search for the keyword, then turn the results pager to page 3","source":"const box = (await page.find('', { role: 'searchbox', limit: 1 })).matches[0]\nawait page.input(box, input.query)\nawait page.press('Enter', box)\nawait page.waitFor({ until: 'url-changed', timeoutMs: 10000 })\nlet shown = 1\nwhile (shown < input.page) {\n  let next\n  for (const name of input.nextNames) {\n    next = (await page.find(name, { role: 'link', limit: 1 })).matches[0]\n    if (next) break\n  }\n  if (!next) return { shown, reason: 'no next-page link' }\n  await page.click(next)\n  await page.waitFor({ until: 'url-changed', timeoutMs: 10000 })\n  shown += 1\n}\nreturn { shown }","input":{"query":"DSphere Agent browser automation","page":3,"nextNames":["下一页","Next page"]},"maxSteps":20},"idempotencyKey":"script-<uuid>"}
```

- `description` (required, ≤ 120 characters): what the script does, in words the person reads in your activity card
  and on the page.
- `source` (≤ 16 KiB): the body of an async function. Await every page call and `return` a small JSON value.
- `input` (optional JSON object, ≤ 8 KiB): read-only as the global `input`. Pass values here instead of building them
  into the source.
- `maxSteps` (1–60, default 30) and `timeoutMs` (1,000–120,000, default 60,000).

## Functions

| Function | Same as |
|---|---|
| `page.find(query, {role, context, includeText, limit})` | `dsagent.page.find`; returns its `matches` (each `match.target` has `id`, label, role, capabilities) |
| `page.act(target, action, params)` | `dsagent.page.action`; `target` is a find match or a target id; `params` as page.action takes them |
| `page.click(target)`, `page.input(target, value)`, `page.press(key, target?)`, `page.select(target, params)`, `page.scroll(target?, params)`, `page.hover(target)` | shorthands of `page.act` |
| `page.waitFor({until, text, timeoutMs, ...})` | `dsagent.page.wait` conditions; `revision-changed` without `sinceRevision` waits from the newest revision the script saw |
| `page.observe()` | `dsagent.page.observe` |
| `page.readText({focus, profile})` | `dsagent.page.markdown`, at most 4,000 characters |
| `log(...values)` | a line in the result's `logs` |
| `sleep(ms)` | 50 to 5,000 ms |
| `page.actions(steps)` | `dsagent.page.actions`: steps name controls by `targetId` or by their words (`target`), plus `waitFor` steps |

Playwright-style code runs too: `page.getByRole(role, { name })`, `getByText`, `getByLabel` and the other role-and-name
locators with their actions, waits and `expect`. To run a person's Playwright script, follow the
[Playwright conversion sheet](playwright.md).

`handle-dialog` and `upload-file` are not available in scripts. Scripts cannot open pages or go to an address: open
the page with `dsagent.page.open` first.

## Results and errors

`status` is one of `completed` (with `value`), `failed`, `script-error`, `stopped`, `needs-person`, `timed-out` or
`step-limit`. Every result has `steps` (one receipt per page call), `logs` and `final`, the compact view of the page
when the script ended: plan your next call from it.

- A page call that fails throws an `Error` named `PageError` with `code`, `businessCode`, `hint` and `step`. Catch the
  failures you expect (a target covered by a popup: close it and find again); let the others fail.
- After a navigation, targets you found before are gone: find them again (`STALE_OBSERVATION` otherwise).
- To wait for a new address after an Enter or a click, use `page.waitFor({ until: 'url-changed' })` or
  `page.waitForURL(part)`. The first url-changed wait after an action counts from the address before that action, so
  a change the action already made meets it at once; a later one waits for a new change.
- Stop, a sign-in or verification wall, a page dialog and the limits end the script; it cannot catch them.
  `needs-person` names the business code: handle it as you would after a single call.
- Script code may compute at most 250 ms between page calls and 2 s in all. It is for orchestrating page calls, not
  for heavy work.
- After `failed`, do not rerun the whole script: the receipts show which steps ran, so continue from the failed step.
- Finishing a task with `dsagent.agent.work.finish {..., compileRun: true}` returns its verified steps as scripts like
  these, one per page. Running a person's own skill: see the [skill sheet](skills.md).

## Writing rules

- Keep scripts short: about 40 lines and 15 page calls. Several short scripts with a look in between beat one long
  script that guesses.
- Return a small summary, not page content.
- Never put credentials or other people's personal data in `source` or `input`.
