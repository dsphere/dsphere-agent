# dsagent.artifact.read

**Read artifact** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 262144 bytes · concurrency `shared-read`

Read a listed artifact.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.artifact.read",
  "args": {
    "artifactId": "<artifactId: supply a value matching the schema>"
  }
}
```

## Inputs

Input for bounded reading of a listed execution artifact. For format records the byte budget is fixed by the Extension…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `artifactId` | string (1–256 chars) | yes | Opaque artifact identifier returned by dsagent.artifacts.list. |
| `cursor` | string (1–512 chars) |  | Opaque continuation cursor returned by a prior read of the same artifact and format; omit for the first read. |
| `format` | enum: records, jsonl, csv |  | records (default): the complete records inline when they fit the fixed probe, else export. jsonl: pages of JSON Lines,… |
| `pageBytes` | integer (1024…65536) |  | With format jsonl or csv: the most bytes of records one page holds (default 65536); records never split across pages. |

## Result fields (data.data)

Bounded structured, paged-text or binary artifact read result. Oversized structured data in format records fails with e…

| Field | Type | Required | Meaning |
|---|---|---|---|
| `artifactId` | string (1–256 chars) |  | Artifact that was read. |
| `mediaType` | string (1–200 chars) |  | Artifact media type. |
| `format` | enum: jsonl, csv |  | Present on a paged text read: the format of page. |
| `cursor` | string (0–512 chars) |  | Cursor consumed by this read; empty for the first page. |
| `nextCursor` | string,null (0–512 chars) |  | Opaque cursor for the next bounded page (binary, jsonl or csv), or null at EOF. |
| `eof` | boolean |  | Whether the complete artifact has been consumed. |
| `records` | array of any |  | Complete structured records returned only when they fit the fixed initial probe (format records). |
| `page` | string |  | format jsonl: the records of this page, one JSON object per line. format csv: the CSV lines of this page (no header lin… |
| `rowsInPage` | integer (0…∞) |  | How many records page holds. |
| `columns` | array of string (1–500 chars) (≤ 200) |  | The columns of the dataset (declared, else the keys of the records read so far), in the order csv cells follow. |
| `header` | string |  | format csv: the header line (the columns, CSV-escaped), the same on every page; write it once before the pages. |
| `encoding` | enum: base64 |  | Binary payload encoding when data is returned inline. |
| `data` | string |  | Bounded Base64 binary payload for the current cursor page. |

## Guidance

Planning rules for this method: [`guidance/dsagent.artifact.md`](../guidance/dsagent.artifact.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.artifact.read.json`](../contracts/dsagent.artifact.read.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
