# macOS 安装与排障

仅在 macOS 上使用本页。浏览器提供现有 Native Host manifest；Native Agent 来自完整 Skill 包。首次使用、更新或离线恢复都必须执行下列 1–4 步。只有已确认在线、且本次未更新的日常任务才跳过初始化。

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

优先读取 `~/Library/Application Support/Dsphere/NativeMessagingHosts/com.dsworkspace.agent.json`；仅当它不存在时，读取当前 `.app` 版本内的嵌套、直接 manifest 作为创建来源，写入目标始终是用户级目录。用户级文件存在但无效时报告错误，不改用包内配置。不得修改签名包或绕过系统保护。

按结果处理：

- `browser-not-installed`：必须先安装 DSphere 浏览器，setup 才能继续。告诉用户这一点，并给出结果中 `downloadUrl` 的官方下载页（`https://work.dsphereai.com/download/index.html`）；如果找不到或打不开，官网 `websiteUrl`（`https://www.dsphereai.com/`）提供下载入口。主动提出帮用户在默认浏览器中打开该页面，仅在用户同意后打开（`open '<downloadUrl>'`）。不要自行下载或运行安装程序，不使用其他地址，也不推荐其他浏览器。请用户安装完成后告诉你，等待确认后重新执行本步骤并继续 setup。
- `upgrade-required`：说明候选的 `issue`，由浏览器部署方恢复有效配置；缺少有效来源时不猜测扩展授权。
- `manifest-ready`：保留 `selectedCandidate.brand` 和 `selectedCandidate.manifestPath`，进入下一步。旧 `path` 为空或文件已丢失不代表无法配置，也不要执行旧程序。

只检查检测器规定的位置。字段细节按需读[诊断状态](diagnostic-schema.zh-CN.md)。

## 2. 验证 Skill 程序

用 `uname -m` 选择 `assets/native/macos-arm64/dsphere-native-agent`（Apple Silicon）或 `assets/native/macos-x64/dsphere-native-agent`（Intel）；Rosetta 环境用 `sysctl -in sysctl.proc_translated` 辅助判断，返回 1 表示转译。用 `shasum -a 256` 对照 `assets/native/manifest.json` 的对应大小与 SHA-256。

保持完整 Skill 在稳定目录。缺文件、版本或摘要不符时恢复可信同版本完整包；校验和用于检查损坏，不能代替发布源可信性。不要复制程序到浏览器目录或使用浏览器旧程序。

执行权限丢失时只对 Skill 程序恢复 `chmod 755`；不自动移除 quarantine，也不绕过 Gatekeeper。

## 3. 创建或更新用户级 manifest

`BROWSER_BRAND` 使用选定品牌（始终为 `Dsphere`，程序拒绝其他品牌），`BROWSER_MANIFEST` 使用检测返回的路径，`SKILL_EXE` 是已核实的 Skill 程序绝对路径。以下命令始终写用户级 `NativeMessagingHosts/com.dsworkspace.agent.json`：已有文件只更新 `path`；文件不存在时，从来源复制 name、type、allowed_origins 和其他字段，再将 `path` 指向 Skill 程序。应用包仅作读取来源，不修改。

```bash
"$SKILL_EXE" integrations native-host configure --manifest "$BROWSER_MANIFEST" --user-brand "$BROWSER_BRAND" --check
"$SKILL_EXE" integrations native-host configure --manifest "$BROWSER_MANIFEST" --user-brand "$BROWSER_BRAND"
```

第一条只读检查，第二条在已获安装/升级授权范围内写入。检查为 `registered` 时已匹配，无需重复写入；`registration-required` 表示需要配置。写入要求 `registered` 或 `unchanged`，回读返回的 `manifestPath` 必须位于选定品牌的用户目录，且 `path` 等于 `nativeAgentPath`；非零退出、权限拒绝或配置并发变化时停止并保留原配置，不换到另一份文件重试。

成功后再执行一次同参数 `--check`，要求 `status=registered`；回读 `manifestPath` 的 JSON，核对 `path` 指向当前 Skill 程序。只有获得这两个结果后才进入第 4 步。

## 4. 配置客户端，然后提示重启并验连

使用返回的 descriptor，MCP command 必须等于 `nativeAgentPath`，args 为 `mcp serve --stdio`。接着读[通用 MCP 配置、重启提示与验连](client-setup.zh-CN.md)。仅使用当前客户端原生 MCP 设置，不注册第二个服务名，不替换为其他浏览器工具。

浏览器自行通过 Native Messaging 启动 runtime；不无参数启动第二个 runtime，不伪造握手。安装、更新或绑定完成后，必须按通用指引主动提示用户完全退出并重开所选浏览器，等待确认后再验连。只读查询实例为空时，先确认已经登录和 Extension 已加载，不直接断言登录缺失。

## 更新或迁移

Skill 路径或浏览器版本变化后重新检测、绑定并验连；确认新组合可用前保留上一份 Skill。回滚重新绑定已验证的旧 Skill，不能恢复失效路径。需要获取新包时读[Skill 安装与更新](skill-install-update.zh-CN.md)。
