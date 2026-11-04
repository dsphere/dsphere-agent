# dsagent.development.chat.new

**Start a new SidePanel Chat conversation** · risk `external-effect` · timeout 30000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-browser`

Development only: press New conversation in the Chat of the person's focused window, so the next dsagent.development.chat.send starts without earlier turns.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.chat.new",
  "args": {},
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

No input.

## Result fields (data.data)

The Chat opened a new conversation.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `started` | enum: true |  | The new conversation is open. |
| `conversationId` | string |  | The new conversation, once it has one. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.chat.new.json`](../contracts/dsagent.development.chat.new.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
