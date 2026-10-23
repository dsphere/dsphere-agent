# dsagent.monitor.snapshot

**Monitor every browser task** · risk `read-sensitive` · timeout 20000 ms · inline result ≤ 163840 bytes · concurrency `shared-read`

Every page and task of the browser, whoever started it: your own and other agents' pages, the person's own tabs, the DSphere Chat bot's tasks and workflow runs, in every browser session and tab group.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.monitor.snapshot",
  "args": {}
}
```

## Inputs

Filters for the monitor view.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `attentionOnly` | boolean |  | Only pages and tasks with an attention signal. |
| `limit` | integer (1…100) |  | Most pages to list; defaults to 100. |

## Result fields (data.data)

Every browser page and task, with who owns it and what holds it up.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `at` | string (0–40 chars) |  | When the view was read (ISO 8601). |
| `pages` | array of object {pageContextId, title, url, active, session, tabGroup, …} (≤ 100) |  | Open tabs, those needing attention first. |
| `totalPages` | integer (0…∞) |  | Matching tabs before the limit. |
| `tasks` | array of object {taskRef, kind, mine, ownerName, description, status, …} (≤ 60) |  | Tasks and runs in the browser. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `pages[].attention[].code`: one of `sign-in-wall`, `verification-challenge`, `waiting-for-answer`, `paused-for-repair`, `paused-for-resources`, `task-failed`, `task-interrupted`, `run-failed`, `stalled`
- `tasks[].attention[].code`: one of `sign-in-wall`, `verification-challenge`, `waiting-for-answer`, `paused-for-repair`, `paused-for-resources`, `task-failed`, `task-interrupted`, `run-failed`, `stalled`

## Guidance

Planning rules for this method: [`guidance/dsagent.monitor.md`](../guidance/dsagent.monitor.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.monitor.snapshot.json`](../contracts/dsagent.monitor.snapshot.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
