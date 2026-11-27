# dsagent.accounts.network.set

**Set Account Network** · risk `external-effect` · timeout 300000 ms · inline result ≤ 65536 bytes · concurrency `exclusive-target`

Set the network connection of up to 100 accounts: a network device, the local network, or none. The person confirms in a trusted sheet, because the accounts' traffic moves to this connection.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.accounts.network.set",
  "args": {
    "accountIds": [
      "<accountIds: supply a value matching the schema>"
    ],
    "connection": "device"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Set the network connection of up to 100 accounts: a network device, the local network, or none. The person confirms in…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `accountIds` | array of string (1–100 chars) (≤ 100) | yes | Accounts to change; references from accounts.list. |
| `connection` | enum: device, local, none | yes | device uses deviceId, local uses the local network, none removes the setting. |
| `deviceId` | string (1–100 chars) |  | Opaque network device reference returned by accounts.devices.list. |

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
| `data` | object {connection, device, dispatched, saved} |  | Only the selected account operation's public product fields. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of `not-dispatched`, `waiting-user`, `running`, `succeeded`, `partial`, `failed`, `cancelled`, `outcome-unknown`, `record-unavailable`, `available`

## Guidance

Planning rules for this method: [`guidance/dsagent.accounts.md`](../guidance/dsagent.accounts.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.accounts.network.set.json`](../contracts/dsagent.accounts.network.set.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
