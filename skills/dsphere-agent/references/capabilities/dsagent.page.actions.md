# dsagent.page.actions

**Act on browser page targets in sequence** · risk `external-effect` · timeout 120000 ms · inline result ≤ 131072 bytes · concurrency `exclusive-target`

Execute up to 8 planned atomic actions in order on one page, each validated against the page as the previous one left it; stops at the first failure, navigation or missing target and returns a receipt per executed action plus final.

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
        "targetId": "<targetId: supply a value matching the schema>",
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
| `taskDescription` | string (1–2000 chars) |  | The person’s reques… |
| `pageContextId` | string (8–128 chars) | yes | Opaque page context… |
| `expectedRevision` | string (1–128 chars) | yes | Observed revision t… |
| `actions` | array of object {targetId, action, clickType, modifiers, offset, dialogAction, …} (≤ 8) | yes | The atomic actions,… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `actions[].action`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `edit-text`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `actions[].clickType`: one of `click`, `dblclick`, `rightclick`, `middleclick`
- `actions[].dialogAction`: one of `accept`, `dismiss`, `native`
- `actions[].kind`: one of `page`, `unload`
- `actions[].scope`: one of `next`, `session`
- `actions[].operation`: one of `replace`, `insert-before`, `insert-after`, `delete`, `select`, `place-caret-before`, `place-caret-after`
- `actions[].formFields[].fieldId`: matches `^fld-[0-9a-f]{12}$`
- `actions[].key`: one of `Enter`, `Escape`, `Tab`, `Backspace`, `Delete`, `Space`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `PageUp`, `PageDown`, `Control+0`, `Control+1`, `Control+2`, `Control+3`, `Control+4`, `Control+5`, `Control+6`, `Control+7`, `Control+8`, `Control+9`, `Meta+0`, `Meta+1`, `Meta+2`, `Meta+3`, `Meta+4`, `Meta+5`, `Meta+6`, `Meta+7`, `Meta+8`, `Meta+9`, `Shift+Tab`, `Control+a`, `Control+c`, `Control+v`, `Control+x`, `Control+z`, `Control+Enter`, `Shift+Enter`, `Shift+ArrowLeft`, `Shift+ArrowRight`, `Shift+ArrowUp`, `Shift+ArrowDown`, `Shift+Home`, `Shift+End`, `Control+ArrowLeft`, `Control+ArrowRight`, `Control+Home`, `Control+End`, `Control+Shift+ArrowLeft`, `Control+Shift+ArrowRight`, `Control+Shift+Home`, `Control+Shift+End`, `Control+Backspace`, `Control+Delete`, `/`, `?`
- `actions[].scrollTo`: one of `top`, `bottom`, `next-viewport`, `previous-viewport`
- `actions[].axis`: one of `y`, `x`
- `actions[].selectBy`: one of `value`, `text`, `index`
- `actions[].uploadId`: matches `^upl_[0-9a-f]{32}$`
- `actions[].level`: one of `basic`, `standard`, `aggressive`
- `actions[].waitAfter.until`: one of `revision-changed`, `target-present`, `target-absent`, `text-present`, `url-changed`, `settled`, `surface-closed`, `authentication-cleared`, `download`

## Result fields (data.data)

Receipts of the executed actions and the complete bounded final target inventory.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | The page context th… |
| `previousRevision` | string (0–128 chars) |  | The revision the se… |
| `revision` | string (0–128 chars) |  | The page revision a… |
| `executed` | integer (0…8) |  | How many actions ex… |
| `receipts` | array of object {index, targetId, action, success, rehover, detail, …} (≤ 8) |  | One receipt per exe… |
| `stopped` | object {reason, index, targetId, code, businessCode, failureCode, …} |  | Present when the se… |
| `warnings` | array of object {code, message, nextActions} (≤ 2) |  | REPEATED_RECORDS_US… |
| `final` | object {pageSurfaces, motion, focusedCaret, framePageSurfaces, timing, operationResult, …} |  | Verified action rec… |
| `authentication` | object {status, type, confidence, waitingOn, attemptsLeft} |  | The sign-in monitor… |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `receipts[].action`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `edit-text`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `receipts[].effect.kind`: one of `navigated`, `surface-opened`, `surface-closed`, `region-shown`, `region-hidden`, `value-changed`, `state-changed`, `media`, `download`, `none`
- `receipts[].waitAfter.until`: one of `revision-changed`, `target-present`, `target-absent`, `text-present`, `url-changed`, `settled`, `surface-closed`, `authentication-cleared`, `download`
- `final.pageSurfaces.surfaces[].broughtBy.eventType`: one of `press`, `click`, `double-click`, `context-click`, `hover`, `focus`, `key`, `input`, `drag`, `drop`, `wheel`
- `final.framePageSurfaces[].observed.surfaces[].broughtBy.eventType`: one of `press`, `click`, `double-click`, `context-click`, `hover`, `focus`, `key`, `input`, `drag`, `drop`, `wheel`
- `final.operationResult.fields[].fieldId`: matches `^fld-[0-9a-f]{12}$`
- `final.action`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `edit-text`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `final.effect.kind`: one of `navigated`, `surface-opened`, `surface-closed`, `region-shown`, `region-hidden`, `value-changed`, `state-changed`, `media`, `download`, `none`
- `final.waitAfter.until`: one of `revision-changed`, `target-present`, `target-absent`, `text-present`, `url-changed`, `settled`, `surface-closed`, `authentication-cleared`, `download`
- `final.targets.added[].capabilities[]`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `edit-text`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `final.targets.changed[].capabilities[]`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `edit-text`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.actions.json`](../contracts/dsagent.page.actions.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
