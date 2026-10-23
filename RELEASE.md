# Release 1.8.4

Built from native-agent source commit 487f0f2a70a95b9baee0bb06757cfe15e0560532. This GitHub
distribution was promoted with the source-owned channel packager
(`package-channel-release.mjs --channel production --distribution github`) from the same
test-channel wrapper that produced the Gitee `dsphere-agent-v1.8.4` release, so both
distributions carry identical Native binaries and identical canonical content (244 files).
Only the bilingual installation/update references name this repository.

Changes since 1.8.3:

- Windows registration refuses sandboxed or virtualized contexts (Windows app packages,
  restricted tokens, a process user other than the desktop user, or an unverifiable
  desktop) for both install and `--check`, so a sandbox-private registration is never
  reported as registered. Registration then completes through the bundled helper in
  PowerShell opened by the user from the Start menu, under the browser's account.
- The external helper's receipt fields `detectedTargets` and `expectedManifestPath` come
  only from its own detection scan; with caller-supplied `-RegistryRoots` they are `[]`
  and `null`, so such a receipt cannot pass verification.
- Wizard capability references regenerated for the fields-step AI review
  (Extension 1.1.25.6 snapshot; 92 capabilities).

Native SHA-256:

| Platform | SHA-256 |
|---|---|
| windows-x64 | `8920425107c272bb2e06fc74edc20d5c98bd4f129ad4b02a3eca674085989756` |
| windows-x86 | `deff0f187347ba90ce3d61df764cc571ec92bc0fa96d47eeb5ef4a0cbc46df9e` |
| macos-x64 | `c0f3e4ed251d09991cf1961e7cc00571e0134ee7af8ab2847247aae7b6c3dee8` |
| macos-arm64 | `11b541f86b343be912b1fbebefea30827dc4e992112898829a304de7b263b524` |

Validation: package verifier (identity, channel, Native manifest, capability build,
promotion manifest) on the promoted tree and on a fresh checkout of this tag; Native
SHA-256 and canonical inventory compared with the Gitee 1.8.4 tag; official skills-ref
validate/read-properties. The candidate's Skill suite: 171 passed, 9 skipped, 1 failed only
because the build host cannot create symlinks.

At the owner's request the test-channel acceptance was skipped. This release adds no
platform runtime certification or browser acceptance. Previous tags are preserved.
