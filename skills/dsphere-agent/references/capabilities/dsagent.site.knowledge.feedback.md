# dsagent.site.knowledge.feedback

**Confirm or contradict site knowledge** · risk `reversible-write` · timeout 8000 ms · inline result ≤ 4096 bytes · concurrency `exclusive-target`

Say whether an entry of the page's site held: confirmed or contradicted. One verdict per entry per task counts; three contradictions in a row pause the entry. Requires an idempotency key.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.site.knowledge.feedback",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "entryId": "<entryId: supply a value matching the schema>",
    "verdict": "confirmed"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The entry and the verdict.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | The page from dsagent.page.open or dsagent.pages.list, or a closed one a finish siteKnowledgeAsk named; the site is the… |
| `entryId` | string (1–64 chars) | yes | An entry id from the digest or dsagent.site.knowledge.get. |
| `verdict` | enum: confirmed, contradicted | yes | Whether the entry held on the page. |

## Result fields (data.data)

The entry as it now stands.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `entryId` | string (0–64 chars) |  | The entry id. |
| `status` | enum: reported, confirmed, paused |  | Its status now. |
| `confirmations` | integer (0…∞) |  | Confirmations so far. |
| `contradictions` | integer (0…∞) |  | Contradictions so far. |

## Guidance

Planning rules for this method: [`guidance/dsagent.site.md`](../guidance/dsagent.site.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.site.knowledge.feedback.json`](../contracts/dsagent.site.knowledge.feedback.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
