# dsagent.page.auth.not-a-wall

**Report a sign-in wall as a false alarm** · risk `reversible-write` · timeout 20000 ms · inline result ≤ 1024 bytes · concurrency `exclusive-target`

Report that the sign-in or verification wall DSphere reads on a page (authentication.status sign-in-required) is a false alarm: the page needs no sign-in or check for the task, as the person's "False Alarm, Skip And Resume" on the sign-in sheet does.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.auth.not-a-wall",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page whose wall is a false alarm.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) | yes | The page the wall stands on: a pageContextId from dsagent.page.open, dsagent.pages.list or a paused run (pause.pageCont… |

## Result fields (data.data)

What the report came to.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (2–128 chars) |  | The page the wall stands on: a pageContextId from dsagent.page.open, dsagent.pages.list or a paused run (pause.pageCont… |
| `outcome` | enum: reported, no-wall |  | reported: the wall standing on the page is recorded as a false alarm for this page; no-wall: no wall stood when the pag… |
| `wallType` | string (0–40 chars) |  | With reported: the kind of wall reported (LOGIN_FORM, CAPTCHA, ...). |
| `cleared` | boolean |  | Whether the page now reads clear. False only when another kind of wall still stands there; that wall is the person's as… |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.auth.not-a-wall.json`](../contracts/dsagent.page.auth.not-a-wall.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
