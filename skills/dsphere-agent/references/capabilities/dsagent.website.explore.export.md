# dsagent.website.explore.export

**Export targeted website exploration report** · risk `reversible-write` · timeout 60000 ms · inline result ≤ 8192 bytes · concurrency `exclusive-browser`

ONLY for an explicit user request to explore a website or produce its report. Compose captured evidence and caller-authored findings into a detailed, self-contained Markdown report in the user export directory for future reuse and third-party agent handoff. Does not navigate or execute actions.

## Invocation

Call `dsagent_invoke` with this shape. Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.website.explore.export",
  "args": {
    "title": "<title: supply a value matching the schema>",
    "objective": "<objective: supply a value matching the schema>",
    "evidenceIds": [
      "<evidenceIds: supply a value matching the schema>"
    ],
    "findings": [
      {
        "title": "<title: supply a value matching the schema>",
        "category": "navigation",
        "status": "observed",
        "evidenceIds": [],
        "description": "<description: supply a value matching the schema>",
        "procedure": [],
        "expectedResult": "<expectedResult: supply a value matching the schema>"
      }
    ],
    "nextSteps": [
      "<nextSteps: supply a value matching the schema>"
    ],
    "limitations": [
      "<limitations: supply a value matching the schema>"
    ]
  },
  "idempotencyKey": "<fresh 8-128 character key you choose; reuse it only for an identical retry>"
}
```

## Inputs

Compose a targeted user-requested report using captured evidence and explicitly attributed caller findings.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `title` | string (1–200 chars) | yes | Report title. |
| `objective` | string (1–2000 chars) | yes | User request, website scope, relevant account state and exploration boundaries. |
| `evidenceIds` | array of string (1–80 chars) (≤ 24) | yes | Capture evidence IDs belonging to this caller. |
| `findings` | array of object {title, category, status, evidenceIds, description, procedure, …} (≤ 48) | yes | Targeted capabilities, data schemas, procedures and conditional cases. A control being present alone does not prove fun… |
| `nextSteps` | array of string (1–1000 chars) (≤ 20) | yes | Remaining work and handoff procedure for another agent. |
| `limitations` | array of string (1–1000 chars) (≤ 20) | yes | Unverified areas, evidence age, account restrictions and incomplete coverage. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `findings[].category`: one of `navigation`, `search`, `filter`, `sort`, `content`, `data`, `authentication`, `form`, `social`, `media`, `limitation`
- `findings[].status`: one of `observed`, `caller-verified`, `not-tested`, `blocked`

## Result fields (data.data)

Confirmed portable report file, suitable for sharing by the user.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `path` | string (1–4096 chars) |  | Confirmed Markdown file in the configured export directory, or the browser download directory. |
| `sizeBytes` | integer (0…∞) |  | Verified file size in bytes. |
| `mediaType` | enum: text/markdown |  | Portable Markdown document. |
| `sha256` | string (pattern under Constraints) |  | Report content SHA-256. |
| `evidenceCount` | integer (1…24) |  | Included page captures. |
| `findingCount` | integer (1…48) |  | Included caller findings. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `sha256`: matches `^[a-f0-9]{64}$`

## Guidance

Planning rules for this method: [`guidance/dsagent.website.md`](../guidance/dsagent.website.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.website.explore.export.json`](../contracts/dsagent.website.explore.export.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
