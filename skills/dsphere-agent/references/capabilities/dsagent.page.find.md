# dsagent.page.find

**Find browser page targets** · risk `read-sensitive` · timeout 35000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

Find the current page targets that read as a short query (a visible label, a placeholder, the name of the row a control sits in), best first, at the current page revision; the whole document is searched, not only what is on screen, and a found control off screen is scrolled to when acted on; while…

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.find",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  }
}
```

## Inputs

Opaque page context and a find-style query, a role, or both, over the current semantic targets.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) | yes | Opaque page context from dsagent.pages.list, dsagent.page.open, or a receipt's destinationPageContextId. |
| `query` | string (1–160 chars) |  | What to look for, in the words the page shows ("关注", "Next page", "Search"). Optional with role: without it, the role’s… |
| `limit` | integer (1…20) |  | Maximum matches; defaults to 10. |
| `role` | string (0–40 chars) |  | Optional: only targets of this role (button, link, tab, textbox, checkbox…); alone, without query, every target of the… |
| `context` | string (0–120 chars) |  | Optional: only controls inside the record whose name contains this text. |
| `includeText` | boolean |  | Optional: also return text targets (headings, paragraphs, dates and other shown text; kind extractable, no actions) for… |
| `includeImages` | boolean |  | Optional: also return the pictures the page shows, first and largest first whatever the query (matchedOn picture; targe… |
| `surface` | string (0–128 chars) |  | Optional open surface id, or latest for the most recently opened menu, panel or dialog. Uses the shared runtime control… |

## Result fields (data.data)

Revision-bound find result over the current semantic targets.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | Opaque observed page context. |
| `revision` | string (0–128 chars) |  | Current page revision the returned target ids belong to; pass it as expectedRevision to dsagent.page.action. |
| `query` | string (0–160 chars) |  | The query as evaluated. |
| `surfaceMissing` | boolean |  | The requested surface is not open; no fallback to unrelated controls. |
| `truncated` | boolean |  | The shared control query reached its bound. |
| `searched` | integer (0…∞) |  | How many current targets were considered. |
| `activeSurface` | object {kind, label, backgroundMatches} |  | Present when an open dialog or panel bounded the search. |
| `warnings` | array of object {code, message, nextActions} (≤ 2) |  | REPEATED_RECORDS_USE_WIZARD: switch to the scrape wizard on this page now (dsagent.wizard.start kind=scrape, then wizar… |
| `matches` | array of object {target, score, matchedOn} (≤ 20) |  | Matching targets, best first. |
| `authentication` | object {status, type, confidence, waitingOn, attemptsLeft} |  | The sign-in monitor's verdict on the page: status no-wall when it checked and found none (absent when it could not chec… |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `matches[].target.capabilities[]`: one of `click`, `detect-form-fields`, `handle-dialog`, `dismiss`, `drag`, `drag-move`, `drag-press`, `drag-release`, `fill-form`, `history-back`, `history-forward`, `hover`, `input`, `press-key`, `scroll`, `select`, `set-checkbox`, `set-radio`, `reload`, `upload-file`, `load-options`, `detect-marquees`, `detect-videos`, `pause-marquees`, `pause-videos`, `play-videos`, `resume-marquees`, `detect-ads`, `remove-ads`
- `matches[].matchedOn[]`: one of `label`, `placeholder`, `context`, `role`, `state`, `content-key`, `picture`

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.find.json`](../contracts/dsagent.page.find.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
