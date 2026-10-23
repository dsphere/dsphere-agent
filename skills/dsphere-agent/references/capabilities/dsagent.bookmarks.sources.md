# dsagent.bookmarks.sources

**List other browsers' bookmarks** · risk `read-sensitive` · timeout 45000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

List the Google Chrome, Microsoft Edge and Safari profiles on this computer whose bookmarks can be imported into the DSphere browser, with an opaque source ID, the profile name, a status and the bookmark count. The Native Agent finds them for the current user; no path is returned.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.bookmarks.sources",
  "args": {}
}
```

## Inputs

No arguments.

## Result fields (data.data)

The profiles found, Chrome first, then Edge, then Safari.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `sources` | array of object {sourceId, browser, profile, status, bookmarkCount} |  | The browser profiles found. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `sources[].sourceId`: matches `^(chrome|edge|safari)-[0-9a-f]{16}$`

## Guidance

Planning rules for this method: [`guidance/dsagent.bookmarks.md`](../guidance/dsagent.bookmarks.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.bookmarks.sources.json`](../contracts/dsagent.bookmarks.sources.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
