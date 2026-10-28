# dsagent.accounts.operations.get

**Get Account Operation** · risk `read-sensitive` · timeout 30000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

Read this caller's local operation record; never dispatch or retry it.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.accounts.operations.get",
  "args": {
    "operationId": "<operationId: supply a value matching the schema>"
  }
}
```

## Inputs

Read this caller's local operation record; never dispatch or retry it.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `operationId` | string (1–100 chars) | yes | Operation reference returned by an account write. |

## Result fields (data.data)

Account operation result. status/stage are for internal reconciliation, not user-facing open-success/failure badges. Re…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `autofill` | object {status, updatedAt, reason} |  | Separate Biz autofill receipt. Query accounts.operations.get with operationId while running; unknown must not be replay… |
| `operationId` | string (0–100 chars) |  | Local operation reference; not a Pangu request receipt. |
| `status` | enum (10 values, listed under Constraints) |  | Observed operation status. |
| `stage` | string (0–100 chars) |  | Completed or current account business stage. |
| `accountId` | string (0–100 chars) |  | Account reference when known. |
| `pageContextId` | string (0–100 chars) |  | Actual opened/focused page reference when known. |
| `warnings` | array of string (0–500 chars) (≤ 20) |  | Bounded warnings, including synchronization and unknown outcomes. |
| `data` | object {configuration, configurationText, configurationSummary, records, account, total, …} |  | Only the selected account operation's public product fields. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of `not-dispatched`, `waiting-user`, `running`, `succeeded`, `partial`, `failed`, `cancelled`, `outcome-unknown`, `record-unavailable`, `available`
- `data.configuration.fields[].control`: one of `text`, `select`, `multiselect`, `boolean`, `private`, `group`, `override`
- `data.configuration.fields[].children[].control`: same values as `data.configuration.fields[].control`
- `data.records[].allowedActions[]`: one of `options.get`, `list`, `get`, `create`, `update`, `delete`, `set-enabled`, `open`, `close`, `focus`, `fingerprint.get`, `fingerprint.update`, `fingerprint.regenerate`, `operations.get`, `pages.list`
- `data.account.allowedActions[]`: same values as `data.records[].allowedActions[]`

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.accounts.operations.get.json`](../contracts/dsagent.accounts.operations.get.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
