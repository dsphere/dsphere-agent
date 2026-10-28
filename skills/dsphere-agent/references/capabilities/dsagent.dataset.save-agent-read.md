# dsagent.dataset.save-agent-read

**Save an agent-read dataset** · risk `reversible-write` · timeout 60000 ms · inline result ≤ 16384 bytes · concurrency `exclusive-target`

The last detection tier (failure-endpoint fallback D4): save records you read yourself from the page with dsagent.page.observe / dsagent.page.find / dsagent.page.markdown as a dataset, after the scrape wizard on that page ended on a typed detection failure.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.dataset.save-agent-read",
  "args": {
    "records": [
      {}
    ],
    "coverage": {
      "pagesVisited": 1,
      "stoppedBecause": "end-of-data"
    }
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

A first save cites the wizard failure and the page; an append cites the capture instead.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `wizardId` | string (0–36 chars, pattern under Constraints) |  | First save: the scrape wizard (dsagent.wizard.start) that ended on a typed detection failure; or, when dsagent.wizard.s… |
| `wizardToken` | string (16–128 chars, pattern under Constraints) |  | First save: the wizard token dsagent.wizard.start returned; it proves the wizard is yours after a connection renewal. |
| `endpoint` | string (0–80 chars, pattern under Constraints) |  | First save: the typed detection endpoint the wizard ended on, exactly as dsagent.wizard.state reports it (lastEndpoint.… |
| `pageContextId` | string (0–128 chars, pattern under Constraints) |  | First save: the page the records were read on (the wizard's page or a sample page it opened), from dsagent.page.observe. |
| `captureId` | string (0–80 chars, pattern under Constraints) |  | Append: the captureId an earlier save returned. |
| `captureToken` | string (16–64 chars, pattern under Constraints) |  | Append: the captureToken the capture's first save returned. |
| `name` | string (1–200 chars) |  | First save: the dataset name the person sees (normalised, at most 120 characters); a dated default when omitted. |
| `fields` | array of string (1–200 chars) (≤ 64) |  | Optional field order: these names first, then other record keys as first seen. |
| `records` | array of object (≤ 500) | yes | The records read from the page, one object per record, field name to value; only values the page shows. |
| `coverage` | object {expectedRecords, pagesVisited, stoppedBecause} | yes | What was read: an honest statement, shown with the dataset. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `wizardId`: matches `^wiz_[a-f0-9]{32}$`
- `wizardToken`: matches `^[A-Za-z0-9]{16,128}$`
- `endpoint`: matches `^[A-Za-z0-9_:.-]{3,80}$`
- `pageContextId`: matches `^[A-Za-z0-9_.:-]{2,128}$`
- `captureId`: matches `^agent-read:[A-Za-z0-9-]{8,64}$`
- `captureToken`: matches `^[A-Za-z0-9-]{16,64}$`
- `coverage.stoppedBecause`: one of `end-of-data`, `requested-count-reached`, `page-limit`, `time-limit`, `page-blocked`, `agent-limit`, `reading`

## Result fields (data.data)

The saved capture and its label.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `captureId` | string (0–80 chars) |  | The capture: pass it as executionId to dsagent.artifacts.list or dsagent.execution.data.export, and with captureToken t… |
| `captureToken` | string (0–64 chars) |  | Returned by the first save only: keep it to append to this capture. |
| `datasetName` | string (0–200 chars) |  | The dataset name the person sees. |
| `columns` | array of string (0–200 chars) (≤ 64) |  | The normalised field names of this save, in order. |
| `recordsInThisSave` | integer (0…∞) |  | Records this call wrote. |
| `droppedFields` | array of string (0–200 chars) (≤ 64) |  | Fields left out because their name says they hold a credential or payment secret. |
| `redactedValues` | integer (0…∞) |  | Values whose credential-shaped parts were replaced by [redacted]. |
| `provenance` | object {source, replayable, coverage, admittedBy, savedAt} |  | The label every listing shows. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `provenance.coverage.stoppedBecause`: same values as input `coverage.stoppedBecause`

## Guidance

Planning rules for this method: [`guidance/dsagent.dataset.md`](../guidance/dsagent.dataset.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.dataset.save-agent-read.json`](../contracts/dsagent.dataset.save-agent-read.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
