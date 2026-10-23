# dsagent.events.open

**Open Browser Event Channel** · risk `reversible-write` · timeout 10000 ms · inline result ≤ 16384 bytes · concurrency `exclusive-target`

Attach the current MCP control session to a bounded resumable channel for typed events published by the Extension. The channel is generic infrastructure and does not start a workflow, recording, or browser action.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.events.open",
  "args": {
    "topics": [
      "session"
    ]
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Parameters for opening a bounded browser event channel.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `topics` | array of enum: session, execution, recovery, page, interaction, monitor (≤ 6) | yes | Event topics to attach to this control-session-scoped channel. page: page.navigated, page.opened (a tab your page opene… |
| `leaseTtlSeconds` | integer (60…14400) |  | Optional channel lease in seconds; the Extension applies its default when omitted. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `topics[]`: one of `session`, `execution`, `recovery`, `page`, `interaction`, `monitor`

## Result fields (data.data)

Opened browser event channel and initial cursor.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `channelId` | string (1–128 chars) |  | Opaque identifier for the opened event channel. |
| `resumeToken` | string (1–128 chars) |  | Opaque token for resuming reads from the same channel. |
| `topics` | array of enum: session, execution, recovery, page, interaction, monitor (≤ 6) |  | Topics accepted for this channel. |
| `cursor` | integer (0…∞) |  | Initial event cursor for subsequent waits. |
| `expiresAt` | string (1–64 chars) |  | Channel lease expiry timestamp. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.events.open.json`](../contracts/dsagent.events.open.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
