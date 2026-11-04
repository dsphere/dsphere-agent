# dsagent.site.knowledge.record

**Record site knowledge** · risk `reversible-write` · timeout 15000 ms · inline result ≤ 8192 bytes · concurrency `exclusive-target`

Record what this task learned about how the page's site works, for the next run: up to 10 entries of kind control, reading, pitfall or state. Controls are named by targetId; DSphere takes their label and role from its own view. Text that looks like the person's data is refused.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.site.knowledge.record",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "entries": [
      {
        "kind": "control"
      }
    ]
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page the entries were learned on, and the entries.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | The page from dsagent.page.open or dsagent.pages.list, or a closed one a finish siteKnowledgeAsk named; the site is the… |
| `expectedRevision` | string (1–128 chars) |  | The revision the target ids belong to; required when an entry names a target. |
| `entries` | array of object {kind, targetId, purpose, needs, signedInOnly, method, …} (≤ 10) | yes | The entries, in order. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `entries[].kind`: one of `control`, `reading`, `pitfall`, `state`
- `entries[].method`: one of `wizard-collect`, `wizard-start`, `page-markdown`, `page-find`, `agent-read`
- `entries[].pagination`: one of `none`, `next-button`, `numbered`, `infinite-scroll`, `load-more`
- `entries[].type`: one of `consent-wall`, `sign-in-wall`, `challenge-handoff`, `popup-overlay`, `search-needs-enter`, `hover-menu`, `opens-new-tab`, `lazy-load`, `infinite-scroll`, `slow-load`, `rate-limit`, `region-block`, `iframe`, `shadow-dom`, `date-picker`, `other`

## Result fields (data.data)

What happened to each entry.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `site` | string (0–259 chars) |  | The site the entries were kept under. |
| `results` | array of object {index, outcome, entryId, reason} (≤ 10) |  | One result per entry, by index. |

## Guidance

Planning rules for this method: [`guidance/dsagent.site.md`](../guidance/dsagent.site.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.site.knowledge.record.json`](../contracts/dsagent.site.knowledge.record.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
