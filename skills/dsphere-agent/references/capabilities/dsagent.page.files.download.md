# dsagent.page.files.download

**Download page files or images** · risk `external-effect` · timeout 60000 ms · inline result ≤ 8192 bytes · concurrency `exclusive-target`

Download detected files or images of a page into the browser's Downloads folder, as the Files panel's download does, by fileId from the latest dsagent.page.files.detect (at most 50 per call). Only http and https addresses download; the result lists the fileIds that did not.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.files.download",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "fileIds": [
      "<fileIds: supply a value matching the schema>"
    ]
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page and the files to download.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) | yes | Opaque page context from dsagent.pages.list or dsagent.page.open. |
| `fileIds` | array of string (1–64 chars) (≤ 50) | yes | The files to download. |

## Result fields (data.data)

The downloads started.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) |  | Opaque page context from dsagent.pages.list or dsagent.page.open. |
| `downloaded` | integer (0…∞) |  | Downloads the browser started. |
| `skipped` | array of object {fileId, reason} (≤ 50) |  | Files not downloaded. |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.files.download.json`](../contracts/dsagent.page.files.download.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
