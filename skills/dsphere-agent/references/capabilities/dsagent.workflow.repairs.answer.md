# dsagent.workflow.repairs.answer

**Keep or decline a workflow's repairs** · risk `reversible-write` · timeout 20000 ms · inline result ≤ 16384 bytes · concurrency `exclusive-target`

Answer the offer dsagent.workflow.repairs.get reports, as the person can in the SidePanel.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.workflow.repairs.answer",
  "args": {
    "workflowId": "<workflowId: supply a value matching the schema>",
    "answer": "keep"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The workflow and the answer to its offer.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (1–128 chars) | yes | Opaque workflow identifier returned by dsagent.workflows.list, dsagent.wizard.save or a run. |
| `answer` | enum: keep, decline | yes | keep: save the repairs into the workflow's steps. decline: leave the workflow as it is and stop offering these repairs. |

## Result fields (data.data)

What the answer did.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (1–128 chars) |  | Opaque workflow identifier returned by dsagent.workflows.list, dsagent.wizard.save or a run. |
| `answer` | enum: keep, decline |  | The answer that was applied. |
| `steps` | integer (0…50) |  | How many steps of the workflow it applies to. |

## Guidance

Planning rules for this method: [`guidance/dsagent.workflow.md`](../guidance/dsagent.workflow.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.workflow.repairs.answer.json`](../contracts/dsagent.workflow.repairs.answer.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
