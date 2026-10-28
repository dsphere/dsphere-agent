# dsagent.page.viewport.set

**Set viewport size** · risk `reversible-write` · timeout 15000 ms · inline result ≤ 4096 bytes · concurrency `exclusive-browser`

Set the viewport size of an agent-owned page using normal browser APIs. Window resizing affects all tabs sharing that window and restores a maximized window to normal; active wizards or workflow runs in that window are refused.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.viewport.set",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page and requested geometry.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | Opaque context of a page opened for this agent or in its named browser session. |
| `width` | integer (200…8192) |  | Requested width; required unless a preset supplies it. |
| `height` | integer (200…8192) |  | Requested height; required unless a preset supplies it. |
| `preset` | enum: mobile, tablet, laptop, desktop |  | Optional mobile, tablet, laptop or desktop dimensions; explicit width/height override the preset. |

## Result fields (data.data)

Verified sizing receipt, including constrained results.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) |  | Opaque context of a page opened for this agent or in its named browser session. |
| `target` | enum: viewport |  | Which geometry was requested. |
| `requested` | object {width, height} |  | Requested dimensions. |
| `before` | object {window, viewport, devicePixelRatio} |  | Measured browser and page geometry. |
| `after` | object {window, viewport, devicePixelRatio} |  | Measured browser and page geometry. |
| `applied` | boolean |  | True only when actual target dimensions match within two pixels; false reports browser constraints honestly. |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.viewport.set.json`](../contracts/dsagent.page.viewport.set.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
