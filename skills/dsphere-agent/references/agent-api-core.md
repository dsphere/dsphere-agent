# Core browser API

Generated from Extension contracts. This is an optional quick reference, not a new API or a required read before every task. Use the existing method names through the named gateway. Read SKILL.md for routing, ownership and consent rules.

## Request and result

Put method, args, instanceId and idempotencyKey beside each other in the gateway input. Omit instanceId only with one online browser. An effect needs a fresh 8–128 character idempotencyKey; only an identical retry reuses it. Never retry an uncertain effect automatically.

Prefer structuredContent. Keep the complete {ok,data|error} envelope: operationId and status are in data; the business result is data.data. Do not recursively unwrap a business field named data. Preserve warnings, authentication, dispatchStatus, hint and nextActions. A successful transport is not proof that the user task finished.

## Handle provenance

- instanceId: dsagent_list_instances; pageContextId: page.open or pages.list.
- expectedRevision: the latest revision returned for that same page.
- targetId: that observation's targets.added/changed or find's matches[].target.id. Never invent a handle.
- Reuse evidence returned by actions; request observe with baseRevision only when a refresh is needed. A missing delta base requires a full observation. Removed targets stay removed.

## Methods

Templates below are non-executable shapes: replace every angle-bracket placeholder using the user request or an earlier result. The first enum value is illustrative, never a recommendation. Open the linked reference for optional fields, action-specific requirements and complete constraints.

### dsagent.pages.list

List browser pages. Gateway: `dsagent_read`; risk: `read-sensitive`; concurrency: `shared-read`.

```json
{"method":"dsagent.pages.list","args":{}}
```

Result preview: `pages`, `total`; complete result in the linked contract.

[Options and constraints](capabilities/dsagent.pages.list.md) · [Lossless contract](contracts/dsagent.pages.list.json)

### dsagent.page.open

Open a web page. Gateway: `dsagent_invoke`; risk: `reversible-write`; concurrency: `exclusive-target`.

```json
{"method":"dsagent.page.open","args":{"url":"<url>"},"idempotencyKey":"<fresh-key>"}
```

Result preview: `pageContextId`, `url`, `title`, `sessionName`; complete result in the linked contract.

[Options and constraints](capabilities/dsagent.page.open.md) · [Lossless contract](contracts/dsagent.page.open.json)

### dsagent.page.observe

Observe browser page. Gateway: `dsagent_read`; risk: `read-sensitive`; concurrency: `shared-read`.

```json
{"method":"dsagent.page.observe","args":{"pageContextId":"<pageContextId>"}}
```

Result preview: `pageContextId`, `revision`, `baseRevision`, `change`; complete result in the linked contract.

[Options and constraints](capabilities/dsagent.page.observe.md) · [Lossless contract](contracts/dsagent.page.observe.json)

### dsagent.page.find

Find browser page targets. Gateway: `dsagent_read`; risk: `read-sensitive`; concurrency: `shared-read`.

```json
{"method":"dsagent.page.find","args":{"pageContextId":"<pageContextId>"}}
```

Result preview: `pageContextId`, `revision`, `query`, `surfaceMissing`; complete result in the linked contract.

[Options and constraints](capabilities/dsagent.page.find.md) · [Lossless contract](contracts/dsagent.page.find.json)

### dsagent.page.markdown

Read browser page as Markdown. Gateway: `dsagent_read`; risk: `read-sensitive`; concurrency: `shared-read`.

```json
{"method":"dsagent.page.markdown","args":{"pageContextId":"<pageContextId>"}}
```

Result preview: `pageContextId`, `revision`, `url`, `title`; complete result in the linked contract.

[Options and constraints](capabilities/dsagent.page.markdown.md) · [Lossless contract](contracts/dsagent.page.markdown.json)

### dsagent.page.action

Act on browser page target. Gateway: `dsagent_invoke`; risk: `external-effect`; concurrency: `exclusive-target`.

```json
{"method":"dsagent.page.action","args":{"pageContextId":"<pageContextId>","targetId":"<targetId>","expectedRevision":"<expectedRevision>","action":"click"},"idempotencyKey":"<fresh-key>"}
```

Result preview: `pageSurfaces`, `motion`, `focusedCaret`, `framePageSurfaces`; complete result in the linked contract.

[Options and constraints](capabilities/dsagent.page.action.md) · [Lossless contract](contracts/dsagent.page.action.json)

### dsagent.page.actions

Act on browser page targets in sequence. Gateway: `dsagent_invoke`; risk: `external-effect`; concurrency: `exclusive-target`.

```json
{"method":"dsagent.page.actions","args":{"pageContextId":"<pageContextId>","expectedRevision":"<expectedRevision>","actions":[{"targetId":"<targetId>","action":"click"}]},"idempotencyKey":"<fresh-key>"}
```

Result preview: `pageContextId`, `previousRevision`, `revision`, `executed`; complete result in the linked contract.

[Options and constraints](capabilities/dsagent.page.actions.md) · [Lossless contract](contracts/dsagent.page.actions.json)

### dsagent.page.wait

Wait for a page condition. Gateway: `dsagent_read`; risk: `read-sensitive`; concurrency: `shared-read`.

```json
{"method":"dsagent.page.wait","args":{"pageContextId":"<pageContextId>","until":"revision-changed"}}
```

Result preview: `pageContextId`, `until`, `outcome`, `waitedMs`; complete result in the linked contract.

[Options and constraints](capabilities/dsagent.page.wait.md) · [Lossless contract](contracts/dsagent.page.wait.json)

### dsagent.agent.work.finish

Finish my browser task. Gateway: `dsagent_invoke`; risk: `reversible-write`; concurrency: `exclusive-target`.

```json
{"method":"dsagent.agent.work.finish","args":{"pageContextId":"<pageContextId>","status":"succeeded"},"idempotencyKey":"<fresh-key>"}
```

Result preview: `status`, `closedPages`, `keptPages`; complete result in the linked contract.

[Options and constraints](capabilities/dsagent.agent.work.finish.md) · [Lossless contract](contracts/dsagent.agent.work.finish.json)

### dsagent.page.close

Close a page opened for you. Gateway: `dsagent_invoke`; risk: `reversible-write`; concurrency: `exclusive-target`.

```json
{"method":"dsagent.page.close","args":{"pageContextId":"<pageContextId>"},"idempotencyKey":"<fresh-key>"}
```

Result preview: `pageContextId`, `closed`, `alreadyClosed`; complete result in the linked contract.

[Options and constraints](capabilities/dsagent.page.close.md) · [Lossless contract](contracts/dsagent.page.close.json)

## When the core is insufficient

Repeated records always use the [wizard](guidance/dsagent.wizard.md), including small lists. Do not build a read/scroll collection loop. [Page guidance](guidance/dsagent.page.md) covers forms, visual inspection, uploads and downloads. [Accounts](account-management.md), [saved workflows](wizard-mode.en.md), and the [full index](capability-index.md) retain the wider API.

Known methods use shipped references directly. An INVALID_REQUEST hint names the wrong field, what it accepts and corrected args: fix them and call once more; discover the exact live contract only when it names no field, or after CAPABILITY_UNAVAILABLE. Omit expectedGeneration. Discovery never authorizes resending an effect.

Caller bookkeeping: [guide](atomic-caller-state.md) and [optional helpers](../scripts/atomic-client-state.mjs). They do not select targets, dispatch or retry.
