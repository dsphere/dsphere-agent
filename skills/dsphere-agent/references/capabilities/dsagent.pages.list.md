# dsagent.pages.list

**List browser pages** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

List bounded, automatable browser pages using opaque page context IDs.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.pages.list",
  "args": {}
}
```

## Inputs

Filters for the bounded browser page catalog.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `activeOnly` | boolean |  | When true, return only the active browser page. |
| `limit` | integer (1…50) |  | Maximum pages to return; defaults to 25. |

## Result fields (data.data)

Bounded catalog of automatable browser pages.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pages` | array of object {pageContextId, title, url, active, owner, held, …} (≤ 50) |  | Automatable pages represented by opaque page context IDs. |
| `total` | integer (0…∞) |  | Total matching page count before the requested limit. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.pages.list.json`](../contracts/dsagent.pages.list.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
