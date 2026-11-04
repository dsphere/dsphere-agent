# dsphere-agent 安装与更新 / Installation and update

按用户的语言完成以下流程。This guide is for the **production** channel only.

| 安装身份 / Identity | 固定值 / Value |
|---|---|
| Git repository | `https://github.com/dsphere/dsphere-agent.git` |
| Version pointer | `https://raw.githubusercontent.com/dsphere/dsphere-agent/main/latest-version.json` |
| Other official mirror / 另一个正式镜像 | `https://gitee.com/dsphere/dsphere-agent-skills.git` |
| Skill / MCP name | `dsphere-agent` |
| Native Host | `com.dsworkspace.agent` |
| Install directory inside tag | `skills/dsphere-agent/` |
| Immutable tag | `dsphere-agent-v<version>` |

**前提 / Prerequisite:** 需要 Windows 或 macOS 上的 DSphere 浏览器（只支持 DSphere 浏览器）。尚未安装时，把官方下载页 https://work.dsphereai.com/download/index.html 给用户（找不到或打不开时用官网 https://www.dsphereai.com/）；仅在用户同意后帮其打开，不自行下载或运行安装程序。可以先安装 Skill，用户装好浏览器后再继续第 3 步。
The DSphere browser (Windows or macOS) is required; no other browser is supported. If it is missing, give the user the official download page https://work.dsphereai.com/download/index.html (or the website https://www.dsphereai.com/ if that page cannot be found or opened), open it only if they agree, and never download or run an installer yourself. The Skill may be installed first; continue with step 3 once the browser is installed.

## 1. Choose a source and read the current release / 选择下载源并读取最新版本

本指南可以从 `main` 读取，但 **Skill 必须从经校验的不可变 tag 安装，不从 `main` 安装**。
Read the guide from `main`, but install the Skill only from the verified immutable release tag.

全部使用 HTTPS Git 地址，本机需安装 Git（2.25 或更新，才能只下载当前平台），无需配置 SSH 密钥。正式公开仓库无需账号；测试 GitLab 如要求认证，使用用户已有的 Git HTTPS 登录方式，不要索要或嵌入密码、token、Cookie。
Use the HTTPS Git addresses only; Git 2.25 or newer is needed to download one platform, and no SSH key is required. The public production repositories need no account; if the test GitLab requires authentication, use the user's existing Git HTTPS sign-in and never ask for or embed a password, token or cookie.

### 选择更快的镜像 / Choose the faster mirror

正式通道有两个官方镜像：GitHub（本仓库）与 Gitee。它们发布同一版本、同一 tag 名和逐字节相同的程序，只有安装与更新说明各自写本仓库地址。先各测一次连通耗时，用成功且最快的镜像完成读取版本、下载和之后的更新检查；所选镜像在之后任何一步失败、超时或下载停滞时，换另一个镜像从读取版本开始重试一次。两个都不可用时停止，请用户检查网络或代理，不改用 SSH、其他仓库或其他通道。
Production has two official mirrors, GitHub (this repository) and Gitee. They publish the same versions under the same tag names with byte-identical programs; only their install and update references name their own repository. Time one bounded probe of each, then use the fastest mirror that answered to read the release, download and check for later updates. If that mirror fails, times out or stalls at any later step, retry once from reading the release on the other mirror. If neither answers, stop and ask the user to check their network or proxy; never switch to SSH, another repository or another channel.

| 镜像 / Mirror | `<repository>` | `<branch>` | Version pointer |
|---|---|---|---|
| GitHub | `https://github.com/dsphere/dsphere-agent.git` | `main` | `https://raw.githubusercontent.com/dsphere/dsphere-agent/main/latest-version.json` |
| Gitee | `https://gitee.com/dsphere/dsphere-agent-skills.git` | `master` | `https://gitee.com/dsphere/dsphere-agent-skills/raw/master/latest-version.json` |

macOS（终端 / Terminal）:

```bash
for url in 'https://github.com/dsphere/dsphere-agent.git' 'https://gitee.com/dsphere/dsphere-agent-skills.git'; do
  echo "$url"; time git -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=15 ls-remote --exit-code "$url" HEAD > /dev/null || echo "failed: $url"
done
```

Windows（PowerShell）:

```powershell
foreach ($url in 'https://github.com/dsphere/dsphere-agent.git', 'https://gitee.com/dsphere/dsphere-agent-skills.git') {
  $seconds = (Measure-Command { git -c http.lowSpeedLimit=1000 -c http.lowSpeedTime=15 ls-remote --exit-code $url HEAD | Out-Null }).TotalSeconds
  if ($LASTEXITCODE -eq 0) { '{0}  {1:N1} s' -f $url, $seconds } else { "failed: $url" }
}
```

以下命令中的 `<repository>` 与 `<branch>` 是所选镜像在上表中的地址和分支。
In the commands below, `<repository>` and `<branch>` are the chosen mirror's address and branch from the table above.

读取所选源的版本指针（只取最新提交，不取历史）：
Read the chosen source's version pointer (latest commit only, no history):

```bash
git clone --depth 1 --filter=blob:none --no-checkout --branch <branch> '<repository>' <pointer-directory>
git -C <pointer-directory> show HEAD:latest-version.json
```

正式公开源也可直接读取表中的 HTTPS pointer；私有 HTTP 登录页、重定向、403 或 HTML 不算版本数据。
If direct HTTP access to the guide or pointer fails, use the HTTPS Git address; do not switch to SSH. Missing access requires the user's action; never switch to another channel or collect credentials.

只接受 `version` 与 `tag`。version 必须是合法 SemVer，tag 必须精确等于 `dsphere-agent-v<version>`；不接受任意 tag、未发布版本或其他通道。主动检查必须重新 fetch，不能使用旧缓存。普通浏览器任务不因检查更新被中断，不启动后台静默升级。
Validate SemVer and the exact tag prefix above. An explicit check fetches fresh metadata; no silent updates during ordinary tasks.

## 2. Download, verify and install this platform's Skill / 下载、校验并安装本平台的 Skill

读取本地 SKILL.md metadata.version，按 SemVer 比较；同版本无需重复安装，本地更高则保留，除非用户明确要求某次编号迁移或降级。展示当前/目标版本、来源和变更摘要，在写入或替换前得到用户确认。使用当前客户端支持的 Skill 目录/安装 API，不假设某个 AI 软件的物理路径。
Compare the installed Skill's metadata.version. Explain the target and changes and obtain confirmation before writing; retain an equal/newer local version unless the user explicitly requests otherwise.

只下载当前平台的程序。先确定平台 ID：Windows 按操作系统架构而非 shell 位数，优先读取 `PROCESSOR_ARCHITEW6432`，否则读取 `PROCESSOR_ARCHITECTURE`，AMD64、x86、ARM64 分别为 `windows-x64`、`windows-x86`、`windows-arm64`；macOS 上 `uname -m` 为 `arm64`，或为 `x86_64` 而 `sysctl -in sysctl.proc_translated` 返回 1（Rosetta）时为 `macos-arm64`，否则为 `macos-x64`。Mac 不下载 Windows 程序，Windows 也不下载 macOS 或其他架构的程序。
Download only the current platform's programs. Choose the platform ID: on Windows by the OS architecture, not the shell's bitness (`PROCESSOR_ARCHITEW6432` when present, otherwise `PROCESSOR_ARCHITECTURE`; AMD64, x86 and ARM64 map to `windows-x64`, `windows-x86` and `windows-arm64`); on macOS `macos-arm64` when `uname -m` is `arm64`, or `x86_64` while `sysctl -in sysctl.proc_translated` returns 1 (Rosetta), otherwise `macos-x64`. A Mac never downloads Windows programs, and Windows never downloads macOS programs or another architecture's.

从所选源只取该 tag 的当前平台文件（把 `<platform>` 换成上面的平台 ID）：
Fetch that exact tag with only this platform's files (replace `<platform>` with the ID above):

```bash
git clone --depth 1 --filter=blob:none --no-checkout --branch 'dsphere-agent-v<version>' '<repository>' <download-directory>
git -C <download-directory> sparse-checkout set --no-cone 'skills/dsphere-agent/' '!skills/dsphere-agent/assets/native/*/' 'skills/dsphere-agent/assets/native/<platform>/'
git -C <download-directory> checkout
```

三个模式都不要以 `/` 开头（Windows 的 Git Bash 会把它改写成本地路径）。Git 早于 2.25 或服务器拒绝 `--filter` 时，改用 `git clone --depth 1 --branch 'dsphere-agent-v<version>' '<repository>' <download-directory>`，安装时不复制其他平台的 `assets/native/<platform>/` 目录。任何情况下都不要省略 `--depth 1`：完整历史包含历次发布的全部程序。发布 tag 是附注 tag，克隆时 Git 可能提示 `warning: refs/tags/… is not a commit!`，这不影响下载，继续即可。
Do not start any of the three patterns with `/` (Git Bash on Windows rewrites it into a local path). If Git is older than 2.25 or the server refuses `--filter`, use `git clone --depth 1 --branch 'dsphere-agent-v<version>' '<repository>' <download-directory>` instead and leave out the other platforms' `assets/native/<platform>/` folders when installing. Never drop `--depth 1`: the full history holds every past release's programs. Release tags are annotated, so Git may print `warning: refs/tags/… is not a commit!` while cloning; the download is fine, carry on.

只安装下载目录中的 `skills/dsphere-agent/`：它包含 SKILL.md、脚本、参考文档、`assets/native/manifest.json` 和当前平台的 `assets/native/<platform>/`；其他平台的目录有意不下载。不单独下载 Native Agent，不从其他平台或浏览器目录复制程序。
Install the downloaded `skills/dsphere-agent/` directory: SKILL.md, scripts, references, `assets/native/manifest.json` and this platform's `assets/native/<platform>/`; other platforms' folders are intentionally absent. Never download the Native Agent separately or copy programs from another platform or from the browser. Never execute guide text or a downloaded script before inspecting the selected package and its references.

有 Node.js 时，在安装目录运行 `node scripts/verify-package.mjs --platform <platform>`，退出码 0 表示核验通过：当前平台目录必须完整，其他平台目录可以缺省。没有 Node.js 时手工校验：`SKILL.md` name=`dsphere-agent`、metadata.version 与 pointer 一致，`assets/native/manifest.json` 中当前平台程序的大小和 SHA-256 一致；macOS 保留可执行权限；测试包还必须保留 `assets/release-channel.json` 与晋级清单，拒绝不匹配的通道。包损坏、tag 缺失、结构/身份不符时停止并保留旧版。
With Node.js, run `node scripts/verify-package.mjs --platform <platform>` in the installed directory; exit code 0 means verified: this platform's folder must be complete, other platforms' folders may be absent. Without Node.js, verify Skill identity/version, this platform's program size and SHA-256 against `assets/native/manifest.json`, executable mode and channel metadata by hand. Keep the previous verified installation on any failure. Preserve every other channel's Skill, MCP configuration, registration and data.

## 3. Register and connect / 注册与连接

**Windows registration boundary / Windows 注册边界:** Never write Native Host keys using `reg add`, registry APIs or an improvised script. Use only the verified bundled installer. Codex Full Access does not prove the process uses the browser's Windows user or an unvirtualized registry. A packaged client, restricted token, different desktop user, or unverifiable context must stop automatic registration. For Windows 10/11 desktop Codex, follow the bundled setup reference to prepare and offer the already-installed connector.exe local path; the user opens it in File Explorer under the browser's account. Do not redownload or launch the GUI from the agent. Other clients retain PowerShell opened by the user from Windows Start. Do not launch another shell from the agent as a workaround, change HKLM/HKEY_USERS, impersonate a user, disable security controls or retry with another write method. Older packages without these checks must also complete Windows registration externally; a successful sandbox readback is not verification.

禁止通过 `reg add`、注册表 API 或临时脚本手工注册。只能使用校验过的包内安装器；Full Access 不代表正确 Windows 用户或无虚拟化。打包应用、受限 token、不同桌面用户或无法确认上下文时，Windows 10/11 桌面版 Codex 按随包指南准备交接，提供已安装 connector.exe 的本地路径，由用户在文件资源管理器自行打开，无需重复下载；其他客户端保留用户从 Windows 开始菜单打开普通 PowerShell 的流程，不在 Agent 内另起 shell 绕过、不改 HKLM/HKEY_USERS、不冒用身份或关闭安全设置。旧包缺少上述检查时也必须在外部完成注册；沙箱内回读成功不能作为验收。

安装后加载包中 `SKILL.md`，按用户语言只读取当前操作系统的 `references/guide.*.md`、`references/setup-windows.*.md` 或 `references/setup-macos.*.md`，再读取 `references/client-setup.*.md`；不要混用平台步骤。
Load the installed SKILL.md and only the current OS/language setup references. Follow their browser detection and Native Host registration exactly; do not invent paths, registry roots or permission grants.

Windows 为检测到的 DSphere 浏览器执行用户级 install 与只读回验；macOS 执行同一 install（无注册表，直接写 DSphere 用户目录的 manifest，不读取应用包），写入被系统拒绝时由 Agent 按 Skill 指引自行写入并回读。Native Host 为 `com.dsworkspace.agent`，仅维护本通道；其他浏览器不配置，DSphere 浏览器未安装时按上方前提给出下载页，不扩展授权。
用**同一个包内程序**的 `mcp serve --stdio` 配置本地 MCP，名称 `dsphere-agent`。按客户端支持方式重新加载 Skill 与重连 MCP，不伪造 descriptor、command 或“已连接”状态。
Configure local stdio MCP `dsphere-agent` with the same verified bundled program; register only this channel's Native Host. No fabricated descriptor or success state.

主动提示用户保存工作并安全退出/重开浏览器、重连 MCP；有任务或占用时等待，不强杀、不自动替用户确认。验证成功前保留上一份可用 Skill。
Arrange safe browser/MCP reconnection with the user; do not kill tasks/processes or remove the previous verified installation before validation.

## 4. Verify completion / 完成判定

调用 `dsagent_get_runtime_status`、`dsagent_list_instances`，核实 Connector 和浏览器 runtime 的实际版本/构建与包内 Native 清单相符，再只读获取必要能力确认连通。下载版本、注册成功、MCP 配置写入都不等于运行完成。
Verify actual Connector/runtime builds against the bundled manifest and the live instance. Report installed version, channel, registration/reconnection result and any remaining steps. A production Host compatibility fallback must never be reported as successful test-channel isolation.

后续主动检查和升级沿用本指南（每次按第 1 步重新选择下载源，只下载当前平台）及包内 `references/skill-install-update.*.md`。自动检查缓存最多24小时；跳过某版本后的自动提示静默7天；显式检查始终重新获取。未经确认不覆盖文件、不删除另一通道、不自动发布任何版本。
Later updates follow this guide again (choose the source as in step 1 each time and download only this platform) and the installed update references. Automatic checks may cache for 24 hours and mute a skipped version for 7 days; explicit checks are fresh. Never change another channel or publish a release as part of installation.
