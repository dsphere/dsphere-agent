# dsagent.development.restart-service-worker

**Restart the Extension service worker** · risk `reversible-write` · timeout 10000 ms · inline result ≤ 2048 bytes · concurrency `exclusive-browser`

Development only: let this Extension's service worker end the way the browser ends an idle one, without reloading the Extension, so restart recovery can be verified.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.development.restart-service-worker",
  "args": {
    "expectedEngineRevision": "<expectedEngineRevision: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The running build and, to confirm a restart, the worker it started from.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `expectedEngineRevision` | string (pattern under Constraints) | yes | engineRevision of the running build (dist/browser-engine-identity.json of the loaded build); the restart keeps that bun… |
| `restartedFrom` | string (pattern under Constraints) |  | workerId from an earlier status=restarting reply: the call only reports whether a new worker answers and never restarts… |
| `force` | boolean |  | Restart even while workflow executions or SidePanel Chat autonomous runs are active; they continue only through their o… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `expectedEngineRevision`: matches `^[a-f0-9]{64}$`
- `restartedFrom`: matches `^[A-Za-z0-9-]{8,64}$`

## Result fields (data.data)

Restart decision, or the restart confirmation, for the running service worker.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | enum: restarting, restarted, reloaded, pending |  | restarting: this reply is sent first and the worker is ended after restartDelayMs; restarted: a new worker answers and… |
| `workerId` | string |  | Identity of the service-worker instance that answered; a new worker has a new id. |
| `workerStartedAt` | string |  | When the answering worker started (ISO 8601). |
| `runningEngineRevision` | string |  | engineRevision of the bundle answering this call. |
| `restartDelayMs` | integer (0…∞) |  | Milliseconds between this reply and the worker being ended; 0 unless status is restarting. |
| `activeWork` | object {workflowExecutions, autonomousGoals, guidedWizards} |  | Work that was running when the call was answered. |

## Guidance

Planning rules for this method: [`guidance/dsagent.development.md`](../guidance/dsagent.development.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.development.restart-service-worker.json`](../contracts/dsagent.development.restart-service-worker.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
