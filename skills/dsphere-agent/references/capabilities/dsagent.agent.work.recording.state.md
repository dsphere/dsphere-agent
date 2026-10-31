# dsagent.agent.work.recording.state

**Wait For Task Recording Choice** · risk `read-sensitive` · timeout 60000 ms · inline result ≤ 2000 bytes · concurrency `shared-read`

Wait for the person to choose whether to record this task. Read-only: it never answers the question or starts a new task. With recording, keep wizardId/token and use the ordinary wizard to finish, clean and save at task completion, without running it.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.agent.work.recording.state",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  }
}
```

## Inputs

The task page and bounded wait.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (1–128 chars) | yes | A page belonging to this task. |
| `waitMs` | integer (0…25000) |  | Wait for a decision, up to 25 seconds; defaults to 25000. |

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

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.agent.work.recording.state.json`](../contracts/dsagent.agent.work.recording.state.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
