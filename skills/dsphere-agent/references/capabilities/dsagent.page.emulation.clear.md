# dsagent.page.emulation.clear

**Clear script device preset** · risk `reversible-write` · timeout 15000 ms · inline result ≤ 2048 bytes · concurrency `exclusive-target`

Stop re-applying the script device preset after navigation. The current document keeps its script overrides until it navigates or reloads; this call never reloads automatically. Requires an idempotency key.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.emulation.clear",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page whose future script overrides to stop.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) | yes | Opaque context of an agent-owned page. |

## Result fields (data.data)

Cleanup receipt; a navigation is still needed to reset current globals.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) |  | Opaque context of an agent-owned page. |
| `cleared` | boolean |  | Whether a registered future-navigation preset was removed. |
| `currentDocumentRequiresReload` | enum: true |  | Current script globals reset only when the page navigates or reloads; the call does not reload. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.emulation.clear.json`](../contracts/dsagent.page.emulation.clear.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
