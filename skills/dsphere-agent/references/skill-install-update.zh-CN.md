# DSphere Agent Skill 安装与更新

公开 Gitee 仓库是 Skill 的默认保底分发源：

- 仓库：`git@gitee.com:dsphere/dsphere-agent-skills.git`
- 版本指针：`https://gitee.com/dsphere/dsphere-agent-skills/raw/master/latest-version.json`
- Skill ID：`dsphere-agent`

## 何时检查

只在首次安装、用户明确要求检查/升级 Skill、连接诊断或接入设置时检查版本指针。普通浏览器自动化任务、工作流执行和结果分析不得为了检查更新而暂停，也不得在后台静默改写 Skill。

自动检查结果可缓存 24 小时。用户对版本 `X` 选择“暂不升级”后，自动检查在 7 天内不重复提醒同一版本；用户主动检查或发现更高版本时可以再次提示。

## 安装

1. 优先使用当前 AI 客户端的 SkillHub 或原生 Skill 安装能力，并确认安装目标的 `skillId` 是 `dsphere-agent`。
2. 客户端没有市场或原生安装能力时，从上述版本指针读取根级 `latest-version.json`，只解析 `version` 和 `tag`；`tag` 必须精确等于 `dsphere-agent-v<version>`。
3. 使用 Git 从上述官方仓库 clone/fetch 该不可变 tag，只安装 tag 下的 `skills/dsphere-agent/`，并确认 `SKILL.md metadata.version` 等于版本指针。不得安装可变 `master` HEAD，也不得接受任意仓库或 tag。
4. 说明将安装的版本、来源和变更摘要，获得用户明确确认后，才使用当前客户端支持的 Skill 安装目录或安装 API 写入。
5. 安装后重新加载客户端 Skill 清单，再按中文操作指引完成注册和 MCP 配置；按[通用指引](client-setup.zh-CN.md)提示用户完全退出并重开所选浏览器，等待确认后验连。

官方 Git clone 地址是 `git@gitee.com:dsphere/dsphere-agent-skills.git`。不得从可变 `master` 工作树直接复制未校验文件来覆盖已安装版本。

安装后、注册前先核验副本：在 Skill 目录运行 `node scripts/verify-package.mjs`，它对照 `assets/release-channel.json` 检查 `SKILL.md`（本包所属通道——`dsphere-agent` 为正式通道，`dsphere-agent` 为测试通道；名称与通道不符的包必须拒绝），对照 `assets/native/manifest.json` 检查每个可执行文件，对照 `assets/capability-build.json` 检查每份契约，对照 `assets/promotion-manifest.json` 检查每个文件。每份清单都写明了自己的哈希算法。退出码 0 表示核验通过；否则从不可变 tag 重新安装同一版本。

## 更新

读取本地 `SKILL.md` 的 `metadata.version`，按 SemVer 与 `latest-version.json.version` 比较：

- 本地等于或高于正式版：保留当前版本，不重复安装。
- 远端更高：展示当前版本、目标版本和变更摘要，并询问用户是否升级。
- 用户未确认：不写文件、不删除当前版本、不修改 MCP。
- 版本指针非法、tag 不存在或 Skill 结构/版本不符：保留当前版本并说明可恢复错误，不降级到 `master` 或未确认的复制方式。

Skill 同时拥有浏览器 runtime 和 MCP Connector 的可执行文件。将完整新发布包（包括 `assets/native/` 下四平台真实文件）安装到稳定目录，无需 Go 或额外下载程序。验证后按当前平台说明注册：Windows 使用 install 写用户 manifest 与 HKCU，macOS 使用 configure --user-brand 写用户 manifest；MCP command 指向同一 Skill 程序。更新完成后必须按[通用指引](client-setup.zh-CN.md)主动提示用户重启浏览器并等待确认。浏览器重启和 MCP 重连验证成功前保留上一份已验证 Skill；不得使用或复制浏览器安装目录中的旧程序。浏览器升级后重新检测；Windows 用户级注册不随浏览器版本目录迁移。旧进程占用文件时保留两个版本并安排安全重启，不强杀进程。

## 渠道一致性

SkillHub 与 Gitee 出现同一版本时，核心 Skill 树必须与对应 tag 一致。市场版本落后时，不得用较低版本覆盖本地较高版本；市场不可用时才使用官方 Gitee Git 保底源。任何渠道的安装和更新都必须先获得用户确认。

升级完成还要求两侧运行构建匹配随包 Native 清单，执行[运行版本验收](client-setup.zh-CN.md#升级完成判定)。市场只替换文件不代表新进程已启用。

历史编号迁移：原正式 2.8.7 归档为 1.3.0，后续正式版从 1.3.1 延续。已安装旧 2.8.7 或内部 2.8.8–2.8.12 测试包的用户，应明确请求“将旧 2.8.x 编号迁移到官方 1.3.1”，再按上述不可变 tag 校验、备份及安装流程处理；这是一次明确指定的编号迁移，不是自动降级。其他较高版本仍按 SemVer 保留；Native 实际构建始终按随包清单核验。
