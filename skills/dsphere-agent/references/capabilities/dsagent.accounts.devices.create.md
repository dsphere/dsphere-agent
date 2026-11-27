# dsagent.accounts.devices.create

**Create Network Device** · risk `external-effect` · timeout 300000 ms · inline result ≤ 65536 bytes · concurrency `exclusive-target`

Add a third-party proxy device. Never pass a proxy username or password: set requestCredential and the person enters them in a trusted sheet. Purchasing platform devices is not available here.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.accounts.devices.create",
  "args": {
    "host": "<host: supply a value matching the schema>",
    "port": 1
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Add a third-party proxy device. Never pass a proxy username or password: set requestCredential and the person enters th…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `name` | string (1–200 chars) |  | Device name, unique in the organization, 1 to 200 characters. |
| `proxyType` | enum: HTTP, HTTPS, SOCKS5 |  | Proxy protocol. |
| `ipProtocol` | enum: IPV4, IPV6 |  | IP version of the proxy. |
| `host` | string (1–253 chars) | yes | Proxy host only: an IPv4 address, an IPv6 address or a domain name. No scheme, port, path or credentials. |
| `port` | integer (1…65535) | yes | Proxy port. |
| `checkChannel` | string (1–100 chars) |  | IP check channel from accounts.devices.options.get. |
| `remark` | string (0–200 chars) |  | Device remark, at most 200 characters. |
| `requestCredential` | boolean |  | True when the proxy needs a username, a password or both; the person enters them privately. |

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
| `data` | object {device, created, saved} |  | Only the selected account operation's public product fields. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of `not-dispatched`, `waiting-user`, `running`, `succeeded`, `partial`, `failed`, `cancelled`, `outcome-unknown`, `record-unavailable`, `available`

## Guidance

Planning rules for this method: [`guidance/dsagent.accounts.md`](../guidance/dsagent.accounts.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.accounts.devices.create.json`](../contracts/dsagent.accounts.devices.create.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
