# Windows 安装与排障

仅在 Windows 上使用本页。Native Agent 来自完整 Skill 包；Windows 首次使用无需浏览器提供 manifest。首次使用、更新或离线恢复都必须执行下列 1–4 步。只有已确认在线、且本次未更新的日常任务才跳过初始化。

## 执行顺序

已知打包应用、沙箱或不同用户上下文时，在检测浏览器前直接进入外部人工完成流程。其他情况也只能使用已校验的包内安装器：install 和 `--check` 在访问 manifest/注册表前有界检查当前进程及祖先进程的包身份、受限 token，以及当前进程 SID 是否等于本桌面 shell 的用户 SID。打包桌面应用启动的中间进程即使自身没有包身份，也不能证明其注册对浏览器可见，仍须由外部用户完成（Codex 使用下文 Connect；其他客户端保留原流程）。桌面身份缺失或读取失败（包括无桌面的会话）必须拒绝。环境变量用户名与 Full Access 不构成身份依据。禁止改用 `reg add`、注册表 API、`configure`、Agent 启动的另一个 shell、HKLM/HKEY_USERS、冒用身份或关闭安全设置；旧包缺少这些检查时也适用。

现在就执行检测、注册与回读，再配置 MCP；这些都是初始化的一部分，不推迟到用户重启之后。先自动执行，只有客户端安全边界阻止注册表写入或回读时才进入下述人工完成流程；不因工具存在就跳过。读取本文件不代表配置已经完成。

- 首次使用或 manifest 缺失：执行 1–4 步完成初始化。
- 更新或移动 Skill：即使路径相同、manifest 已匹配，也执行 1–4 步，再提示重启以替换旧进程。
- `EXTENSION_OFFLINE` 或实例为空：先执行 1–4 步，不能仅让用户重启或登录。空实例只证明没有在线扩展，不证明 Native Host 已配置正常。
- 任一步失败：报告实际错误和失败步骤；权限或安全边界失败进入下述受控人工流程，其他错误停止。不要宣称配置完成，也不要把重启当作修复。

## 1. 自动检测浏览器

只支持 DSphere 浏览器（Dsphere）。检测脚本只查找它，setup 也只为它注册；DuokaiBrowser、DsWorkspace 及其他 Chromium 浏览器不再配置，它们已有的注册保持不动。不让用户选择浏览器。

在 Skill 根目录执行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\detect-windows.ps1
```

默认 manifest 是 `%LOCALAPPDATA%\dsphere\NativeMessagingHosts\com.dsworkspace.agent.json`。`registrationTargets` 描述 DSphere 浏览器及其是否安装；setup 只在 `installed=true` 时使用：

| 浏览器 | `Candidate.registryRoot` | Host 注册位置 |
|---|---|---|
| Dsphere | `Software\Dsphere` | `HKCU\Software\Dsphere\NativeMessagingHosts\com.dsworkspace.agent` |

优先读取 32 位 HKCU 视图，再读 64 位视图；保留已有受支持的用户 manifest。`Software\Chromium` 或其他浏览器键下的注册不代表 DSphere 浏览器已注册。install 和每次 `--check` 都必须显式传入目标注册根 `Software\Dsphere`，安装程序拒绝其他任何注册根。不搜索或写入浏览器版本目录，不修改 HKLM 或策略。

保留 `selectedCandidate.manifestPath`、`sourceManifestPath`，以及 `registrationTargets` 中每个已安装项。首次安装不需要来源文件；内置扩展 ID 为 `dkpedeeoceglnpignjhiblgfgofpmmik`，无需询问用户，不使用示例 ID 或通配符。已有配置不包含该 ID 时停止报告，不扩大权限。

按结果处理：

- `browser-not-installed`：必须先安装 DSphere 浏览器，setup 才能继续。告诉用户这一点，并给出结果中 `downloadUrl` 的官方下载页（`https://work.dsphereai.com/download/index.html`）；如果找不到或打不开，官网 `websiteUrl`（`https://www.dsphereai.com/`）提供下载入口。主动提出帮用户在默认浏览器中打开该页面，仅在用户同意后打开（`Start-Process '<downloadUrl>'`）。不要自行下载或运行安装程序，不使用其他地址，也不推荐其他浏览器。请用户安装完成后告诉你，等待确认后重新执行本步骤并继续 setup。
- `registration-blocked`：DSphere 浏览器的注册来源无效；报告 `user-registration-invalid` 等实际问题，不静默覆盖现有授权，也不要求升级浏览器。
- `manifest-ready`：保留 `selectedCandidate.manifestPath`，进入下一步。旧 `path` 为空或文件已丢失不代表无法配置，也不要执行旧程序。

只检查检测器规定的位置。字段细节按需读[诊断状态](diagnostic-schema.zh-CN.md)。

## 2. 验证 Skill 程序

按操作系统架构选择程序，不按进程位数：优先读取 `PROCESSOR_ARCHITEW6432`，否则读取 `PROCESSOR_ARCHITECTURE`；AMD64/x86/ARM64 分别对应 windows-x64/windows-x86/windows-arm64，选择 `assets/native/<platform>/dsphere-native-agent.exe`。环境变量仅用于选取文件，不是身份或权限证据；Connect 会通过 Windows API 独立确认原生架构。用 `Get-FileHash -Algorithm SHA256` 对照 `assets/native/manifest.json` 的对应大小与 SHA-256。

保持完整 Skill 在稳定目录。缺文件、版本或摘要不符时恢复可信同版本完整包；校验和用于检查损坏，不能代替发布源可信性。不要复制程序到浏览器目录或使用浏览器旧程序。

## 3. 安装或更新用户级 manifest 和 HKCU

只更新现有 manifest 的 `path`，保留其余字段；首次创建使用内置扩展 ID。用户请求安装、接入、连接或修复已经授权这项固定的用户级注册，不再询问是否创建。`manifestSource=new` 时立即执行不带 `--manifest` 的默认安装，由命令选择 `%LOCALAPPDATA%\dsphere\NativeMessagingHosts\com.dsworkspace.agent.json`。`$Detection` 是检测结果，`$Candidate = $Detection.selectedCandidate`，`$SkillExe` 为已验证的当前 Skill 程序：

```powershell
$Targets = @($Detection.registrationTargets | Where-Object { $_.installed })
if ($Targets.Count -eq 0) { throw 'Detection did not find an installed supported browser.' }
for ($Index = 0; $Index -lt $Targets.Count; $Index++) {
  $InstallArgs = @('integrations', 'native-host', 'install', '--registry-root', $Targets[$Index].registryRoot)
  if ($Candidate.manifestSource -ne 'new') { $InstallArgs += @('--manifest', $Candidate.manifestPath) }
  if ($Index -eq 0 -and $Candidate.manifestSource -ne 'new' -and $Candidate.sourceManifestPath -and
      $Candidate.sourceManifestPath -ine $Candidate.manifestPath) {
    $InstallArgs += @('--template', $Candidate.sourceManifestPath)
  }
  & $SkillExe @InstallArgs --check
  if ($LASTEXITCODE -ne 0) { throw "Registration preflight failed for $($Targets[$Index].brand)." }
  & $SkillExe @InstallArgs
  if ($LASTEXITCODE -ne 0) { throw "Registration failed for $($Targets[$Index].brand)." }
  & $SkillExe @InstallArgs --check
  if ($LASTEXITCODE -ne 0) { throw "Registration readback failed for $($Targets[$Index].brand)." }
}
```

预检返回 `registration-required` 或 `registered`；写入返回 `registered` 或 `unchanged`；每个目标最后的预检都必须返回 `registered`。所有已安装目标必须返回相同的 `manifestPath`、`nativeAgentPath` 与 descriptor。回读共享 manifest JSON，核对 `path` 等于 `nativeAgentPath` 后才进入第 4 步。

来源只读；用户目录与注册表为实际目标，绝不在浏览器目录持久化 `NativeMessagingHosts`。注册表写入失败时可能已保留有效用户 JSON，但初始化仍失败，应解决实际错误再运行 install，不能宣称成功或只要求重启。

### 受限客户端的人工完成流程

`registration-user-mismatch`、`registration-context-restricted`、`registration-context-unverified` 同样进入本流程，禁止在客户端内重试。桌面用户必须也是运行浏览器的账号；本流程不支持特意以另一用户运行的浏览器。

仅当自动安装或某次最后 `--check` 因当前客户端沙箱/权限限制而无法写入或读取一个或多个已安装浏览器的 HKCU 注册时使用。任一 install 或 `--check` 返回 `packaged-client-virtualized` 也进入本流程：当前客户端是 Windows 打包应用（MSIX，例如 Codex Desktop），其 AppData 与 HKCU 写入会被重定向到私有存储，浏览器看不到，因此在该客户端内既不能安装也不能回读；不要重试或改用其他写入方式。配置校验失败、manifest 冲突、Origin 不匹配或并发变化不是权限回退；报告后停止。

#### Windows/Codex：本地图形化兜底

仅 **Windows 10/11 桌面版的 Codex** 用随包 GUI 替换原 PowerShell 交接。正常自动安装和其他客户端保持原流程；不支持 Windows 7/8/8.1、Server，x86 仅支持 Windows 10。Connect 不是统一安装前置条件。

1. 公开安装指南第 2 步已安装完整 Skill。验证可信发布源及对应文件哈希后，用已验证 Native 程序执行 `integrations native-host prepare-connect`。命令不注册、不启动 GUI，通过系统原生架构选择、签名与哈希检查后返回 `connectorPath` 和有效期 30 分钟的 `request`。将完整 JSON 保存在包外临时 `prepared.json`，不手工改写或传入沙箱 manifest 路径。
2. 给用户返回的 **connector.exe 绝对本地路径**（支持时使用本地文件链接）和所在文件夹。请用户在文件资源管理器打开该文件夹，用浏览器所在 Windows 账号自行双击程序，点击“设置 / 修复”，再“复制结果”粘贴回当前对话。Agent 不启动程序，不要求找 PowerShell，不让用户重复下载。文件不可访问或缺失时先报告阻塞，恢复可信完整 Skill 到用户可访问位置后重新准备；不提供单个替代 exe，不要求关闭安全保护。
3. `HANDOFF_BUSY` 表示已有未过期交接：使用该对话保存的原请求继续，或等待过期；不删除其他尝试的请求。不支持的系统、签名失败、包不完整或请求无法写入时，停止提供可运行路径。旧版无 Connect 时保持其文档化支持流程，不假装文件存在；只有签名、外部启动和真实客户端验收通过的发布版才能推广 Connect。
4. 将用户复制的 JSON 保存为包外 `copied-result.json`，从已安装 Skill 执行 `node scripts/verify-connect-result.mjs <prepared.json> <copied-result.json>`，必须返回 `ok=true`、`configured-awaiting-client-verification`。过期 challenge、错误通道/哈希/路径、注册不完整、重复检查或错误均保持阻塞。口头“完成”不算证据；回执是有界配置证据，不是实时 MCP 已连接的密码学证明。
5. 使用校验后的 descriptor 继续第 4 步。必须验证当前 Codex MCP 重连、`dsagent_get_runtime_status`、目标在线 DSphere 实例和共享指南的 capability 检查。C4 允许待检查，GUI 的 C5 始终是“请在 Codex 中验证”，不得只凭回执宣称端到端成功。

#### 其他客户端与旧版支持：保留 PowerShell 流程

以下仅用于其他客户端或明确选用的旧版支持，不是 Windows/Codex Connect 的自动兜底。

1. 生成一个 16–64 字符、只含 `[A-Za-z0-9_-]` 的新 challenge。解析已验证 `$SkillExe` 与 `scripts\complete-windows-registration.ps1` 的绝对路径。完整 Skill 必须能被桌面用户访问，否则先在其普通 PowerShell 安装并验证完整发布包。禁止传入沙箱检测得到的 `-ManifestPath`、`-TemplatePath` 或 `-RegistryRoots`。helper 在外部用户上下文独立重新检测 DSphere 浏览器，并保留该上下文发现的现有 manifest/来源；不能采信沙箱路径或沙箱内的空浏览器列表。
2. 用下列模板生成一条可直接复制的命令。显示前替换所有尖括号值；PowerShell 单引号值中的 `'` 必须写成 `''`。绝不把占位符或环境变量留给用户：

```powershell
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File '<absolute-skill>\scripts\complete-windows-registration.ps1' -SkillExe '<absolute-skill-exe>' -Challenge '<fresh-challenge>'
```

3. 引导用户在运行所选浏览器的同一 Windows 账号下，从 Windows 开始菜单打开普通 PowerShell，原样粘贴命令，只返回最后一行 JSON 或最终错误。不得由 Agent 启动此窗口。不要让用户用注册表编辑器手工构造值、关闭安全设置或以管理员身份运行；HKCU 通常无需提权。用户只回复“完成”不能作为验证。
4. 仅当回执满足以下条件才接受：`verification=passed`、`status=registered`、`challenge` 与本次值相同，且 `registrations` 与回执 `detectedTargets` 外部扫描中的已安装品牌完全一致——每个 root 恰好一项且 `status=registered`，品牌/root 必须符合上表。`manifestPath` 必须等于外部扫描的 `expectedManifestPath`，不能与沙箱路径比较；`nativeAgentPath`、manifest `path` 证据和 `descriptor.command` 都必须等于已验证 Skill 程序，descriptor args 严格为 `mcp`、`serve`、`--stdio`。品牌缺失/多余、root 重复、字段缺失、值不符或 helper 报错仍视为阻塞。旧 helper 缺少外部扫描证据时，要求用户同时返回普通 PowerShell 的 detector 输出。只有有效回执才进入第 4 步，仍须验证实际浏览器/runtime 连接。

## 4. 配置客户端，然后提示重启并验连

使用本次扫描得到的已安装目标，它必须有已验证的注册项。不得为其他浏览器创建注册项，修复时也不要删除它们已有的注册或现有 Chromium 注册。新建 manifest 时只省略 `--manifest`，仍必须为每个目标传入 `--registry-root`。

使用返回的 descriptor，MCP command 必须等于 `nativeAgentPath`，args 为 `mcp serve --stdio`。接着读[通用 MCP 配置、重启提示与验连](client-setup.zh-CN.md)。仅使用当前客户端原生 MCP 设置，不注册第二个服务名，不替换为其他浏览器工具。

浏览器自行通过 Native Messaging 启动 runtime；不无参数启动第二个 runtime，不伪造握手。安装、更新或绑定完成后，必须按通用指引主动提示用户完全退出并重开所选浏览器，等待确认后再验连。只读查询实例为空时，先确认已经登录和 Extension 已加载，不直接断言登录缺失。

## 更新或迁移

浏览器报告 `Can't find manifest` 时，先核对选定品牌的注册根及 manifest，不据此断言浏览器不支持注册表，也不把文件移入浏览器安装目录。空实例可能意味着 browser runtime 尚未启动，并不证明 bridge 握手被拒绝。注册表回读或直接启动程序不能代替真实浏览器发现验连。

Skill 路径或浏览器版本变化后重新检测、绑定并验连；确认新组合可用前保留上一份 Skill。回滚重新绑定已验证的旧 Skill，不能恢复失效路径。需要获取新包时读[Skill 安装与更新](skill-install-update.zh-CN.md)。
