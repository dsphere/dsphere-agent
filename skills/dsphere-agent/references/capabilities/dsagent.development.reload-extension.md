# dsagent.development.reload-extension

**Reload the unpacked development Extension** · risk `reversible-write` · timeout 10000 ms · inline result ≤ 2048 bytes · concurrency `exclusive-browser`

Development only: reload this unpacked Extension from its dist folder so a freshly built bundle replaces the running one. Advertised only by development builds and executes only for an unpacked (developer-mode) install.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.reload-extension",
  "args": {
    "expectedEngineRevision": "<expectedEngineRevision: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Which build must be running after the call.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `expectedEngineRevision` | string (pattern under Constraints) | yes | engineRevision from dist/browser-engine-identity.json of the build that must be loaded. |
| `force` | boolean |  | Reload even while workflow executions or SidePanel Chat autonomous runs are active; their in-memory progress is lost. D… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `expectedEngineRevision`: matches `^[a-f0-9]{64}$`

## Result fields (data.data)

Reload decision for the running Extension.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | enum: reloading, already-current |  | reloading: this reply is sent first and the Extension reloads from disk after reloadDelayMs; already-current: the expec… |
| `runningEngineRevision` | string |  | engineRevision of the bundle answering this call. |
| `targetEngineRevision` | string |  | engineRevision found in the dist folder; equals expectedEngineRevision when a reload was accepted. |
| `extensionVersion` | string |  | Manifest version of the bundle answering this call. |
| `buildMode` | string |  | Build mode recorded in the dist folder identity, for example pltest1; unknown when the identity file could not be read. |
| `reloadDelayMs` | integer (0…∞) |  | Milliseconds between this reply and chrome.runtime.reload(); 0 when status is already-current. |
| `offlineAhead` | object {reason, expectedBackMs} |  | B24, with status=reloading only: the Extension and its browser-hosted Native Agent go offline right after this reply, o… |
| `activeWork` | object {workflowExecutions, autonomousGoals, guidedWizards} |  | Work that was running when the call was answered; non-zero with status=reloading only when force was true. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.reload-extension.json`](../contracts/dsagent.development.reload-extension.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
