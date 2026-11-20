# dsagent.live-tasks.window.open

**Open the Live Task window** · risk `reversible-write` · timeout 15000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-browser`

Open DSphere's Live Task window for the person: its own browser window with live video of every tab group whose task still runs (your tasks, other agents', the DSphere Chat bot's and workflow runs), the same window as the SidePanel's Live Task Window button.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.live-tasks.window.open",
  "args": {},
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

No input.

## Result fields (data.data)

What the open did.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `window` | enum: opened, focused |  | opened: a new Live Task window was created; focused: the one already open was brought to the front. |

## Guidance

Planning rules for this method: [`guidance/dsagent.live-tasks.md`](../guidance/dsagent.live-tasks.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.live-tasks.window.open.json`](../contracts/dsagent.live-tasks.window.open.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
