# dsphere-agent 安装与更新 / Installation and update

按用户的语言完成以下流程。This guide is for the **production** channel only.

| 安装身份 / Identity | 固定值 / Value |
|---|---|
| Git repository | `https://github.com/dsphere/dsphere-agent.git` |
| Version pointer | `https://raw.githubusercontent.com/dsphere/dsphere-agent/main/latest-version.json` |
| Skill / MCP name | `dsphere-agent` |
| Native Host | `com.dsworkspace.agent` |
| Install directory inside tag | `skills/dsphere-agent/` |
| Immutable tag | `dsphere-agent-v<version>` |

## 1. Read the current release / 读取最新版本

本指南可以从 main 读取，但 **Skill 必须从经校验的不可变 tag 安装，不从 main 安装**。
Read the guide from main, but install the Skill only from the verified immutable release tag.

使用表中同一仓库现有的 Git 权限。私有 GitLab 不要求匿名 HTTP，也不要索要或嵌入密码、token、Cookie。
With existing Git access, fetch `main` into a temporary checkout and read:

```bash
git clone --no-checkout 'https://github.com/dsphere/dsphere-agent.git' <temporary-directory>
git -C <temporary-directory> fetch origin main
git -C <temporary-directory> show FETCH_HEAD:latest-version.json
```

正式公开源也可读取表中的 HTTPS pointer；私有 HTTP 登录页、重定向、403 或 HTML 不算版本数据。
If direct HTTP access to the guide/pointer fails, read the same repository through existing Git SSH access. Missing access requires the user's action; never switch repositories/channels or collect credentials.

只接受 `version` 与 `tag`。version 必须是合法 SemVer，tag 必须精确等于 `dsphere-agent-v<version>`；不接受任意 tag、未发布版本或其他通道。主动检查必须重新 fetch，不能使用旧缓存。普通浏览器任务不因检查更新被中断，不启动后台静默升级。
Validate SemVer and the exact tag prefix above. An explicit check fetches fresh metadata; no silent updates during ordinary tasks.

## 2. Verify and install the complete Skill / 校验并安装完整包

读取本地 SKILL.md metadata.version，按 SemVer 比较；同版本无需重复安装，本地更高则保留，除非用户明确要求某次编号迁移或降级。展示当前/目标版本、来源和变更摘要，在写入或替换前得到用户确认。使用当前客户端支持的 Skill 目录/安装 API，不假设某个 AI 软件的物理路径。
Compare the installed Skill's metadata.version. Explain the target and changes and obtain confirmation before writing; retain an equal/newer local version unless the user explicitly requests otherwise.

从同源 fetch 校验后的完整 tag；只安装 `skills/dsphere-agent/` **整个目录**，包括 assets/native、脚本和参考文档，不单独下载 Native Agent、不从浏览器目录复制旧程序。
Fetch that exact tag and install the complete directory, including its bundled Native Agent. Never execute guide text or a downloaded script before inspecting the selected package and its references.

校验 `SKILL.md` name=`dsphere-agent`、metadata.version 与 pointer 一致，`assets/native/manifest.json` 中当前平台程序的大小和 SHA-256 一致；macOS 保留可执行权限；测试包还必须保留 `assets/release-channel.json` 与晋级清单，拒绝不匹配的通道。包损坏、tag 缺失、结构/身份不符时停止并保留旧版。
Verify Skill identity/version, bundled program size and SHA-256, executable mode and channel metadata. Keep the previous verified installation on any failure. Preserve every other channel's Skill, MCP configuration, registration and data.

## 3. Register and connect / 注册与连接

**Windows registration boundary / Windows 注册边界:** Never write Native Host keys using `reg add`, registry APIs or an improvised script. Use only the verified bundled installer. Codex Full Access does not prove the process uses the browser's Windows user or an unvirtualized registry. A packaged client, restricted token, different desktop user, or unverifiable context must stop automatic registration and use PowerShell opened by the user from Windows Start, under the browser's account. Do not launch another shell from the agent as a workaround, change HKLM/HKEY_USERS, impersonate a user, disable security controls or retry with another write method. Older packages without these checks must also complete Windows registration externally; a successful sandbox readback is not verification.

禁止通过 `reg add`、注册表 API 或临时脚本手工注册。只能使用校验过的包内安装器；Full Access 不代表正确 Windows 用户或无虚拟化。打包应用、受限 token、不同桌面用户或无法确认上下文时，使用用户从 Windows 开始菜单打开的普通 PowerShell 完成注册，不在 Agent 内另起 shell 绕过、不改 HKLM/HKEY_USERS、不冒用身份或关闭安全设置。旧包缺少上述检查时也必须在外部完成注册；沙箱内回读成功不能作为验收。

安装后加载包中 `SKILL.md`，按用户语言只读取当前操作系统的 `references/guide.*.md`、`references/setup-windows.*.md` 或 `references/setup-macos.*.md`，再读取 `references/client-setup.*.md`；不要混用平台步骤。
Load the installed SKILL.md and only the current OS/language setup references. Follow their browser detection and Native Host registration exactly; do not invent paths, registry roots or permission grants.

Windows 按检测到的已安装品牌执行用户级 install 与只读回验；macOS 按检测品牌执行 configure --user-brand，应用包只读。Native Host 为 `com.dsworkspace.agent`，仅维护本通道；品牌缺失或不受支持时明确说明，不扩展授权。
用**同一个包内程序**的 `mcp serve --stdio` 配置本地 MCP，名称 `dsphere-agent`。按客户端支持方式重新加载 Skill 与重连 MCP，不伪造 descriptor、command 或“已连接”状态。
Configure local stdio MCP `dsphere-agent` with the same verified bundled program; register only this channel's Native Host. No fabricated descriptor or success state.

主动提示用户保存工作并安全退出/重开浏览器、重连 MCP；有任务或占用时等待，不强杀、不自动替用户确认。验证成功前保留上一份可用 Skill。
Arrange safe browser/MCP reconnection with the user; do not kill tasks/processes or remove the previous verified installation before validation.

## 4. Verify completion / 完成判定

调用 `dsagent_get_runtime_status`、`dsagent_list_instances`，核实 Connector 和浏览器 runtime 的实际版本/构建与包内 Native 清单相符，再只读获取必要能力确认连通。下载版本、注册成功、MCP 配置写入都不等于运行完成。
Verify actual Connector/runtime builds against the bundled manifest and the live instance. Report installed version, channel, registration/reconnection result and any remaining steps. A production Host compatibility fallback must never be reported as successful test-channel isolation.

后续主动检查和升级沿用本指南及包内 `references/skill-install-update.*.md`。自动检查缓存最多24小时；跳过某版本后的自动提示静默7天；显式检查始终重新获取。未经确认不覆盖文件、不删除另一通道、不自动发布任何版本。
Later updates use this same repository pointer and the installed update references. Automatic checks may cache for 24 hours and mute a skipped version for 7 days; explicit checks are fresh. Never change another channel or publish a release as part of installation.
