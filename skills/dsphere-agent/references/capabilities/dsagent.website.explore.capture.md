# dsagent.website.explore.capture

**Export website exploration evidence** · risk `reversible-write` · timeout 60000 ms · inline result ≤ 8192 bytes · concurrency `exclusive-browser`

ONLY when the user explicitly requests website exploration or an exploration report. Capture selected controls at a current page revision and export a verified Markdown evidence file. Independent from atomic execution: never invoked automatically.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.website.explore.capture",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "expectedRevision": "<expectedRevision: supply a value matching the schema>",
    "label": "<label: supply a value matching the schema>",
    "targetIds": []
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Capture explicitly requested website exploration evidence from selected current controls. No browsing or actions are pe…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (1–128 chars) | yes | Existing task page context. |
| `expectedRevision` | string (1–128 chars) | yes | Current observation revision; stale captures fail closed. |
| `label` | string (1–200 chars) | yes | Meaningful page or explored state name. |
| `targetIds` | array of string (1–128 chars) (≤ 32) | yes | Select only relevant observed controls, never records for bulk data collection. Empty captures document the page identi… |

## Result fields (data.data)

Confirmed exploration evidence and durable Markdown artifact.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `evidenceId` | string (1–80 chars) |  | Opaque evidence ID for report export; not an action handle. |
| `capturedAt` | number (0…∞) |  | Capture timestamp in epoch milliseconds. |
| `revision` | string (1–128 chars) |  | Captured page observation revision. |
| `path` | string (1–4096 chars) |  | Confirmed Markdown file in the configured export directory, or the browser download directory. |
| `sizeBytes` | integer (0…∞) |  | Verified file size in bytes. |
| `mediaType` | enum: text/markdown |  | Portable Markdown document. |

## Guidance

Planning rules for this method: [`guidance/dsagent.website.md`](../guidance/dsagent.website.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.website.explore.capture.json`](../contracts/dsagent.website.explore.capture.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
