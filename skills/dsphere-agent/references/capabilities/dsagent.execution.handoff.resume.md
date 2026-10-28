# dsagent.execution.handoff.resume

**Resume a run after your repair** · risk `external-effect` · timeout 20000 ms · inline result ≤ 4096 bytes · concurrency `exclusive-browser`

Answer a run's repair handoff and resume it. retry: run the failed block once more (after you repaired the page, for example dismissed a dialog covering the target).

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.execution.handoff.resume",
  "args": {
    "handoffId": "<handoffId: supply a value matching the schema>",
    "answer": "retry"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Your answer to the handoff.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `handoffId` | string (0–64 chars, pattern under Constraints) | yes | The handoff to act on: pause.handoffId of dsagent.execution.get / wait. |
| `runToken` | string (0–128 chars, pattern under Constraints) |  | The run's ownership token, as dsagent.execution.run or dsagent.wizard.run returned it (shown once). Pass it when your b… |
| `answer` | enum: retry, skip-item, continue | yes | retry, skip-item or continue; one of the handoff's answers. |
| `retarget` | object {pageContextId, targetId, targetRevision, remember, identityChangeIntended} |  | retry only, for a retargetable handoff: the element the block should act on or read instead. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `handoffId`: matches `^handoff_[a-f0-9]{32}$`
- `runToken`: matches `^[A-Za-z0-9_-]{16,128}$`
- `retarget.pageContextId`: matches `^[A-Za-z0-9_.:-]{2,128}$`
- `retarget.targetId`: matches `^[A-Za-z0-9_.:-]{1,128}$`
- `retarget.targetRevision`: matches `^[A-Za-z0-9_.:-]{1,128}$`

## Result fields (data.data)

The answer the run resumed with.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (0–128 chars) |  | The resumed run; follow it with dsagent.execution.wait. |
| `handoffId` | string (0–64 chars) |  | The answered handoff. |
| `answer` | enum: retry, skip-item, continue |  | The answer applied. |
| `retargeted` | boolean |  | retry rebinds the block to your verified element for the rest of this run. |
| `healing` | enum: proposed, confirmed |  | A retarget for later runs: proposed (this run only) or confirmed (filed once the retried block completes). |
| `identityChange` | object {similarity, label} |  | Present when identityChangeIntended accepted an element whose identity did not verify: the recorded verdict. |

## Guidance

Planning rules for this method: [`guidance/dsagent.execution.md`](../guidance/dsagent.execution.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.execution.handoff.resume.json`](../contracts/dsagent.execution.handoff.resume.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
