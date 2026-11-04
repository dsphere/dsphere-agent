# dsagent.development.chat.respond

**Answer what a SidePanel Chat task waits on** · risk `external-effect` · timeout 30000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-browser`

Development only: answer the decision the Chat task's card waits on, as the person would: decision approve-plan presses Start (or Continue) on the waiting plan of that version; decision answer answers the open question with that requestId (accepted, and optionIndex for an option or answer for free…

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.chat.respond",
  "args": {
    "sessionId": "<sessionId: supply a value matching the schema>",
    "decision": "approve-plan"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The decision to answer.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `sessionId` | string (0–200 chars) | yes | The Chat task (its sessionId from dsagent.development.chat.state or .transcript). |
| `decision` | enum: approve-plan, answer | yes | approve-plan: Start on the waiting plan. answer: the open question. |
| `version` | integer (1…∞) |  | approve-plan: the plan version the transcript shows as pending. |
| `requestId` | string (0–200 chars) |  | answer: the question the transcript shows as pending. |
| `accepted` | boolean |  | answer: true to accept or answer, false to decline. |
| `optionIndex` | integer (0…50) |  | answer: the chosen option (0-based) of a question with options. |
| `answer` | string (0–2000 chars) |  | answer: free text for a question that takes it. |

## Result fields (data.data)

The task took the answer.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `accepted` | enum: true |  | The answer reached the task. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.chat.respond.json`](../contracts/dsagent.development.chat.respond.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
