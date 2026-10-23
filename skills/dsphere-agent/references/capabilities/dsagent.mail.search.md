# dsagent.mail.search

**Search the person's local email** · risk `read-sensitive` · timeout 15000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

Search the mail the person synced into the DSphere Agent Email panel from their own IMAP account (stored locally through the Native Agent).

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.mail.search",
  "args": {}
}
```

## Inputs

A search over the locally synced mail.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `query` | string (1–256 chars) |  | Search words and operators, for example: invoice from:billing@example.com has:attachment newer_than:30d. Optional when… |
| `from` | string (1–200 chars) |  | Only mail whose sender name or address contains this text. |
| `to` | string (1–200 chars) |  | Only mail whose recipients (To or Cc) have a name or address containing this text. |
| `after` | string (pattern under Constraints) |  | Only mail sent on or after this day (YYYY-MM-DD, the person's local time). |
| `until` | string (pattern under Constraints) |  | Only mail sent on or before this day (YYYY-MM-DD, the person's local time). |
| `mailbox` | string (1–1000 chars) |  | Restrict to one folder, by the mailbox value a previous result returned (INBOX for the inbox). Omit to search every syn… |
| `limit` | integer (1…25) |  | How many results to return; default 10. |
| `cursor` | string (pattern under Constraints) |  | nextCursor from the previous page of the same search. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `after`: matches `^\d{4}-\d{2}-\d{2}$`
- `until`: matches `^\d{4}-\d{2}-\d{2}$`
- `cursor`: matches `^\d{1,7}$`

## Result fields (data.data)

Matching messages, newest first.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `configured` | boolean |  | Whether the person has set up an account in the Email panel. |
| `available` | boolean |  | Whether the local mail store is reachable now (it needs the Native Agent). |
| `items` | array of object {id, mailbox, subject, from, to, date, …} (≤ 25) |  | Matching messages. |
| `nextCursor` | one of 2: string (pattern under Constraints) / null |  | Pass as cursor for the next page; null when there are no more. |
| `indexed` | integer (0…∞) |  | How many messages are stored and searchable by their headers. |
| `pendingBodies` | integer (0…∞) |  | How many stored messages still wait for their bodies (their bodies are not searchable yet). |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `nextCursor`: matches `^\d{1,7}$`

## Guidance

Planning rules for this method: [`guidance/dsagent.mail.md`](../guidance/dsagent.mail.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.mail.search.json`](../contracts/dsagent.mail.search.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
