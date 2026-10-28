# macOS 安装与排障

仅在 macOS 上使用本页。Native Agent 来自完整 Skill 包，Native Host manifest 也由它自行创建；首次使用不需要浏览器提供 manifest。首次使用、更新或离线恢复都必须执行下列 1–4 步。只有已确认在线、且本次未更新的日常任务才跳过初始化。

## 执行顺序

现在就执行检测、注册与回读，再配置 MCP；这些都是初始化的一部分，不推迟到用户重启之后。不把步骤交给用户手动完成，也不因工具存在就跳过。读取本文件不代表配置已经完成。

- 首次使用或 manifest 缺失：执行 1–4 步完成初始化。
- 更新或移动 Skill：即使路径相同、manifest 已匹配，也执行 1–4 步，再提示重启以替换旧进程。
- `EXTENSION_OFFLINE` 或实例为空：先执行 1–4 步，不能仅让用户重启或登录。空实例只证明没有在线扩展，不证明 Native Host 已配置正常。
- 任一步失败：报告实际错误和失败步骤；不要宣称配置完成，也不要把重启当作修复。

## 1. 自动检测浏览器

只支持 DSphere 浏览器（`/Applications/Dsphere.app`）。检测脚本只查找它，setup 也只配置它的用户目录；DuokaiBrowser、DsWorkspace 及其他 Chromium 浏览器不再配置，它们已有的配置保持不动。不让用户选择浏览器。DSphere 浏览器的配置有误时修复或报告该问题。

在 Skill 根目录执行：

```bash
bash scripts/detect-macos.sh
```

manifest 始终位于 `~/Library/Application Support/Dsphere/NativeMessagingHosts/com.dsworkspace.agent.json`。macOS 没有注册表：DSphere 浏览器从自身用户数据目录下的这个文件夹读取 Native Messaging host，文件写到这里即完成注册。检测脚本不查看 `Dsphere.app` 内部；不得读取、复制或修改已签名应用包中的任何内容，也不得绕过系统保护。

内置扩展 ID 为 `dkpedeeoceglnpignjhiblgfgofpmmik`，绝不要求用户提供，也不使用示例 ID 或通配符。现有授权不含该 ID 时报告问题，不扩大授权。

按结果处理：

- `browser-not-installed`：必须先安装 DSphere 浏览器，setup 才能继续。告诉用户这一点，并给出结果中 `downloadUrl` 的官方下载页（`https://work.dsphereai.com/download/index.html`）；如果找不到或打不开，官网 `websiteUrl`（`https://www.dsphereai.com/`）提供下载入口。主动提出帮用户在默认浏览器中打开该页面，仅在用户同意后打开（`open '<downloadUrl>'`）。不要自行下载或运行安装程序，不使用其他地址，也不推荐其他浏览器。请用户安装完成后告诉你，等待确认后重新执行本步骤并继续 setup。
- `registration-blocked`：现有用户 manifest 无效、是符号链接或未授权内置扩展（`user-registration-invalid`）。报告该问题；不删除、不覆盖、不扩大授权，也不要求升级浏览器。
- `manifest-ready`：继续下一步。`selectedCandidate.manifestSource` 为 `new` 表示尚无 manifest（第 3 步创建），为 `user-file` 表示已存在（第 3 步只更新其 `path`）。旧 `path` 为空或文件已丢失不代表无法配置，也不要执行旧程序。

只检查检测器规定的位置。字段细节按需读[诊断状态](diagnostic-schema.zh-CN.md)。

## 2. 验证 Skill 程序

用 `uname -m` 选择 `assets/native/macos-arm64/dsphere-native-agent`（Apple Silicon）或 `assets/native/macos-x64/dsphere-native-agent`（Intel）；Rosetta 环境用 `sysctl -in sysctl.proc_translated` 辅助判断，返回 1 表示转译。用 `shasum -a 256` 对照 `assets/native/manifest.json` 的对应大小与 SHA-256。

保持完整 Skill 在稳定目录。缺文件、版本或摘要不符时恢复可信同版本完整包；校验和用于检查损坏，不能代替发布源可信性。不要复制程序到浏览器目录或使用浏览器旧程序。

执行权限丢失时只对 Skill 程序恢复 `chmod 755`；不自动移除 quarantine，也不绕过 Gatekeeper。

## 3. 创建或更新用户级 manifest

用户请求安装、接入、连接或修复已经授权这项固定的用户级文件，不再单独询问确认。`SKILL_EXE` 是已核实的 Skill 程序绝对路径。不传 `--manifest`：命令始终选择上述 DSphere 用户目录，拒绝其他位置。

```bash
"$SKILL_EXE" integrations native-host install --check
"$SKILL_EXE" integrations native-host install
"$SKILL_EXE" integrations native-host install --check
```

manifest 不存在时，install 创建它：写入 `name`、`type: stdio`、`allowed_origins` 中的内置扩展，并将 `path` 指向 Skill 程序。已存在时只更新 `path`，保留其余全部字段。macOS 上不传 `--registry-root`。

第一条 `--check` 只读，返回 `registration-required` 或 `registered`；写入要求 `registered` 或 `unchanged`；最后一条 `--check` 必须返回 `registered`。回读返回的 `manifestPath` 的 JSON：必须是上述 DSphere 用户目录中的文件，且 `path` 等于 `nativeAgentPath`。其他非零退出（例如 `extension-origin-conflict`、文件无效或配置并发变化）时停止并保留原文件，不换到其他位置重试。

### Skill 程序无法写入 manifest 时

没有这个文件，浏览器永远无法启动 runtime，MCP Connector 也就无法工作，所以 manifest 必须写入。install 或其 `--check` 非零退出且错误包含 `write-blocked`（`user-manifest-write-blocked` 或 `browser-manifest-write-blocked`：权限拒绝、客户端沙箱、只读文件或只读卷）时，由你自己写入同样的文件。该回退只适用于这些错误；校验、Origin 与并发错误仍然停止 setup。

1. 将 `SKILL_EXE` 设为已核实的 Skill 程序后原样执行。它在文件不存在时创建带内置扩展的 manifest，已存在时只修改 `path`，并写入程序的物理路径：

```bash
SKILL_EXE="$(cd "$(dirname "$SKILL_EXE")" && pwd -P)/$(basename "$SKILL_EXE")"
HOST_DIR="$HOME/Library/Application Support/Dsphere/NativeMessagingHosts"
MANIFEST="$HOST_DIR/com.dsworkspace.agent.json"
mkdir -p "$HOST_DIR" && /usr/bin/osascript -l JavaScript -e 'ObjC.import("Foundation"); function run(a) { var s = $.NSString.stringWithContentsOfFileEncodingError(a[0], $.NSUTF8StringEncoding, null); var m = s ? JSON.parse(ObjC.unwrap(s)) : { name: "com.dsworkspace.agent", description: "DSphere Agent Native Agent", type: "stdio", allowed_origins: ["chrome-extension://dkpedeeoceglnpignjhiblgfgofpmmik/"] }; m.path = a[1]; return JSON.stringify(m, null, 2); }' -- "$MANIFEST" "$SKILL_EXE" > "$MANIFEST.tmp" && mv -f "$MANIFEST.tmp" "$MANIFEST"
```

2. 如果你自己的 shell 也被拒绝，按客户端正常流程申请在沙箱外执行同一条命令的授权。不得使用 `sudo`、关闭安全控制、移除 quarantine 或写到其他位置。客户端无法授权时，把这条命令作为一个可直接复制的代码块交给用户（`SKILL_EXE` 替换为真实绝对路径并用单引号包裹），请用户粘贴到“终端”执行，再执行 `cat "$HOME/Library/Application Support/Dsphere/NativeMessagingHosts/com.dsworkspace.agent.json"` 并把输出发回。不接受“已完成”作为验证。
3. 验证：`"$SKILL_EXE" integrations native-host install --check` 必须返回 `registered`。若该检查本身也被阻止，改为读取文件（你的 shell 或用户发回的 `cat` 输出），要求 `name` 为 `com.dsworkspace.agent`、`type` 为 `stdio`、`allowed_origins` 包含 `chrome-extension://dkpedeeoceglnpignjhiblgfgofpmmik/`，且 `path` 等于 `SKILL_EXE` 的物理路径。然后从 `"$SKILL_EXE" integrations descriptor --json` 取得 descriptor（其 command 必须等于 `SKILL_EXE`），进入第 4 步。

## 4. 配置客户端，然后提示重启并验连

使用返回的 descriptor，MCP command 必须等于 `nativeAgentPath`，args 为 `mcp serve --stdio`。接着读[通用 MCP 配置、重启提示与验连](client-setup.zh-CN.md)。仅使用当前客户端原生 MCP 设置，不注册第二个服务名，不替换为其他浏览器工具。

浏览器自行通过 Native Messaging 启动 runtime；不无参数启动第二个 runtime，不伪造握手。安装、更新或绑定完成后，必须按通用指引主动提示用户完全退出并重开所选浏览器，等待确认后再验连。只读查询实例为空时，先确认已经登录和 Extension 已加载，不直接断言登录缺失。

## 更新或迁移

Skill 路径或浏览器版本变化后重新检测、安装并验连；浏览器升级不会移动用户级 manifest。确认新组合可用前保留上一份 Skill。回滚时安装已验证的旧 Skill，不能恢复失效路径。需要获取新包时读[Skill 安装与更新](skill-install-update.zh-CN.md)。
