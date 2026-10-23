# dsagent.page.open

**Open a web page** · risk `reversible-write` · timeout 150000 ms · inline result ≤ 4096 bytes · concurrency `exclusive-target`

Use the default user session for every agent task, preserving the person's existing website sign-ins.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.open",
  "args": {
    "url": "<url: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The page to open and where.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `url` | string (8–2048 chars, pattern under Constraints) | yes | Only the exact HTTP(S) URL supplied by the user, or the entry page of the website explicitly named by the user. Never p… |
| `pageContextId` | string (8–128 chars) |  | Optional page from dsagent.pages.list supplying window placement; default mode always uses the user session even if the… |
| `sessionGroup` | enum: default, new, previous |  | Which browser session the page opens in: default (the person's own session group; the default), new (a fresh isolated s… |
| `sessionName` | string (0–40 chars, pattern under Constraints) |  | The session's name: lowercase letters, digits and dashes (for example section-38). Optional with new (a name is generat… |
| `windowPlacement` | enum: shared-window, new-window |  | Where a named session's tab group goes when its first page opens: shared-window (the person's window; the default) or n… |
| `accountId` | string (0–128 chars, pattern under Constraints) |  | Opaque application account id from dsagent.app.accounts.list or dsagent.browser.sessions.list: the page opens in that a… |
| `taskDescription` | string (1–2000 chars) |  | The person’s request in detail (what to do, on which site, with which data), as you would tell them; DSphere shows it a… |
| `waitUntil` | enum: settled |  | Optional: settled waits, bounded (10 s), for the opened page to go quiet before the result reads its revision, as dsage… |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `url`: matches `^https?://`
- `sessionName`: matches `^[a-z0-9][a-z0-9-]{0,39}$`
- `accountId`: matches `^acct_[0-9a-f]{16,128}$`

## Result fields (data.data)

The opened page.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (0–128 chars) |  | Opaque context of the opened page, accepted by dsagent.page.* and dsagent.wizard.start. |
| `url` | string (0–2048 chars) |  | Sanitized URL the page loaded (after redirects), without credentials. |
| `title` | string (0–300 chars) |  | Bounded page title. |
| `sessionName` | string (0–40 chars) |  | The named session the page opened in (sessionGroup new or previous); pass it with sessionGroup previous to keep working… |
| `accountId` | string (0–128 chars) |  | The application account whose session the page opened in, when accountId was given. |
| `revision` | string (0–128 chars) |  | The revision of the opened page from the read the open already made (after the wait with waitUntil settled): pass it as… |
| `rendered` | boolean |  | False when the browser is not drawing the page (its window reported minimized or a 0×0 viewport): finds, waits and acti… |
| `settled` | boolean |  | With waitUntil settled: whether the page went quiet within the bound (false: it was still changing; the revision is the… |
| `authentication` | object {status, type, confidence, waitingOn, attemptsLeft} |  | The sign-in monitor's verdict on the page: status no-wall when it checked and found none (absent when it could not chec… |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.open.json`](../contracts/dsagent.page.open.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
