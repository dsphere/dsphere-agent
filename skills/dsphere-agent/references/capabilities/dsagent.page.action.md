# dsagent.page.action

**Act on browser page target** · risk `external-effect` · timeout 45000 ms · inline result ≤ 131072 bytes · concurrency `exclusive-target`

Execute one planned atomic action (see the action enum: click, input, hover, scroll, press-key, select, …) on an opaque target at the latest revision. A stale expectedRevision is refused before dispatch; the receipt carries the page delta to plan the next step from.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.action",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "targetId": "<targetId: supply a value matching the schema>",
    "expectedRevision": "<expectedRevision: supply a value matching the schema>",
    "action": "click"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Opaque target binding, revision guard, and bounded parameters for one external atomic page action.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `taskDescription` | string (1–2000 chars) |  | The person’s request in detail… |
| `pageContextId` | string (8–128 chars) | yes | Opaque page context from dsagen… |
| `targetId` | string (1–128 chars) | yes | Opaque target identifier return… |
| `expectedRevision` | string (1–128 chars) | yes | Observed revision associated wi… |
| `action` | enum (29 values, listed under Constraints) | yes | Atomic action dynamically proje… |
| `waitAfter` | object {until, timeoutMs, targetId, text, surfaceId} |  | Optional: a dsagent.page.wait f… |
| `clickType` | enum: click, dblclick, rightclick, middleclick |  | Optional click variant; default… |
| `modifiers` | object {ctrl, shift, alt, meta} |  | Optional modifier keys held dur… |
| `offset` | object {dx, dy} |  | Optional point inside the targe… |
| `dialogAction` | enum: accept, dismiss, native |  | How the page's next alert, conf… |
| `promptText` | string (0–2000 chars) |  | With dialogAction accept: the t… |
| `kind` | enum: page, unload |  | page (default): alert, confirm… |
| `scope` | enum: next, session |  | next (default): the next dialog… |
| `dropTargetId` | string (1–128 chars) |  | With drag: the opaque target to… |
| `delta` | object {dx, dy} |  | With drag: the pixel offset fro… |
| `formFields` | array of object {fieldId, targetId, value, checked, selections} (≤ 30) |  | With fill-form: the fields to f… |
| `value` | string (0–8000 chars) |  | Text value to enter into the op… |
| `key` | enum (44 values, listed under Constraints) |  | Key or modifier chord to press… |
| `repeat` | integer (1…20) |  | Press the same key this many ti… |
| `scrollTo` | enum: top, bottom, next-viewport, previous-viewport |  | Bounded destination for scrolli… |
| `viewportRatio` | number (-∞…1) |  | Optional fraction of one viewpo… |
| `axis` | enum: y, x |  | Optional scroll axis; y (vertic… |
| `selection` | string (0–2000 chars) |  | Exact option value, label or in… |
| `selectBy` | enum: value, text, index |  | How selection names the option;… |
| `selections` | array of string (0–2000 chars) (≤ 50) |  | Optional complete selection for… |
| `checked` | boolean |  | Required final checked state; t… |
| `bypassCache` | boolean |  | Reload past the browser cache;… |
| `uploadId` | string (36–36 chars, pattern under Constraints) |  | With upload-file: the uploadId… |
| `level` | enum: basic, standard, aggressive |  | Ad rule tier: basic, standard (… |
| `persistent` | boolean |  | Keep removing newly inserted ad… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `action`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `waitAfter.until`: one of `revision-changed`, `target-present`, `target-absent`, `text-present`, `url-changed`, `settled`, `surface-closed`, `authentication-cleared`, `download`
- `formFields[].fieldId`: matches `^fld-[0-9a-f]{12}$`
- `key`: one of `Enter`, `Escape`, `Tab`, `Backspace`, `Delete`, `Space`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `PageUp`, `PageDown`, `Control+0`, `Control+1`, `Control+2`, `Control+3`, `Control+4`, `Control+5`, `Control+6`, `Control+7`, `Control+8`, `Control+9`, `Meta+0`, `Meta+1`, `Meta+2`, `Meta+3`, `Meta+4`, `Meta+5`, `Meta+6`, `Meta+7`, `Meta+8`, `Meta+9`, `Shift+Tab`, `Control+a`, `Control+c`, `Control+v`, `Control+x`, `Control+z`, `Control+Enter`, `Shift+Enter`, `/`, `?`
- `uploadId`: matches `^upl_[0-9a-f]{32}$`

## Result fields (data.data)

Verified action receipt and bounded post-action page delta.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageSurfaces` | object {sequence, surfaces} |  | Live surface evidence from the… |
| `motion` | object {scope, animationCount, marqueeCount, carouselCount, heldCount, unpausableCount, …} |  | Current motion state; successfu… |
| `framePageSurfaces` | array of object {frameId, observed} (≤ 8) |  | Admitted child-frame surface mo… |
| `timing` | object {startedAt, durationMs, stages} |  | Measured shared owner timing, w… |
| `operationResult` | one of 12: object {fields, fieldCount, truncated} / object {filled, requiredEmpty, fieldCount} / object {uploadState, path, fileName, sizeBytes, slotIndex, slotLabel, …} / object {options, reclassifyAs} / object {operation, animationCount, marqueeCount, carouselCount, heldCount, runningCount, …} / object {operation, videoCount, playingCount, truncated} / object {operation, animationCount, marqueeCount, carouselCount, heldCount, runningCount, …} / object {operation, videoCount, playingCount, pausedCount, truncated} / object {operation, videoCount, playingCount, playedCount, truncated} / object {operation, animationCount, marqueeCount, carouselCount, heldCount, runningCount, …} / object {operation, count, protectedSkips, truncated} / object {operation, removedCount, remaining, protectedSkips, truncated, persistent, …} |  | Bounded result published by the… |
| `pageContextId` | string (0–128 chars) |  | Page context on which the actio… |
| `targetId` | string (0–128 chars) |  | Opaque target selected for the… |
| `action` | enum (29 values, listed under Constraints) |  | Atomic action that executed. |
| `success` | boolean |  | Whether the Extension action ru… |
| `detail` | string (0–1000 chars) |  | Bounded action receipt detail. |
| `previousRevision` | string (0–128 chars) |  | Revision verified immediately b… |
| `revision` | string (0–128 chars) |  | Page revision observed after th… |
| `change` | enum: full, delta, unchanged |  | Observed page change mode after… |
| `url` | string (0–2048 chars) |  | Sanitized page URL observed aft… |
| `title` | string (0–300 chars) |  | Bounded page title observed aft… |
| `semanticText` | string (0–6000 chars) |  | Already collected bounded visib… |
| `contentVerified` | boolean |  | Optional receipt flag indicatin… |
| `effect` | object {kind, confidence, evidence, surfaceId, closeTargetId} |  | What the page did after the act… |
| `hover` | object {entered, pointerAlreadyInside, cssHoverRulesApplied} |  | What the pointer did on a hover… |
| `rehover` | object {targetId, label, hint} |  | Present on a hover receipt when… |
| `pageUnchanged` | enum: true |  | Present and true when the click… |
| `consumedByDismissal` | object {surfaceId, kind} |  | Present when the page used this… |
| `omittedRemovedTargets` | integer (1…∞) |  | Present when the action removed… |
| `omittedTargets` | integer (1…∞) |  | Present when the action brought… |
| `pageSettled` | enum: false |  | Present and false when the page… |
| `sourcePageContextId` | string (0–128 chars) |  | Origin page when an attributed… |
| `destinationPageContextId` | string (0–128 chars) |  | Observed destination page for s… |
| `clickConfidence` | number |  | Optional bounded click confiden… |
| `playbackResumed` | enum: true |  | Present and true when the click… |
| `disclosureChange` | enum: target-removed, state-changed, label-changed, content-expanded, content-collapsed, content-changed |  | Optional target-local evidence… |
| `opensOnPointerEnter` | boolean |  | True when the control opens on… |
| `navigationUrl` | string (0–2048 chars) |  | Optional sanitized navigation d… |
| … | 11 more fields in the contract | | |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `pageSurfaces.surfaces[].broughtBy.eventType`: one of `press`, `click`, `double-click`, `context-click`, `hover`, `focus`, `key`, `input`, `drag`, `drop`, `wheel`
- `framePageSurfaces[].observed.surfaces[].broughtBy.eventType`: one of `press`, `click`, `double-click`, `context-click`, `hover`, `focus`, `key`, `input`, `drag`, `drop`, `wheel`
- `operationResult.fields[].fieldId`: matches `^fld-[0-9a-f]{12}$`
- `action`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `effect.kind`: one of `navigated`, `surface-opened`, `surface-closed`, `region-shown`, `region-hidden`, `value-changed`, `state-changed`, `media`, `download`, `none`
- `waitAfter.until`: one of `revision-changed`, `target-present`, `target-absent`, `text-present`, `url-changed`, `settled`, `surface-closed`, `authentication-cleared`, `download`
- `targets.added[].capabilities[]`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `targets.changed[].capabilities[]`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.action.json`](../contracts/dsagent.page.action.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
