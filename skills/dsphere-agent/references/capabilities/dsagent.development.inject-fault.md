# dsagent.development.inject-fault

**Inject a fault into the running development Extension** · risk `reversible-write` · timeout 10000 ms · inline result ≤ 2048 bytes · concurrency `exclusive-browser`

Development only: reproduce on demand a fault the release gate must see handled (failure-endpoint fallback X10). Advertised only by development builds.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.inject-fault",
  "args": {
    "kind": "sqlite-lost-ack"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The fault to inject.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `kind` | enum: sqlite-lost-ack, sqlite-clear, run-tab-group-closed | yes | sqlite-lost-ack: the next dataset commits lose their acknowledgment; sqlite-clear: disarm it; run-tab-group-closed: clo… |
| `times` | integer (1…20) |  | sqlite-lost-ack only: how many commits lose their acknowledgment (the flush attempt and each outbox retry round count o… |
| `executionId` | string (0–64 chars) |  | run-tab-group-closed only: the running execution whose tab group to close. |

## Result fields (data.data)

What the fault injector did.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `kind` | enum: sqlite-lost-ack, sqlite-clear, run-tab-group-closed |  | The fault that was injected or cleared. |
| `sqlite` | object {kind, remaining, fired} |  | The SQLite fault state after the call. |
| `tabGroup` | object {executionId, tabGroupId, closedTabIds} |  | run-tab-group-closed: the tabs that were closed. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.inject-fault.json`](../contracts/dsagent.development.inject-fault.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
