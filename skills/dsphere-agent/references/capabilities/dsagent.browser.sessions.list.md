# dsagent.browser.sessions.list

**List reusable browser sessions** · risk `read-sensitive` · timeout 15000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

List the browser sessions a task can open pages in, each with the websites it holds sign-in evidence for: the person's default session, the named sessions (sessionGroup new/previous) and the managed application accounts' own sessions (dsagent.page.open accountId).

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.browser.sessions.list",
  "args": {}
}
```

## Inputs

Filters for the session catalog.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `site` | string (1–300 chars) |  | Optional website (an http(s) address or a host such as www.example.com): only that site's evidence, and only sessions h… |
| `query` | string (1–200 chars) |  | Optional case-insensitive text matched against session names, application and account names, the account labels the per… |

## Result fields (data.data)

The reusable browser sessions, the default first, then the most recently signed in.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `sessions` | array of object {session, openPages, sites} (≤ 50) |  | Browser sessions with their sign-in evidence. |

## Guidance

Planning rules for this method: [`guidance/dsagent.browser.md`](../guidance/dsagent.browser.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.browser.sessions.list.json`](../contracts/dsagent.browser.sessions.list.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
