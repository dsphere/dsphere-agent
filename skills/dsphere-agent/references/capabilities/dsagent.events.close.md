# dsagent.events.close

**Close Browser Event Channel** · risk `reversible-write` · timeout 10000 ms · inline result ≤ 8192 bytes · concurrency `exclusive-target`

Close one owned browser event channel and release its bounded event buffer.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.events.close",
  "args": {
    "channelId": "<channelId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Parameters for closing an owned event channel.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `channelId` | string (8–128 chars) | yes | Opaque channel identifier to close. |
| `resumeToken` | string (8–128 chars) |  | Optional opaque token proving access to the channel. |

## Result fields (data.data)

Result of closing the event channel.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `channelId` | string (1–128 chars) |  | Opaque identifier of the closed channel. |
| `closed` | boolean |  | Whether the channel is now closed. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.events.close.json`](../contracts/dsagent.events.close.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
