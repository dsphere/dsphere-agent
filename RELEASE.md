# Release 1.8.3

Built from clean native-agent source commit c611ced. Four-platform Native binaries were built once; the locally tagged dsphere-agent-test-v1.8.3 candidate was verified before production promotion. Native SHA-256 values and the exact source commit are in skills/dsphere-agent/assets/native/manifest.json.

This patch binds the root installation guide and both bundled update references to this GitHub repository. A shared packaging owner selects the distribution explicitly and keeps native binaries and capability contracts unchanged across distribution wrappers. Existing immutable tags remain unchanged.

Validation: all 13 packaging regression tests pass, including a new regression that failed before the correction. Official Skill validation/read-properties, bilingual detection contract, capability drift checks, four-platform builds and package integrity verification pass. Capability references match Extension bundle 1.1.25.6 (92 methods).

Limitations: the existing full Skill entry test still has a stale wording assertion and its entry-size assertion is also exceeded. The full suite is not claimed green. No new live browser acceptance, macOS runtime certification or Windows race test was performed; runtime code is unchanged.
