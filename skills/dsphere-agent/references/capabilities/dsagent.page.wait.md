# dsagent.page.wait

**Wait for a page condition** · risk `read-sensitive` · timeout 30000 ms · inline result ≤ 4096 bytes · concurrency `shared-read`

Wait, bounded, for one condition on the page instead of polling dsagent.page.observe: the revision to change (sinceRevision), a target to appear, go, become enabled or become disabled (targetId + expectedRevision), text to show or to go, the address to change, the page to settle, a surface to…

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.wait",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "until": "revision-changed"
  }
}
```

## Inputs

The page, the condition and its bound.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | Opaque page context from dsagent.pages.list, dsagent.page.open, or a receipt's destinationPageContextId. |
| `until` | enum (12 values, listed under Constraints) | yes | revision-changed: the page revision differs from sinceRevision. target-present / target-absent: the target (targetId at… |
| `timeoutMs` | integer (250…25000) |  | How long to wait at most; 10000 by default. |
| `sinceRevision` | string (1–128 chars) |  | With revision-changed: the revision you hold. |
| `targetId` | string (1–128 chars) |  | With target-present / target-absent / target-enabled / target-disabled: the opaque target. |
| `expectedRevision` | string (1–128 chars) |  | With targetId: the revision it was published at. |
| `text` | string (1–200 chars) |  | With text-present / text-absent: the words the page should show (or stop showing), as it prints them. |
| `surfaceId` | string (1–128 chars) |  | With surface-closed: the surface from pageSurfaces. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `until`: one of `revision-changed`, `target-present`, `target-absent`, `target-enabled`, `target-disabled`, `text-present`, `text-absent`, `url-changed`, `settled`, `surface-closed`, `authentication-cleared`, `download`

## Result fields (data.data)

Whether the condition was met within the bound, and where the page is now.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) |  | Opaque page context from dsagent.pages.list, dsagent.page.open, or a receipt's destinationPageContextId. |
| `until` | enum (12 values, listed under Constraints) |  | The condition waited for. |
| `outcome` | enum: met, timed-out |  | met: the condition held; timed-out: it did not within timeoutMs (read the page and decide; it is not an error). |
| `waitedMs` | integer (0…∞) |  | How long the wait took for its condition, not counting the read of the page that names the revision after it. |
| `revision` | string (0–128 chars) |  | The page revision when the wait ended (a met wait reads the page again if its condition did not), current enough to act… |
| `url` | string (0–2048 chars) |  | The page address as last read. |
| `change` | enum: changed, unchanged |  | With sinceRevision: whether the latest revision differs from it. |
| `authentication` | object |  | With authentication-cleared and timed-out: the wall still standing (status, kind). |
| `download` | object {state, fileName, sizeBytes, mimeType, interruptReason} |  | With download, once the page started one: the file as the browser saved it. A timed-out wait with state in_progress: th… |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `until`: same values as input `until`

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.wait.json`](../contracts/dsagent.page.wait.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
