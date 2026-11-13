# dsagent.page.files.download

**Download page files or images** · risk `external-effect` · timeout 60000 ms · inline result ≤ 262144 bytes · concurrency `exclusive-target`

Save detected files or images through the DSphere file API to the user export folder first, allowing browser downloads only after that route is unavailable or fails, by fileId from the latest dsagent.page.files.detect (at most 50 per call).

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
| `pageContextId` | string (2–128 chars) | yes | Opaque page context from dsagent.pages.list or dsagent.page.open. |
| `fileIds` | array of string (1–64 chars) (≤ 50) | yes | The files to download. |

## Result fields (data.data)

Completed saves and their confirmed locations.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) |  | Opaque page context from dsagent.pages.list or dsagent.page.open. |
| `downloaded` | integer (0…∞) |  | Files confirmed saved. |
| `savedFiles` | array of object {fileId, filePath, destination} (≤ 50) |  | Confirmed local locations; explicitly report these paths to the person. |
| `skipped` | array of object {fileId, reason} (≤ 50) |  | Files not downloaded. |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.files.download.json`](../contracts/dsagent.page.files.download.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
