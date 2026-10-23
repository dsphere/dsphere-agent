# dsagent.page.account.detect

**Detect the signed-in account** · risk `read-sensitive` · timeout 15000 ms · inline result ≤ 8192 bytes · concurrency `shared-read`

Read which account the web application on this page shows as signed in, from where applications show it: the top-left and top-right corners of the header and the bottom-left corner (a sidebar foot), using the avatar, the name beside it, account menus and accessible labels.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.page.account.detect",
  "args": {
    "pageContextId": "<pageContextId: supply a value matching the schema>"
  }
}
```

## Inputs

The page to read.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) | yes | Opaque page context from dsagent.pages.list or dsagent.page.open. |

## Result fields (data.data)

The signed-in account the page shows.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `pageContextId` | string (8–128 chars) |  | Opaque page context from dsagent.pages.list or dsagent.page.open. |
| `status` | enum: signed-in, signed-out, unknown |  | signed-in: an account name or avatar shows in a corner and no sign-in control does; signed-out: a sign-in control shows… |
| `account` | object {label, corner, source, score, signals} |  | The most likely account, when the evidence is strong enough. |
| `avatar` | boolean |  | A user picture shows in a corner. |
| `signInControl` | boolean |  | A sign-in or log-in control shows in a corner. |
| `candidates` | array of object {label, corner, source, score, signals} (≤ 5) |  | Every account label considered, strongest first. |
| `accountMenu` | object {targetId, expectedRevision, open, label, corner} |  | The control that opens the account menu (the avatar's), to open it with a page action when only an avatar shows. |

## Guidance

Planning rules for this method: [`guidance/dsagent.page.md`](../guidance/dsagent.page.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.page.account.detect.json`](../contracts/dsagent.page.account.detect.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
