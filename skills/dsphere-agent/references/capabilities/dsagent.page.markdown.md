# dsagent.page.markdown

**Read browser page as Markdown** · risk `read-sensitive` · timeout 35000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

Read the current document of a page context as clean Markdown for reading, summarising or answering: page chrome, hidden elements and ad slots removed, links written as numbered citations with a reference list, low-density link farms pruned in fit mode.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.markdown",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  }
}
```

## Inputs

Page context to read and the Markdown rendering options.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) | yes | Opaque page context from dsagent.pages.list, dsagent.page.open, or a receipt's destinationPageContextId. |
| `profile` | enum: minimal, balanced, aggressive |  | Noise removal: minimal keeps navigation and footers, balanced (default) removes page chrome and hidden elements, aggres… |
| `links` | enum: inline, citations, none |  | Link rendering: citations (default) writes text⟨n⟩ plus a reference list, inline keeps [text](url), none drops destinat… |
| `fit` | boolean |  | Prune low-density link-farm blocks (default true). Repeated records such as listing cards are always kept. |
| `focus` | string (1–500 chars) |  | Optional wording to focus the reading on; only relevant blocks and headings are kept (BM25, Chinese-aware). A wording t… |
| `maxChars` | integer (4000…120000) |  | Maximum Markdown characters returned inline; longer pages are cut at a paragraph boundary and flagged truncated. |
| `cursor` | string (4–32 chars) |  | nextCursor of the previous read of this page with the same options: continue the Markdown where that read was cut. |

## Result fields (data.data)

Bounded Markdown rendering of the current document with its references and metadata.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | Opaque page context that was read. |
| `revision` | string (0–128 chars) |  | Page revision observed for this read; pass it to dsagent.page.action or observe again when it changes. |
| `url` | string (0–2048 chars) |  | Sanitized current page URL. |
| `title` | string (0–300 chars) |  | Bounded current page title. |
| `format` | enum: markdown |  | Text representation. |
| `markdown` | string (0–120000 chars) |  | The page as Markdown in document order, bounded by maxChars. |
| `truncated` | boolean |  | True when the Markdown was cut at maxChars or at the inline byte limit, the capture hit its node budget or the compiler… |
| `nextCursor` | string (0–32 chars) |  | Present when the Markdown was cut before the end of the rendering: pass it as cursor, with the same options, to read on. |
| `references` | array of object {index, url, text} (≤ 400) |  | Numbered link and image destinations referenced from the Markdown in citations mode. |
| `metadata` | object {description, canonicalUrl, language, siteName, author, publishedAt, …} |  | What the document says about itself in its head, bounded. |
| `warnings` | array of object {code, message, nextActions} (≤ 2) |  | REPEATED_RECORDS_USE_WIZARD: switch to the scrape wizard on this page now (dsagent.wizard.start kind=scrape, then wizar… |
| `fit` | object {rawByteLength, prunedBlocks, matchedChunks, totalChunks} |  | Pruning statistics, present when fit or focus was applied. |
| `authentication` | object {status, type, confidence, waitingOn, attemptsLeft} |  | The sign-in monitor's verdict on the page: status no-wall when it checked and found none (absent when it could not chec… |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.markdown.json`](../contracts/dsagent.page.markdown.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
