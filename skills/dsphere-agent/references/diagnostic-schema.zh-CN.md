# DSphere Agent — 诊断数据契约

## Windows schema 3

Windows 不再要求或搜索浏览器目录中的 NativeMessagingHosts。下述核心字段保持，但 schemaVersion=3；status 为 browser-not-installed、registration-blocked 或 manifest-ready；nextAction 为 install-browser、repair-user-registration 或 install-user-native-host。

Windows 每次都扫描 Dsphere、DuokaiBrowser 与 DsWorkspace。`candidates` 和 `registrationTargets` 按此顺序包含三个品牌；setup 只注册 `installed=true` 的目标。`selectionRequired` 始终为 false，`selectedCandidate` 表示默认任务浏览器（Dsphere 优先，其次 DuokaiBrowser）。任一已安装品牌的注册来源无效都会阻塞 setup；未安装品牌既不触发注册，也不会阻塞已安装品牌。

manifestPath / hostDir 是共享用户安装目标，不是浏览器版本目录。新增 sourceManifestPath（现有配置来源，可空）、manifestSource（new / user-file / user-registry）、registryRoot（HKCU 相对产品根，按品牌为 Software\Dsphere、Software\DuokaiBrowser 或 Software\DsWorkspace，除非显式覆盖）、registeredManifestPath、registryView（Registry32 优先于 Registry64）、extensionId（内置 dkpedeeoceglnpignjhiblgfgofpmmik，仅供诊断）、registrationCompatible 和 registrationIssue。各候选只读取对应品牌注册，不回退 Chromium。`registrationTargets` 投影品牌、安装状态、注册根、manifest/回读字段和注册健康状态，供 setup 循环使用。versionDir 仅供诊断；检测用户目录与标准 Program Files 安装位置。

manifestCompatible 表示可进入安装，即使尚无 manifest。首次创建自动授权内置扩展 ID，绝不要求用户提供。`manifestSource=new` 时，接入 Agent 不再询问确认，立即按默认路径先检查再安装；检测器本身仍保持只读。非法注册表值、无效文件、来源冲突或现有权限不含所选 ID 返回 user-registration-invalid / registration-blocked。检测始终只读，不创建目录、文件、注册表项，也不证明 runtime 在线。

Windows integrations native-host install 返回 schemaVersion 1，含 status、manifestPath、previousPath、nativeAgentPath、descriptor、registryRoot 和可选 previousRegistryPath。DsWorkspace 根还返回 browserShortcuts {status, shortcuts[{path, status, error?}]}：为当前用户桌面与开始菜单的 DsWorkspace 快捷方式补上 --disable-backgrounding-occluded-windows --disable-features=CalculateNativeWinOcclusion（status 为 updated、current、--check 下的 needs-update、not-found 或 failed）；单个快捷方式失败只报告，不使注册失败。--check 只读；退出码为零且 registered/unchanged 确认文件与注册表回读，不等于 runtime 在线。非零退出始终失败；注册表失败可能保留已发布的有效用户文件。在 Windows 打包客户端（MSIX）内，install 与 --check 在任何读写之前以 packaged-client-virtualized 非零退出。不修改 HKLM 或策略。

受限客户端无法完成 HKCU 写入/回读时，`scripts/complete-windows-registration.ps1` 会重新扫描三个浏览器品牌，并只为执行时已安装的品牌完成安装和最终检查。它输出单行回执，新增 `verification=passed`、调用方生成的 `challenge`、`manifestSha256`，以及每个已安装品牌一项的 `registrations`；同时给出共享的 `status=registered`、`manifestPath`、`nativeAgentPath` 与 `descriptor`。只有品牌/注册根集合与最新扫描完全一致，且其余值全部匹配已验证 Skill 程序时，回执才构成配置证据。

## macOS schema 2

```json
{
  "schemaVersion": 2,
  "os": "macos",
  "status": "browser-not-installed | upgrade-required | manifest-ready",
  "nextAction": "install-browser | upgrade-browser | configure-skill-native-host",
  "selectionRequired": false,
  "selectedCandidate": null,
  "compatibleCandidates": [],
  "candidates": []
}
```

macOS 检测器只读，按 Dsphere、DuokaiBrowser、DsWorkspace 的顺序检测并在首个已安装品牌处停止。候选字段为 brand、installed、running、appPath、version、versionDir、hostDir、manifestPath、nativeAgentPath、manifestCompatible 和 issue。品牌为 Dsphere、DuokaiBrowser、DsWorkspace；macOS 的 hostDir/manifestPath 优先指向品牌用户目录下的直接 manifest，不存在时才回退到应用版本目录；Windows 使用前述 schema 3，不全盘搜索。

nativeAgentPath 描述旧 manifest 配置；Windows 相对值以 manifest 目录解析。它允许为空或指向不存在文件，且绝不执行。manifestCompatible 仅校验 host name、stdio type 和扩展 Origin。浏览器未启动或旧程序不存在不改变品牌优先级。manifest-ready 只表示可注册 Skill 程序，不表示 runtime 已运行。

issue 取值为 not-installed、version-unavailable、active-version-directory-missing、native-host-manifest-missing、native-host-manifest-invalid。不受支持的系统返回 unsupported-platform 并非零退出。

schemaVersion 2 不再返回 agentCompatible 或 descriptor。Skill 程序的 integrations native-host configure 命令返回 schemaVersion 1 配置结果，包括 status、manifestPath、previousPath、nativeAgentPath、descriptor。只读检查状态为 registration-required 或 registered；写入状态为 registered 或 unchanged。MCP descriptor 只从该验证结果取得；非零退出表示失败，不能当成成功。

macOS 配置时必须传入选定品牌 `--user-brand`。检测的 `manifestPath` 在用户文件缺失时仅作为读取来源；配置结果的 `manifestPath` 才是实际用户级写入位置。已有用户文件优先且保留其授权字段。
