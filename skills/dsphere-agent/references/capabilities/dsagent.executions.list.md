# dsagent.executions.list

**List executions** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

List bounded execution summaries visible to the current extension identity.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.executions.list",
  "args": {}
}
```

## Inputs

Filters and pagination for workflow execution history.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (0–128 chars) |  | Optional opaque workflow ID used to filter execution history. |
| `status` | enum (10 values, listed under Constraints) |  | Optional exact execution status filter; omit instead of sending an empty value. partial: ended through the agent repair… |
| `page` | integer (1…100000) |  | One-based result page; defaults to 1. |
| `pageSize` | integer (1…100) |  | Maximum records per page; defaults to 50. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of ``, `pending`, `running`, `completed`, `failed`, `cancelled`, `success`, `stopped`, `restricted`, `partial`

## Result fields (data.data)

Paginated workflow execution summaries.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `records` | array of object {executionId, workflowId, workflowName, status, startedAt, finishedAt, …} (≤ 100) |  | Bounded execution summaries. |
| `total` | integer (0…∞) |  | Total matching execution count. |
| `page` | integer (1…100000) |  | One-based page returned. |
| `pageSize` | integer (1…100) |  | Requested maximum records per page. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.executions.list.json`](../contracts/dsagent.executions.list.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
