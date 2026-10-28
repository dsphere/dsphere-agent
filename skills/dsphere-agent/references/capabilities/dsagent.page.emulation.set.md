# dsagent.page.emulation.set

**Set script device preset** · risk `reversible-write` · timeout 15000 ms · inline result ≤ 2048 bytes · concurrency `exclusive-target`

Install an android, iphone, ipad or desktop script device preset on an agent-owned page and re-apply it after main-document navigation. Pair with dsagent.page.viewport.set for responsive layout testing.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.emulation.set",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "preset": "android"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page and bounded device preset.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | Opaque context of an agent-owned page. |
| `preset` | enum: android, iphone, ipad, desktop | yes | Named script-visible device profile; no native device emulation is implied. |

## Result fields (data.data)

Current-document verification and explicit device-emulation limits.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) |  | Opaque context of an agent-owned page. |
| `preset` | enum: android, iphone, ipad, desktop |  | The requested script device preset. |
| `applied` | boolean |  | Whether the requested navigator values were verified in the current document. |
| `scope` | enum: script-only |  | Bounded emulation scope. |
| `limitations` | array of enum: script-user-agent-only, network-headers-unchanged, native-touch-unchanged, device-pixel-ratio-unchanged (≤ 4) |  | Limits of normal browser API device presets. |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.emulation.set.json`](../contracts/dsagent.page.emulation.set.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
