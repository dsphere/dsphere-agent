# Efficient atomic caller state

The optional `scripts/atomic-client-state.mjs` module is ordinary caller-side JavaScript. Import it in a host that supports local ES modules, or use its pure bookkeeping functions in your existing tool orchestration. It does not connect to a browser, choose controls, retry an action, submit an answer, or replace the MCP tools. Keep the same authorized MCP session.

```js
import { createCapabilityCache, readOperationResult, reducePageEvidence,
  bindKnownActions, measureToolCall } from '../scripts/atomic-client-state.mjs'

// Supply your existing MCP tool functions. Contracts come from
// references/capabilities/<method>.md; fetch a live one through this cache only
// after INVALID_REQUEST or CAPABILITY_UNAVAILABLE (SKILL.md's rule), never
// before the first call.
const contracts = createCapabilityCache(listCapabilities)
// Only in that rejection branch:
// const contract = await contracts.get(instanceId, generation, 'dsagent.page.actions')

// Retain the full envelope before considering data. Errors need reconciliation.
const { envelope, status, payload } = readOperationResult(toolResult)
if (status !== 'succeeded') {
  // OUTCOME_UNKNOWN: inspect read-only. Never automatically resend the effect.
  // Retain envelope.error (dispatchStatus, hint, nextActions) and operationId.
  // Return to the caller's recovery branch; never dispatch from this helper.
  return { envelope, status }
}
state = reducePageEvidence(state, payload)
// state.receipt retains the original receipt, including warnings/authentication.
// Keep envelope as well: operationId and operation status belong to that layer.

// These steps must already have been selected by the caller from current evidence.
const args = bindKnownActions(state, alreadyDecidedActions)
```

Keep state separately per `pageContextId`. Full observations replace the target set; delta observations remove IDs and then apply additions/changes. Unchanged retains the current set and never revives a removed target. A missing base means request a full observation. A stopped failed batch's final successful receipt is historical evidence, so re-observe before continuing. Never print a compact result that drops removal facts.

For timing, wrap the existing tool callback with `measureToolCall(method, callback, recordTiming)`. Persist only its method, dispatch/return times, operation ID and status. Correlate the operation ID with extension logs and Native MCP receive/complete times. `page.action` timing describes owner execution phases only: total tool latency minus owner time still contains unmeasured dispatch, bridge and preparation costs. Do not label that residual as Native latency without Native timestamps. The outer host may add delay before this JavaScript callback starts; measuring the callback cannot observe that interval.

Keep human wait separate. Call `page.ask.wait` immediately with its default long-poll; `publishedAt` and `answeredAt` are runtime boundaries, and `response.answeredBy` distinguishes a person's response from a safe default. A timeout, cancelled question, declined answer or missing result grants no continuation. Continue promptly after the person's accepted answer using fresh required evidence; do not add arbitrary sleeps.

Use action-returned evidence before another observe. Batch independent already-decided fields when all targets are present. Popup opening and unseen-option selection require separate decisions. Review the returned field states and owner verification before submission; if a required field or current value remains uncertain, inspect it. Never trade required verification for a faster benchmark.

Do not assume caller, browser and log epoch clocks are synchronized. Compare elapsed spans within each clock domain; calibrate clocks before attributing request versus return delay from absolute timestamps.
