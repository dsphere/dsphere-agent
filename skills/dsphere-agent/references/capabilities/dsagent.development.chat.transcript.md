# dsagent.development.chat.transcript

**Read the SidePanel Chat conversation in full** · risk `read-sensitive` · timeout 15000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

Development only: the open conversation of the focused window's Chat with each message's text (cut at 8000 characters), its task's status, what the observed task waits on (a plan to approve or a question, read before dsagent.development.chat.respond) and, with traceSessionId, that task's redacted…

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.chat.transcript",
  "args": {}
}
```

## Inputs

How much to read.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `maxMessages` | integer (1…40) |  | Newest messages to return (default 20). |
| `traceSessionId` | string (0–200 chars) |  | A Chat task whose trace events to include. |
| `traceLimit` | integer (1…500) |  | Newest trace events of that task to include (default 200). |

## Result fields (data.data)

The Chat of the focused window.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `panelOpen` | boolean |  | A Chat answered. |
| `conversationId` | string |  | The open conversation. |
| `busy` | boolean |  | A reply is still streaming. |
| `taskRunning` | boolean |  | A browser task of the Chat is running. |
| `messages` | array of object {role, fromAgent, text, truncated, errorCode, task} (≤ 40) |  | The newest messages, oldest first. |
| `pending` | object {kind, sessionId, version, stage, goal, steps, …} |  | What the observed task waits on the person for, if anything. |
| `trace` | array of object {at, level, event, details} (≤ 500) |  | The task's redacted trace events, oldest first. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.chat.transcript.json`](../contracts/dsagent.development.chat.transcript.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
