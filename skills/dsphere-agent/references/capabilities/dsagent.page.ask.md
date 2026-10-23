# dsagent.page.ask

**Ask the person in the live execution panel** · risk `reversible-write` · timeout 15000 ms · inline result ≤ 4096 bytes · concurrency `exclusive-target`

Ask a task clarification or confirmation in DSphere using the same runtime sheet as semantic execution. The external agent still plans. Do not ask these browser-task questions in the caller chat. Returns pending immediately; use page.ask.wait until answered or cancelled.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.ask",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "kind": "clarify",
    "question": "<question: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

A task-scoped runtime question or wait request.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) | yes | The task page context from dsagent.page.open, dsagent.pages.list or a receipt's destinationPageContextId. |
| `kind` | enum: clarify, confirm | yes | Clarify missing details or confirm a described effect. |
| `question` | string (1–600 chars) | yes | The actual question or confirmation summary shown to the person. |
| `options` | array of string (1–120 chars) (≤ 8) |  | Optional choices for a clarification; free text is also allowed. |
| `effect` | string (1–120 chars) |  | Required for confirm: the concrete action awaiting confirmation. |

## Result fields (data.data)

Runtime question state and its answer when settled.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `requestId` | string (1–128 chars) |  | The opaque runtime question identity returned by page.ask. |
| `status` | enum: pending, answered, cancelled |  | Pending waits for the person in DSphere. Only an answered accepted response permits the requested continuation. |
| `publishedAt` | number (0…∞) |  | Runtime question publication boundary in epoch milliseconds. |
| `answeredAt` | number (0…∞) |  | Runtime validated response boundary in epoch milliseconds; use with answeredBy to distinguish person response from a sa… |
| `response` | object {requestId, accepted, answer, optionIndex, answeredBy} |  | The runtime answer, available only after the question settles. |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.ask.json`](../contracts/dsagent.page.ask.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
