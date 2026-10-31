# Documentation learning and agent memory

On every Skill installation, reinstallation and upgrade, the outside agent must read the installed package's documentation and references in full and build or rebuild its own memory cache. Do this after package integrity verification and before reporting installation or upgrade complete or starting the next browser task. A previous version's summary or a change log does not replace this full read. This is preparation by the calling agent, not a new Native Agent service or browser capability.

## Read the complete installed documentation

1. Enumerate the verified installed package, starting with `SKILL.md`. Include every bundled documentation file and every file recursively under `references/`: guides, examples, request sheets, owner guidance, method descriptions and JSON contracts. Include both language versions and all platform guides. Follow package-local documentation links, including documentation outside `references/`; do not stop at the method index or only the files relevant to today's task. Reading an external URL is not required merely because a reference links to it. Executables and other binary assets are not documentation.
2. Read each file from beginning to end. Use bounded chunks for large files and track the last fully read section or offset. Tool-output truncation, a search excerpt, a heading list or an existing summary does not count as reading the file. Continue until every file is covered; checkpoint progress across context limits so an interrupted pass can resume on the same verified package.
3. Learn all platform instructions but execute setup only for the actual OS and selected client. Reading examples does not authorize executing them, starting browser tasks, calling every method or fetching a live capability catalog.
4. Resolve contradictions against the installed source and record unresolved gaps with their source paths; do not invent a contract. If any required file cannot be read, record the missing coverage and report learning as incomplete. Keep connection verification and documentation learning as separate completion results.

The full read is an installation/upgrade exception to the guides' task-time rules such as “read only your platform”, “optional”, or “read only when needed”. Those rules still select what to execute and what to reread during later browser tasks.

## Build a reusable cache owned by the calling agent

Use the client's supported durable memory or a private local notes location outside the installed Skill tree and published repositories. Do not edit the verified package or its integrity manifests to store memory. Keep the cache discoverable through a short memory index so future conversations can find it without loading the entire documentation again.

Store:

- Package identity: Skill name, release channel, `metadata.version`, immutable tag/source when available, and the verified package manifest fingerprint (or a deterministic digest of the documented file paths and contents). Record the learning timestamp and distinguish it from runtime activation verification.
- Coverage: a complete relative-path inventory, each file's digest, read status and any checkpoint or gap. Mark the learning pass complete only after all documentation and references have been read fully and the memory has been saved and read back successfully.
- A concise operating map: how to choose ordinary page actions, the collection wizard, task recording, saved workflow replay and other documented capabilities; setup/recovery entry points; efficient request shapes and batching boundaries; result envelopes; terminal states; consent, authentication, retry, cancellation and cleanup rules.
- A searchable method/reference index with source paths and section names. Preserve exact required fields, enums, limits and error handling where useful; link back to the full contract instead of inventing shortened schemas. Keep detailed notes separate from the small entry index so later tasks retrieve only what they need.

Cache documentation-derived knowledge only. Do not persist credentials, browser/page contents, personal or business records, grants, confirmations, live instance/page/target IDs, revisions, tokens, idempotency keys or task execution state as reusable documentation memory. Placeholders in examples stay placeholders.

If durable memory is unavailable, maintain a session-local cache and explicitly report that it will not survive a new session. Do not claim persistent memory was saved. A future session without a complete matching cache must repeat the learning pass; resume a partial pass only when the package identity still matches.

## Use and refresh the cache

At the start of a later task, read `SKILL.md` and the small memory index, confirm that the cache matches the currently installed package, and retrieve the relevant notes. Use them to plan directly and reread the exact source contract whenever a field, limit or recovery rule is unclear. A complete matching cache avoids another full documentation read for each ordinary browser task; it does not remove required task-specific guidance.

Every installation or upgrade triggers a fresh full read and cache rebuild, even a reinstall of the same version. Changed package contents, a missing cache or incomplete coverage also require learning before relying on the cache. Invalidate obsolete notes, including removed methods; do not merge stale rules into the new cache. Keep an interrupted rebuild marked incomplete and never present the previous package's memory as current.

Memory is a navigation aid, not authority over the installed Skill, current method contracts, tool responses or user instructions. Always obtain current browser evidence and handles for the actual task. Follow the Skill's normal live-contract discovery rules when a method is unavailable or its request contract is unclear; cached knowledge never proves a capability is available or an action succeeded. Do not add update checks, full catalog discovery or browser probes to ordinary tasks just to refresh memory.

In the installation/upgrade result, report the learned package version, completed/total document count, remaining gaps, and whether the cache is durable or session-only (with its index location when available). Runtime activation still requires the existing setup and connection checks; completing documentation learning alone does not mean the browser is ready.
