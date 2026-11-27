# dsagent.browser.version

**Read the browser version verdict** · risk `read-sensitive` · timeout 5000 ms · inline result ≤ 4096 bytes · concurrency `shared-read`

Whether this DSphere browser is new enough to run tasks: it must be newer than 6.6.70.284, which is itself too old.

## Invocation

Call `dsagent_read` with this shape (a read: no idempotencyKey, may run beside other reads; `dsagent_invoke` accepts it too). Replace every placeholder with a value from the user or a preceding result; add `instanceId` when more than one browser is online. Opaque ids and revisions come only from results.

```json
{
  "method": "dsagent.browser.version",
  "args": {}
}
```

## Inputs

No arguments.

## Result fields (data.data)

The browser version verdict.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `running` | string (0–32 chars) |  | The browser's version, left out when it cannot be read. |
| `minimum` | string (0–32 chars) |  | The newest version that is still too old: the browser must be newer than this, and this version itself is refused. |
| `status` | enum: supported, upgrade-required |  | supported: tasks can run; upgrade-required: the person must update the browser first. Later versions may add values. |
| `backgroundRendering` | boolean |  | Whether the browser can keep task pages drawing in the background. |
| `upgradeEntrance` | enum: work-portal-check-update |  | Where the person updates the browser: Check Update at the top right of the Work portal. |
| `hint` | string (0–128 chars) |  | What to tell the person, in English. |

## Guidance

Planning rules for this method: [`guidance/dsagent.browser.md`](../guidance/dsagent.browser.md).

## Contract

The complete lossless descriptor (full input and output schemas, every field description) is [`contracts/dsagent.browser.version.json`](../contracts/dsagent.browser.version.json); the live Extension stays authoritative (`dsagent_list_capabilities` with this exact method and `detail=invoke`). Results arrive as ToolOutput: check `ok` and `error` first; `data.data` holds the business result.
