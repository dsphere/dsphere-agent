# dsagent.execution.data.export

**Export execution data as CSV** · risk `reversible-write` · timeout 120000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

Write the records a finished execution collected (for example one started by dsagent.wizard.run, once dsagent.execution.wait reports it terminal) as UTF-8 CSV files in the Extension-managed directory, one file per dataset table: a list with details, such as posts and their comments, gives one file…

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.execution.data.export",
  "args": {
    "executionId": "<executionId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Input for exporting one terminal execution's collected records as CSV files.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (1–128 chars) | yes | Opaque workflow execution identifier returned by dsagent.wizard.run or dsagent.execution.run; the execution must be ter… |

## Result fields (data.data)

Local CSV file references for one terminal execution.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (1–128 chars) |  | Workflow execution whose records were exported. |
| `files` | array of object {path, mediaType, sizeBytes, rowCount, table, sourceArtifactId} (≤ 50) |  | CSV files written for the execution, one per dataset table, in table order. |

## Guidance

Planning rules for this method: [`guidance/dsagent.execution.md`](../guidance/dsagent.execution.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.execution.data.export.json`](../contracts/dsagent.execution.data.export.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
