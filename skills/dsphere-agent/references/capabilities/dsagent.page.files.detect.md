# dsagent.page.files.detect

**Detect page files and images** · risk `read-sensitive` · timeout 20000 ms · inline result ≤ 98304 bytes · concurrency `shared-read`

Scan a page, its embedded frames included, for the files it links (pdf, excel, csv, zip, video) and the images it shows, as the SidePanel Files panel does. group images or files narrows the list; kind narrows it to one type.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.files.detect",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  }
}
```

## Inputs

The page to scan and how much of the list to return.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | Opaque page context from dsagent.pages.list or dsagent.page.open. |
| `group` | enum: all, images, files |  | images: pictures only; files: linked files only; all (default): both. |
| `kind` | enum: pdf, excel, csv, zip, video, image |  | Only this file type. |
| `offset` | integer (0…∞) |  | Entries to skip, for the next page of a long list. |
| `limit` | integer (1…200) |  | Entries to return; 100 by default. |

## Result fields (data.data)

The files and images found.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) |  | Opaque page context from dsagent.pages.list or dsagent.page.open. |
| `counts` | object {images, files} |  | How many of each group the whole page has, before group, kind and paging. |
| `total` | integer (0…∞) |  | Entries matching group and kind, before paging. |
| `files` | array of object {fileId, fileName, kind, source, url, inFrame} (≤ 200) |  | The matching entries in page order, from offset. |
| `nextOffset` | integer (0…∞) |  | The offset of the next entries when more match. |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.files.detect.json`](../contracts/dsagent.page.files.detect.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
