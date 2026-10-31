# Setup and troubleshooting entry

Every installation or upgrade requires [complete documentation learning and a refreshed agent memory cache](documentation-memory.md), including all platform/language references. For setup execution and later troubleshooting, identify the current execution OS and consult its guide:

- [macOS: detection → user Host → registration → verification](setup-macos.en.md)
- [Windows: detection → user Host + HKCU → registration → verification](setup-windows.en.md)

When the OS is known, execute only its guide; the full learning pass does not authorize running another platform's setup. Later troubleshooting needs only the relevant guide. Other operating systems have no bundled executable.
Only the DSphere browser is supported. If it is not installed yet, the guide's `browser-not-installed` step gives the user the official download page (https://work.dsphereai.com/download/index.html, or the website https://www.dsphereai.com/) and resumes setup once it is installed.
For installing or updating the Skill itself, use [release and installation guidance](skill-install-update.en.md).

Both launch paths (the browser's Native Messaging host and the MCP Connector) run the executable bundled under `assets/native/`; its selection and checksum binding are described in [native executables](native-executables.md). To verify an installed copy against its manifests, run `node scripts/verify-package.mjs` from the Skill directory (read-only; exit 0 means every manifest matches).
