# dsagent.page.ask.wait

**Wait for the runtime answer** · risk `read-sensitive` · timeout 35000 ms · inline result ≤ 4096 bytes · concurrency `shared-read`

Read or wait up to 30 seconds for the person to answer the question in DSphere. Pending is not consent: keep waiting. A cancelled or missing request never authorizes an action. Answers are returned only to the caller that asked on that page. This cannot submit an answer on the person’s behalf.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.ask.wait",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "requestId": "<requestId: supply a value matching the schema>"
  }
}
```

## Inputs

A task-scoped runtime question or wait request.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) | yes | The task page context from dsagent.page.open, dsagent.pages.list or a receipt's destinationPageContextId. |
| `requestId` | string (1–128 chars) | yes | The opaque runtime question identity returned by page.ask. |
| `timeoutMs` | integer (0…30000) |  | Long-poll duration; default 30000. Zero reads immediately. |

## Result fields (data.data)

Runtime question state and its answer when settled.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `requestId` | string (1–128 chars) |  | The opaque runtime question identity returned by page.ask. |
| `status` | enum: pending, answered, cancelled |  | Pending waits for the person in DSphere. Only an answered accepted response permits the requested continuation. |
| `publishedAt` | number (0…∞) |  | Runtime question publication boundary in epoch milliseconds. |
| `answeredAt` | number (0…∞) |  | Runtime validated response boundary in epoch milliseconds; use with answeredBy to distinguish person response from a sa… |
| `response` | object {requestId, accepted, answer, optionIndex, answeredBy} |  | The runtime answer, available only after the question settles. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.ask.wait.json`](../contracts/dsagent.page.ask.wait.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
