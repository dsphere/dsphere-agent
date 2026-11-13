# dsagent.workflow.repairs.get

**Read the repairs a workflow can keep** · risk `read-sensitive` · timeout 20000 ms · inline result ≤ 16384 bytes · concurrency `shared-read`

Read which steps of a saved workflow were repaired on its last runs and can be kept in the workflow. When a page changes, a run repairs a step whose recorded address reaches nothing and remembers the repair on this computer; the workflow itself is never rewritten by a run.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.workflow.repairs.get",
  "args": {
    "workflowId": "<workflowId: supply a value matching the schema>"
  }
}
```

## Inputs

The workflow to ask about.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (1–128 chars) | yes | Opaque workflow identifier returned by dsagent.workflows.list, dsagent.wizard.save or a run. |

## Result fields (data.data)

The steps whose repair can be kept.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (1–128 chars) |  | Opaque workflow identifier returned by dsagent.workflows.list, dsagent.wizard.save or a run. |
| `steps` | integer (0…50) |  | How many steps of the workflow it applies to. |
| `offers` | array of object {nodeId, blockType, runs} (≤ 50) |  | One entry per step, in the workflow's order. |

## Guidance

Planning rules for this method: [`guidance/dsagent.workflow.md`](../guidance/dsagent.workflow.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.workflow.repairs.get.json`](../contracts/dsagent.workflow.repairs.get.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
