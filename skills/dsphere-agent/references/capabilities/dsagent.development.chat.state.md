# dsagent.development.chat.state

**Read where the SidePanel is and what its Chat shows** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 8192 bytes · concurrency `shared-read`

Development only: the view the SidePanel of the person's focused window shows (chat, workflows, scrape, ...) and, while the Chat is that view, its latest messages (cut) with their browser tasks' status. panelOpen false when no SidePanel answered.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.chat.state",
  "args": {}
}
```

## Inputs

No input.

## Result fields (data.data)

The SidePanel of the focused window.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `panelOpen` | boolean |  | A SidePanel answered. |
| `activeTab` | string |  | The view it shows. |
| `chat` | object {busy, taskRunning, conversationId, messages} |  | The open conversation, bounded. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.chat.state.json`](../contracts/dsagent.development.chat.state.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
