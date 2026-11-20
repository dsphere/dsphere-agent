# dsagent.agent.work.state

**Read my task state** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 32768 bytes · concurrency `shared-read`

Where your task stands, in one read (weak-agent W3): its description and steps, a state word (running, blocked, waiting-on-person, ended; no-task when you have none), the pages, wizards and runs it holds, what holds it up first (blockers[0]: the situation, its ids and who must act), your last…

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.agent.work.state",
  "args": {}
}
```

## Inputs

No input.

## Result fields (data.data)

Your task state.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `state` | enum: no-task, running, blocked, waiting-on-person, idle-warning, ended |  | Your task now: running, blocked (handle blockers[0]), waiting-on-person, idle-warning, ended, or no-task. |
| `task` | object {taskId, description, status, endReason, steps} |  | Your latest task; absent with state no-task. |
| `pages` | array of object {pageContextId, attention} (≤ 16) |  | The pages your task holds. |
| `wizards` | array of object {wizardId, kind, phase, awaitingPerson} (≤ 16) |  | Your task's open wizards. |
| `runs` | array of object {executionId, status, waitingOn, pageContextId} (≤ 16) |  | Your task's runs still running or paused. |
| `blockers` | array of object {situation, attention, waitingOn, pageContextId, wizardId, executionId} (≤ 4) |  | What holds the task up, the one to handle first first (the person's before yours). |
| `recentCalls` | array of object {method, outcome, verdict, code, secondsAgo} (≤ 5) |  | Your last calls on this task, oldest first. |
| `idleEndsInSeconds` | integer (0…∞) |  | The idle time this call gave the task: it ends after this long without a call. Absent while its run runs. |
| `hint` | string (0–256 chars) |  | What the state means for your next step. |
| `nextActions` | array of object {tool, method, args} (≤ 3) |  | The calls that move the task on, first one first; empty when the person stopped it. |
| `taskNote` | object {state, changes, nextActions} |  | Never on this read: the note any other reply carries, once, when your task changed since your last call. Act on it befo… |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `blockers[].situation`: one of `sign-in-wall`, `challenge`, `dialog-open`, `new-tab-opened`, `target-stale`, `no-effect`, `rate-limited`, `run-paused`, `run-ended-partial`, `run-ended`, `wizard-waiting`, `browser-reloading`, `task-ended`
- `taskNote.changes[].situation`: same values as `blockers[].situation`

## Guidance

Planning rules for this method: [`guidance/dsagent.agent.md`](../guidance/dsagent.agent.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.agent.work.state.json`](../contracts/dsagent.agent.work.state.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
