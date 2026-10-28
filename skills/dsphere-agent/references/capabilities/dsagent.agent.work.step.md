# dsagent.agent.work.step

**Report a step of my continue task** · risk `reversible-write` · timeout 10000 ms · inline result ≤ 8192 bytes · concurrency `exclusive-target`

For a task that follows your own skill or plan of several steps. Report succeeded, failed or skipped when you decide a step is done: that also starts your next listed step still pending, and the first listed step starts with the task, so one report per step is enough.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.agent.work.step",
  "args": {
    "step": "<step: supply a value matching the schema>",
    "status": "started"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The step and the state you decided for it.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (1–128 chars) |  | A page belonging to the task; omit to report on your latest task. |
| `step` | string (1–160 chars) | yes | The step in your skill's own words, a few words long; the same title every time you report this step. |
| `status` | enum: started, succeeded, failed, skipped | yes | started when you begin the step; succeeded, failed or skipped once you decided its outcome. |
| `taskSteps` | array of string (1–160 chars) (≤ 30) |  | The full list of your steps, in order, when you did not list them when the task started or your plan changed; steps alr… |

## Result fields (data.data)

The task, still running, and its steps as recorded.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `taskStatus` | enum: running |  | The task keeps running until you finish it with dsagent.agent.work.finish. |
| `steps` | array of object {title, state, current} |  | The task's steps in order. |

## Guidance

Planning rules for this method: [`guidance/dsagent.agent.md`](../guidance/dsagent.agent.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.agent.work.step.json`](../contracts/dsagent.agent.work.step.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
