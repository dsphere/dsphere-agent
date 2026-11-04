# dsagent.development.chat.stop

**Stop a SidePanel Chat task** · risk `external-effect` · timeout 30000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-browser`

Development only: press Stop task on the Chat task's message, as the person does (the task ends cancelled; its run, if any, is stopped by the same owner). For ending a benchmark case at its time limit.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.chat.stop",
  "args": {
    "sessionId": "<sessionId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The task to stop.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `sessionId` | string (0–200 chars) | yes | The Chat task (its sessionId from dsagent.development.chat.state or .transcript). |

## Result fields (data.data)

The Chat sent the stop.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `stopped` | enum: true |  | Stop task was pressed; follow the task to its cancelled end. |
| `conversationId` | string |  | The conversation of the task. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.chat.stop.json`](../contracts/dsagent.development.chat.stop.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
