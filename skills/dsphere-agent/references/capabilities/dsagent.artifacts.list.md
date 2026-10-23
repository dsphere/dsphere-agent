# dsagent.artifacts.list

**List artifacts** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

List logical execution result and generated binary artifacts; an agent-read capture lists its dataset with its provenance label.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.artifacts.list",
  "args": {
    "executionId": "<executionId: supply a value matching the schema>"
  }
}
```

## Inputs

Input for listing artifacts owned by one workflow execution.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (1–128 chars) | yes | Opaque workflow execution identifier returned by dsagent.execution.run or dsagent.wizard.run, or the captureId dsagent.… |
| `includeCompleteness` | boolean |  | true: also count the empty cells per column of each single-table dataset (emptyCells), which reads its first records (u… |

## Result fields (data.data)

Artifact summaries for one workflow execution.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (1–128 chars) |  | Workflow execution that owns the returned artifacts. |
| `artifacts` | array of object {artifactId, name, mediaType, kind, size, rowCount, …} (≤ 1000) |  | Bounded artifact summaries; pass an artifactId to dsagent.artifact.read or dsagent.execution.artifact.export. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.artifacts.list.json`](../contracts/dsagent.artifacts.list.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
