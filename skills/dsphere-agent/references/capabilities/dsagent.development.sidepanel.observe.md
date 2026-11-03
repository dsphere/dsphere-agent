# dsagent.development.sidepanel.observe

**Observe the extension side panel** · risk `read-sensitive` · timeout 15000 ms · inline result ≤ 48000 bytes · concurrency `shared-read`

Read visible registered side-panel regions, control labels, layout bounds and current revision. Development only. Inspect the actual side-panel DOM through owner-declared public labels and opaque controls.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.sidepanel.observe",
  "args": {}
}
```

## Inputs

Closed side-panel verification input.

## Result fields (data.data)

Bounded, current evidence from the actual extension side-panel document. Only registered public labels are exposed.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `panelId` | string (1–100 chars) |  | Opaque document identity; changes on reload. |
| `revision` | string (1–100 chars) |  | Evidence revision; pass to action. |
| `view` | string (0–160 chars) |  | Current panel view. |
| `blockedByDialog` | boolean |  | A modal dialog is visible; navigation refuses while it is open. |
| `truncated` | boolean |  | More registered evidence exists than the bounded result can contain. |
| `viewport` | object {width, height} |  | Panel viewport. |
| `surfaces` | array of object {name, role, bounds, controls} (≤ 8) |  | Registered visible surfaces; at most 60 total controls. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.sidepanel.observe.json`](../contracts/dsagent.development.sidepanel.observe.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
