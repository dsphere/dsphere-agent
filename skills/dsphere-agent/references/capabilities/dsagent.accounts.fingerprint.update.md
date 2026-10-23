# dsagent.accounts.fingerprint.update

**Update Account Fingerprint** · risk `reversible-write` · timeout 300000 ms · inline result ≤ 65536 bytes · concurrency `exclusive-target`

Merge the permitted fingerprint changes with the existing saved configuration.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.accounts.fingerprint.update",
  "args": {
    "accountId": "<accountId: supply a value matching the schema>",
    "patch": {}
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Merge the permitted fingerprint changes with the existing saved configuration.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `accountId` | string (1–100 chars) | yes | Opaque account reference returned by accounts.list or accounts.get. |
| `patch` | object {language, time_zone, dnt, battery, font, bluetooth, …} | yes | Supported fingerprint fields; omitted fields retain their current value. Cookies and device credentials are never accep… |

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
| `data` | object {saved} |  | Only the selected account operation's public product fields. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of `not-dispatched`, `waiting-user`, `running`, `succeeded`, `partial`, `failed`, `cancelled`, `outcome-unknown`, `record-unavailable`, `available`

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.accounts.fingerprint.update.json`](../contracts/dsagent.accounts.fingerprint.update.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
