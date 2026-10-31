# dsagent.agent.work.recording

**Task Recording Choice** · risk `reversible-write` · timeout 60000 ms · inline result ≤ 2000 bytes · concurrency `exclusive-target`

Read or begin this task's recording choice, the person's question in the standard side panel bottom sheet. Every task is asked: page.open and a scrape wizard.start ask. Poll dsagent.agent.work.recording.state while pending; never choose for the person.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.agent.work.recording",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The task page and purpose for a choice not started yet.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (1–128 chars) | yes | A page belonging to this task. |
| `purpose` | enum: browser, collection |  | browser: create-workflow records the task; collection: it keeps the collection wizard's workflow. |

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

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.agent.work.recording.json`](../contracts/dsagent.agent.work.recording.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
