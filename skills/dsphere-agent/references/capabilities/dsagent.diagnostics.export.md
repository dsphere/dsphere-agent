# dsagent.diagnostics.export

**Export local diagnostic records** · risk `reversible-write` · timeout 180000 ms · inline result ≤ 8192 bytes · concurrency `shared-read`

Export current-user retained ActionEpisode, DecisionSpan and TaskRun facts as one browser-downloaded ZIP containing offline HTML per-record details, JSONL and a checksummed manifest. No upload. Extract the ZIP and open index.html. Requires a Native Agent with archive.zip.v1.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.diagnostics.export",
  "args": {
    "rangeDays": 1
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Bounded local diagnostic export interval.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `rangeDays` | enum: 1, 7, 14 | yes | Look back 1, 7 or 14 days from snapshot creation. |

## Result fields (data.data)

Confirmed local diagnostic package and coverage.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `archivePath` | string (0–4096 chars) |  | Absolute path of the completed ZIP download. Extract it and open index.html. |
| `fileName` | string (0–256 chars) |  | Suggested ZIP download file name. |
| `archiveSize` | integer (0…∞) |  | Compressed ZIP byte size. |
| `sha256` | string (pattern under Constraints) |  | SHA-256 of the complete ZIP bytes. |
| `downloadId` | integer (0…∞) |  | Browser download ID, usable to locate the completed local file. |
| `fileCount` | integer (0…∞) |  | Number of files including the manifest. |
| `missingReferences` | integer (0…∞) |  | Distinct referenced records unavailable in retained storage. |
| `counts` | object {task-run, decision-span, action-episode} |  | Record counts per kind. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `sha256`: matches `^[a-f0-9]{64}$`

## Guidance

Planning rules for this method: [`guidance/dsagent.diagnostics.md`](../guidance/dsagent.diagnostics.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.diagnostics.export.json`](../contracts/dsagent.diagnostics.export.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
