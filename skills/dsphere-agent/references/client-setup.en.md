# DSphere Agent — client-neutral MCP setup

First complete detection, executable registration and readback in the selected platform guide. Use the configuration command’s returned `descriptor` as `mcpDescriptor`: its command must equal the absolute Skill executable now read back from the browser manifest. There is no browser-shipped or source-checkout fallback. Register this same executable for MCP:

```json
{
  "schemaVersion": 1,
  "name": "dsphere-agent",
  "transport": "stdio",
  "command": "<absolute selected MCP connector path>",
  "args": ["mcp", "serve", "--stdio"]
}
```

Use the current AI client's native MCP configuration API, settings page, or CLI. Do not rewrite the descriptor into an HTTP configuration. If the entry already matches, keep it and reconnect; do not delete a valid service.

## Codex CLI

Inspect first:

```sh
codex mcp get dsphere-agent
```

Add when absent:

```sh
codex mcp add dsphere-agent -- "<descriptor.command>" mcp serve --stdio
```

When the existing entry differs, remove only the client entry and add it again:

```sh
codex mcp remove dsphere-agent
codex mcp add dsphere-agent -- "<descriptor.command>" mcp serve --stdio
```

Then start a new task or reconnect MCP so the tool list refreshes.

## OpenCode and other clients

Use the client's own local stdio MCP configuration mechanism. Register:

- name: `dsphere-agent`
- command: the descriptor's absolute `command`
- args: the descriptor's exact `args`
- environment: none unless the client requires an explicit empty object

Inspect before replacing. Migrate one unambiguous legacy-named entry whose command is a `dsphere-native-agent` executable to the stable `dsphere-agent` name; if more than one entry may be DSphere, ask the user before removing anything. If the client has no local stdio MCP support, report that limitation instead of inventing another transport.

## After installation or update: request restart and wait

Prerequisite: this run executed platform detection and configuration, `--check` returned `registered`, the manifest was read back, and MCP configuration was verified. If missing, return to platform setup; do not jump to restart.

After first installation, a Skill update or Native Host rebinding meets those conditions, explicitly tell the user:

> Configuration is complete. Save your browser work, fully quit and reopen [selected browser name]; closing a tab is insufficient. Tell me when it has restarted so I can verify the connection and continue your task.

Wait for the user's restart confirmation. Do not retry browser tasks, poll offline status or close the browser automatically. An unchanged executable path or `unchanged` configuration does not upgrade an existing process. Report “configured, awaiting restart and connection verification”, not “ready”.

After confirmation, reconnect the client's MCP and perform the read-only verification below. Continue only when the selected browser is online and passes “Upgrade completion” below. If tools remain unavailable, ask the user to restart the AI client. If still offline, report “configuration verified, browser Extension not connected” and inspect actual browser/Extension state and launch errors. Do not repeatedly request restart, resubmit tasks or infer missing login.

## Verification

Multiple `dsphere-native-agent.exe` processes can be normal: each MCP client/session starts a separate `mcp serve --stdio` connector. Each browser profile launches one runtime that holds that profile's lock (each browser profile appears as a separate instance; pass `instanceId` when more than one is online); a competing runtime for the same profile receives `AGENT_ALREADY_RUNNING`. Inspect command arguments and parent processes before diagnosing duplicates; do not terminate connectors merely because their executable names match. A bare CLI debug runtime does not use this browser-runtime singleton lock.

Only call:

- `dsagent_get_runtime_status` (running build verification after setup/update)
- `dsagent_list_instances`
- `dsagent_list_capabilities` only for a needed exact `method` on the chosen online instance, with `limit:1`; routine setup does not need the whole catalog

Do not run `dsagent_invoke` or `dsagent_read` during connection setup verification.

## Upgrade completion

After install/update/rebinding, call `dsagent_get_runtime_status` through the client's **current MCP connection** and save its structured response. Never launch a fresh test Connector as proof that the current connection upgraded. If the tool is absent, reconnect MCP and restart the client if needed.

Confirm the intended browser's online instanceId with `dsagent_list_instances`, then run:

```sh
node "<Skill>/scripts/check-runtime-version.mjs" --status "<saved MCP response.json>" --instance-id "<selected instanceId>"
```

The script compares both running builds with the validated bundled manifest's `nativeVersion/sourceCommit/builtAt`, not the Skill version. Report upgrade complete only with `verified=true` and successful configuration readback. Connector mismatch requires MCP reconnection; runtime mismatch requires binding verification and a browser restart. Unsupported/unavailable, offline, ambiguous or missing evidence cannot pass. If Node is unavailable, compare the same fields exactly without skipping either side. Retain the old package and task; never kill processes or replay effects. Ordinary verified tasks need no repeated version check.
