# dsagent.execution.run

**Run workflow** · risk `external-effect` · timeout 30000 ms · inline result ≤ 262144 bytes · concurrency `exclusive-browser`

Create and dispatch one workflow execution.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.execution.run",
  "args": {
    "workflowId": "<workflowId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Workflow launch request. Use an idempotency key and inspect workflow inputs before supplying fieldValues.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `fileValues` | array of object {fieldId, uploadId} (≤ 100) |  | Run-local file bindings for upload-file inputs. Stage each file with dsagent_upload_file. All empty upload inputs must… |
| `workflowId` | string (0–128 chars) | yes | Opaque workflow identifier returned by dsagent.workflows.list. |
| `taskDescription` | string (1–2000 chars) |  | The person’s request in detail (what to do, on which site, with which data), as you would tell them; DSphere shows it a… |
| `taskMode` | enum: auto, continue |  | continue when you follow your own skill, workflow or plan of several steps (open, act, run, collect, …): the task then… |
| `taskSteps` | array of string (1–160 chars) (≤ 30) |  | With taskMode continue: your steps in order, as your skill lists them; DSphere shows them as the task checklist and you… |
| `variables` | object |  | Optional bounded workflow variable object accepted by the workflow runtime. |
| `fieldValues` | array of object {fieldId, value} (≤ 100) |  | Optional run-time field substitutions obtained from dsagent.workflow.inputs.get. |
| `accountMode` | enum: default, specified |  | Use default account selection or require the opaque accountId supplied by the caller. |
| `accountId` | string (0–128 chars) |  | Opaque account identifier from dsagent.app.accounts.list; required only for specified mode. |
| `sessionGroup` | enum: default, new, previous |  | Use the default user session for every agent task, preserving the person's existing website sign-ins. When the task nam… |
| `sessionName` | string (0–40 chars, pattern under Constraints) |  | The session's name (lowercase letters, digits, dashes): optional with new, required with previous, not allowed with def… |
| `agentRepairHandoff` | boolean |  | Whether a block that fails after the run's own retries and in-run recovery pauses the run for you to repair (lifecycle… |
| `windowPlacement` | enum: shared-window, new-window |  | Where a named session's tab group goes when it has no open page yet: shared-window (the person's window; the default) o… |
| `pageContextId` | string (0–128 chars) |  | Optional page of your task (from dsagent.page.open or a run) the run starts beside: its tabs open in that page's window… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `fileValues[].uploadId`: matches `^upl_[a-f0-9]{32}$`
- `sessionName`: matches `^[a-z0-9][a-z0-9-]{0,39}$`

## Result fields (data.data)

Created workflow execution and dispatch status.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (0–128 chars) |  | Opaque created execution identifier. |
| `workflowId` | string (0–128 chars) |  | Workflow that was dispatched. |
| `status` | string (0–100 chars) |  | Initial execution status reported by the runtime. |
| `dispatch` | string (0–100 chars) |  | Dispatch result such as started, already_running, or backend_pending. |
| `sessionName` | string (0–40 chars) |  | The named browser session the run started in (sessionGroup new or previous). |
| `runToken` | string (0–128 chars) |  | The run's ownership token, shown only here: keep it. On the browser connection that started the run nothing needs it; a… |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.execution.run.json`](../contracts/dsagent.execution.run.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
