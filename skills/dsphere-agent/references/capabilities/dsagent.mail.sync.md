# dsagent.mail.sync

**Sync the person's local email now** · risk `read-sensitive` · timeout 180000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

Fetch new mail for one folder (INBOX by default) from the person's mail server into the DSphere Agent Email panel's local copy now, instead of waiting for the background sync (every few minutes, 15 by default).

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.mail.sync",
  "args": {}
}
```

## Inputs

The folder to sync.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `mailbox` | string (1–1000 chars) |  | Folder to sync, as folders or a search result names it (INBOX for the inbox). Default INBOX. |

## Result fields (data.data)

The folder after the sync.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `mailbox` | string (0–1000 chars) |  | The folder that was synced. |
| `syncedAt` | string (0–40 chars) |  | When the folder finished syncing, as an ISO 8601 timestamp. |
| `messageCount` | integer (0…∞) |  | Messages in the folder on the server. |
| `unreadCount` | integer (0…∞) |  | Unread messages in the folder on the server. |
| `pendingBodies` | integer (0…∞) |  | Stored messages (all folders) whose bodies are still downloading; their body text is not searchable yet. |
| `folders` | array of object {path, role} (≤ 100) |  | The account's folders, at most 100. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `folders[].role`: one of `inbox`, `sent`, `drafts`, `trash`, `junk`, `archive`, `other`

## Guidance

Planning rules for this method: [`guidance/dsagent.mail.md`](../guidance/dsagent.mail.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.mail.sync.json`](../contracts/dsagent.mail.sync.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
