# dsagent.workflows.list

**List workflows** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

List workflows visible to the current extension identity.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.workflows.list",
  "args": {}
}
```

## Inputs

Filters and pagination for workflows visible to the current Extension identity.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `query` | string (0–200 chars) |  | Optional workflow name or metadata search text. |
| `page` | integer (1…100000) |  | One-based result page; defaults to 1. |
| `pageSize` | integer (1…100) |  | Maximum records per page; defaults to 50. |

## Result fields (data.data)

Paginated workflows visible to the current Extension identity.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `records` | array of object {id, name, description, folder, tags, updatedAt, …} (≤ 100) |  | Records in the requested page. |
| `total` | integer (0…∞) |  | Total matching record count. |
| `page` | integer (1…100000) |  | One-based page returned. |
| `pageSize` | integer (1…100) |  | Requested maximum records per page. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.workflows.list.json`](../contracts/dsagent.workflows.list.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
