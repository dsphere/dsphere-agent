# dsagent.execution.stop

**Stop execution** · risk `reversible-write` · timeout 20000 ms · inline result ≤ 262144 bytes · concurrency `exclusive-browser`

Stop one workflow execution.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.execution.stop",
  "args": {
    "executionId": "<executionId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Execution to stop.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (0–128 chars) | yes | Opaque identifier of a non-terminal workflow execution. |

## Result fields (data.data)

Confirmed workflow stop result.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (0–128 chars) |  | Execution that was stopped. |
| `status` | enum: stopped |  | Confirmed stop state. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.execution.stop.json`](../contracts/dsagent.execution.stop.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
