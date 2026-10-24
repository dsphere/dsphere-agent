# dsagent.execution.wait

**Wait for execution** · risk `read-sensitive` · timeout 35000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

Bounded wait (at most 30 s) until the execution is terminal, or until it pauses for your repair of a failed block (pause.kind agent-repair, or pause.handoff under a sign-in wall: answer with dsagent.execution.handoff.get / resume / abort).

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.execution.wait",
  "args": {
    "executionId": "<executionId: supply a value matching the schema>"
  }
}
```

## Inputs

Execution and maximum duration for one bounded status wait.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (0–128 chars) | yes | Opaque workflow exe… |
| `timeoutMs` | integer (100…30000) |  | Bounded wait durati… |
| `runToken` | string (0–128 chars, pattern under Constraints) |  | The run's ownership… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `runToken`: matches `^[A-Za-z0-9_-]{16,128}$`

## Result fields (data.data)

Execution state after the bounded wait.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (0–128 chars) |  | Opaque workflow exe… |
| `workflowId` | string (0–128 chars) |  | Opaque workflow ide… |
| `workflowName` | string (0–500 chars) |  | Optional workflow d… |
| `status` | string (0–100 chars) |  | Current execution l… |
| `startedAt` | string (0–100 chars) |  | Optional execution… |
| `finishedAt` | string (0–100 chars) |  | Optional execution… |
| `durationMs` | integer (0…∞) |  | Optional execution… |
| `error` | string (0–500 chars) |  | Optional bounded ex… |
| `endpoint` | enum (52 values, listed under Constraints) |  | The typed place the… |
| `endpointFallback` | enum: none, recovery, agent-handoff, person |  | The last fallback t… |
| `endpointDetails` | object {kind, wallType, failureClass, netError, transient, phase, …} |  | Bounded, value-free… |
| `endpointProvenance` | enum: typed, code, message |  | How the endpoint wa… |
| `errorCode` | string (0–100 chars) |  | The terminal error… |
| `errorNodeId` | string (0–128 chars) |  | The workflow node t… |
| `outcomeSource` | enum: local, backend |  | Where how-it-ended… |
| `stopSource` | enum: person, agent, tab-closed, server, chat-task, unspecified |  | A stopped run: who… |
| `handoffEnding` | enum: aborted, timed-out, budget-exhausted, handoff-disabled, handoff-occupied |  | How a run that took… |
| `recovery` | object {decline} |  | The in-run recovery… |
| `coverage` | object {rowsSaved, rowsUnsaved, rowsRecovered, collectionFulfillment, fieldsMissing, chartsIncomplete, …} |  | What the run collec… |
| `toleratedFailures` | object {count, firstError} |  | Failures the polici… |
| `hasResult` | boolean |  | Whether at least on… |
| `artifactCount` | integer (0…∞) |  | Number of listed ar… |
| `lifecycle` | enum (7 values, listed under Constraints) |  | The lifecycle to pl… |
| `pause` | object {kind, waitingOn, openedFor, sinceMs, deadline, wall, …} |  | Present while the r… |
| `terminal` | boolean |  | true: the run has e… |
| `resultDelivery` | enum: pending |  | Present when the ru… |
| `runPageContextIds` | array of string (0–128 chars) (≤ 32) |  | The pages of the ta… |
| `progress` | object {currentNode, nodeIndex, nodeCount, recordsSoFar, listRecordsSoFar, authInterrupt, …} |  | Present while the r… |
| `timedOut` | boolean |  | Whether the bounded… |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `endpoint`: one of `target-not-found`, `target-ambiguous`, `target-stale`, `target-out-of-range`, `target-covered`, `recorded-target-unreached`, `list-unbound`, `click-not-dispatched`, `loop-no-elements`, `wait-timeout`, `readiness-deadline`, `readiness-target-missing`, `readiness-wrong-document`, `readiness-unresolved`, `block-timeout`, `navigation-failed`, `navigation-not-observed`, `new-tab-not-opened`, `new-tab-url-rejected`, `new-tab-open-failed`, `tab-unavailable`, `effect-unverified`, `detail-visit-unverified`, `media-state-unverified`, `nested-identity-conflict`, `continuation-source-changed`, `traversal-budget-exhausted`, `record-limit-not-reached`, `list-load-incomplete`, `records-not-saved`, `config-invalid`, `input-data-unavailable`, `execution-state-invalid`, `api-request-failed`, `browser-operation-failed`, `script-error`, `permission-denied`, `person-declined`, `auth-required`, `execution-stopped`, `parallel-group-timeout`, `workflow-invalid`, `engine-error`, `dataset-save-unconfirmed`, `plan-restricted`, `run-ownership-conflict`, `recovery-replay-forbidden`, `run-tab-group-closed`, `recovery-reopen-unavailable`, `recovery-attempts-exhausted`, `recovery-snapshot-missing`, `unclassified`
- `recovery.decline`: one of `ineligible`, `execution-stopped`, `fallback-disabled`, `effect-outcome-unknown`, `model-unavailable`, `evidence-empty`, `decision-invalid`, `low-confidence`, `model-give-up`, `action-not-allowed`, `selector-update-invalid`, `probe-incomplete`, `identity-not-preserved`, `identity-unverifiable`, `cardinality-mismatch`, `list-setting-unrepaired`, `zero-matches`, `target-gone`, `target-unaddressable`, `blocker-not-dismissed`, `retry-failed`, `prerequisite-unavailable`, `prerequisite-unaddressable`, `prerequisite-replay-failed`, `model-request-failed`, `revision-changed`, `recovery-unavailable`, `triaged-out:resource-budget`, `triaged-out:nested-identity-conflict`, `triaged-out:permission`, `triaged-out:script-error`, `triaged-out:network-navigation`, `triaged-out:wrong-document`, `triaged-out:document-changed`, `triaged-out:content-absent`, `recovery-queue-full`, `recovery-execution-closed`, `recovery-execution-budget`, `recovery-already-attempted`, `recovery-admission-unavailable`, `recovery-cancelled`, `recovery-deadline`, `recovery-model-budget`, `recovery-settled`, `recovery-page-evidence-timeout`, `recovery-disabled`, `recovery-not-offered`, `no-tab`, `recovery-error`, `contributor-error`, `no-semantic-owner`, `not-semantic-replay`, `semantic-replay-ineligible`, `semantic-owner-failed`, `semantic-cleanup-unrecovered`, `execution-state-not-page`, `relayed-item-failure`
- `coverage.degradedOutcomes[].kind`: one of `kept-unreached`, `zero-iterations`, `continued-unverified`, `pagination-shortfall`, `rows-not-saved`, `rows-unverified`, `detail-field-missing`, `item-skipped`, `field-empty-all-rows`, `field-identity-refused`, `field-read-blanked`, `chart-sweep-incomplete`
- `coverage.degradedOutcomes[].endpoint`: one of `target-not-found`, `target-ambiguous`, `target-stale`, `target-out-of-range`, `target-covered`, `recorded-target-unreached`, `list-unbound`, `click-not-dispatched`, `loop-no-elements`, `wait-timeout`, `readiness-deadline`, `readiness-target-missing`, `readiness-wrong-document`, `readiness-unresolved`, `block-timeout`, `navigation-failed`, `navigation-not-observed`, `new-tab-not-opened`, `new-tab-url-rejected`, `new-tab-open-failed`, `tab-unavailable`, `effect-unverified`, `detail-visit-unverified`, `media-state-unverified`, `nested-identity-conflict`, `continuation-source-changed`, `traversal-budget-exhausted`, `record-limit-not-reached`, `list-load-incomplete`, `records-not-saved`, `config-invalid`, `input-data-unavailable`, `execution-state-invalid`, `api-request-failed`, `browser-operation-failed`, `script-error`, `permission-denied`, `person-declined`, `auth-required`, `execution-stopped`, `parallel-group-timeout`, `workflow-invalid`, `engine-error`, `dataset-save-unconfirmed`, `plan-restricted`, `run-ownership-conflict`, `recovery-replay-forbidden`, `run-tab-group-closed`, `recovery-reopen-unavailable`, `recovery-attempts-exhausted`, `recovery-snapshot-missing`, `unclassified`
- `lifecycle`: one of `pending`, `running`, `paused`, `completed`, `partial`, `failed`, `stopped`

## Guidance

Planning rules for this method: [`guidance/dsagent.execution.md`](../guidance/dsagent.execution.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.execution.wait.json`](../contracts/dsagent.execution.wait.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
