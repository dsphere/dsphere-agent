# dsagent.execution.handoff.abort

**Abort a run's repair handoff** · risk `reversible-write` · timeout 10000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-browser`

End a run paused for your repair without resuming it: the run ends failed on the failed block's typed endpoint, keeping the rows it saved and reporting its coverage (dsagent.execution.get / wait). Use it when the block cannot be repaired on the page. Requires an idempotency key.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.execution.handoff.abort",
  "args": {
    "handoffId": "<handoffId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The handoff to end.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `handoffId` | string (0–64 chars, pattern under Constraints) | yes | The handoff to act on: pause.handoffId of dsagent.execution.get / wait. |
| `runToken` | string (0–128 chars, pattern under Constraints) |  | The run's ownership token, as dsagent.execution.run or dsagent.wizard.run returned it (shown once). Pass it when your b… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `handoffId`: matches `^handoff_[a-f0-9]{32}$`
- `runToken`: matches `^[A-Za-z0-9_-]{16,128}$`

## Result fields (data.data)

The ended handoff.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (0–128 chars) |  | The run, now ending failed; read its outcome with dsagent.execution.wait. |
| `handoffId` | string (0–64 chars) |  | The ended handoff. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.execution.handoff.abort.json`](../contracts/dsagent.execution.handoff.abort.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
