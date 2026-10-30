# dsagent.page.script

**Run a short script of page actions** · risk `external-effect` · timeout 130000 ms · inline result ≤ 131072 bytes · concurrency `exclusive-target`

Runs a short JavaScript program in a sandbox in the extension on one page you opened. No page DOM, network, cookies, storage or timers: only page.* functions (each with the single call's checks), input, log and sleep. Returns status, value, logs, step receipts and the ended page.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.script",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "description": "<description: supply a value matching the schema>",
    "source": "<source: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page, what the script does in words, its source and optional input and limits.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `taskDescription` | string (1–2000 chars) |  | The person’s request in detail (what to do, on which site, with which data), as you would tell them; DSphere shows it a… |
| `taskMode` | enum: auto, continue |  | continue when you follow your own skill, workflow or plan of several steps (open, act, run, collect, …): the task then… |
| `taskSteps` | array of string (1–160 chars) (≤ 30) |  | With taskMode continue: your steps in order, as your skill lists them; DSphere shows them as the task checklist and you… |
| `pageContextId` | string (2–128 chars) | yes | Opaque page context from dsagent.pages.list or dsagent.page.open. The script works on this page only; it cannot open pa… |
| `description` | string (1–120 chars) | yes | What the script does, in words the person reads in the activity card and on the page, e.g. "Search for the keyword and… |
| `source` | string (1–16384 chars) | yes | The script body (at most 16384 bytes of UTF-8). It runs as the body of an async function: use await and return a JSON v… |
| `input` | object |  | Optional JSON object (at most 8192 bytes), available read-only as the global input. |
| `maxSteps` | integer (1…60) |  | Most page calls the script may make; default 30. One more ends it with step-limit. |
| `timeoutMs` | integer (1000…120000) |  | Time for the whole script; default 60000. A page call already sent finishes first. |

## Result fields (data.data)

How the script ended, its value, logs, step receipts and the ended page.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | enum (7 values, listed under Constraints) |  | completed: it returned; failed: a page call failed and the script did not catch it; script-error: the code itself faile… |
| `pageContextId` | string (0–128 chars) |  | The page the script ran on. |
| `value` | any |  | On completed: the returned JSON value (at most 32768 bytes). |
| `logs` | array of string (≤ 100) |  | log() lines in order (at most 100 lines and 8192 bytes; a last line says when more were cut). |
| `steps` | array of object {index, call, action, targetId, outcome, code, …} (≤ 60) |  | One receipt per page call, in order. |
| `error` | object {code, businessCode, name, message, line, column, …} |  | Present unless status is completed. |
| `final` | object {revision, url, title, change, semanticText, semanticTextKind, …} |  | The compact view of the page when the script ended; plan the next call from it. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of `completed`, `failed`, `script-error`, `stopped`, `needs-person`, `timed-out`, `step-limit`
- `steps[].call`: one of `find`, `act`, `actions`, `click`, `input`, `press`, `select`, `scroll`, `hover`, `waitFor`, `observe`, `readText`
- `final.targets.added[].capabilities[]`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `edit-text`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `paste`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `final.targets.changed[].capabilities[]`: same values as `final.targets.added[].capabilities[]`

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.script.json`](../contracts/dsagent.page.script.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
