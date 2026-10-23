# dsagent.workflow.definition.get

**Get workflow definition** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

Read one page of a saved workflow definition: its blocks in order (type, label, configuration such as recorded selectors, field roles, value shapes, variable names, record limits) and the edges touching them. Use it to explain what a run did or why a field read nothing.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.workflow.definition.get",
  "args": {
    "workflowId": "<workflowId: supply a value matching the schema>"
  }
}
```

## Inputs

Workflow and page of its definition to read.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (0–128 chars) | yes | Opaque workflow identifier returned by dsagent.workflows.list or dsagent.wizard.save. |
| `nodeOffset` | integer (0…100000) |  | Zero-based position of the first block of the page among the matching blocks; defaults to 0. Pass nextNodeOffset to con… |
| `nodeLimit` | integer (1…50) |  | Most blocks returned in this page; defaults to 20. A page also stops before its size exceeds the result budget. |
| `nodeType` | string (0–100 chars) |  | Optional block type to keep, for example get-text, attribute-value, event-click or save-to-local-db. |

## Result fields (data.data)

One redacted, bounded page of a workflow definition.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (0–128 chars) |  | Workflow whose definition was read. |
| `name` | string (0–500 chars) |  | Workflow display name. |
| `definitionVersion` | integer (0…∞) |  | Definition version the page was read from, when the backend reports one. |
| `nodeCount` | integer (0…∞) |  | Blocks in the whole definition. |
| `edgeCount` | integer (0…∞) |  | Edges in the whole definition. |
| `matchedNodeCount` | integer (0…∞) |  | Blocks matching nodeType (all blocks when no filter was given). |
| `nodes` | array of object {nodeId, index, type, label, config, truncated} (≤ 50) |  | Blocks of this page in definition order. |
| `edges` | array of object {source, target, sourceHandle, targetHandle} (≤ 400) |  | Edges that start or end at a block of this page. |
| `hasMore` | boolean |  | More matching blocks follow this page. |
| `nextNodeOffset` | integer (0…∞) |  | nodeOffset for the next page, present when hasMore is true. |
| `redactedValueCount` | integer (0…∞) |  | How many values on this page were replaced by [redacted]. |
| `detectionProvenance` | object {collectHint, detectionTier} |  | How the collected source was detected; present only for a workflow saved by a scrape wizard with a collect hint (dsagen… |

## Guidance

Planning rules for this method: [`guidance/dsagent.workflow.md`](../guidance/dsagent.workflow.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.workflow.definition.get.json`](../contracts/dsagent.workflow.definition.get.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
