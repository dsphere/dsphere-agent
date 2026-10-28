# dsagent.page.close

**Close a page opened for you** · risk `reversible-write` · timeout 15000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-target`

Close a browser tab opened for you, once you are done with it (for example when a test or check is finished and its data is exported): a page dsagent.page.open opened, a page a guided wizard you drive opened (the sample detail page it reported as pagePick.pageContextId), or any tab of a named…

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.close",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page to close.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | The pageContextId dsagent.page.open returned or a guided wizard reported as pagePick.pageContextId for a page it opened… |

## Result fields (data.data)

The closed page.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | The page context that was closed; dsagent.page.* no longer accepts it. |
| `closed` | enum: true |  | Always true: the tab is gone. |
| `alreadyClosed` | boolean |  | True when the tab was already gone (closed by the person or the browser) before this call. |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.close.json`](../contracts/dsagent.page.close.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
