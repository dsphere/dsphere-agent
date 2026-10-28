# dsagent.agent.work.finish

**Finish my browser task** · risk `reversible-write` · timeout 30000 ms · inline result ≤ 8192 bytes · concurrency `exclusive-target`

Ends your task with its verified outcome, and with keep closes its pages in the same call: pass keep [] to close every page the task opened, or name the pages to leave open for the person.

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

The page identifying your task, its verified terminal outcome, and the pages to keep.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (1–128 chars) | yes | A page reference belonging to the task you are finishing. |
| `status` | enum: succeeded, failed, cancelled | yes | The outcome you verified for this task. |
| `keep` | array of string (1–128 chars) (≤ 32) |  | Close the task's other pages now: [] closes them all, listed pages stay open for the person. Omit for the 60-second cou… |

## Result fields (data.data)

The recorded terminal outcome of this task, and what keep closed.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | enum: succeeded, failed, cancelled, interrupted |  | The terminal status recorded for this task. |
| `closedPages` | integer (0…∞) |  | With keep: how many of the task's pages this call closed. |
| `keptPages` | array of string (0–128 chars) (≤ 32) |  | With keep: the kept pages that are this task's and still open; a name that is not one is left out. |

## Guidance

Planning rules for this method: [`guidance/dsagent.agent.md`](../guidance/dsagent.agent.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.agent.work.finish.json`](../contracts/dsagent.agent.work.finish.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
