# dsagent.accounts.confirmations.list

**List Account Confirmations** · risk `read-sensitive` · timeout 30000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

List the Confirm/Decline sheets this caller's own account writes opened in the DSphere SidePanel that wait for an answer now. Empty, with agentAnswersAllowed false, while the person keeps answers to themselves. Never another caller's sheet or a secret-input sheet.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.accounts.confirmations.list",
  "args": {}
}
```

## Inputs

List the Confirm/Decline sheets this caller's own account writes opened in the DSphere SidePanel that wait for an answe…

## Result fields (data.data)

Account operation result. status/stage are for internal reconciliation, not user-facing open-success/failure badges. Re…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `autofill` | object {status, updatedAt, reason} |  | Separate sign-in receipt: the DSphere account manager signs in on the opened page. Query accounts.operations.get with o… |
| `operationId` | string (0–100 chars) |  | Local operation reference; not a Pangu request receipt. |
| `status` | enum (10 values, listed under Constraints) |  | Observed operation status. |
| `stage` | string (0–100 chars) |  | Completed or current account business stage. |
| `accountId` | string (0–100 chars) |  | Account reference when known. |
| `pageContextId` | string (0–100 chars) |  | Actual opened/focused page reference when known. |
| `warnings` | array of string (0–500 chars) (≤ 20) |  | Bounded warnings, including synchronization and unknown outcomes. |
| `data` | object {agentAnswersAllowed, confirmations} |  | Only the selected account operation's public product fields. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of `not-dispatched`, `waiting-user`, `running`, `succeeded`, `partial`, `failed`, `cancelled`, `outcome-unknown`, `record-unavailable`, `available`

## Guidance

Planning rules for this method: [`guidance/dsagent.accounts.md`](../guidance/dsagent.accounts.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.accounts.confirmations.list.json`](../contracts/dsagent.accounts.confirmations.list.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
