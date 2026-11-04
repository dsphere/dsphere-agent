# dsagent.development.chat.arm

**Set the benchmark arm of the Chat planner** · risk `external-effect` · timeout 10000 ms · inline result ≤ 512 bytes · concurrency `exclusive-browser`

Development only, for a benchmark of the Chat the person asked you to run: the arm the Chat's next browser tasks plan under, for at most 60 minutes. budget-x3 gives a task three times the decision turns and active time; decision-only always plans with the decision harness; none clears the arm.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.chat.arm",
  "args": {
    "arm": "budget-x3"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The arm to set.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `arm` | enum: budget-x3, decision-only, none | yes | budget-x3, decision-only, or none to clear the arm. |

## Result fields (data.data)

The arm now in force.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `arm` | enum: budget-x3, decision-only, none |  | The arm new tasks plan under; none when cleared. |
| `expiresAt` | string |  | When the arm ends by itself (ISO time); absent when cleared. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.chat.arm.json`](../contracts/dsagent.development.chat.arm.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
