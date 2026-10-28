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
| `taskDescription` | string (1–2000 chars) |  | The person’s reques… |
| `taskMode` | enum: auto, continue |  | continue when you f… |
| `taskSteps` | array of string (1–160 chars) (≤ 30) |  | With taskMode conti… |
| `pageContextId` | string (2–128 chars) | yes | Opaque page context… |
| `targetId` | string (1–128 chars) | yes | Opaque target ident… |
| `expectedRevision` | string (1–128 chars) | yes | Observed revision a… |
| `action` | enum (31 values, listed under Constraints) | yes | Atomic action dynam… |
| `waitAfter` | object {until, timeoutMs, targetId, text, surfaceId} |  | Optional: a dsagent… |
| `clickType` | enum: click, dblclick, rightclick, middleclick |  | Optional click vari… |
| `modifiers` | object {ctrl, shift, alt, meta} |  | Optional modifier k… |
| `offset` | object {dx, dy} |  | Optional point insi… |
| `dialogAction` | enum: accept, dismiss, native |  | How the page's next… |
| `promptText` | string (0–2000 chars) |  | With dialogAction a… |
| `kind` | enum: page, unload |  | page (default): ale… |
| `scope` | enum: next, session |  | next (default): the… |
| `dropTargetId` | string (1–128 chars) |  | With drag: the opaq… |
| `delta` | object {dx, dy} |  | With drag: the pixe… |
| `find` | string (1–2000 chars) |  | The exact text in t… |
| `occurrence` | integer (1…1000) |  | Which match of find… |
| `operation` | enum (8 values, listed under Constraints) |  | replace: put text i… |
| `lineBreaks` | enum: auto, paragraphs, soft |  | In a rich editor (a… |
| `format` | object {bold, italic, underline} |  | With set-format: th… |
| `text` | string (0–8000 chars) |  | The new text for re… |
| `formFields` | array of object {fieldId, targetId, value, checked, selections} (≤ 30) |  | With fill-form: the… |
| `value` | string (0–8000 chars) |  | Text value to enter… |
| `uploadId` | string (36–36 chars, pattern under Constraints) |  | With upload-file: t… |
| `html` | string (1–100000 chars) |  | With paste: rich te… |
| `plainText` | string (1–100000 chars) |  | With paste, optiona… |
| `key` | enum (65 values, listed under Constraints) |  | Key or modifier cho… |
| `repeat` | integer (1…20) |  | Press the same key… |
| `scrollTo` | enum: top, bottom, next-viewport, previous-viewport |  | Bounded destination… |
| `viewportRatio` | number (-∞…1) |  | Optional fraction o… |
| … | 9 more fields in the contract | | |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `action`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `edit-text`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `paste`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `waitAfter.until`: one of `revision-changed`, `target-present`, `target-absent`, `target-enabled`, `target-disabled`, `text-present`, `text-absent`, `url-changed`, `settled`, `surface-closed`, `authentication-cleared`, `download`
- `operation`: one of `replace`, `insert-before`, `insert-after`, `delete`, `select`, `place-caret-before`, `place-caret-after`, `set-format`
- `formFields[].fieldId`: matches `^fld-[0-9a-f]{12}$`
- `uploadId`: matches `^upl_[0-9a-f]{32}$`
- `key`: one of `Enter`, `Escape`, `Tab`, `Backspace`, `Delete`, `Space`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `PageUp`, `PageDown`, `Control+0`, `Control+1`, `Control+2`, `Control+3`, `Control+4`, `Control+5`, `Control+6`, `Control+7`, `Control+8`, `Control+9`, `Meta+0`, `Meta+1`, `Meta+2`, `Meta+3`, `Meta+4`, `Meta+5`, `Meta+6`, `Meta+7`, `Meta+8`, `Meta+9`, `Shift+Tab`, `Control+a`, `Control+c`, `Control+v`, `Control+x`, `Control+z`, `Control+Enter`, `Shift+Enter`, `Shift+ArrowLeft`, `Shift+ArrowRight`, `Shift+ArrowUp`, `Shift+ArrowDown`, `Shift+Home`, `Shift+End`, `Control+ArrowLeft`, `Control+ArrowRight`, `Control+Home`, `Control+End`, `Control+Shift+ArrowLeft`, `Control+Shift+ArrowRight`, `Control+Shift+Home`, `Control+Shift+End`, `Control+Backspace`, `Control+Delete`, `Control+b`, `Control+i`, `Control+u`, `Control+Shift+z`, `Control+y`, `/`, `?`
- `axis`: one of `y`, `x`
- `selectBy`: one of `value`, `text`, `index`
- `level`: one of `basic`, `standard`, `aggressive`

## Result fields (data.data)

Verified action receipt: a delta of the page the action left in place, or the compact view of the page it navigated to…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageSurfaces` | object {sequence, surfaces} |  | Live surface eviden… |
| `motion` | object {scope, animationCount, marqueeCount, carouselCount, heldCount, unpausableCount, …} |  | Current motion stat… |
| `focusedCaret` | object {surface, textLength, selectionStart, selectionEnd, caret, selectedText, …} |  | Where the caret sta… |
| `framePageSurfaces` | array of object {frameId, observed} (≤ 8) |  | Admitted child-fram… |
| `timing` | object {startedAt, durationMs, stages} |  | Measured shared own… |
| `operationResult` | one of 13: object {fields, fieldCount, truncated} / object {filled, requiredEmpty, fieldCount} / object {pasted, handledBy, caretPlacement, elementsAdded, imagesInserted, textAdded, …} / object {uploadState, path, fileDelivery, fileName, sizeBytes, slotIndex, …} / object {options, reclassifyAs} / object {operation, animationCount, marqueeCount, carouselCount, heldCount, runningCount, …} / object {operation, videoCount, playingCount, truncated} / object {operation, animationCount, marqueeCount, carouselCount, heldCount, runningCount, …} / object {operation, videoCount, playingCount, pausedCount, truncated} / object {operation, videoCount, playingCount, playedCount, truncated} / object {operation, animationCount, marqueeCount, carouselCount, heldCount, runningCount, …} / object {operation, count, protectedSkips, truncated} / object {operation, removedCount, remaining, protectedSkips, truncated, persistent, …} |  | Bounded result publ… |
| `pageContextId` | string (0–128 chars) |  | Page context on whi… |
| `targetId` | string (0–128 chars) |  | Opaque target selec… |
| `action` | enum (31 values, listed under Constraints) |  | Atomic action that… |
| `success` | boolean |  | Whether the Extensi… |
| `detail` | string (0–1000 chars) |  | Bounded action rece… |
| `previousRevision` | string (0–128 chars) |  | Revision verified i… |
| `revision` | string (0–128 chars) |  | Page revision obser… |
| `change` | enum: full, delta, unchanged |  | Observed page chang… |
| `url` | string (0–2048 chars) |  | Sanitized page URL… |
| `title` | string (0–300 chars) |  | Bounded page title… |
| `semanticText` | string (0–6000 chars) |  | Already collected b… |
| `semanticTextKind` | enum: page-prose, control-labels, surface |  | With a new page's c… |
| `semanticTextTruncated` | enum: true |  | With a new page's c… |
| `activeSurface` | object {kind, label, closeTargetId} |  | Present when a dial… |
| `visibleRecordCount` | integer (0…∞) |  | Records the page sh… |
| `pageMessages` | array of string (0–160 chars) (≤ 4) |  | What the page says… |
| `documentStatus` | integer (100…599) |  | HTTP status of the… |
| `pageMetrics` | object {viewportWidth, viewportHeight, scrollX, scrollY, pixelsAbove, pixelsBelow} |  | With a new page's c… |
| `contentVerified` | boolean |  | Optional receipt fl… |
| `effect` | object {kind, confidence, evidence, surfaceId, closeTargetId, message} |  | What the page did a… |
| `hover` | object {entered, pointerAlreadyInside, cssHoverRulesApplied} |  | What the pointer di… |
| `rehover` | object {targetId, label, hint} |  | Present on a hover… |
| `pageUnchanged` | enum: true |  | Present and true wh… |
| `consumedByDismissal` | object {surfaceId, kind} |  | Present when the pa… |
| `omittedRemovedTargets` | integer (1…∞) |  | Present when the ac… |
| `omittedTargets` | integer (1…∞) |  | Present when the ac… |
| … | 21 more fields in the contract | | |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `pageSurfaces.surfaces[].broughtBy.eventType`: one of `press`, `click`, `double-click`, `context-click`, `hover`, `focus`, `key`, `input`, `drag`, `drop`, `wheel`
- `focusedCaret.formatting.block`: one of `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `li`, `blockquote`, `pre`, `td`, `th`, `div`, `section`
- `framePageSurfaces[].observed.surfaces[].broughtBy.eventType`: same values as `pageSurfaces.surfaces[].broughtBy.eventType`
- `operationResult.fields[].fieldId`: matches `^fld-[0-9a-f]{12}$`
- `action`: same values as input `action`
- `effect.kind`: one of `navigated`, `surface-opened`, `surface-closed`, `region-shown`, `region-hidden`, `value-changed`, `state-changed`, `media`, `download`, `message-shown`, `none`
- `pageSettled`: one of `false`
- `backgroundRendering`: one of `unavailable`
- `playbackResumed`: one of `true`
- `disclosureChange`: one of `target-removed`, `state-changed`, `label-changed`, `content-expanded`, `content-collapsed`, `content-changed`
- `downloadState`: one of `complete`, `in_progress`
- `waitAfter.until`: same values as input `waitAfter.until`
- `wizardStep`: one of `not-recorded`
- `targets.added[].capabilities[]`: same values as input `action`
- `targets.changed[].capabilities[]`: same values as input `action`

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.action.json`](../contracts/dsagent.page.action.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
