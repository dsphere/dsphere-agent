# dsagent.mail.read

**Read messages from the person's local email** · risk `read-sensitive` · timeout 60000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

Read the plain text of up to 10 messages found with dsagent.mail.search, by their ids, to answer or summarize from mail content: headers, attachment names and the body text (HTML mail converted to text), each cut to maxChars (default 8000) and all together to 40000 characters.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.mail.read",
  "args": {
    "ids": [
      "<ids: supply a value matching the schema>"
    ]
  }
}
```

## Inputs

Messages to read.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `ids` | array of string (pattern under Constraints) (≤ 10) | yes | Message ids from dsagent.mail.search. |
| `maxChars` | integer (200…20000) |  | Characters of body text per message; default 8000. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `ids[]`: matches `^[a-f0-9]{24}$`

## Result fields (data.data)

The text of the messages.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `messages` | array of object {id, mailbox, subject, from, to, cc, …} (≤ 10) |  | The messages in the order asked. |
| `missing` | array of string (0–24 chars) (≤ 10) |  | Ids that are not stored (never synced, or deleted since). |
| `truncated` | boolean |  | Whether any text was cut to fit the budget. |

## Guidance

Planning rules for this method: [`guidance/dsagent.mail.md`](../guidance/dsagent.mail.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.mail.read.json`](../contracts/dsagent.mail.read.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
