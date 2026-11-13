# Guidance: dsagent.workflow

Owner rules for planning with these methods, each paragraph once with the methods it applies to. They are projections of the owner descriptors (the live `guidance` field); the per-method references link here.

- (dsagent.workflow.definition.get) Read-only; credentials, physical file paths, session-group bindings and URL user-info are replaced by [redacted], and long values are cut. Page with nodeOffset / nextNodeOffset; filter by nodeType (for example get-text). A workflow saved by a scrape wizard with a collect hint also carries detectionProvenance (whether the hint-steered detection, tier D2, produced its source).

- (dsagent.workflow.repairs.answer) keep: the repaired address of each offered step is put first in that step's own setting and the workflow is saved through its normal save, with the recorded addresses kept behind it; later runs reach the step directly. decline: the workflow is not changed; the repairs keep working from this computer's memory and are not offered again. Use keep when your user asked you to maintain the workflow or the changed page is the page they want it to run on; ask them first when unsure. steps 0 means nothing was offered and nothing was written. Requires an idempotency key.

- (dsagent.workflow.repairs.get) A repair that worked on the run that made it and on two further runs is offered here. steps 0 means there is nothing to keep. Call it after replaying a workflow whose run healed or repaired steps (a slower run, a repair handoff you answered), then keep the repairs with dsagent.workflow.repairs.answer. Read-only; no address or page text is returned.
