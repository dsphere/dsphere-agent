# dsagent.page.target.inspect

**Inspect browser page target** · risk `read-sensitive` · timeout 15000 ms · inline result ≤ 16384 bytes · concurrency `shared-read`

Inspect one opaque target at an exact page revision. Returns bounded local structure and geometry; never returns selectors, action coordinates, scripts, or unbounded DOM.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.target.inspect",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "targetId": "<targetId: supply a value matching the schema>",
    "expectedRevision": "<expectedRevision: supply a value matching the schema>"
  }
}
```

## Inputs

Opaque target binding and revision guard for one bounded structure inspection.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) | yes | Opaque page context from dsagent.pages.list, dsagent.page.open, or a receipt's destinationPageContextId. |
| `targetId` | string (1–128 chars) | yes | Opaque target identifier returned by dsagent.page.observe. |
| `expectedRevision` | string (1–128 chars) | yes | Observed revision associated with the target; local identity and context must remain valid. |

## Result fields (data.data)

Revision-bound target-local structure and geometry evidence.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | Opaque inspected page context. |
| `targetId` | string (0–128 chars) |  | Opaque inspected target identifier. |
| `revision` | string (0–128 chars) |  | Revision to which all returned evidence is bound. |
| `role` | string (0–40 chars) |  | Target semantic role. |
| `tagName` | string (0–40 chars) |  | Target lowercase HTML tag name. |
| `label` | string (0–160 chars) |  | Bounded target label. |
| `state` | object {filled, checked, selected, current, expanded, disabled, …} |  | Allowlisted target state without field values. |
| `rect` | object {x, y, width, height} |  | Current target geometry for observation only. |
| `viewport` | object {relation, occlusion} |  | Conservative viewport and occlusion evidence. |
| `ancestors` | array of object {role, label, tagName} (≤ 3) |  | Nearest semantic ancestors, closest first. |
| `neighbors` | array of object {relation, role, label, tagName} (≤ 6) |  | Nearest semantic sibling summaries. |
| `localDom` | object {format, content, truncated} |  | Bounded local structure without selectors, values, script, style, or arbitrary attributes. |
| `value` | string (0–2000 chars) |  | The field's current text when it is readable: a page-produced field (read-only, disabled, output) or one you typed into… |
| `appearance` | object {textColor, backgroundColor} |  | Fixed computed color evidence for this target only. No arbitrary CSS, custom properties, URLs, pixels or private field… |
| `guidance` | object {evidenceGaps, recommendedObservation} |  | Optional owner-derived read-only evidence escalation guidance. |
| `authentication` | object {status, type, confidence, waitingOn, attemptsLeft} |  | The sign-in monitor's verdict on the page: status no-wall when it checked and found none (absent when it could not chec… |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `appearance.textColor`: matches `^(?:(?:rgba?|(?:ok)?lab|(?:ok)?lch|color)\([a-zA-Z0-9.,%/+\s-]+\)|transparent|currentcolor)$`
- `appearance.backgroundColor`: matches `^(?:(?:rgba?|(?:ok)?lab|(?:ok)?lch|color)\([a-zA-Z0-9.,%/+\s-]+\)|transparent|currentcolor)$`

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.target.inspect.json`](../contracts/dsagent.page.target.inspect.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
