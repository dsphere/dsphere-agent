# dsagent.agent.work.recording.choose

**Pass On The Recording Choice** · risk `reversible-write` · timeout 60000 ms · inline result ≤ 2000 bytes · concurrency `exclusive-target`

Pass on the person's answer to this task's pending recording question when the person gave it to you in your own chat (they said to record the task as a workflow, or not to). Never answer it yourself or infer it from the task.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.agent.work.recording.choose",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "requestId": "<requestId: supply a value matching the schema>",
    "choice": "create-workflow"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The task page, the pending question and the person's answer.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (1–128 chars) | yes | A page belonging to this task. |
| `requestId` | string (1–128 chars) | yes | The pending question's requestId from recording or recording.state. |
| `choice` | enum: create-workflow, continue-without-recording | yes | create-workflow: the person wants the task recorded as a workflow. continue-without-recording: they do not. |

## Result fields (data.data)

The person's choice (in the sheet, or passed on with recording.choose) and the recording it started.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | enum: pending, starting, recording, not-recording, cancelled, failed |  | Wait while pending or starting; only recording and not-recording permit task actions. Failed means recording could not… |
| `recordingActive` | boolean |  | False after recording stops; further task page actions are refused. |
| `keepWorkflow` | boolean |  | False: collect once (wizard.run once true), never save. |
| `requestId` | string |  | The pending side panel question. |
| `wizardId` | string |  | The standard guided recording wizard; finish, clean and save this draft. |
| `wizardToken` | string |  | Ownership token; keep it with the wizard id. |

## Guidance

Planning rules for this method: [`guidance/dsagent.agent.md`](../guidance/dsagent.agent.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.agent.work.recording.choose.json`](../contracts/dsagent.agent.work.recording.choose.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
