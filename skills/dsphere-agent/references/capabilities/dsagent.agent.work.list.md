# dsagent.agent.work.list

**List my open wizards and paused runs** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 32768 bytes · concurrency `shared-read`

What this browser still holds for you between calls (decision F4, failure-endpoint fallback §11): the guided wizards you started that are still open (dsagent.wizard.*), with how long each has waited for you and when it is released unless you address it (idle for 30 minutes of silence from your…

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.agent.work.list",
  "args": {}
}
```

## Inputs

No input.

## Result fields (data.data)

Your open wizards, the wizard limit, and your paused runs.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `wizards` | array of object {wizardId, kind, phase, busy, awaitingPerson, ageSeconds, …} (≤ 8) |  | Your open guided wizards, oldest first. |
| `limits` | object {active, max, nextFreeInSeconds} |  | How close the wizard limit is. |
| `pausedRuns` | array of object {executionId, workflowId, workflowName, status, pause} (≤ 32) |  | Runs you started that wait on something in this browser, with the pause dsagent.execution.get reports. |

## Guidance

Planning rules for this method: [`guidance/dsagent.agent.md`](../guidance/dsagent.agent.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.agent.work.list.json`](../contracts/dsagent.agent.work.list.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
