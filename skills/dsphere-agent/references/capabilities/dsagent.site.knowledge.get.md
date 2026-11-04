# dsagent.site.knowledge.get

**Read site knowledge** · risk `read-sensitive` · timeout 8000 ms · inline result ≤ 32768 bytes · concurrency `shared-read`

Read every entry earlier runs left about a site: the site of pageContextId, or a host name. Controls the page's last observation shows exactly once carry their targetId.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.site.knowledge.get",
  "args": {}
}
```

## Inputs

The site to read: a page or a host name, exactly one.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) |  | The page from dsagent.page.open or dsagent.pages.list, or a closed one a finish siteKnowledgeAsk named; the site is the… |
| `site` | string (1–259 chars) |  | A host such as example.com, plus :port if not 80/443, when no page of the site is open. |
| `kinds` | array of enum: control, reading, pitfall, state (≤ 4) |  | Only these kinds; all when absent. |
| `includePaused` | boolean |  | Also return paused entries (contradicted three times in a row). |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `kinds[]`: one of `control`, `reading`, `pitfall`, `state`

## Result fields (data.data)

The site's knowledge.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `site` | string (0–259 chars) |  | The site the entries are kept under (the page's own host, or the nearest parent that has entries). |
| `entries` | array of object {id, kind, status, source, sourceName, pathPattern, …} (≤ 120) |  | Its live entries. |
| `verified` | array of object {label, role, fieldPurpose, purpose} (≤ 8) |  | Controls DSphere's own runs verified on the site (read-only). |
| `personNote` | string (0–400 chars) |  | The person's own Site Note for the site, in their words: their guidance. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `entries[].pitfall.type`: one of `consent-wall`, `sign-in-wall`, `challenge-handoff`, `popup-overlay`, `search-needs-enter`, `hover-menu`, `opens-new-tab`, `lazy-load`, `infinite-scroll`, `slow-load`, `rate-limit`, `region-block`, `iframe`, `shadow-dom`, `date-picker`, `other`

## Guidance

Planning rules for this method: [`guidance/dsagent.site.md`](../guidance/dsagent.site.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.site.knowledge.get.json`](../contracts/dsagent.site.knowledge.get.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
