# dsagent.settings.update

**Change an Extension setting** · risk `reversible-write` · timeout 30000 ms · inline result ≤ 131072 bytes · concurrency `exclusive-target`

Change one setting section exactly as the person would in the SidePanel or Options page: the change goes through the same owner (storage or background handler) as the SidePanel, needs the same SidePanel permission, and open SidePanel views reload it.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.settings.update",
  "args": {
    "section": "export-directory",
    "operation": "set"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

One change to one settings section. The fields each section and operation accept are given by the oneOf branch whose se…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `section` | enum (31 values, listed under Constraints) | yes | Section to change; list them with dsagent.settings.get. |
| `operation` | enum: set, delete, update, test, create, reset | yes | What to do; the operations a section accepts are listed by dsagent.settings.get. |
| `workflowId` | string (1–128 chars) |  | Opaque workflow id from dsagent.workflows.list; required for workflow-* sections and refused for the others. |
| `itemId` | string (1–256 chars) |  | Item of a collection section to update or delete, as dsagent.settings.get lists it. |
| `value` | any |  | The operation's value; its shape is the value schema of the matching oneOf branch. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `section`: one of `export-directory`, `dom-training-export`, `trace-logs`, `intent-interpreter`, `ad-blocker-default`, `fallback-model`, `execution-memory`, `site-memory`, `site-notes`, `resource-pressure`, `professional-mode`, `identity-providers`, `run-window-focus`, `agent-challenge-walls`, `browser-monitor`, `agent-scripts`, `chat-plan-approval`, `file-release-consent`, `chat-memory`, `notification-channels`, `schedules`, `llm-models`, `chat-model`, `mail`, `dashboard-url`, `workflow-favorite`, `workflow-run-environment`, `workflow-name`, `workflow-sheet-binding`, `workflow-record-limits`, `workflow-monitors`
- `value.level`: one of `none`, `basic`, `standard`, `aggressive`
- `value.mode`: one of `disabled`, `shadow`, `site-recall`
- `value.hosts[]`: matches `^[A-Za-z0-9.-]+$`
- `value.name`: matches `\S`
- `value.triggerLevel`: one of `FAILED_ONLY`, `ALL_FINISHED`
- `value.scheduleType`: one of `daily`, `interval`, `date`, `cron`
- `value.dailyTime`: matches `^([01]\d|2[0-3]):[0-5]\d$`
- `value.dateTime`: matches `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d$`
- `value.cronExpression`: matches `\S`
- `value.dailyTime`: matches `^([01]\d|2[0-3]):[0-5]\d$`
- `value.dateTime`: matches `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d$`
- `value.cronExpression`: matches `\S`
- `value.name`: matches `\S`
- `value.model`: matches `\S`
- `value.autoSyncMinutes`: one of `0`, `5`, `15`, `30`, `60`
- `value.env`: one of `current`, `accounts`
- `value.name`: matches `\S`
- `value.source`: one of `local`, `server`
- `value.name`: matches `\S`
- `value.pollIntervalMs`: one of `60000`, `300000`, `900000`, `1800000`, `3600000`, `21600000`, `86400000`
- `value.name`: matches `\S`

## Result fields (data.data)

The applied change and the section's value afterwards.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `section` | enum (31 values, listed under Constraints) |  | Section that changed. |
| `operation` | enum: set, reset, create, update, delete, test |  | Operation that was applied. |
| `workflowId` | string (0–128 chars) |  | Workflow whose card setting changed. |
| `itemId` | string (0–256 chars) |  | Id of the item a create added, usable for later update or delete. |
| `value` | any |  | The section's value after the change, shaped like its dsagent.settings.get value. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `section`: same values as input `section`

## Guidance

Planning rules for this method: [`guidance/dsagent.settings.md`](../guidance/dsagent.settings.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.settings.update.json`](../contracts/dsagent.settings.update.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
