# dsagent.wizard.recording.edit

**Edit Recorded Steps** · risk `reversible-write` · timeout 10000 ms · inline result ≤ 1000 bytes · concurrency `exclusive-target`

Atomically clean a stopped single-recording draft before save: remove incorrect exploration or redundant steps, change recorded form values or anchored inserted text, and move a step before another step on the same page. Targets remain those captured by the recorder.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.wizard.recording.edit",
  "args": {
    "wizardId": "<wizardId: supply a value matching the schema>",
    "expectedRevision": "<expectedRevision: supply a value matching the schema>",
    "edits": [
      "<edits: supply a value matching the schema>"
    ]
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The draft revision and edits.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `wizardId` | string (1–128 chars) | yes | The recording wizard id. |
| `wizardToken` | string (1–128 chars) |  | Its ownership token; pass it after a connection renewal. |
| `expectedRevision` | string (1–16 chars) | yes | The current recording draft revision; an outdated revision refuses the edit. |
| `edits` | array of one of 3: object {operation, stepId} / object {operation, stepId, beforeStepId} / object {operation, stepId, value} (≤ 50) | yes | Ordered edits applied as one atomic batch. |

## Result fields (data.data)

The new draft revision; no workflow was run.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `revision` | string (1–16 chars) |  | The current recording draft revision; an outdated revision refuses the edit. |

## Guidance

Planning rules for this method: [`guidance/dsagent.wizard.md`](../guidance/dsagent.wizard.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.wizard.recording.edit.json`](../contracts/dsagent.wizard.recording.edit.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
