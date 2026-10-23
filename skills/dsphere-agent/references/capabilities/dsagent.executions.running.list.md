# dsagent.executions.running.list

**List running executions** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

List pending and running execution summaries assigned to the current extension instance.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.executions.running.list",
  "args": {}
}
```

## Inputs

Optional workflow filter for active executions.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (0–128 chars) |  | Optional opaque workflow ID used to restrict active executions. |

## Result fields (data.data)

Pending and running executions assigned to this Extension instance.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `records` | array of object {executionId, workflowId, workflowName, status, startedAt, finishedAt, …} (≤ 100) |  | Bounded execution summaries. |
| `total` | integer (0…∞) |  | Total matching execution count. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.executions.running.list.json`](../contracts/dsagent.executions.running.list.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
