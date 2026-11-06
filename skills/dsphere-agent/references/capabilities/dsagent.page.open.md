# dsagent.page.open

**Open a web page** · risk `reversible-write` · timeout 150000 ms · inline result ≤ 49152 bytes · concurrency `exclusive-target`

Use the default user session for every agent task, preserving the person's existing website sign-ins.

## Invocation

Call `dsagent_page_open` with this shape: the arguments flat, no method/args wrapper. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "url": "<url: supply a value matching the schema>",
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page to open and where.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `url` | string (8–2048 chars, pattern under Constraints) | yes | Only the exact HTTP(S) URL supplied by the user, or the entry page of t… |
| `pageContextId` | string (2–128 chars) |  | Optional page from dsagent.pages.list whose window the new tab joins. T… |
| `sessionGroup` | enum: default, new, previous |  | Which browser session the page opens in. default: the person's own sess… |
| `sessionName` | string (0–40 chars, pattern under Constraints) |  | The session's name: lowercase letters, digits and dashes (for example s… |
| `windowPlacement` | enum: shared-window, new-window |  | Where a named session's tab group opens with its first page: shared-win… |
| `accountId` | string (0–128 chars, pattern under Constraints) |  | Account id from dsagent.app.accounts.list or dsagent.browser.sessions.l… |
| `taskDescription` | string (1–2000 chars) |  | The person’s request in detail, as you would tell them: what to do, whe… |
| `taskKind` | enum: browser, collection |  | browser (default) or collection; both ask whether to keep a workflow (s… |
| `recording` | enum: create-workflow, continue-without-recording |  | Your own answer to the keep-a-workflow question this call begins, so it… |
| `taskMode` | enum: auto, continue |  | continue for your own skill, workflow or plan of several steps; auto (t… |
| `taskSteps` | array of string (1–160 chars) (≤ 30) |  | With taskMode continue: your steps in order. Name them as your skill li… |
| `waitUntil` | enum: settled |  | Optional: settled waits up to 10 s for the opened page to go quiet. The… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `url`: matches `^https?://`
- `sessionName`: matches `^[a-z0-9][a-z0-9-]{0,39}$`
- `accountId`: matches `^acct_[0-9a-f]{16,128}$`

## Result fields (data.data)

The opened page and its first compact view (absent when the page could not be read, or on a replayed key after a restar…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | Opaque context of the opened page, accepted by dsagent.page.* and dsage… |
| `url` | string (0–2048 chars) |  | Sanitized URL the page loaded (after redirects), without credentials. |
| `title` | string (0–300 chars) |  | Bounded page title. |
| `sessionName` | string (0–40 chars) |  | The named session the page opened in (sessionGroup new or previous); pa… |
| `accountId` | string (0–128 chars) |  | The application account whose session the page opened in, when accountI… |
| `revision` | string (0–128 chars) |  | The revision of the opened page from the read the open already made (af… |
| `rendered` | boolean |  | False when the browser is not drawing the page (its window reported min… |
| `settled` | boolean |  | With waitUntil settled: whether the page went quiet within the bound (f… |
| `recording` | object {status, keepWorkflow, answeredBy, endedBy, requestId, wizardId, …} |  | Task recording choice. While pending or starting, wait for the person i… |
| `browserSession` | object {session, site, state, accountLabel, observedAccountLabel, otherSignedInSessions} |  | The browser session this page opened in and the sign-in evidence DSpher… |
| `siteKnowledge` | object {site, controls, reading, pitfalls, states, personNote, …} |  | What earlier runs learned about this site: known controls, the reading… |
| `change` | enum: full, delta, unchanged |  | full: the targets are the page's whole on-screen inventory, not a delta. |
| `semanticText` | string (0–6000 chars) |  | The start of the page's visible text (up to 2000 characters in a compac… |
| `semanticTextKind` | enum: page-prose, control-labels, surface |  | What semanticText is: the page's prose, the labels of the published con… |
| `semanticTextTruncated` | enum: true |  | Present when the page has more text than semanticText holds. |
| `activeSurface` | object {kind, label, closeTargetId} |  | Present when a dialog or panel bounds the targets: the page behind it i… |
| `visibleRecordCount` | integer (0…∞) |  | Records the page shows (list items, rows, repeated cards), counted from… |
| `pageMessages` | array of string (0–160 chars) (≤ 4) |  | What the page says in its alert, status and live regions, bounded. |
| `documentStatus` | integer (100…599) |  | HTTP status of the loaded document (404, 429, 503 ...) from its navigat… |
| `pageMetrics` | object {viewportWidth, viewportHeight, scrollX, scrollY, pixelsAbove, pixelsBelow} |  | Viewport and scroll metrics used for bounded navigation planning. |
| `targets` | object {mode, added, changed, removedTargetIds, commonCapabilities, groups} |  | Opaque semantic targets of the page. |
| `omittedTargets` | integer (1…∞) |  | Present when the page has more targets than are listed (off screen, or… |
| `authentication` | object {status, type, confidence, waitingOn, attemptsLeft} |  | The sign-in monitor's verdict on the page: status no-wall when it check… |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `siteKnowledge.pitfalls[].type`: one of `consent-wall`, `sign-in-wall`, `challenge-handoff`, `popup-overlay`, `search-needs-enter`, `hover-menu`, `opens-new-tab`, `lazy-load`, `infinite-scroll`, `slow-load`, `rate-limit`, `region-block`, `iframe`, `shadow-dom`, `date-picker`, `other`
- `targets.added[].capabilities[]`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `edit-text`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `paste`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `targets.changed[].capabilities[]`: same values as `targets.added[].capabilities[]`

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.open.json`](../contracts/dsagent.page.open.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
