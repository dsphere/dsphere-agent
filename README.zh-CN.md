<p align="center"><a href="README.md">English</a> | <b>简体中文</b></p>

<p align="center">
  <a href="https://www.dsphereai.com/"><img src="docs/images/dsphere-logo.svg" alt="DSphere" height="48"></a>
</p>

<h1 align="center">DSphere Agent</h1>

<p align="center">
  <b>给你的 AI 智能体一个真正的浏览器。</b><br>
  Claude Code、Codex、Cursor、WorkBuddy 等 AI 智能体负责规划，DSphere 浏览器在你已登录的会话中执行每一步，
  全程可见、由你掌控。
</p>

<p align="center">
  <a href="https://www.dsphereai.com/">官网</a> ·
  <a href="https://work.dsphereai.com/download/index.html">下载 DSphere 浏览器</a> ·
  <a href="installation-guide.md">安装与更新指南</a> ·
  <a href="RELEASE.md">发布验证</a>
</p>

<p align="center">
  <img src="docs/images/sidepanel-chat.webp" alt="网页旁的 DSphere Agent 侧边栏，显示 Claude Code 正在控制浏览器" width="900">
</p>

当前版本：**1.10.0**。

下载[不可变的 1.10.0 安装包](https://github.com/dsphere/dsphere-agent/archive/refs/tags/dsphere-agent-v1.10.0.zip)，解压并校验后安装完整的 `skills/dsphere-agent/` 目录。按你的系统和客户端阅读[安装指南](installation-guide.md)。

## DSphere Agent 是什么？

DSphere Agent 是官方 Skill 与本地 MCP 连接器，让 AI 智能体在 **DSphere 浏览器**中工作。DSphere 浏览器是一款智能体浏览器，集成已登录的多账号工作空间、网页数据提取与 AI 处理能力。

- **智能体负责规划**：读取每个页面，决定下一步，通过三个稳定的 MCP 工具调用浏览器。
- **浏览器负责执行**：每一步都在你电脑上的 DSphere 浏览器中、在你已登录的会话和应用账号里执行，无需把密码交给智能体。
- **你始终掌控**：实时查看每一步，确认敏感操作，接手登录与验证码，随时停止智能体。

Skill 会安装并配置 **Native Agent**（名为 `dsphere-agent` 的本地 stdio MCP 服务），随包提供 Windows x64/x86 与 macOS Intel/Apple Silicon 四个平台的程序。

## 快速开始

1. 从[官方下载页](https://work.dsphereai.com/download/index.html)**安装 DSphere 浏览器**，并保持运行。
2. **把下面的提示词复制给你的 AI 助手**（Claude Code、Codex、Cursor、WorkBuddy 等）。它会为你安装或升级 Skill 与 MCP 连接器，并在写入任何文件前请你确认版本和改动：

   ```text
   帮我安装或升级 dsphere-agent：https://github.com/dsphere/dsphere-agent/blob/main/installation-guide.md
   ```

3. 如助手提示，**重启 AI 助手**，然后让它列出在线的 DSphere 浏览器，确认连接成功。
4. **交给它一个浏览器任务**，例如：“把 books.toscrape.com 上每本书的书名、价格和库存状态采集到本地数据表。”

不想使用外部智能体？DSphere 浏览器内置 **Chat**，无需安装 Skill 或配置 MCP，即可执行同样的任务。

## 工作原理

```text
 你的 AI 智能体                 Native Agent（本地 MCP）          DSphere 浏览器
 ─────────────────              ───────────────────────          ─────────────────────────────
 Claude Code、Codex、    ──▶    dsagent_list_instances    ──▶    网页、已登录会话、
 Cursor、WorkBuddy 等            dsagent_list_capabilities        应用账号、数据表
 规划每一步                      dsagent_invoke                   执行每一步，你可随时查看
```

1. **你的 AI 智能体**规划任务，决定每一步。
2. **Native Agent** 是由 Skill 安装和配置的本地 stdio MCP 服务，把每一步交给浏览器并带回结果。
3. **DSphere 浏览器**在你已登录的会话中执行每一步，并实时发布智能体可以调用的能力清单。

智能体从浏览器实时发现可用方法，只调用浏览器提供的能力。

## 智能体能做什么

| 能力 | 说明 | 方法示例 |
|---|---|---|
| **读取并操作网页** | 观察页面、定位目标，再以经过校验的步骤点击、输入和滚动。 | `page.observe` · `page.find` · `page.action` · `page.markdown` |
| **复用已登录会话** | 在你已在 DSphere 中登录的会话或应用账号中打开页面，无需重新登录。 | `browser.sessions.list` · `page.account.detect` · `app.accounts.list` |
| **采集数据** | 运行采集向导：自动识别列表、表格和分页，把数据保存到本地数据表或导出 CSV。 | `wizard.start` · `execution.data.export` |
| **运行已保存任务** | 启动已保存的工作流，等待或停止它，再读取结果。 | `execution.run` · `execution.wait` · `execution.stop` |
| **文件与邮件** | 发现并下载页面中的文件；用你自己的账号搜索、阅读和发送邮件。 | `page.files.download` · `mail.search` · `mail.send` |
| **关键时刻问你** | 在实时任务面板中提问或请你确认，必要时提醒你回到页面。 | `page.ask` · `page.notify` |
| **查看所有浏览器任务** | 查看各来源（智能体、Chat、你自己）的标签页和任务，在任务受阻时协助处理。 | `monitor.snapshot` · `monitor.assist` |

## 产品一览

### 实时查看智能体的每一步

实时任务面板展示每一步及其结果、已采集的记录，以及当前是谁在控制浏览器。

![智能体在演示网站上运行时，实时任务面板列出每个工作流步骤及其结果](docs/images/runtime-steps.webp)

### 关键操作由你确认

敏感操作会等待你点击**确认**。未经确认，不会代你发送、保存或提交任何内容。

![创建本地数据表前，请用户确认的确认面板](docs/images/runtime-confirm.webp)

### 把网页数据采集到本地数据表

采集向导把重复记录（列表、表格、搜索结果、评论）整理成数据行，并沿页面分页采集到底。结果保存在你的电脑上，可下载为 Excel 或 CSV。

![运行数据视图中已采集的书名、价格与库存状态](docs/images/local-sheet.webp)

### 多任务并行

多个任务同时运行，各自位于独立的标签页分组中，每个任务都可以单独打开实时视图或停止。

![三个工作流同时运行，每个都带有“打开实时视图”和“停止”按钮](docs/images/parallel-runs.webp)

### 内置 Chat 与技能

想自己输入任务？Chat 在同一个浏览器中执行，并提供采集数据、填写表单、下载图片、邮件处理以及把请求变成可复用工作流等现成技能。

![Chat 技能菜单：创建工作流、询问我的邮件、采集数据](docs/images/sidepanel-skills.png)

### 会话与账号隔离

把店铺、达人账号和客户分开：每个会话或应用账号拥有独立的标签页、Cookie、代理与浏览器环境。

![两个相互隔离的浏览器会话并排显示，各有独立的标签页分组](docs/images/isolated-sessions.webp)

[观看产品视频](https://static-dsphere-com-cn.oss-cn-hangzhou.aliyuncs.com/official-website/agent_brand.mp4)

## 安全与掌控

- **本地运行**：智能体通过你电脑上的本地 stdio 服务连接 DSphere 浏览器。
- **无需交出密码**：复用你在 DSphere 中登录过的会话；遇到登录或验证码时交给你处理。
- **关键操作由你确认**：敏感操作会在实时任务面板中等待你确认。
- **随时停止**：Chat 显示当前控制浏览器的智能体，并提供**停止智能体**按钮。
- **有边界的设计**：智能体只能拿到脱敏、有大小上限的页面信息，只能调用浏览器发布的方法；不能执行任意脚本或 SQL，不能打开任意网址或文件路径，也不能透传凭据。

## 支持的客户端与平台

| | |
|---|---|
| **AI 客户端** | Claude Code、Codex、Cursor、WorkBuddy、TRAE Work、Qianwen Office，以及任何能启动本地 stdio MCP 服务的智能体 |
| **操作系统** | Windows x64 与 x86，macOS Intel 与 Apple Silicon |
| **浏览器** | DSphere 浏览器（[下载](https://work.dsphereai.com/download/index.html)） |
| **MCP 工具** | `dsagent_list_instances`、`dsagent_list_capabilities`、`dsagent_invoke`（另有 `dsagent_read`、`dsagent_launch_browser`、`dsagent_get_runtime_status`、`dsagent_upload_file` 等辅助工具） |

如果你的客户端不能安装 Skill，请先按[完整安装指南](installation-guide.md)安装官方连接器，再在客户端的 MCP 设置中接入它的本地 stdio 服务。安装包内附各客户端的配置说明。

## 仓库结构与安装规则

| 路径 | 内容 |
|---|---|
| `skills/dsphere-agent/` | 最新正式版的完整 Skill：`SKILL.md`、能力参考、安装脚本、完整性清单，以及 Windows x64/x86、macOS Intel/Apple Silicon 的 Native Agent 程序。 |
| `installation-guide.md` | 覆盖所有支持平台与客户端的中英文安装与更新指南。 |
| `latest-version.json` | 版本指针：只包含最新正式版及其 tag。 |
| `RELEASE.md` | 当前版本的来源、Native 校验和与验证记录。 |
| `docs/images/` | 本 README 使用的图片。 |

本发布渠道使用 `https://github.com/dsphere/dsphere-agent.git`，版本指针位于 `https://raw.githubusercontent.com/dsphere/dsphere-agent/main/latest-version.json`。更新始终来自本仓库。请始终安装经过校验的指针所指定的不可变 tag。

Git tag `dsphere-agent-v<version>` 是版本的唯一事实。从 `latest-version.json` 读取 `version` 和 `tag`，确认 tag 与版本精确对应，然后只从该 tag 取得 `skills/dsphere-agent/`；写入客户端 Skill 目录前必须获得用户确认。

Skill 的开发源位于 DSphere 集成仓的 `native-agent/skills/dsphere-agent/`，由此发布到本仓库；请勿直接修改本镜像。

## 常见问题

**需要把密码交给智能体吗？**
不需要。智能体复用你在 DSphere 浏览器中登录过的会话；需要登录或验证码时，会请你接手。

**怎样停止智能体？**
Chat 会显示当前控制浏览器的智能体。点击**停止智能体**，或在实时任务面板中停止本次运行。

**智能体找不到浏览器怎么办？**
保持 DSphere 浏览器打开，再次复制安装提示词，让助手按指南检查版本、Native Host 注册和 MCP 配置，然后安全重连并核验。安装或更新失败时，保留上一个已验证的 Skill。

**怎样更新？**
再次发送同一个安装提示词。助手会把已安装版本与 `latest-version.json` 比较，向你说明改动，并在你确认后安装新的不可变 tag。

## 链接

- 官网：<https://www.dsphereai.com/>
- 下载 DSphere 浏览器：<https://work.dsphereai.com/download/index.html>
- 国内镜像（Gitee）：<https://gitee.com/dsphere/dsphere-agent-skills>
- 许可证：[MIT](LICENSE)
