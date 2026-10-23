# Wizard and dataset requests

Generated input-only reference. Each JSON block is the complete input validation schema for args, with prose annotations omitted; it is not a request to execute. Required fields, bounds, enums and patterns are unchanged. Copy opaque handles only from actual results. Add method and instanceId at the gateway level; effects also require a fresh idempotencyKey there. Retain the complete response envelope and check operation status before using data.data.

Read the [wizard owner guidance](../guidance/dsagent.wizard.md) for behavior and permissions. This sheet supplies request shapes, not authorization. Use it instead of separately reading every linked method or its full input/output contract when the needed fields are clear. If a field's meaning or a result is unclear, read that method's linked reference; do not guess.

Use the current pendingChoice options and values to decide each answer. Do not pre-enumerate pagination or records with page tools: detection and loading belong to the wizard. A choice receipt is the next state when it contains the current revision and pendingChoice; use state when waiting or evidence is missing. Save at ready-to-save, run only if requested, wait for terminal, then list/read artifacts. Preserve wizardToken and runToken from their issuing results; every wizard call carries wizardToken. Artifact cursor comes from the preceding read of that artifact and format; continue until eof.

## dsagent.wizard.start

Gateway: `dsagent_invoke`; risk: `reversible-write`; concurrency: `exclusive-target`.

```json
{"type":"object","additionalProperties":false,"properties":{"kind":{"type":"string","enum":["scrape","record"]},"pageContextId":{"type":"string","pattern":"^[A-Za-z0-9_.:-]{8,128}$","maxLength":128},"adoptActive":{"type":"boolean"},"taskDescription":{"type":"string","minLength":1,"maxLength":2000},"collectHint":{"type":"string","minLength":1,"maxLength":300}},"required":["kind"]}
```

[Meanings and results](../capabilities/dsagent.wizard.start.md) · [Full contract](../contracts/dsagent.wizard.start.json)

## dsagent.wizard.state

Gateway: `dsagent_read`; risk: `read-sensitive`; concurrency: `shared-read`.

```json
{"type":"object","additionalProperties":false,"properties":{"wizardId":{"type":"string","pattern":"^wiz_[a-f0-9]{32}$","maxLength":36},"wizardToken":{"type":"string","pattern":"^[A-Za-z0-9]{16,128}$","minLength":16,"maxLength":128},"sinceRevision":{"type":"string","pattern":"^[a-f0-9]{16}$","maxLength":16},"waitMs":{"type":"integer","minimum":0,"maximum":25000}},"required":["wizardId"]}
```

[Meanings and results](../capabilities/dsagent.wizard.state.md) · [Full contract](../contracts/dsagent.wizard.state.json)

## dsagent.wizard.choose

Gateway: `dsagent_invoke`; risk: `reversible-write`; concurrency: `exclusive-target`.

```json
{"type":"object","additionalProperties":false,"properties":{"wizardId":{"type":"string","pattern":"^wiz_[a-f0-9]{32}$","maxLength":36},"wizardToken":{"type":"string","pattern":"^[A-Za-z0-9]{16,128}$","minLength":16,"maxLength":128},"expectedRevision":{"type":"string","pattern":"^[a-f0-9]{16}$","maxLength":16},"choiceId":{"type":"string","enum":["page-changes","pagination","pick-next-control","data-source","pick-sample-record","fields","nested-data","detail-pages","detail-pagination","detail-interactions","detail-pick-next-control","detail-data-source","detail-fields","detail-nested-data","page-content","detail-page-content","data-processing","after-scrape","recording-control","form-fields","upload-slots","repeat-items","repeat-item-actions","option-panel","option-groups","option-image","option-fields","option-preview","workflow-details"]},"optionIds":{"type":"array","maxItems":200,"uniqueItems":true,"items":{"type":"string","pattern":"^opt_[a-f0-9]{12}$","maxLength":16}},"values":{"type":"object","additionalProperties":false,"properties":{"collectHint":{"type":"string","minLength":1,"maxLength":300},"maxRecords":{"type":"integer","minimum":0,"maximum":100000},"stopBefore":{"type":"object","additionalProperties":false,"properties":{"field":{"type":"string","minLength":1,"maxLength":80},"before":{"type":"string","minLength":1,"maxLength":64}},"required":["field","before"]},"detailUrlSuffix":{"type":"string","maxLength":300},"pageQueryParam":{"type":"string","pattern":"^[A-Za-z0-9_.\\[\\]-]{1,64}$","maxLength":64},"fieldLabels":{"type":"array","maxItems":200,"items":{"type":"object","additionalProperties":false,"properties":{"optionId":{"type":"string","pattern":"^opt_[a-f0-9]{12}$","maxLength":16},"label":{"type":"string","minLength":1,"maxLength":80}},"required":["optionId","label"]}},"maxChildrenPerParent":{"type":"integer","minimum":1,"maximum":10000},"fieldRules":{"type":"array","maxItems":200,"items":{"type":"object","additionalProperties":false,"properties":{"optionId":{"type":"string","pattern":"^opt_[a-f0-9]{12}$","maxLength":16},"rules":{"type":"array","maxItems":10,"items":{"type":"object","additionalProperties":false,"properties":{"match":{"type":"string","enum":["contains","not-contains"]},"value":{"type":"string","minLength":1,"maxLength":200}},"required":["match","value"]}}},"required":["optionId","rules"]}},"maxConcurrency":{"type":"integer","minimum":1,"maximum":20},"maxItems":{"type":"integer","minimum":1,"maximum":10000},"maxPages":{"type":"integer","minimum":1,"maximum":10000},"swapLabelValue":{"type":"array","maxItems":200,"uniqueItems":true,"items":{"type":"string","pattern":"^opt_[a-f0-9]{12}$","maxLength":16}},"sampleUploads":{"type":"array","maxItems":50,"items":{"type":"object","additionalProperties":false,"properties":{"optionId":{"type":"string","pattern":"^opt_[a-f0-9]{12}$","maxLength":16},"kind":{"type":"string","enum":["image","text"]}},"required":["optionId","kind"]}},"pageMarkdown":{"type":"object","additionalProperties":false,"properties":{"profile":{"type":"string","enum":["balanced","minimal","aggressive"]},"links":{"type":"string","enum":["inline","citations","none"]},"fit":{"type":"boolean"},"frontMatter":{"type":"boolean"}},"required":[]},"name":{"type":"string","minLength":1,"maxLength":100},"description":{"type":"string","maxLength":500},"stepIds":{"type":"array","maxItems":50,"items":{"type":"string","pattern":"^opt_[a-f0-9]{12}$","maxLength":16}}},"required":[]}},"required":["wizardId","expectedRevision","choiceId"]}
```

[Meanings and results](../capabilities/dsagent.wizard.choose.md) · [Full contract](../contracts/dsagent.wizard.choose.json)

## dsagent.wizard.save

Gateway: `dsagent_invoke`; risk: `reversible-write`; concurrency: `exclusive-target`.

```json
{"type":"object","additionalProperties":false,"properties":{"wizardId":{"type":"string","pattern":"^wiz_[a-f0-9]{32}$","maxLength":36},"wizardToken":{"type":"string","pattern":"^[A-Za-z0-9]{16,128}$","minLength":16,"maxLength":128},"expectedRevision":{"type":"string","pattern":"^[a-f0-9]{16}$","maxLength":16}},"required":["wizardId","expectedRevision"]}
```

[Meanings and results](../capabilities/dsagent.wizard.save.md) · [Full contract](../contracts/dsagent.wizard.save.json)

## dsagent.wizard.run

Gateway: `dsagent_invoke`; risk: `external-effect`; concurrency: `exclusive-target`.

```json
{"type":"object","additionalProperties":false,"properties":{"wizardId":{"type":"string","pattern":"^wiz_[a-f0-9]{32}$","maxLength":36},"wizardToken":{"type":"string","pattern":"^[A-Za-z0-9]{16,128}$","minLength":16,"maxLength":128},"expectedRevision":{"type":"string","pattern":"^[a-f0-9]{16}$","maxLength":16}},"required":["wizardId","expectedRevision"]}
```

[Meanings and results](../capabilities/dsagent.wizard.run.md) · [Full contract](../contracts/dsagent.wizard.run.json)

## dsagent.execution.wait

Gateway: `dsagent_read`; risk: `read-sensitive`; concurrency: `shared-read`.

```json
{"type":"object","properties":{"executionId":{"type":"string","maxLength":128},"timeoutMs":{"type":"integer","minimum":100,"maximum":30000},"runToken":{"type":"string","maxLength":128,"pattern":"^[A-Za-z0-9_-]{16,128}$"}},"required":["executionId"],"additionalProperties":false}
```

[Meanings and results](../capabilities/dsagent.execution.wait.md) · [Full contract](../contracts/dsagent.execution.wait.json)

## dsagent.artifacts.list

Gateway: `dsagent_read`; risk: `read-sensitive`; concurrency: `shared-read`.

```json
{"type":"object","additionalProperties":false,"properties":{"executionId":{"type":"string","minLength":1,"maxLength":128},"includeCompleteness":{"type":"boolean"}},"required":["executionId"]}
```

[Meanings and results](../capabilities/dsagent.artifacts.list.md) · [Full contract](../contracts/dsagent.artifacts.list.json)

## dsagent.artifact.read

Gateway: `dsagent_read`; risk: `read-sensitive`; concurrency: `shared-read`.

```json
{"type":"object","additionalProperties":false,"properties":{"artifactId":{"type":"string","minLength":1,"maxLength":256},"cursor":{"type":"string","minLength":1,"maxLength":512},"format":{"type":"string","enum":["records","jsonl","csv"]},"pageBytes":{"type":"integer","minimum":1024,"maximum":65536}},"required":["artifactId"]}
```

[Meanings and results](../capabilities/dsagent.artifact.read.md) · [Full contract](../contracts/dsagent.artifact.read.json)
