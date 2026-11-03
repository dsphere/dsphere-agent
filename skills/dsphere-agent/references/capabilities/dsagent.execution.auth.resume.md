# dsagent.execution.auth.resume

**Resume a run after the person signed in** · risk `external-effect` · timeout 20000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-browser`

Resume a run paused on a sign-in or verification wall (pause.kind auth, waitingOn person, of dsagent.execution.wait) after the person told you they passed it.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.execution.auth.resume",
  "args": {
    "executionId": "<executionId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The run to resume.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (0–128 chars, pattern under Constraints) | yes | The paused run, as dsagent.execution.run or dsagent.wizard.run returned it. |
| `runToken` | string (0–128 chars, pattern under Constraints) |  | The run's ownership token, as dsagent.execution.run or dsagent.wizard.run returned it (shown once). Pass it when your b… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `executionId`: matches `^[A-Za-z0-9_.:-]{1,128}$`
- `runToken`: matches `^[A-Za-z0-9_-]{16,128}$`

## Result fields (data.data)

The resumed run.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (0–128 chars) |  | The run, running again; follow it with dsagent.execution.wait. |
| `resumed` | enum: true |  | Always true: the wall was checked gone and the run resumed. |

## Guidance

Planning rules for this method: [`guidance/dsagent.execution.md`](../guidance/dsagent.execution.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.execution.auth.resume.json`](../contracts/dsagent.execution.auth.resume.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
