# dsagent.workflow.inputs.get

**Get workflow inputs** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

List editable run inputs using opaque field IDs. Call before execution when a workflow may require form values.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.workflow.inputs.get",
  "args": {
    "workflowId": "<workflowId: supply a value matching the schema>"
  }
}
```

## Inputs

Workflow whose editable run-time fields should be inspected.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (0–128 chars) | yes | Opaque workflow identifier returned by dsagent.workflows.list. |

## Result fields (data.data)

Editable run-time fields for one workflow.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (0–128 chars) |  | Workflow whose run-time fields were inspected. |
| `fields` | array of object {fieldId, label, alias, fieldType, value, writable, …} (≤ 100) |  | Editable workflow fields; use writable field IDs in dsagent.execution.run.fieldValues. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.workflow.inputs.get.json`](../contracts/dsagent.workflow.inputs.get.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
