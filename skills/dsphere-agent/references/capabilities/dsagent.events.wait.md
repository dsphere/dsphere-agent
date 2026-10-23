# dsagent.events.wait

**Wait For Browser Events** · risk `read-sensitive` · timeout 30000 ms · inline result ≤ 196608 bytes · concurrency `shared-read`

Wait for typed Extension events after an opaque cursor; returns immediately on change or at the bounded timeout. timedOut=true is a heartbeat, not a task failure; callers may continue from nextCursor.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.events.wait",
  "args": {
    "channelId": "<channelId: supply a value matching the schema>",
    "cursor": 0
  }
}
```

## Inputs

Parameters for waiting on a previously opened event channel.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `channelId` | string (8–128 chars) | yes | Opaque channel identifier returned by events.open. |
| `resumeToken` | string (8–128 chars) |  | Optional opaque resume token returned by events.open. |
| `cursor` | integer (0…∞) | yes | Last consumed cursor; events strictly after it are returned. |
| `limit` | integer (1…50) |  | Maximum number of events to return in this wait. |
| `timeoutMs` | integer (0…25000) |  | Bounded wait duration in milliseconds. |

## Result fields (data.data)

Bounded event page and continuation cursor.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `channelId` | string (1–128 chars) |  | Opaque identifier of the channel that produced this page. |
| `events` | array of object {eventId, sequence, topic, type, occurredAt, subject, …} (≤ 50) |  | Typed bounded events after the requested cursor. |
| `nextCursor` | integer (0…∞) |  | Cursor to pass to the next events.wait call. |
| `timedOut` | boolean |  | True when the bounded wait ended without a new event; this is a heartbeat, not task failure. |
| `expiresAt` | string (1–64 chars) |  | Current channel lease expiry timestamp. |
| `gap` | object {droppedBefore, dropped} |  | Present when the bounded channel (200 events) dropped events after your cursor: you missed them, so read the state of w… |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.events.wait.json`](../contracts/dsagent.events.wait.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
