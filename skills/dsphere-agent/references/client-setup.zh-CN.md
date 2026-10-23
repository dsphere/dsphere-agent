# 客户端中立的 MCP 配置

先按当前平台安装说明完成检测、程序注册和回读。把配置命令返回的 `descriptor` 作为 `mcpDescriptor`，command 必须等于浏览器 manifest 回读得到的 Skill 程序绝对路径。不存在浏览器随包程序或未构建源码的回退路径。MCP 注册同一程序：

```json
{
  "schemaVersion": 1,
  "name": "dsphere-agent",
  "transport": "stdio",
  "command": "<所选 MCP Connector 的绝对路径>",
  "args": ["mcp", "serve", "--stdio"]
}
```

使用当前 AI 客户端原生的 MCP 配置 API、设置页面或 CLI。不得把 descriptor 改写成 HTTP 配置。已有配置完全一致时保留并重连，不删除有效服务。

## Codex CLI

先检查：

```sh
codex mcp get dsphere-agent
```

不存在时添加：

```sh
codex mcp add dsphere-agent -- "<descriptor.command>" mcp serve --stdio
```

已有配置与 descriptor 不一致时，只移除客户端配置再重新添加：

```sh
codex mcp remove dsphere-agent
codex mcp add dsphere-agent -- "<descriptor.command>" mcp serve --stdio
```

随后新建任务或重新连接 MCP，使工具列表刷新。

## OpenCode 与其他客户端

使用该客户端原生的本地 stdio MCP 配置机制，注册：

- name：`dsphere-agent`
- command：descriptor 的绝对 `command`
- args：descriptor 原样返回的 `args`
- environment：除非客户端要求显式空对象，否则不设置

替换前必须先检查。只有一个旧名称配置明确指向 `dsphere-native-agent` 时，才迁移为稳定名称 `dsphere-agent`；存在多个候选时，删除前必须让用户选择。如果客户端不支持本地 stdio MCP，应说明限制，不得虚构其他 transport。

## 安装或更新后：提示重启并等待

前置条件：本轮已执行平台检测、配置命令，`--check` 返回 `registered`，已回读 manifest，且 MCP 配置已核对。未满足时返回平台说明完成配置，不能跳到重启。

首次安装、更新 Skill 或重新绑定 Native Host 满足以上条件后，必须主动告诉用户：

> 配置已完成。请先保存浏览器中的工作，完全退出并重新打开【所选浏览器名称】，仅关闭标签页不算退出。重启后告诉我，我再检查连接并继续原任务。

等待用户确认已重启，期间不重试浏览器任务，不循环查询离线状态，也不自动关闭浏览器。即使程序路径相同或配置返回 `unchanged`，更新后的旧进程仍需重启；此时只能报告“配置完成，待重启验连”，不能说“已可用”。

确认重启后重连客户端 MCP，再执行下面的只读验连；选定浏览器在线且通过下方“升级完成判定”后才继续任务。工具仍未加载时，提示重启 AI 客户端。仍离线则报告“配置已核验，但浏览器扩展尚未连通”，检查实际浏览器/扩展状态和启动错误；不要重复要求重启、重复下发任务或断言用户未登录。

## 验连

多个 `dsphere-native-agent.exe` 进程可能正常：各 MCP 客户端/会话分别启动 `mcp serve --stdio` Connector。每个浏览器 profile 启动一个 runtime 并持有该 profile 的锁（Dsphere、DuokaiBrowser 与 DsWorkspace 各有一个，显示为不同实例；多于一个在线时传 `instanceId`），同一 profile 的竞争启动返回 `AGENT_ALREADY_RUNNING`。先查命令参数和父进程，不因程序同名就判定重复或终止 Connector。无参数 CLI 调试 runtime 不使用该浏览器 runtime 单实例锁。

只调用：

- `dsagent_get_runtime_status`（安装/更新后的运行版本验收）
- `dsagent_list_instances`
- 仅需具体契约时，对选定在线实例用精确 `method` 和 `limit:1` 调用 `dsagent_list_capabilities`；日常验连不读取完整目录

连接配置验证期间不得调用 `dsagent_invoke` 或 `dsagent_read`。

## 升级完成判定

安装、更新或重新绑定后，从**当前客户端实际连接的 MCP 服务**调用 `dsagent_get_runtime_status`，保存完整结构化返回。不要另启动新 Connector 自检来代替当前连接。工具缺失表示 Connector 过旧或工具列表未刷新，先重连 MCP，必要时重启客户端。

从 `dsagent_list_instances` 确认所选浏览器的在线 instanceId，然后运行：

```sh
node "<Skill目录>/scripts/check-runtime-version.mjs" --status "<保存的MCP返回.json>" --instance-id "<所选instanceId>"
```

脚本按已校验随包清单的 `nativeVersion/sourceCommit/builtAt` 比较 Connector 与该浏览器 runtime 的 `version/commit/buildDate`；Skill 版本不是 Native 版本。只有 `verified=true`、配置回读已通过，才报告升级完成。Connector 不匹配引导重连 MCP；runtime 不匹配先核查绑定再重启浏览器；unsupported、unavailable、离线、多候选或字段缺失均不算通过。Node 不可用时按相同字段精确比对，不跳过任何一侧。保留旧包及原任务，不自动终止进程、不重放任务。普通已验连任务无需重复版本检查。
