# dsagent.settings.get

**Read Extension settings** · risk `read-sensitive` · timeout 30000 ms · inline result ≤ 131072 bytes · concurrency `shared-read`

Read the settings a person can change in the SidePanel and Options page, with their current values.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.settings.get",
  "args": {}
}
```

## Inputs

Which settings to read: the Extension settings, or the card settings of one saved workflow when workflowId is given.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflowId` | string (1–128 chars) |  | Opaque workflow id from dsagent.workflows.list; required for workflow-* sections and refused for the others. |
| `sections` | array of enum (31 values, listed under Constraints) (≤ 31) |  | Only these sections, all of the same scope; every section of the scope when absent. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `sections[]`: one of `export-directory`, `dom-training-export`, `trace-logs`, `intent-interpreter`, `ad-blocker-default`, `fallback-model`, `execution-memory`, `site-memory`, `site-notes`, `resource-pressure`, `professional-mode`, `identity-providers`, `run-window-focus`, `agent-challenge-walls`, `browser-monitor`, `agent-scripts`, `chat-plan-approval`, `file-release-consent`, `chat-memory`, `notification-channels`, `schedules`, `llm-models`, `chat-model`, `mail`, `dashboard-url`, `workflow-favorite`, `workflow-run-environment`, `workflow-name`, `workflow-sheet-binding`, `workflow-record-limits`, `workflow-monitors`

## Result fields (data.data)

The requested settings with their current values.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `scope` | enum: extension, workflow |  | extension for the Extension settings, workflow for one workflow's card settings. |
| `workflowId` | string (0–128 chars) |  | The workflow whose card settings were read. |
| `sections` | array of one of 31: object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} / object {section, value} (≤ 31) |  | Sections in the order the person meets them in the SidePanel. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `sections[].section`: same values as input `sections[]`
- `sections[].value.hosts[]`: matches `^[A-Za-z0-9.-]+$`
- `sections[].value.channels[].name`: matches `\S`
- `sections[].value.schedules[].dailyTime`: matches `^([01]\d|2[0-3]):[0-5]\d$`
- `sections[].value.schedules[].cronExpression`: matches `\S`
- `sections[].value.models[].provider`: one of `openai`, `anthropic`, `deepseek`, `gemini`, `kimi`, `doubao`, `minimax`, `moonshot`, `qwen`, `zhipu`, `custom`
- `sections[].value.options[].provider`: same values as `sections[].value.models[].provider`

## Guidance

Planning rules for this method: [`guidance/dsagent.settings.md`](../guidance/dsagent.settings.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.settings.get.json`](../contracts/dsagent.settings.get.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
