# dsagent.agent.work.finish

**Finish my ordinary browser task** · risk `reversible-write` · timeout 30000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-target`

Call before your final answer when an ordinary browser task has ended. Name one page belonging to that task and report succeeded, failed or cancelled. Ends only your task and starts the existing 60-second shutdown countdown on its owned tabs, including child tabs. The person can keep them open.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.agent.work.finish",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "status": "succeeded"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page identifying your task and its verified terminal outcome.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (1–128 chars) | yes | A page reference belonging to the task you are finishing. |
| `status` | enum: succeeded, failed, cancelled | yes | The outcome you verified for this task. |

## Result fields (data.data)

The recorded terminal outcome of this task.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | enum: succeeded, failed, cancelled, interrupted |  | The terminal status recorded for this task. |

## Guidance

Planning rules for this method: [`guidance/dsagent.agent.md`](../guidance/dsagent.agent.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.agent.work.finish.json`](../contracts/dsagent.agent.work.finish.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
