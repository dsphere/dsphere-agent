# dsagent.page.observe

**Observe browser page** · risk `read-sensitive` · timeout 35000 ms · inline result ≤ 196608 bytes · concurrency `shared-read`

Read bounded live evidence for the browser steps you plan. Consume the targets and revision already returned by page.action before reading again. For a needed refresh, pass that revision as baseRevision; unchanged means retain the prior targets and semantic text.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.observe",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  }
}
```

## Inputs

Opaque page context and observation mode for a bounded live page read.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) | yes | Opaque page context from dsagent.pages.list, ds… |
| `observationMode` | enum: compact, dom |  | Use compact for semantic targets; use dom only… |
| `targetId` | string (1–128 chars) |  | Optional, only with observationMode dom: an opa… |
| `expectedRevision` | string (1–128 chars) |  | The revision the targetId was published at; req… |
| `baseRevision` | string (1–128 chars) |  | Optional prior revision used to request a delta… |
| `diagnostics` | array of enum: omitted-candidates (≤ 4) |  | omitted-candidates adds up to 40 control candid… |
| `detail` | enum: compact, full |  | full adds the page's hidden same-origin navigat… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `diagnostics[]`: one of `omitted-candidates`

## Result fields (data.data)

Bounded live page state and opaque semantic targets.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | Opaque observed page context. |
| `revision` | string (0–128 chars) |  | Current immutable page revision required by dsa… |
| `baseRevision` | string (0–128 chars) |  | Base revision used to produce a delta when avai… |
| `change` | enum: full, delta, unchanged |  | Whether the observation is a full snapshot, del… |
| `url` | string (0–2048 chars) |  | Sanitized current page URL. |
| `title` | string (0–300 chars) |  | Bounded current page title. |
| `semanticText` | string (0–6000 chars) |  | Bounded visible semantic summary for planning. |
| `semanticTextKind` | enum: page-prose, control-labels, surface |  | What semanticText is: the page's prose, the lab… |
| `activeSurface` | object {kind, label, closeTargetId} |  | Present when a dialog or panel bounds the targe… |
| `omittedCandidates` | array of object {reason, hiddenBy, tag, text, inViewport} (≤ 40) |  | With diagnostics omitted-candidates: control ca… |
| `backgroundControlCount` | integer (0…∞) |  | With activeSurface: declared controls behind th… |
| `visibleRecordCount` | integer (0…∞) |  | Records the page shows (list items, rows, repea… |
| `pageMessages` | array of string (0–160 chars) (≤ 4) |  | What the page says in its alert, status and liv… |
| `documentStatus` | integer (100…599) |  | HTTP status of the loaded document (404, 429, 5… |
| `dialogs` | array of object {kind, decision, policySource, at} (≤ 8) |  | The page's recent alert, confirm, prompt and pr… |
| `console` | object {errors, uncaught, rejections} |  | Page script error counts, diagnostic only; abse… |
| `truncation` | object {targets, extractable, semanticText, frames, detailDropped} |  | What the bounds cut from this observation, repo… |
| `hiddenLinks` | array of object {label, url} (≤ 20) |  | With detail full: same-origin navigation links… |
| `tables` | array of object {id, kind, label, columns, columnCount, rowCount, …} (≤ 4) |  | With detail full: the page's data tables, large… |
| `pageSurfaces` | object {sequence, surfaces} |  | Live surface evidence from the shared global pa… |
| `motion` | object {scope, animationCount, marqueeCount, carouselCount, heldCount, unpausableCount, …} |  | Current motion state; successful input is not p… |
| `framePageSurfaces` | array of object {frameId, observed} (≤ 8) |  | Admitted child-frame surface monitors; compare… |
| `mediaPlayback` | object {scope, videoCount, playingCount, truncated} |  | Read-only playback state without media URLs or… |
| `pageMetrics` | object {viewportWidth, viewportHeight, scrollX, scrollY, pixelsAbove, pixelsBelow} |  | Viewport and scroll metrics used for bounded na… |
| `targets` | object {mode, added, changed, removedTargetIds} |  | Opaque semantic target snapshot or delta. |
| `structure` | object {landmarks, headings, truncated} |  | The page outline (landmarks and headings), valu… |
| `dom` | object {format, mode, baseRevision, content, truncated, scope, …} |  | Optional bounded sanitized DOM evidence returne… |
| `warnings` | array of object {code, message, nextActions} (≤ 2) |  | REPEATED_RECORDS_USE_WIZARD: switch to the scra… |
| `guidance` | object {evidenceGaps, recommendedObservation} |  | Optional owner-derived read-only evidence escal… |
| `authentication` | object {status, type, confidence, waitingOn, attemptsLeft} |  | The sign-in monitor's verdict on the page: stat… |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `omittedCandidates[].hiddenBy`: one of `excluded`, `detached`, `css-hidden`, `no-box`, `hidden-attribute`, `aria-hidden`, `display-none`, `transparent`, `content-hidden`, `clipped`
- `pageSurfaces.surfaces[].broughtBy.eventType`: one of `press`, `click`, `double-click`, `context-click`, `hover`, `focus`, `key`, `input`, `drag`, `drop`, `wheel`
- `framePageSurfaces[].observed.surfaces[].broughtBy.eventType`: one of `press`, `click`, `double-click`, `context-click`, `hover`, `focus`, `key`, `input`, `drag`, `drop`, `wheel`
- `targets.added[].capabilities[]`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `targets.changed[].capabilities[]`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `structure.landmarks[].role`: one of `main`, `navigation`, `banner`, `contentinfo`, `complementary`, `search`, `form`, `region`, `dialog`, `tablist`

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.observe.json`](../contracts/dsagent.page.observe.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
