# dsagent.wizard.collect

**Read records by fields once** · risk `external-effect` · timeout 125000 ms · inline result ≤ 65536 bytes · concurrency `exclusive-target`

Read the records of one list, table or one-record page once with the fields you name; no workflow is kept (the dataset stays in Data). Use it when you know the fields; otherwise, or for a reusable workflow, dsagent.wizard.start.

## Invocation

Call `dsagent_wizard_collect` with this shape: the arguments flat, no method/args wrapper. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "records": "<records: supply a value matching the schema>",
  "fields": [
    {
      "name": "<name: supply a value matching the schema>"
    }
  ],
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

What to read, from where, and how long to wait for the run.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `records` | string (1–300 chars) | yes | Which records, as the person said it ("every book in the list", "this product"). |
| `fields` | array of object {name, description, required} (≤ 20) | yes | The fields to read, at most 20, in the order the rows should carry them. |
| `region` | object {pageContextId, targetId, targetRevision} |  | Optional: a target from dsagent.page.observe or page.find around the records (or one record); only sources inside or ar… |
| `pageContextId` | string (0–128 chars, pattern under Constraints) |  | Optional page; default the region's page, else the active tab. |
| `maxRecords` | integer (1…500) |  | Records to read, following the list's pagination; default 50. A one-record page reads one. |
| `waitMs` | integer (0…100000) |  | How long this call waits for the run after it starts; default 45000. The call itself ends 120 s after it started, so a… |
| `taskDescription` | string (1–2000 chars) |  | The person's request in detail, as you would tell them; DSphere shows it as the task in the SidePanel. When you follow… |
| `taskMode` | enum: auto, continue |  | continue for your own skill, workflow or plan of several steps; auto (the default) for a request of one step. With cont… |
| `taskSteps` | array of string (1–160 chars) (≤ 30) |  | With taskMode continue: your steps in order. Name them as your skill lists them; DSphere shows them as the task checkli… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `region.pageContextId`: matches `^[A-Za-z0-9_.:-]{2,128}$`
- `region.targetId`: matches `^[A-Za-z0-9_.:-]{1,128}$`
- `region.targetRevision`: matches `^[A-Za-z0-9_.:-]{1,128}$`
- `pageContextId`: matches `^[A-Za-z0-9_.:-]{2,128}$`

## Result fields (data.data)

The rows read, or why the read stopped or is still running.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `siteKnowledgeAsk` | object {note, sites} |  | Present (on the reply that hands the task its data, and on the finish) when this task used a site no earlier run taught… |
| `outcome` | enum: completed, ended, running, stopped |  | completed: the run succeeded (rows). ended: the run failed, stopped or saved only part (status; rows hold what was save… |
| `rows` | array of object (≤ 50) |  | The first records, keyed by your field names; key order is not kept in transport, so read them in the order of columns. |
| `columns` | array of string (0–60 chars) (≤ 20) |  | Your field names in your order: the order to read each row in. Present whenever rows is. |
| `rowCount` | integer (0…∞) |  | Records in the dataset. |
| `rowsTruncated` | boolean |  | True when rows holds fewer records than the dataset: rowsRest reads them all. |
| `rowsRest` | object {method, args} |  | Only when rowsTruncated: the call that reads every record. Send it as it is (dsagent_invoke method and args), then repe… |
| `valuesTruncated` | integer (0…∞) |  | Values cut at 2000 characters in rows; the dataset keeps them whole. |
| `artifactId` | string (0–256 chars) |  | The local dataset: dsagent.artifact.read reads every record. |
| `executionId` | string (0–128 chars) |  | The one-time run. |
| `status` | string (0–32 chars) |  | ended: the run's end status (failed, stopped, partial, …). |
| `paused` | boolean |  | running: the run paused for a repair or a sign-in wall; dsagent.execution.wait says what it needs. |
| `waitedMs` | integer (0…∞) |  | How long this call waited for the run. |
| `reason` | enum (20 values, listed under Constraints) |  | stopped: why (the wizard auto stop reasons; fields-not-found, fields-ambiguous, region-mismatch and choose-source are t… |
| `stoppedAt` | string (0–64 chars) |  | stopped: the pending wizard choice it stopped at. |
| `fieldResults` | array of object {name, status, optionId, matchedLabel, sample, source, …} (≤ 20) |  | How each wanted field mapped, once the fields were decided. |
| `wizardId` | string (0–36 chars) |  | stopped: the wizard, now yours to continue or cancel. |
| `wizardToken` | string (0–128 chars) |  | stopped: its ownership token; pass it with every dsagent.wizard.* call. |
| `wizard` | object |  | stopped: the wizard state as dsagent.wizard.state returns it (pendingChoice, lastEndpoint, authentication, nextActions). |
| `taskNotice` | object {code, previousTaskId, hint} |  | Present when this call's new taskDescription started a separate task on a page your other running task holds. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `reason`: one of `wall`, `awaiting-page`, `taken-over`, `step-failed`, `detection-endpoint`, `no-data`, `no-recommendation`, `ambiguous-source`, `no-fields`, `fields-truncated`, `detail-pages-requested`, `name-required`, `not-auto-choice`, `changed`, `no-progress`, `time-budget`, `fields-not-found`, `fields-ambiguous`, `region-mismatch`, `choose-source`

## Guidance

Planning rules for this method: [`guidance/dsagent.wizard.md`](../guidance/dsagent.wizard.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.wizard.collect.json`](../contracts/dsagent.wizard.collect.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
