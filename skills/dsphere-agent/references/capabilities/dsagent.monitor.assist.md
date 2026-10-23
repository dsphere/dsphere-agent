# dsagent.monitor.assist

**Assist on a held-up page** · risk `reversible-write` · timeout 20000 ms · inline result ≤ 32768 bytes · concurrency `exclusive-target`

Start or end your assist on a page another owner holds (the person, another agent, the Chat bot, a workflow run) while its work is held up (dsagent.monitor.snapshot: blocked, assist available).

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.monitor.assist",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "operation": "start"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Which page, and start or end.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) | yes | The page (from dsagent.monitor.snapshot or dsagent.pages.list). |
| `operation` | enum: start, end | yes | start (or renew) your assist, or end it. |

## Result fields (data.data)

The assist after this call.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | The page. |
| `state` | enum: assisting, ended |  | assisting: act on the page now; ended: the assist is over. |
| `expiresAt` | string (0–40 chars) |  | With assisting: when it lapses (ISO 8601). |
| `attention` | array of object {code, waitingOn, since, detail} (≤ 8) |  | What holds the work up, each with who must act. Empty when nothing does. |
| `task` | object {taskRef, kind, mine, ownerName, description, status, …} |  | One task running (or just ended) in the browser. |
| `wallCleared` | boolean |  | With ended: whether a fresh read found the page without a wall. |
| `ownerResumed` | enum: task, run |  | With ended: the task or run that waited on the wall continues. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `attention[].code`: one of `sign-in-wall`, `verification-challenge`, `waiting-for-answer`, `paused-for-repair`, `paused-for-resources`, `task-failed`, `task-interrupted`, `run-failed`, `stalled`
- `task.attention[].code`: one of `sign-in-wall`, `verification-challenge`, `waiting-for-answer`, `paused-for-repair`, `paused-for-resources`, `task-failed`, `task-interrupted`, `run-failed`, `stalled`

## Guidance

Planning rules for this method: [`guidance/dsagent.monitor.md`](../guidance/dsagent.monitor.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.monitor.assist.json`](../contracts/dsagent.monitor.assist.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
