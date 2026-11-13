# dsagent.agent.work.amend

**Change the request of my running task** · risk `reversible-write` · timeout 10000 ms · inline result ≤ 8192 bytes · concurrency `exclusive-target`

When the person adjusts the task you are doing (more or fewer fields, another range, order, filter or count, a correction), call this instead of starting a new task: the task, its card, tab group, pages, wizards and runs stay, and the person sees the new request.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.agent.work.amend",
  "args": {
    "taskDescription": "<taskDescription: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The task and its new request.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (1–128 chars) |  | A page belonging to the task; omit when you have one running task. |
| `taskDescription` | string (1–2000 chars) | yes | The whole request as it stands now, in detail and in the person's terms (not only the change); no credentials. |
| `instruction` | string (1–500 chars) |  | What the person said to change it, in their own words; shown on the task card as the change. |
| `taskSteps` | array of string (1–160 chars) (≤ 30) |  | A continue task only: your new list of steps in order; steps already reported keep their state. |

## Result fields (data.data)

The task, still running, with its new request.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `taskId` | string |  | The task (its agent session, the card the person sees); taskNotice.previousTaskId names tasks the same way. |
| `taskDescription` | string |  | The task's request now. |
| `amendments` | integer (1…∞) |  | How often the task's request was changed so far. |
| `steps` | array of object {title, state, current} |  | A continue task: its steps in order. |

## Guidance

Planning rules for this method: [`guidance/dsagent.agent.md`](../guidance/dsagent.agent.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.agent.work.amend.json`](../contracts/dsagent.agent.work.amend.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
