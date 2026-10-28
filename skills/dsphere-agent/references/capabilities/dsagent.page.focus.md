# dsagent.page.focus

**Bring a page forward** · risk `reversible-write` · timeout 15000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-target`

Bring a page's tab forward in its window and focus that window, for the rare step that needs the page on screen (a visual read that reports TAB_NOT_ACTIVE or WINDOW_NOT_FOCUSED, a control that only paints while visible).

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.focus",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page to bring forward.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | Opaque page context from dsagent.pages.list, dsagent.page.open, or a receipt's destinationPageContextId. |

## Result fields (data.data)

The page as it is after the call.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | The page that was brought forward. |
| `active` | boolean |  | Whether the tab is now the active tab of its window. |
| `focused` | boolean |  | Whether its window is now focused; false when the browser or OS refused focus, in which case the person has to click th… |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.focus.json`](../contracts/dsagent.page.focus.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
