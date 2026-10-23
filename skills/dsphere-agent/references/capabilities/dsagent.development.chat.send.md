# dsagent.development.chat.send

**Type a message into the SidePanel Chat** · risk `external-effect` · timeout 30000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-browser`

Development only: open the SidePanel of the person's focused window on the Chat and send this text there exactly as the person's Send does (same conversation, model and context; a browser task it starts is the Chat planner's, presented in the Chat).

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.chat.send",
  "args": {
    "text": "<text: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The message to send.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `text` | string (1–4000 chars) | yes | The message, as the person would type it. |

## Result fields (data.data)

The Chat sent the message.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `sent` | enum: true |  | The Chat sent it. |
| `conversationId` | string |  | The conversation it went to. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.chat.send.json`](../contracts/dsagent.development.chat.send.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
