# dsagent.app.accounts.list

**List application accounts** · risk `read-sensitive` · timeout 15000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

List bounded application-account labels using opaque account IDs.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.app.accounts.list",
  "args": {}
}
```

## Inputs

Filters and pagination for the application-account catalog.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (0–128 chars) |  | Optional opaque workflow ID used to restrict accounts to one workflow. |
| `query` | string (0–200 chars) |  | Optional case-insensitive label search across application and account names. |
| `page` | integer (1…100000) |  | One-based result page; defaults to 1. |
| `pageSize` | integer (1…100) |  | Maximum records per page; defaults to 50. |

## Result fields (data.data)

Paginated application-account labels and opaque IDs.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `records` | array of object {accountId, appName, accountName} (≤ 100) |  | Records in the requested page. |
| `total` | integer (0…∞) |  | Total matching record count. |
| `page` | integer (1…100000) |  | One-based page returned. |
| `pageSize` | integer (1…100) |  | Requested maximum records per page. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.app.accounts.list.json`](../contracts/dsagent.app.accounts.list.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
