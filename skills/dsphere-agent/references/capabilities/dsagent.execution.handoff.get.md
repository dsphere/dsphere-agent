# dsagent.execution.handoff.get

**Get a run's repair handoff** · risk `read-sensitive` · timeout 45000 ms · inline result ≤ 49152 bytes · concurrency `shared-read`

Read the bounded, redacted context of a run paused for your repair (pause.kind agent-repair of dsagent.execution.get / wait; failure-endpoint fallback tier E3): the typed endpoint the block failed on, the block, the element it was recorded on (tag, role, label, intent; never a selector), the loop…

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.execution.handoff.get",
  "args": {
    "handoffId": "<handoffId: supply a value matching the schema>"
  }
}
```

## Inputs

The handoff to read, and the evidence you want with it.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `handoffId` | string (0–64 chars, pattern under Constraints) | yes | The handoff to act on: pause.handoffId of dsagent.execution.get / wait. |
| `runToken` | string (0–128 chars, pattern under Constraints) |  | The run's ownership token, as dsagent.execution.run or dsagent.wizard.run returned it (shown once). Pass it when your b… |
| `candidates` | boolean |  | List the run page's targets that read like the recorded element (default true). |
| `vision` | boolean |  | Declare that you read images: the result adds one redacted JPEG of the run page's viewport as image content (default fa… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `handoffId`: matches `^handoff_[a-f0-9]{32}$`
- `runToken`: matches `^[A-Za-z0-9_-]{16,128}$`

## Result fields (data.data)

The open handoff and the page to repair it on.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (0–128 chars) |  | The paused run. |
| `handoff` | object {handoffId, endpoint, endpointDetails, nodeId, blockType, blockLabel, …} |  | The open handoff. |
| `pageContextId` | string (0–128 chars) |  | The run page the block failed on, issued to you: observe it (dsagent.page.observe / find) and act on it while the run w… |
| `recordedTarget` | object {tag, role, label, intent, targetMode} |  | What the block was recorded on; a retarget must name an element the Extension verifies against it. |
| `candidates` | object {revision, query, matches, evidenceOnly} |  | Present when candidates were asked for and the run page and the recorded element have something to search by. |
| `candidatesUnavailable` | string (0–80 chars) |  | Why no candidates were listed: no-run-page, nothing-recorded, or the page owner's refusal code. |
| `visual` | object |  | With vision: the screenshot's receipt as dsagent.page.visual.observe gives it (revision, size, redaction); the image it… |
| `visualUnavailable` | string (0–80 chars) |  | Why no screenshot was added: no-run-page, or the page owner's refusal code. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `handoff.endpoint`: one of `target-not-found`, `target-ambiguous`, `target-stale`, `target-out-of-range`, `target-covered`, `recorded-target-unreached`, `list-unbound`, `click-not-dispatched`, `loop-no-elements`, `wait-timeout`, `readiness-deadline`, `readiness-target-missing`, `readiness-wrong-document`, `readiness-unresolved`, `block-timeout`, `navigation-failed`, `navigation-not-observed`, `new-tab-not-opened`, `new-tab-url-rejected`, `new-tab-open-failed`, `tab-unavailable`, `effect-unverified`, `detail-visit-unverified`, `media-state-unverified`, `nested-identity-conflict`, `continuation-source-changed`, `traversal-budget-exhausted`, `record-limit-not-reached`, `list-load-incomplete`, `records-not-saved`, `config-invalid`, `input-data-unavailable`, `execution-state-invalid`, `api-request-failed`, `browser-operation-failed`, `script-error`, `permission-denied`, `person-declined`, `auth-required`, `execution-stopped`, `parallel-group-timeout`, `workflow-invalid`, `engine-error`, `dataset-save-unconfirmed`, `plan-restricted`, `run-ownership-conflict`, `recovery-replay-forbidden`, `run-tab-group-closed`, `recovery-reopen-unavailable`, `recovery-attempts-exhausted`, `recovery-snapshot-missing`, `unclassified`

## Guidance

Planning rules for this method: [`guidance/dsagent.execution.md`](../guidance/dsagent.execution.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.execution.handoff.get.json`](../contracts/dsagent.execution.handoff.get.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
