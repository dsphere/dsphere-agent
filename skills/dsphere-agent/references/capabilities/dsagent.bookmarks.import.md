# dsagent.bookmarks.import

**Import other browsers' bookmarks** · risk `reversible-write` · timeout 120000 ms · inline result ≤ 65536 bytes · concurrency `exclusive-browser`

Import the bookmarks of the chosen profiles into the DSphere browser, exactly as the SidePanel Chat skill "Sync bookmarks" does.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.bookmarks.import",
  "args": {
    "sourceIds": [
      "<sourceIds: supply a value matching the schema>"
    ]
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The profiles to import.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `sourceIds` | array of string (pattern under Constraints) (≤ 32) | yes | Source IDs from dsagent.bookmarks.sources, imported in this order. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `sourceIds[]`: matches `^(chrome|edge|safari)-[0-9a-f]{16}$`

## Result fields (data.data)

What the import added to the DSphere browser, in total and per source.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `sources` | array of object {sourceId, browser, profile, added, foldersCreated, duplicates, …} |  | One entry per imported source, in the order requested. |
| `added` | integer (0…∞) |  | Bookmarks created across all sources. |
| `foldersCreated` | integer (0…∞) |  | Folders created across all sources. |
| `duplicates` | integer (0…∞) |  | Bookmarks skipped as already present, across all sources. |
| `unsupported` | integer (0…∞) |  | Bookmarks skipped as not bookmarkable, across all sources. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `sources[].sourceId`: matches `^(chrome|edge|safari)-[0-9a-f]{16}$`
- `sources[].failure`: one of `INVALID_REQUEST`, `NATIVE_UNAVAILABLE`, `NATIVE_UPGRADE_REQUIRED`, `SOURCE_NOT_FOUND`, `ACCESS_DENIED`, `UNREADABLE`, `BOOKMARKS_UNAVAILABLE`, `BUSY`

## Guidance

Planning rules for this method: [`guidance/dsagent.bookmarks.md`](../guidance/dsagent.bookmarks.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.bookmarks.import.json`](../contracts/dsagent.bookmarks.import.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
