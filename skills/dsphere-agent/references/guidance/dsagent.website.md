# Guidance: dsagent.website

Owner rules for planning with these methods, each paragraph once with the methods it applies to. They are projections of the owner descriptors (the live `guidance` field); the per-method references link here.

- (dsagent.website.explore.capture) No navigation, LLM loop, dataset collection or page modification. Returns caller-owned evidence ID retained for 24 hours or until browser exit, and a durable file path. Use a fresh idempotency key for a new capture; reuse the same key/input to recover a receipt.

- (dsagent.website.explore.export) Observed/caller-verified/untested/blocked remain distinct. All referenced evidence must belong to this caller and be unexpired. Identical report content reuses the verified file. No arbitrary file paths, URLs, scripts or automatic integration with ordinary browser tasks.
