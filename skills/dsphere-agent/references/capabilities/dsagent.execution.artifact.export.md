# dsagent.execution.artifact.export

**Export execution artifact** · risk `reversible-write` · timeout 60000 ms · inline result ≤ 16384 bytes · concurrency `shared-read`

Write an artifact to a local file in the export directory, for a client that can read files on the browser machine (after RESULT_LIMIT_EXCEEDED from a records read, or a binary artifact). A remote or sandboxed client pages a dataset with dsagent.artifact.read format jsonl or csv instead.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.execution.artifact.export",
  "args": {
    "executionId": "<executionId: supply a value matching the schema>",
    "artifactId": "<artifactId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Input for exporting one authorized artifact to the Extension-managed local directory.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `executionId` | string (1–128 chars) | yes | Opaque execution identifier that owns the artifact. |
| `artifactId` | string (1–256 chars) | yes | Opaque artifact identifier returned by dsagent.artifacts.list or the read-limit error details. |

## Result fields (data.data)

Local file reference produced by a successful artifact export.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `path` | string (1–4096 chars) |  | Absolute local path of the exported artifact inside the configured managed directory. |
| `mediaType` | string (1–200 chars) |  | Media type of the exported file. |
| `sizeBytes` | integer (0…∞) |  | Exact exported file size in bytes. |

## Guidance

Planning rules for this method: [`guidance/dsagent.execution.md`](../guidance/dsagent.execution.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.execution.artifact.export.json`](../contracts/dsagent.execution.artifact.export.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
