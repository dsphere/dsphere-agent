# Windows 安装与排障

仅在 Windows 上使用本页。Native Agent 来自完整 Skill 包；Windows 首次使用无需浏览器提供 manifest。首次使用、更新或离线恢复都必须执行下列 1–4 步。只有已确认在线、且本次未更新的日常任务才跳过初始化。

## 执行顺序

现在就执行检测、注册与回读，再配置 MCP；这些都是初始化的一部分，不推迟到用户重启之后。先自动执行，只有客户端安全边界阻止注册表写入或回读时才进入下述人工完成流程；不因工具存在就跳过。读取本文件不代表配置已经完成。

- 首次使用或 manifest 缺失：执行 1–4 步完成初始化。
- 更新或移动 Skill：即使路径相同、manifest 已匹配，也执行 1–4 步，再提示重启以替换旧进程。
- `EXTENSION_OFFLINE` 或实例为空：先执行 1–4 步，不能仅让用户重启或登录。空实例只证明没有在线扩展，不证明 Native Host 已配置正常。
- 任一步失败：报告实际错误和失败步骤；权限或安全边界失败进入下述受控人工流程，其他错误停止。不要宣称配置完成，也不要把重启当作修复。

## 1. 自动检测浏览器

同时扫描 Dsphere、DuokaiBrowser 与 DsWorkspace，只为实际检测到浏览器程序已安装的品牌注册。每个已安装品牌都必须完成各自的注册；不得创建或修改未安装品牌的注册项。不让用户选择；默认任务目标按 Dsphere、DuokaiBrowser、DsWorkspace 的顺序取第一个已安装品牌，但每个已安装品牌的注册状态都要独立验证。

在 Skill 根目录执行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\detect-windows.ps1
```

默认 manifest 是 `%LOCALAPPDATA%\dsphere\NativeMessagingHosts\com.dsworkspace.agent.json`。`registrationTargets` 始终描述三个受支持品牌并标记各自是否安装；setup 只保留 `installed=true` 的目标：

| 浏览器 | `Candidate.registryRoot` | Host 注册位置 |
|---|---|---|
| Dsphere | `Software\Dsphere` | `HKCU\Software\Dsphere\NativeMessagingHosts\com.dsworkspace.agent` |
| DuokaiBrowser | `Software\DuokaiBrowser` | `HKCU\Software\DuokaiBrowser\NativeMessagingHosts\com.dsworkspace.agent` |
| DsWorkspace | `Software\DsWorkspace` | `HKCU\Software\DsWorkspace\NativeMessagingHosts\com.dsworkspace.agent` |

优先读取 32 位 HKCU 视图，再读 64 位视图；保留已有受支持的用户 manifest。`Software\Chromium` 中的注册不代表任何受支持品牌已注册。install 和每次 `--check` 都必须显式传入每个已安装目标的注册根，程序的历史默认值仍为 Chromium。仅已核实的定制版本使用 `-RegistryRoot` 覆盖检测。不搜索或写入浏览器版本目录，不修改 HKLM 或策略。

保留 `selectedCandidate.manifestPath`、`sourceManifestPath`，以及 `registrationTargets` 中每个已安装项。首次安装不需要来源文件；内置扩展 ID 为 `dkpedeeoceglnpignjhiblgfgofpmmik`，无需询问用户，不使用示例 ID 或通配符。已有配置不包含该 ID 时停止报告，不扩大权限。

按结果处理：

- `browser-not-installed`：通过组织正式渠道安装支持的浏览器，不虚构下载地址。
- `registration-blocked`：至少一个已安装品牌的注册来源无效；报告对应品牌与 `user-registration-invalid` 等实际问题，不静默覆盖现有授权，也不要求升级浏览器。
- `manifest-ready`：保留 `selectedCandidate.manifestPath`，进入下一步。旧 `path` 为空或文件已丢失不代表无法配置，也不要执行旧程序。

只检查检测器规定的位置。字段细节按需读[诊断状态](diagnostic-schema.zh-CN.md)。

## 2. 验证 Skill 程序

用 `[Environment]::Is64BitOperatingSystem` 选择 `assets/native/windows-x64/dsphere-native-agent.exe` 或 `assets/native/windows-x86/dsphere-native-agent.exe`，按系统位数而不是 PowerShell 位数。用 `Get-FileHash -Algorithm SHA256` 对照 `assets/native/manifest.json` 的对应大小与 SHA-256。

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

仅当自动安装或某次最后 `--check` 因当前客户端沙箱/权限限制而无法写入或读取一个或多个已安装浏览器的 HKCU 注册时使用。任一 install 或 `--check` 返回 `packaged-client-virtualized` 也进入本流程：当前客户端是 Windows 打包应用（MSIX，例如 Codex Desktop），其 AppData 与 HKCU 写入会被重定向到私有存储，浏览器看不到，因此在该客户端内既不能安装也不能回读；不要重试或改用其他写入方式。配置校验失败、manifest 冲突、Origin 不匹配或并发变化不是权限回退；报告后停止。

1. 生成一个 16–64 字符、只含 `[A-Za-z0-9_-]` 的新 challenge。解析已验证 `$SkillExe` 与 `scripts\complete-windows-registration.ps1` 的绝对路径。helper 会重新扫描三个品牌，并只注册执行时已安装的品牌。`manifestSource=new` 时省略 `-ManifestPath`；否则附加检测到的精确 `-ManifestPath`。只有自动流程已核实旧来源时才附加 `-TemplatePath`。
2. 用下列模板生成一条可直接复制的命令。显示前替换所有尖括号值；PowerShell 单引号值中的 `'` 必须写成 `''`。绝不把占位符或环境变量留给用户：

```powershell
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File '<absolute-skill>\scripts\complete-windows-registration.ps1' -SkillExe '<absolute-skill-exe>' -Challenge '<fresh-challenge>'
```

3. 引导用户在运行所选浏览器的同一 Windows 账号下打开普通 PowerShell，原样粘贴命令，只返回最后一行 JSON 或最终错误。不要让用户用注册表编辑器手工构造值、关闭安全设置或以管理员身份运行；HKCU 通常无需提权。用户只回复“完成”不能作为验证。
4. 仅当回执满足以下条件才接受：`verification=passed`、`status=registered`、`challenge` 与本次值相同，且 `registrations` 与本次重新扫描到的已安装品牌完全一致——每个 root 恰好一项且 `status=registered`。`manifestPath` 必须等于预期共享用户 manifest；`nativeAgentPath`、manifest `path` 证据和 `descriptor.command` 都必须等于已验证 Skill 程序，descriptor args 严格为 `mcp`、`serve`、`--stdio`。品牌缺失/多余、root 重复、字段缺失、值不符或 helper 报错仍视为阻塞。只有有效回执才进入第 4 步。

## 4. 配置客户端，然后提示重启并验连

使用本次扫描得到的已安装目标集合。所有品牌共享一个用户 manifest，但每个已安装品牌都必须有各自已验证的注册项。不得为未安装品牌创建注册项，不得把一个品牌注册成功当作另一个已完成，也不要在修复时删除现有 Chromium 注册。新建 manifest 时只省略 `--manifest`，仍必须为每个目标传入 `--registry-root`。

使用返回的 descriptor，MCP command 必须等于 `nativeAgentPath`，args 为 `mcp serve --stdio`。接着读[通用 MCP 配置、重启提示与验连](client-setup.zh-CN.md)。仅使用当前客户端原生 MCP 设置，不注册第二个服务名，不替换为其他浏览器工具。

浏览器自行通过 Native Messaging 启动 runtime；不无参数启动第二个 runtime，不伪造握手。安装、更新或绑定完成后，必须按通用指引主动提示用户完全退出并重开所选浏览器，等待确认后再验连。只读查询实例为空时，先确认已经登录和 Extension 已加载，不直接断言登录缺失。

## 更新或迁移

浏览器报告 `Can't find manifest` 时，先核对选定品牌的注册根及 manifest，不据此断言浏览器不支持注册表，也不把文件移入浏览器安装目录。空实例可能意味着 browser runtime 尚未启动，并不证明 bridge 握手被拒绝。注册表回读或直接启动程序不能代替真实浏览器发现验连。

Skill 路径或浏览器版本变化后重新检测、绑定并验连；确认新组合可用前保留上一份 Skill。回滚重新绑定已验证的旧 Skill，不能恢复失效路径。需要获取新包时读[Skill 安装与更新](skill-install-update.zh-CN.md)。
