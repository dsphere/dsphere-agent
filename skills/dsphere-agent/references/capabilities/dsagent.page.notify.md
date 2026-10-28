# dsagent.page.notify

**Ask the person to come to a page** · risk `reversible-write` · timeout 10000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-target`

Show the person a desktop notification asking them to come to this page, also while the DSphere side panel is closed (for example when a dsagent.page.ask question waits for them, or the task needs them on the page). Clicking it brings the page forward and opens the side panel.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.notify",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>",
    "message": "<message: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page and the short message for the person.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | The task page context returned by page.open; the notification brings this page forward when clicked. |
| `message` | string (1–200 chars) | yes | What the person is asked to do on the page, in their language; plain text, no links. |

## Result fields (data.data)

Whether the notification was shown.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) |  | The task page context returned by page.open; the notification brings this page forward when clicked. |
| `shown` | boolean |  | True when the notification was shown; false when one for this page was shown less than 30 seconds ago. |
| `retryAfterMs` | integer (0…30000) |  | When not shown: how long until a notice for this page may be shown again. |
| `challengeHandedToPerson` | enum: true |  | Present and true when a verification challenge you held on this page was handed to the person by this call: read the pa… |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.notify.json`](../contracts/dsagent.page.notify.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
