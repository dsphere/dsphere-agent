# dsagent.page.files.locate

**Scroll to a page file or image** · risk `reversible-write` · timeout 15000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-target`

Scroll the page (or its embedded frame) so a detected file's link or picture is in the middle of the view, and outline it briefly, as the Files panel's locate does. Use it to show the person a file or to bring a picture into view before reading or picking it.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.files.locate",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "fileId": "<fileId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page and the file to bring into view.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | Opaque page context from dsagent.pages.list or dsagent.page.open. |
| `fileId` | string (1–64 chars) | yes | A fileId from the latest dsagent.page.files.detect of this page. |

## Result fields (data.data)

Whether the file was scrolled into view.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) |  | Opaque page context from dsagent.pages.list or dsagent.page.open. |
| `fileId` | string (1–64 chars) |  | A fileId from the latest dsagent.page.files.detect of this page. |
| `located` | boolean |  | The element was found, scrolled into view and outlined. |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.files.locate.json`](../contracts/dsagent.page.files.locate.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
