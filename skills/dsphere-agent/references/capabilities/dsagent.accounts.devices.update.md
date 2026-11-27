# dsagent.accounts.devices.update

**Update Network Device** · risk `external-effect` · timeout 300000 ms · inline result ≤ 65536 bytes · concurrency `exclusive-target`

Update any one setting of a third-party device; omitted fields, bindings and saved credentials are kept. The username and password change independently, through a trusted sheet. Moving a device with saved credentials requires replacing or clearing them.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.accounts.devices.update",
  "args": {
    "deviceId": "<deviceId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Update any one setting of a third-party device; omitted fields, bindings and saved credentials are kept. The username a…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `deviceId` | string (1–100 chars) | yes | Opaque network device reference returned by accounts.devices.list. |
| `patch` | object {name, proxyType, ipProtocol, host, port, checkChannel, …} |  | Device changes; omitted fields retain their values. |
| `replaceUsername` | boolean |  | Ask the person to enter a new proxy username in a trusted sheet; the saved password is kept unless also changed. |
| `replacePassword` | boolean |  | Ask the person to enter a new proxy password in a trusted sheet; the saved username is kept unless also changed. |
| `clearUsername` | boolean |  | Remove the saved proxy username; the saved password is kept unless also changed. |
| `clearPassword` | boolean |  | Remove the saved proxy password; the saved username is kept unless also changed. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `patch.proxyType`: one of `HTTP`, `HTTPS`, `SOCKS5`
- `patch.ipProtocol`: one of `IPV4`, `IPV6`

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
| `data` | object {device, saved} |  | Only the selected account operation's public product fields. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of `not-dispatched`, `waiting-user`, `running`, `succeeded`, `partial`, `failed`, `cancelled`, `outcome-unknown`, `record-unavailable`, `available`

## Guidance

Planning rules for this method: [`guidance/dsagent.accounts.md`](../guidance/dsagent.accounts.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.accounts.devices.update.json`](../contracts/dsagent.accounts.devices.update.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
