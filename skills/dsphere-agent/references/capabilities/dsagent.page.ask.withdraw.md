# dsagent.page.ask.withdraw

**Withdraw your question** · risk `reversible-write` · timeout 15000 ms · inline result ≤ 4096 bytes · concurrency `exclusive-target`

Withdraw your own pending dsagent.page.ask question on this page once it is outdated (your user changed the instruction in your chat). It settles withdrawn, never consent; its card ends and your actions here are no longer held. An answered question keeps its answer. Only the asker can withdraw.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.ask.withdraw",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "requestId": "<requestId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Your pending question to take back.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | The task page context from dsagent.page.open, dsagent.pages.list or a receipt's destinationPageContextId. |
| `requestId` | string (1–128 chars) | yes | The opaque runtime question identity returned by page.ask. |

## Result fields (data.data)

Runtime question state and its answer when settled.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `requestId` | string (1–128 chars) |  | The opaque runtime question identity returned by page.ask. |
| `status` | enum: pending, answered, cancelled, withdrawn |  | Pending waits for the person in DSphere. Only an answered accepted response permits the requested continuation. Withdra… |
| `publishedAt` | number (0…∞) |  | Runtime question publication boundary in epoch milliseconds. |
| `answeredAt` | number (0…∞) |  | Runtime validated response boundary in epoch milliseconds; use with answeredBy to distinguish person response from a sa… |
| `response` | object {requestId, accepted, answer, optionIndex, answeredBy} |  | The runtime answer, available only after the question settles. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.ask.withdraw.json`](../contracts/dsagent.page.ask.withdraw.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
