# dsagent.mail.send

**Send an email from the person's account** · risk `external-effect` · timeout 120000 ms · inline result ≤ 4096 bytes · concurrency `exclusive-target`

Send a new email from the account the person set up in the DSphere Agent Email panel (as that address and display name, through its SMTP login via the Native Agent); a copy is filed in its Sent folder unless the server files one itself.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.mail.send",
  "args": {
    "to": [
      "<to: supply a value matching the schema>"
    ],
    "subject": "<subject: supply a value matching the schema>",
    "body": "<body: supply a value matching the schema>"
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

The message to send.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `to` | array of one of 2: string (3–320 chars) / object {address, name} (≤ 100) | yes | Recipients; at least one. |
| `cc` | array of one of 2: string (3–320 chars) / object {address, name} (≤ 100) |  | Copy recipients. |
| `bcc` | array of one of 2: string (3–320 chars) / object {address, name} (≤ 100) |  | Blind copy recipients; they are not listed in the message. |
| `subject` | string (0–900 chars) | yes | Subject, one line. |
| `body` | string (0–50000 chars) | yes | Body as plain text; line breaks are kept. With html it is the plain-text alternative. |
| `html` | string (0–100000 chars) |  | Optional HTML body: email-safe markup with inline styles; <img src="cid:<contentId>"> shows an inline attachment. |
| `attachments` | array of object {uploadId, contentId} (≤ 10) |  | Files staged with the dsagent_upload_file tool, at most 10; the recipient sees the name and type given when staging. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `attachments[].uploadId`: matches `^upl_[0-9a-f]{32}$`
- `attachments[].contentId`: matches `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$`

## Result fields (data.data)

The mail the server accepted.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `messageId` | string (0–400 chars) |  | The Message-ID header the sent mail carries. |
| `from` | string (0–320 chars) |  | The address the mail was sent from. |
| `recipients` | integer (1…100) |  | How many distinct addresses it was sent to. |
| `attachments` | integer (0…10) |  | How many staged files it carried. |

## Guidance

Planning rules for this method: [`guidance/dsagent.mail.md`](../guidance/dsagent.mail.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.mail.send.json`](../contracts/dsagent.mail.send.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
