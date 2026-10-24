# 安装与排障入口

先根据当前执行环境确认操作系统，只读取对应平台的一份说明：

- [macOS：检测 → 用户级 Host → 注册 → 验连](setup-macos.zh-CN.md)
- [Windows：检测 → 用户级 Host + HKCU → 注册 → 验连](setup-windows.zh-CN.md)

系统已知时直接进入对应文件，不同时读取两套流程。其他系统暂不提供随包程序。
只支持 DSphere 浏览器。尚未安装时，对应说明的 `browser-not-installed` 步骤会给用户官方下载页（https://work.dsphereai.com/download/index.html，或官网 https://www.dsphereai.com/），安装完成后继续 setup。
仅需要安装或更新 Skill 本身时，读取[版本与分发说明](skill-install-update.zh-CN.md)。

浏览器的 Native Messaging host 与 MCP Connector 两条启动路径都运行 `assets/native/` 内随包的程序；程序选择与校验和绑定见[程序注册入口](native-executables.md)。要核验已安装副本与随包清单是否一致，在 Skill 目录运行 `node scripts/verify-package.mjs`（只读；退出码 0 表示全部清单吻合）。
