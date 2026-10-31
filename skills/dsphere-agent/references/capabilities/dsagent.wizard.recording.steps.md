# dsagent.wizard.recording.steps

**Read Recorded Steps** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 16000 bytes · concurrency `shared-read`

Read all recorded steps in pages of 50, including the stopped draft before saving. No selectors or entered values are exposed. Finish recording before editing; use recording.edit to remove exploration, change form values and reorder steps within a page. Saving the draft does not run it.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.wizard.recording.steps",
  "args": {
    "wizardId": "<wizardId: supply a value matching the schema>"
  }
}
```

## Inputs

The recording and page of steps.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `wizardId` | string (1–128 chars) | yes | The recording wizard id. |
| `wizardToken` | string (1–128 chars) |  | Its ownership token; pass it after a connection renewal. |
| `offset` | integer (0…100000) |  | Zero-based step offset; defaults to zero. |

## Result fields (data.data)

A bounded recording draft view.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `revision` | string (1–16 chars) |  | The current recording draft revision; an outdated revision refuses the edit. |
| `total` | integer |  | Total editable steps. |
| `offset` | integer |  | The returned offset. |
| `steps` | array of object {stepId, kind, target, editableValue} (≤ 50) |  | This page of recorded steps in order. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.wizard.recording.steps.json`](../contracts/dsagent.wizard.recording.steps.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
