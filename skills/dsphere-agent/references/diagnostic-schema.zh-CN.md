# DSphere Agent — 诊断数据契约

## Windows schema 3

1.8.4 起，`install` 与旧 `configure`（包括 `--check`）共用 Windows 注册上下文门禁。除 `packaged-client-virtualized` 外，错误包括 `registration-context-restricted`（受限 token）、`registration-user-mismatch`（进程 SID 与本桌面 shell 用户 SID 不同）、`registration-context-unverified`（桌面身份缺失或无法读取）。这些错误不返回成功回执、不访问 manifest/注册表；进入外部人工流程，不提供绕过开关。外部 helper 回执新增 `detectedTargets`（该用户扫描到的已安装品牌/root）和 `expectedManifestPath`，应据此校验而不是与沙箱检测比较。两者只来自 helper 自身扫描：调用方传入 `-RegistryRoots` 时分别为 `[]` 与 `null`，此类回执不能作为验收。helper 保留外部扫描发现的现有 manifest/来源，并拒绝被阻塞的扫描。

Windows 不再要求或搜索浏览器目录中的 NativeMessagingHosts。下述核心字段保持，但 schemaVersion=3；status 为 browser-not-installed、registration-blocked 或 manifest-ready；nextAction 为 install-browser、repair-user-registration 或 install-user-native-host。

只支持 DSphere 浏览器：Windows 只扫描 Dsphere，`candidates` 与 `registrationTargets` 各只含一项 Dsphere；setup 只在 `installed=true` 时为它注册。其他浏览器（DuokaiBrowser、DsWorkspace、Chromium）既不扫描也不注册，它们已有的注册保持不动。`selectionRequired` 始终为 false，就绪时 `selectedCandidate` 即 Dsphere 候选。Dsphere 注册来源无效会阻塞 setup。两个平台的每个结果都带 `downloadUrl`（官方下载页 `https://work.dsphereai.com/download/index.html`）与 `websiteUrl`（找不到或打不开下载页时使用的官网 `https://www.dsphereai.com/`）；状态为 `browser-not-installed` 时按 setup 说明把它们交给用户。

manifestPath / hostDir 是共享用户安装目标，不是浏览器版本目录。新增 sourceManifestPath（现有配置来源，可空）、manifestSource（new / user-file / user-registry）、registryRoot（HKCU 相对产品根，始终为 Software\Dsphere；检测器与安装程序都拒绝其他注册根）、registeredManifestPath、registryView（Registry32 优先于 Registry64）、extensionId（内置 dkpedeeoceglnpignjhiblgfgofpmmik，仅供诊断）、registrationCompatible 和 registrationIssue。各候选只读取对应品牌注册，不回退 Chromium。`registrationTargets` 投影品牌、安装状态、注册根、manifest/回读字段和注册健康状态，供 setup 循环使用。versionDir 仅供诊断；检测用户目录与标准 Program Files 安装位置。

manifestCompatible 表示可进入安装，即使尚无 manifest。首次创建自动授权内置扩展 ID，绝不要求用户提供。`manifestSource=new` 时，接入 Agent 不再询问确认，立即按默认路径先检查再安装；检测器本身仍保持只读。非法注册表值、无效文件、来源冲突或现有权限不含所选 ID 返回 user-registration-invalid / registration-blocked。检测始终只读，不创建目录、文件、注册表项，也不证明 runtime 在线。

Windows integrations native-host install 返回 schemaVersion 1，含 status、manifestPath、previousPath、nativeAgentPath、descriptor、registryRoot 和可选 previousRegistryPath。`--registry-root` 只接受 Software\Dsphere（也是默认值），其他注册根在访问注册表前即失败。--check 只读；退出码为零且 registered/unchanged 确认文件与注册表回读，不等于 runtime 在线。非零退出始终失败；注册表失败可能保留已发布的有效用户文件。在 Windows 打包客户端（MSIX）内，install 与 --check 在任何读写之前以 packaged-client-virtualized 非零退出。不修改 HKLM 或策略。

受限客户端无法完成 HKCU 写入/回读时，`scripts/complete-windows-registration.ps1` 会重新扫描 DSphere 浏览器，仅在执行时已安装时完成安装和最终检查；未安装时 helper 停止并给出下载页。它输出单行回执，新增 `verification=passed`、调用方生成的 `challenge`、`manifestSha256`，以及每个已安装品牌一项的 `registrations`；同时给出共享的 `status=registered`、`manifestPath`、`nativeAgentPath` 与 `descriptor`。只有品牌/注册根集合与最新扫描完全一致，且其余值全部匹配已验证 Skill 程序时，回执才构成配置证据。

## macOS schema 3

```json
{
  "schemaVersion": 3,
  "os": "macos",
  "status": "browser-not-installed | registration-blocked | manifest-ready",
  "nextAction": "install-browser | repair-user-registration | install-user-native-host",
  "downloadUrl": "https://work.dsphereai.com/download/index.html",
  "websiteUrl": "https://www.dsphereai.com/",
  "selectionRequired": false,
  "selectedCandidate": null,
  "compatibleCandidates": [],
  "candidates": []
}
```

macOS 检测器只读，只查找 DSphere 浏览器（`/Applications/Dsphere.app`），不查看应用包内部（新版应用包不再提供 Native Host manifest）。候选字段为 brand（始终为 Dsphere）、installed、running、appPath、version、hostDir、manifestPath、sourceManifestPath、manifestSource（new 或 user-file）、extensionId（内置 dkpedeeoceglnpignjhiblgfgofpmmik，仅供诊断）、nativeAgentPath、registrationCompatible、registrationIssue、manifestCompatible 和 issue。hostDir/manifestPath 始终为 `~/Library/Application Support/Dsphere/NativeMessagingHosts/com.dsworkspace.agent.json`：macOS 没有注册表，浏览器从自身用户数据目录下的这个文件夹读取 Native Messaging host。没有 registryRoot 或 registrationTargets，不全盘搜索。

manifestCompatible 表示可进入安装，即使尚无 manifest；`manifestSource=new` 时，接入 Agent 不再询问确认，直接按默认路径先检查再安装。已有用户 manifest 无效、是符号链接或未授权内置扩展时返回 user-registration-invalid / registration-blocked，只报告、不替换。nativeAgentPath 描述现有 manifest 的 path，允许为空或指向不存在文件，且绝不执行。浏览器未启动不改变检测结果。manifest-ready 只表示可注册 Skill 程序，不表示 runtime 已运行。

issue 取值为 not-installed、user-registration-invalid。不受支持的系统返回 unsupported-platform 并非零退出。

macOS 的 integrations native-host install 返回与 Windows 相同的 schemaVersion 1 配置结果（不含 registryRoot）：status、manifestPath、previousPath、nativeAgentPath、descriptor。新建文件只授权内置扩展；已有文件保留授权和其他字段，只改 path。DSphere 用户目录之外的 `--manifest` 和任何 `--registry-root` 都被拒绝。只读检查状态为 registration-required 或 registered；写入状态为 registered 或 unchanged。MCP descriptor 只从该验证结果取得，或在 Agent 自行写入的回退之后从 `integrations descriptor --json` 取得；非零退出表示失败，不能当成成功。已移除的 `configure --user-brand` 会非零退出并提示改用 install。

以 `user-manifest-write-blocked:` 开头的错误表示操作系统拒绝创建、写入或读取 manifest（权限拒绝、客户端沙箱、只读卷）；`browser-manifest-write-blocked:` 表示现有文件只读。macOS 上两者都让接入 Agent 进入安装指引中的回退步骤，由它自行写入同样的 manifest 并验证；其他错误不进入回退。
