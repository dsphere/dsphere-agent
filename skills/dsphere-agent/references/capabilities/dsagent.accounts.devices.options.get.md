# dsagent.accounts.devices.options.get

**Get Network Device Options** · risk `read-sensitive` · timeout 30000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

Read what a new network device can use: proxy types, IP versions, check channels, a suggested unique name, and the third-party device capacity.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.accounts.devices.options.get",
  "args": {}
}
```

## Inputs

Read what a new network device can use: proxy types, IP versions, check channels, a suggested unique name, and the thir…

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
| `data` | object {defaults, proxyTypes, ipProtocols, checkChannels, suggestedName, capacity} |  | Only the selected account operation's public product fields. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of `not-dispatched`, `waiting-user`, `running`, `succeeded`, `partial`, `failed`, `cancelled`, `outcome-unknown`, `record-unavailable`, `available`

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.accounts.devices.options.get.json`](../contracts/dsagent.accounts.devices.options.get.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
