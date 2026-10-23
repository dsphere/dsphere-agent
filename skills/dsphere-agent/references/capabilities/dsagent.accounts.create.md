# dsagent.accounts.create

**Create Account** · risk `external-effect` · timeout 300000 ms · inline result ≤ 65536 bytes · concurrency `exclusive-target`

Create a DSphere account record. Ordinary requests show a trusted inline chat form. Explicit generateDefaults delegation generates a name, encrypted password and permitted defaults, then saves directly. This never registers a third-party account; never pass passwords in tool input.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.accounts.create",
  "args": {},
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Create a DSphere account record. Ordinary requests show a trusted inline chat form. Explicit generateDefaults delegatio…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `generateDefaults` | boolean |  | True only when the person explicitly delegates generation of the account and all unspecified settings. Generate secrets… |
| `chooseAnyApplication` | boolean |  | Use true with generateDefaults for explicit requests like “随便挑一个应用创建” / “pick any application and create”. For a named… |
| `reviewConfiguration` | boolean |  | Show this application configuration as an inline card in the original AI conversation. Work and Sidepanel render every… |
| `appId` | string (1–100 chars) |  | Opaque application reference returned by accounts.options.get. |
| `account` | string (1–320 chars) |  | Existing website account name. |
| `loginType` | string (1–200 chars) |  | Application-supported login method. |
| `remark` | string (0–2000 chars) |  | Account remark. |
| `assigneeQuery` | string (1–200 chars) |  | The same user search used in options.get when choosing assigneeRefs. |
| `assigneeRefs` | array of string (1–100 chars) (≤ 100) |  | Explicitly selected assignment.choices references; never raw employee ids. Ask the person to select users or accept the… |
| `proxyRef` | string (1–100 chars) |  | Available proxy reference. |
| `deviceRef` | string (1–100 chars) |  | Available device reference. |
| `syncEnabled` | boolean |  | Whether to enable existing account synchronization when supported. |
| `sessionKeepAlive` | boolean |  | Whether to retain the existing account session. |
| `fingerprintPolicy` | enum: auto, require, none |  | Automatic generation follows the supported Work baseline; require rejects an unsupported app. |
| `fingerprintOverrides` | object {language, time_zone, dnt, battery, font, bluetooth, …} |  | Supported fingerprint fields; omitted fields retain their current value. Cookies and device credentials are never accep… |

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
| `data` | object {configuration, configurationText, configurationSummary, loginTypes, resources, defaults, …} |  | Only the selected account operation's public product fields. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of `not-dispatched`, `waiting-user`, `running`, `succeeded`, `partial`, `failed`, `cancelled`, `outcome-unknown`, `record-unavailable`, `available`
- `data.configuration.fields[].control`: one of `text`, `select`, `multiselect`, `boolean`, `private`, `group`, `override`
- `data.configuration.fields[].children[].control`: one of `text`, `select`, `multiselect`, `boolean`, `private`, `group`, `override`

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.accounts.create.json`](../contracts/dsagent.accounts.create.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
