# Guidance: dsagent.bookmarks

Owner rules for planning with these methods, each paragraph once with the methods it applies to. They are projections of the owner descriptors (the live `guidance` field); the per-method references link here.

- (dsagent.bookmarks.import) Each source's bookmark bar merges into the DSphere bookmark bar and its other folders into Other bookmarks; a folder with the same name under the same parent is reused, and a URL the DSphere browser already has is skipped, so repeating an import only adds new bookmarks. Nothing is removed, and nothing is written to the other browsers. Ask the person which profiles to import first: list them with dsagent.bookmarks.sources and pass the chosen ready source IDs. One import runs at a time (BUSY otherwise); a source that cannot be read reports its failure while the others still import. Requires an idempotency key; repeating a key with the same request replays its result.

- (dsagent.bookmarks.sources) Pass the source IDs of ready profiles to dsagent.bookmarks.import. Safari exists only on macOS and needs Full Disk Access for the DSphere browser (status access-denied until the person grants it). Fails with NATIVE_UNAVAILABLE when the Native Agent is not connected and NATIVE_UPGRADE_REQUIRED when it is too old to read bookmarks.
