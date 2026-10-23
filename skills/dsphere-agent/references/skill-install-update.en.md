# DSphere Agent Skill installation and updates

The public Gitee repository is the default fallback distribution source:

- repository: `git@gitee.com:dsphere/dsphere-agent-skills.git`
- version pointer: `https://gitee.com/dsphere/dsphere-agent-skills/raw/master/latest-version.json`
- skill ID: `dsphere-agent`

## When to check

Check the version pointer only during first-time installation, an explicit Skill version/update request, connection diagnostics, or setup. Never pause an ordinary browser automation, workflow, or result-analysis task just to check for updates, and never rewrite the Skill silently in the background.

An automatic check may be cached for 24 hours. After the user skips version `X`, do not automatically prompt for that same version again for 7 days. An explicit check or a newer version may prompt again.

## Install

1. Prefer the current AI client's SkillHub or native Skill installer and verify that the target `skillId` is `dsphere-agent`.
2. If the client has no marketplace or native installer, read the root `latest-version.json` from the version pointer above. Resolve only `version` and `tag`; the tag must equal `dsphere-agent-v<version>` exactly.
3. Clone or fetch that immutable tag with Git from the official repository above, install only `skills/dsphere-agent/` from the tag, and verify that `SKILL.md metadata.version` matches the version pointer. Never install mutable `master`, an arbitrary repository, or an arbitrary tag.
4. Show the version, source, and change summary. Write to the client's supported Skill directory or installation API only after explicit user confirmation.
5. Reload the client's Skill catalog, then follow the English guide linked by `SKILL.md` to detect the browser and configure MCP.

The official Git clone URL is `git@gitee.com:dsphere/dsphere-agent-skills.git`. Do not overwrite an installed release by copying unverified files from the mutable `master` worktree.

After installing, verify the copy before registering it: `node scripts/verify-package.mjs` in the Skill directory checks `SKILL.md` against `assets/release-channel.json` (the channel this package was built for — a `dsphere-agent` package is production, `dsphere-agent` is the test channel; refuse a package whose name and channel disagree), every executable against `assets/native/manifest.json`, every contract against `assets/capability-build.json`, and every file against `assets/promotion-manifest.json`. Each manifest states how its hashes are computed. Exit code 0 means verified; otherwise reinstall the same release from its immutable tag.

## Update

Read the installed `metadata.version` from `SKILL.md` and compare it with `latest-version.json.version` using SemVer:

- If the installed version is equal to or newer than the latest stable release, keep it and do not reinstall.
- If the remote version is newer, show the current version, target version, and change summary, then ask whether to upgrade.
- Without confirmation, do not write files, remove the installed version, or change MCP.
- If the version pointer is invalid, the tag is absent, or the Skill shape/version is invalid, keep the current version and report a recoverable error. Do not fall back to `master` or an unconfirmed copy.

The Skill owns the executable for both browser runtime and MCP connector. Install the complete new Skill release, including all four real files under `assets/native/`, at a stable location. No Go compiler or separate executable download is required. Validate and follow platform setup: Windows install writes the user manifest and HKCU; macOS configure --user-brand writes the user manifest. MCP uses the same Skill executable. After installation or update, follow the [shared guide](client-setup.en.md) to explicitly request a full browser restart and wait for confirmation. Keep the previous verified Skill until browser restart and MCP reconnection succeed. Never use or copy an executable from the browser installation. Rerun detection after browser upgrades; Windows user registration does not move with version directories. If an old process prevents replacing files, retain both releases and arrange a safe restart; never forcibly kill it.

## Channel consistency

The same version from SkillHub and Gitee must have the same core Skill tree as the corresponding tag. Do not let an older marketplace version overwrite a newer local version. Use the official Gitee Git source only as the fallback when a marketplace is unavailable. Every channel requires user confirmation before installation or update.

Upgrade completion requires both running builds to match the bundled Native manifest; follow [client verification](client-setup.en.md#upgrade-completion). Package replacement alone is not activation.

Historical numbering migration: the former stable 2.8.7 is archived as 1.3.0; subsequent stable releases resume at 1.3.1. Users with 2.8.7 or internal 2.8.8–2.8.12 test packages must explicitly request “migrate the old 2.8.x numbering to official 1.3.1”, then use the immutable-tag validation, backup and installation flow above. This is an explicitly requested numbering migration, not an automatic downgrade. Keep other newer versions under normal SemVer rules; verify actual Native builds against the bundled manifest.
