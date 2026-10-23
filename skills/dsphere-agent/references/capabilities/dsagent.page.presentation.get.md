# dsagent.page.presentation.get

**Read browser and viewport size** · risk `read-sensitive` · timeout 15000 ms · inline result ≤ 4096 bytes · concurrency `shared-read`

Read actual window, viewport and device pixel ratio of an agent-owned page. No device emulation is implied.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.presentation.get",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  }
}
```

## Inputs

The page whose geometry to read.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) | yes | Opaque context of a page opened for this agent or in its named browser session. |

## Result fields (data.data)

Actual page and browser geometry.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) |  | Opaque context of a page opened for this agent or in its named browser session. |
| `window` | object {width, height} |  | Outer browser window geometry in browser screen pixels. |
| `viewport` | object {width, height} |  | Page layout viewport geometry in CSS pixels, excluding browser chrome and the side panel. |
| `devicePixelRatio` | number (0…∞) |  | Actual device pixel ratio; normal sizing does not override it. |

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.presentation.get.json`](../contracts/dsagent.page.presentation.get.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
