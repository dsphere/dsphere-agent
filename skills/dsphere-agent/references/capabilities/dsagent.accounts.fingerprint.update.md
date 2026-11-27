# dsagent.accounts.fingerprint.update

**Update Account Fingerprint** · risk `reversible-write` · timeout 300000 ms · inline result ≤ 65536 bytes · concurrency `exclusive-target`

Change any fingerprint setting on its own and keep every other one. Changing os, os_version or a browser version regenerates the user agents the way Work does. Never pass a cookie value: set replaceCookie and the person enters it in a trusted sheet.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.accounts.fingerprint.update",
  "args": {
    "accountId": "<accountId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Change any fingerprint setting on its own and keep every other one. Changing os, os_version or a browser version regene…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `accountId` | string (1–100 chars) | yes | Opaque account reference returned by accounts.list or accounts.get. |
| `patch` | object {language, time_zone, dnt, battery, font, bluetooth, …} |  | Fingerprint settings to change; omitted fields retain their current value. Cookie values and device credentials are nev… |
| `replaceCookie` | boolean |  | Ask the person to enter this account's fingerprint cookie in a trusted sheet. The value never passes through this tool. |
| `clearCookie` | boolean |  | Remove the cookie saved in this account's fingerprint. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `patch.dnt`: one of `1`, `0`, ``
- `patch.os`: one of `Windows`, `macOS`, `Linux`, `Android`, `iOS`
- `patch.userAgentVersion132`: one of `All`, `132`, `131`, `130`
- `patch.userAgentVersion120`: one of `All`, `121`, `120`, `119`
- `patch.randomize_user_agent`: one of `all`, `132`, `120`
- `patch.webrtc`: one of `1`, `0`, ``
- `patch.geolocationDisplay`: one of `1`, `2`, `3`
- `patch.webgpu`: one of `match-webgl`, `disabled`, `real`
- `patch.screenDisplay`: one of `1`, `2`, `3`
- `patch.font_mode`: one of `privacy`, `real`
- `patch.battery_mode`: one of `privacy`, `real`
- `patch.bluetooth_mode`: one of `privacy`, `real`
- `patch.speech_voices_mode`: one of `privacy`, `real`
- `patch.audio_context_mode`: one of `noise`, `real`
- `patch.client_rects_mode`: one of `noise`, `real`
- `patch.media_device_mode`: one of `noise`, `real`
- `patch.canvas_mode`: one of `noise`, `real`
- `patch.webgl_image_mode`: one of `noise`, `real`

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
| `data` | object {saved} |  | Only the selected account operation's public product fields. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `status`: one of `not-dispatched`, `waiting-user`, `running`, `succeeded`, `partial`, `failed`, `cancelled`, `outcome-unknown`, `record-unavailable`, `available`

## Guidance

Planning rules for this method: [`guidance/dsagent.accounts.md`](../guidance/dsagent.accounts.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.accounts.fingerprint.update.json`](../contracts/dsagent.accounts.fingerprint.update.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
