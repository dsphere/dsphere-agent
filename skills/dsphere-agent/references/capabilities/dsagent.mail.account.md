# dsagent.mail.account

**Look up the person's configured email address** · risk `read-sensitive` · timeout 10000 ms · inline result ≤ 4096 bytes · concurrency `shared-read`

The email address and display name of the account the person set up in the DSphere Agent Email panel, and whether mail can be sent from it (canSend: an SMTP login is set up) and reached now (available: the Native Agent is connected and supports mail).

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.mail.account",
  "args": {}
}
```

## Inputs

No arguments.

## Result fields (data.data)

The configured account.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `configured` | boolean |  | Whether the person has set up an account in the Email panel. |
| `available` | boolean |  | Whether the Native Agent mail transport is reachable now. |
| `canSend` | boolean |  | Whether the account has an SMTP login, so dsagent.mail.send can send from it. |
| `email` | one of 2: string (0–320 chars) / null |  | The account's email address, or null when none is set up. |
| `displayName` | one of 2: string (0–320 chars) / null |  | The name mail is sent under, or null when none is set up. |

## Guidance

Planning rules for this method: [`guidance/dsagent.mail.md`](../guidance/dsagent.mail.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.mail.account.json`](../contracts/dsagent.mail.account.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
