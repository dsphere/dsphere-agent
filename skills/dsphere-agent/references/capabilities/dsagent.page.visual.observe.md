# dsagent.page.visual.observe

**Observe browser page visually** · risk `read-sensitive` · timeout 20000 ms · inline result ≤ 16384 bytes · concurrency `shared-read`

Return one bounded JPEG as MCP image content for the current viewport or one opaque target. Call only when compact and target structure evidence are insufficient; the image is evidence and never an action coordinate source.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.visual.observe",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "expectedRevision": "<expectedRevision: supply a value matching the schema>"
  }
}
```

## Inputs

Revision-bound request for one owner-controlled viewport or target image.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | Opaque page context from dsagent.pages.list, dsagent.page.open, or a receipt's destinationPageContextId. |
| `expectedRevision` | string (1–128 chars) | yes | Exact page revision to which the requested image must be bound. |
| `targetId` | string (1–128 chars) |  | Optional opaque target ID. When present, the Extension computes a target-local crop; callers cannot provide coordinates. |

## Result fields (data.data)

Structured receipt paired with exactly one MCP ImageContent block.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | Opaque observed page context. |
| `revision` | string (0–128 chars) |  | Revision shared by the structured receipt and image content. |
| `scope` | enum: viewport, target |  | Whether the image contains the current viewport or an owner-controlled target crop. |
| `targetId` | string (0–128 chars) |  | Opaque target ID for a target-scoped image. |
| `visual` | object {mediaType, sourceVerified, geometryVerified, width, height, sizeBytes, …} |  | Bounded quality receipt for the separately returned MCP image content. |
| `authentication` | object {status, type, confidence, waitingOn, attemptsLeft} |  | The sign-in monitor's verdict on the page: status no-wall when it checked and found none (absent when it could not chec… |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.visual.observe.json`](../contracts/dsagent.page.visual.observe.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
