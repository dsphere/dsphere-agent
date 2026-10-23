# dsagent.manual.get

**Get DSphere Agent User Manual Section** · risk `read-sensitive` · timeout 5000 ms · inline result ≤ 65536 bytes · concurrency `shared-read`

Return one bounded section of the build-time DSphere Agent Extension user manual as Markdown in English or Simplified Chinese. Omit section (or request "index") for a table of contents listing every section id, then request one section per call.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.manual.get",
  "args": {}
}
```

## Inputs

Parameters for reading one section of the build-time DSphere Agent user manual.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `locale` | enum: en, zh-CN |  | Requested manual locale. Omit to use English. |
| `section` | enum (24 values, listed under Constraints) |  | Manual section to return. Omit to receive the index, which lists every section id with its title. |

## Input constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `section`: one of `index`, `overview`, `console`, `welcome`, `agreement`, `workflows`, `recording`, `scraping`, `build`, `autonomous`, `running`, `schedules`, `monitor`, `plan`, `datasheet`, `files`, `templates`, `authenticator`, `llm-config`, `email`, `settings`, `chat`, `skill`, `mcp`

## Result fields (data.data)

Build-time DSphere Agent user manual section response.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `locale` | enum: en, zh-CN |  | Locale of the returned section. |
| `format` | enum: markdown |  | Stable text format of the manual content. |
| `section` | enum (24 values, listed under Constraints) |  | Section id this response carries. |
| `sections` | array of enum (23 values, listed under Constraints) |  | Every manual section id, in manual order, so the whole manual can be read section by section. |
| `content` | string (1–65536 chars) |  | The requested bounded manual section in Markdown. |

## Result constraints

Complete value lists and id patterns for the fields above (the contract file is authoritative).

- `section`: one of `index`, `overview`, `console`, `welcome`, `agreement`, `workflows`, `recording`, `scraping`, `build`, `autonomous`, `running`, `schedules`, `monitor`, `plan`, `datasheet`, `files`, `templates`, `authenticator`, `llm-config`, `email`, `settings`, `chat`, `skill`, `mcp`
- `sections[]`: one of `overview`, `console`, `welcome`, `agreement`, `workflows`, `recording`, `scraping`, `build`, `autonomous`, `running`, `schedules`, `monitor`, `plan`, `datasheet`, `files`, `templates`, `authenticator`, `llm-config`, `email`, `settings`, `chat`, `skill`, `mcp`

## Guidance

Planning rules for this method: [`guidance/dsagent.manual.md`](../guidance/dsagent.manual.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.manual.get.json`](../contracts/dsagent.manual.get.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
