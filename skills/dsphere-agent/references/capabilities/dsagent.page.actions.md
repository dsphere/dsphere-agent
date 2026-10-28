# dsagent.page.actions

**Act on browser page targets in sequence** · risk `external-effect` · timeout 120000 ms · inline result ≤ 131072 bytes · concurrency `exclusive-target`

Up to 12 planned steps on one page, in order: actions on a targetId or on the control its words name (target), and waits (waitFor), across a same-tab navigation; returns step receipts and final, the ended page's view.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.actions",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "expectedRevision": "<expectedRevision: supply a value matching the schema>",
    "actions": [
      {
        "targetId": "<targetId>",
        "action": "click"
      }
    ]
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

One page context, the revision the sequence starts from, and the ordered actions.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `taskDescription` | string (1–2000 chars) |  | The person’s request in detail (what to do, on which site, with which d… |
| `taskMode` | enum: auto, continue |  | continue when you follow your own skill, workflow or plan of several st… |
| `taskSteps` | array of string (1–160 chars) (≤ 30) |  | With taskMode continue: your steps in order, as your skill lists them;… |
| `pageContextId` | string (2–128 chars) | yes | Opaque page context from dsagent.pages.list, dsagent.page.open, or a re… |
| `expectedRevision` | string (1–128 chars) | yes | The revision the first step was planned at. |
| `actions` | array of object {targetId, target, action, clickType, modifiers, offset, …} (≤ 12) | yes | The steps, in order. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `actions[].action`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `edit-text`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `paste`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `actions[].clickType`: one of `click`, `dblclick`, `rightclick`, `middleclick`
- `actions[].dialogAction`: one of `accept`, `dismiss`, `native`
- `actions[].kind`: one of `page`, `unload`
- `actions[].scope`: one of `next`, `session`
- `actions[].operation`: one of `replace`, `insert-before`, `insert-after`, `delete`, `select`, `place-caret-before`, `place-caret-after`, `set-format`
- `actions[].lineBreaks`: one of `auto`, `paragraphs`, `soft`
- `actions[].formFields[].fieldId`: matches `^fld-[0-9a-f]{12}$`
- `actions[].uploadId`: matches `^upl_[0-9a-f]{32}$`
- `actions[].key`: one of `Enter`, `Escape`, `Tab`, `Backspace`, `Delete`, `Space`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `PageUp`, `PageDown`, `Control+0`, `Control+1`, `Control+2`, `Control+3`, `Control+4`, `Control+5`, `Control+6`, `Control+7`, `Control+8`, `Control+9`, `Meta+0`, `Meta+1`, `Meta+2`, `Meta+3`, `Meta+4`, `Meta+5`, `Meta+6`, `Meta+7`, `Meta+8`, `Meta+9`, `Shift+Tab`, `Control+a`, `Control+c`, `Control+v`, `Control+x`, `Control+z`, `Control+Enter`, `Shift+Enter`, `Shift+ArrowLeft`, `Shift+ArrowRight`, `Shift+ArrowUp`, `Shift+ArrowDown`, `Shift+Home`, `Shift+End`, `Control+ArrowLeft`, `Control+ArrowRight`, `Control+Home`, `Control+End`, `Control+Shift+ArrowLeft`, `Control+Shift+ArrowRight`, `Control+Shift+Home`, `Control+Shift+End`, `Control+Backspace`, `Control+Delete`, `Control+b`, `Control+i`, `Control+u`, `Control+Shift+z`, `Control+y`, `/`, `?`
- `actions[].scrollTo`: one of `top`, `bottom`, `next-viewport`, `previous-viewport`
- `actions[].axis`: one of `y`, `x`
- `actions[].selectBy`: one of `value`, `text`, `index`
- `actions[].level`: one of `basic`, `standard`, `aggressive`
- `actions[].waitFor.until`: one of `text-present`, `text-absent`, `target-present`, `target-absent`, `url-changed`, `revision-changed`, `settled`
- `actions[].waitAfter.until`: one of `revision-changed`, `target-present`, `target-absent`, `target-enabled`, `target-disabled`, `text-present`, `text-absent`, `url-changed`, `settled`, `surface-closed`, `authentication-cleared`, `download`

## Result fields (data.data)

Receipts of the executed steps and the compact view of the page the sequence ended on.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | The page context the sequence ended on (another one after a navigated s… |
| `previousRevision` | string (0–128 chars) |  | The revision the sequence started from. |
| `revision` | string (0–128 chars) |  | The page revision after the last executed action. |
| `executed` | integer (0…12) |  | How many steps executed (actions verified, waits ended). |
| `receipts` | array of object {index, targetId, action, resolved, waitFor, success, …} (≤ 12) |  | One receipt per executed step, in order. |
| `stopped` | object {reason, index, targetId, code, businessCode, failureCode, …} |  | Present when the sequence ended before its last step. |
| `warnings` | array of object {code, message, nextActions} (≤ 2) |  | REPEATED_RECORDS_USE_WIZARD: switch to the scrape wizard on this page n… |
| `final` | object {pageSurfaces, motion, focusedCaret, framePageSurfaces, timing, operationResult, …} |  | Verified action receipt: a delta of the page the action left in place,… |
| `authentication` | object {status, type, confidence, waitingOn, attemptsLeft} |  | The sign-in monitor's verdict on the page: status no-wall when it check… |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `receipts[].action`: same values as input `actions[].action`
- `receipts[].waitFor.until`: same values as input `actions[].waitFor.until`
- `receipts[].effect.kind`: one of `navigated`, `surface-opened`, `surface-closed`, `region-shown`, `region-hidden`, `value-changed`, `state-changed`, `media`, `download`, `message-shown`, `none`
- `receipts[].waitAfter.until`: same values as input `actions[].waitAfter.until`
- `stopped.reason`: one of `failed`, `navigated`, `target-missing`, `target-unresolved`, `wait-timed-out`, `canceled`, `consumed-by-dismissal`
- `final.pageSurfaces.surfaces[].broughtBy.eventType`: one of `press`, `click`, `double-click`, `context-click`, `hover`, `focus`, `key`, `input`, `drag`, `drop`, `wheel`
- `final.focusedCaret.formatting.block`: one of `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `li`, `blockquote`, `pre`, `td`, `th`, `div`, `section`
- `final.framePageSurfaces[].observed.surfaces[].broughtBy.eventType`: same values as `final.pageSurfaces.surfaces[].broughtBy.eventType`
- `final.operationResult.fields[].fieldId`: matches `^fld-[0-9a-f]{12}$`
- `final.action`: same values as input `actions[].action`
- `final.effect.kind`: same values as `receipts[].effect.kind`
- `final.waitAfter.until`: same values as input `actions[].waitAfter.until`
- `final.targets.added[].capabilities[]`: same values as input `actions[].action`
- `final.targets.changed[].capabilities[]`: same values as input `actions[].action`

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.actions.json`](../contracts/dsagent.page.actions.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
