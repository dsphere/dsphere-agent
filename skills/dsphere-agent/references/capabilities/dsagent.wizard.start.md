# dsagent.wizard.start

**Start a guided wizard** · risk `reversible-write` · timeout 60000 ms · inline result ≤ 65536 bytes · concurrency `exclusive-target`

Choose wizard options autonomously from the requested task and current wizard/page evidence. Reuse explicit scope, limits and fields; select relevant sources, pagination, fields, nested/detail data and output settings, and supply a concise task-based workflow name when none was given.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.wizard.start",
  "args": {
    "kind": "scrape"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Which wizard to start and on which page.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `kind` | enum: scrape, record | yes | scrape: collect a list (paginat… |
| `pageContextId` | string (0–128 chars, pattern under Constraints) |  | Optional page context from dsag… |
| `adoptActive` | boolean |  | Guide the wizard or recording t… |
| `taskDescription` | string (1–2000 chars) |  | The person’s request in detail… |
| `collectHint` | string (1–300 chars) |  | kind=scrape only: What you want… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `pageContextId`: matches `^[A-Za-z0-9_.:-]{8,128}$`

## Result fields (data.data)

The started wizard and its first state.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `wizardId` | string (0–36 chars, pattern under Constraints) |  | Opaque wizard id returned by ds… |
| `kind` | enum: scrape, record |  | Scrape wizard or recording wiza… |
| `revision` | string (0–16 chars, pattern under Constraints) |  | Digest of everything below; pas… |
| `phase` | enum (8 values, listed under Constraints) |  | Where the wizard is. ready-to-s… |
| `sidePanelStep` | integer (0…5) |  | The scrape wizard step the pers… |
| `busy` | one of 2: object {activity, sinceMs} / null |  | Present while a step runs. |
| `awaitingPerson` | one of 2: enum (13 values, listed under Constraints) / null |  | Something to do on the page now. |
| `pagePick` | one of 2: object {pageContextId, includeText, includeImages} / null |  | The page on which you may make… |
| `pendingChoice` | one of 2: object {choiceId, selection, minSelected, maxSelected, options, values, …} / null |  | The one decision the wizard wai… |
| `summary` | object {searchResultState, page, pagination, source, adFilter, repeatActions, …} |  | What the wizard has configured… |
| `nextActions` | array of enum (7 values, listed under Constraints) (≤ 7) |  | The dsagent.wizard.* calls that… |
| `authentication` | object {status, type, confidence, waitingOn, sinceMs, deadline} |  | Present only while the page the… |
| `workflowId` | string (0–128 chars) |  | Saved workflow id (dsagent.work… |
| `executionId` | string (0–128 chars) |  | Execution started by dsagent.wi… |
| `lastError` | object {code, message} |  | The last step that failed in th… |
| `lastEndpoint` | object {endpoint, group, outcome, scope, reason, scrapeErrorCode, …} |  | The typed endpoint the latest s… |
| `warnings` | array of object {code, message} (≤ 8) |  | What the saved workflow does di… |
| `personTookOver` | boolean |  | True when the person pressed Ta… |
| `wizardToken` | string (0–128 chars) |  | Ownership token, returned only… |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `wizardId`: matches `^wiz_[a-f0-9]{32}$`
- `revision`: matches `^[a-f0-9]{16}$`
- `phase`: one of `recording`, `pagination`, `data`, `detail-page`, `naming`, `ready-to-save`, `saved`, `canceled`
- `busy.activity`: one of `starting`, `detecting-pagination`, `detecting-data`, `reviewing-fields`, `applying-choice`, `opening-detail-page`, `detecting-detail-data`, `detecting-page-inputs`, `collecting-option-combinations`, `returning-to-list`, `stopping-recording`, `handing-over-to-scrape`, `resuming-recording`, `saving`, `starting-run`, `canceling`
- `awaitingPerson`: one of `click-next-page-control`, `click-one-record`, `click-one-detail-record`, `click-record-to-exclude`, `click-table`, `click-detail-fields`, `click-page-fields`, `click-block-fields`, `click-option-panel`, `click-option-group`, `click-product-image`, `perform-steps-on-page`, `pass-page-check`
- `pendingChoice.choiceId`: one of `page-changes`, `pagination`, `pick-next-control`, `data-source`, `pick-sample-record`, `fields`, `nested-data`, `detail-pages`, `detail-pagination`, `detail-interactions`, `detail-pick-next-control`, `detail-data-source`, `detail-fields`, `detail-nested-data`, `page-content`, `detail-page-content`, `data-processing`, `after-scrape`, `recording-control`, `form-fields`, `upload-slots`, `repeat-items`, `repeat-item-actions`, `option-panel`, `option-groups`, `option-image`, `option-fields`, `option-preview`, `workflow-details`
- `pendingChoice.options[].optionId`: matches `^opt_[a-f0-9]{12}$`
- `pendingChoice.options[].kind`: one of `pagination-type`, `data-block`, `data-table`, `form-group`, `option-group`, `form-field`, `upload-slot`, `field`, `link-field`, `nested-scope`, `page-content`, `output-destination`, `action`
- `pendingChoice.options[].labelSource`: one of `page`, `role`, `shape`, `fallback`, `user`, `api`, `ai`
- `pendingChoice.values[].name`: one of `maxRecords`, `collectHint`, `stopBefore`, `detailUrlSuffix`, `pageQueryParam`, `fieldLabels`, `fieldRules`, `maxChildrenPerParent`, `maxConcurrency`, `maxItems`, `maxPages`, `swapLabelValue`, `sampleUploads`, `pageMarkdown`, `name`, `description`, `stepIds`
- `nextActions[]`: one of `choose`, `pick`, `back`, `save`, `run`, `cancel`, `wait`
- `lastEndpoint.endpoint`: one of `page-unreadable`, `content-unavailable`, `wall`, `session-start-refused`, `page-not-scrapable`, `structure-none`, `structure-search-empty`, `structure-detection-failed`, `structure-budget-exhausted`, `form-none`, `form-detection-failed`, `ai-model-unavailable`, `ai-detection-failed`, `ai-found-nothing`, `pagination-inconclusive`, `pagination-unavailable`, `nested-detection-timeout`, `nested-detection-failed`, `field-naming-timeout`, `field-review-model-unavailable`, `field-review-failed`, `detail-sample-unavailable`, `sample-not-repeating`, `sample-invisible`, `field-pick-not-landed`, `next-control-not-taken`, `option-pick-not-taken`, `pick-not-dispatched`, `compile-rejected`, `save-duplicate`, `save-failed`, `plan-limit`, `step-rejected`, `step-crashed`
- `lastEndpoint.group`: one of `readiness`, `structure`, `form`, `ai-detection`, `pagination`, `follow-up`, `detail`, `pick`, `finishing`, `step`
- `lastEndpoint.reason`: one of `content-unavailable`, `main-frame-timed-out`, `main-frame-failed`, `processing-budget`, `all-frames-failed`, `content-error`, `no-session`, `low-confidence`, `unknown-kind`, `unmappable`, `document-replaced`, `no-model`, `snapshot-unavailable`, `model-failed`, `transport-error`, `invalid-review`, `fields-changed`, `timed-out`, `detector-error`, `samples-apart`, `exclusion-kept`, `records-dropped`, `no-tighter-record`, `no-looser-record`, `no-table`, `samples-lost`
- `lastEndpoint.scrapeErrorCode`: one of `NO_ACTIVE_SESSION`, `TAB_UNAVAILABLE`, `TAB_NOT_SCRAPABLE`, `RECORDING_CONFLICT`, `FIELD_NAME_IN_USE`, `FIELD_NOT_FOUND`, `NOT_URL_LINK_FIELD`, `NO_SAMPLE_URL`, `NEXT_DETAIL_SAMPLE_UNAVAILABLE`, `SUBPAGE_CONTEXT_FAILED`, `DETAIL_DOCUMENT_UNSUPPORTED`, `PICKER_NOT_ACTIVE`, `BLOCK_NOT_FOUND`, `INVALID_INPUT`, `OPERATION_FAILED`, `SUBPAGE_NAVIGATION_TIMEOUT`, `PAGINATION_NOT_SET`, `NEXT_PAGE_BUTTON_NOT_SELECTED`, `PAGE_QUERY_PARAM_NOT_SET`, `RECORD_LIMIT_NOT_SET`, `FIELDS_REQUIRED`, `SESSION_STOPPED_DURING_START`, `CONTENT_UNAVAILABLE`, `STRUCTURE_DETECTION_TIMED_OUT`, `STRUCTURE_DETECTION_FAILED`, `STRUCTURE_DETECTION_BUDGET_EXCEEDED`, `STRUCTURE_DETECTION_ALL_FRAMES_FAILED`, `NO_REPEATING_BLOCK`, `SAMPLE_ELEMENT_INVISIBLE`, `WORKFLOW_COMPILE_FAILED`, `FINISH_IN_PROGRESS`
- `lastEndpoint.fallbacks[]`: one of `detect-again`, `detect-with-ai`, `detect-form-fields`, `pick-sample-record`, `pick-page-fields`, `pick-detail-fields`, `page-content-only`, `next-detail-sample`, `choose-pagination-type`, `pick-again`, `back`, `wait-for-person`, `reopen-page`, `retry-save`, `agent-read`, `pick-next-control`, `add-sample-record`, `exclude-record`, `pick-tighter-record`, `pick-looser-record`, `pick-table`, `review-fields-with-ai`

## Guidance

Planning rules for this method: [`guidance/dsagent.wizard.md`](../guidance/dsagent.wizard.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.wizard.start.json`](../contracts/dsagent.wizard.start.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
