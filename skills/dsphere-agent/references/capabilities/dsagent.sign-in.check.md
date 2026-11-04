# dsagent.sign-in.check

**Check whether a sign-in page needs signing in** · risk `reversible-write` · timeout 60000 ms · inline result ≤ 4000 bytes · concurrency `exclusive-target`

Open a sign-in or application entry address in a new tab and report, once the page settled, what it asks of the visitor: sign-in-required (the sign-in monitor sees a sign-in wall, which wallType names, or the page shows a login and password form beside its content, with no wallType), signed-in (no…

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.sign-in.check",
  "args": {
    "url": "<url: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The address to check and the browser session to open it in.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `url` | string (8–2048 chars, pattern under Constraints) | yes | The sign-in or entry address: http or https, with no user name or password in it. |
| `sessionGroup` | enum: default, new, previous |  | default (the person's own session; the default), new (a fresh isolated session named sessionName) or previous (the name… |
| `sessionName` | string (0–40 chars, pattern under Constraints) |  | With new or previous: the session's name, lowercase letters, digits and dashes. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `url`: matches `^https?://`
- `sessionName`: matches `^[a-z0-9][a-z0-9-]{0,39}$`

## Result fields (data.data)

What the settled page asks of the visitor, where it settled, and the opened tab.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | enum: sign-in-required, signed-in, blocked, unknown |  | sign-in-required, signed-in, blocked, or unknown when no wall shows and no signed-in account either (also while the pag… |
| `wallType` | string |  | The sign-in monitor's wall type, with sign-in-required and blocked. |
| `page` | object {origin, path} |  | Where the page settled, without its query or fragment. |
| `session` | object {mode, name} |  | The browser session the page opened in. |
| `checkId` | string |  | Opaque id of this check, for a later sign-in on the same page. |
| `pageContextId` | string |  | The opened tab; absent when the check no longer stands for it. |
| `loading` | enum: true |  | The page was still loading when the check ended, so status is unknown: check again later, or call the sign-in on this c… |
| `signInEntries` | array of object |  | With unknown: the page shows no sign-in form yet, and these controls may open one (a header Sign in button, a sign-in l… |

## Guidance

Planning rules for this method: [`guidance/dsagent.sign-in.md`](../guidance/dsagent.sign-in.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.sign-in.check.json`](../contracts/dsagent.sign-in.check.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
