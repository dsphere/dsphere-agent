# Example 3 — collect a list with the scrape wizard

**Task:** "Collect the 最新文章 list on the front page of 阮一峰的网络日志 into a dataset with each post's title, date and link; this page only; save the workflow and run it once." Route: a dataset → scrape wizard; the request for the data authorises the run.
**Recorded:** 2026-10-21 on DsWorkspace (Extension 1.1.25.5). Wizard results are trimmed to what each decision needs (options cut to the chosen one plus one alternative; `summary`, `nextActions` and step counters dropped where they did not change the decision).

Every wizard turn returns `revision`, `phase` and `pendingChoice` (`choiceId`, `options[].optionId`, `values[]`); you answer with `wizard.choose` bound to that `revision`, with `wizardId` and `wizardToken` every time.

## 1. Open the page, start the wizard

```json request
{"method":"dsagent.page.open","args":{"url":"https://www.ruanyifeng.com/blog/","taskDescription":"Collect the 最新文章 (latest posts) list on the front page of 阮一峰的网络日志 (ruanyifeng.com/blog) into a dataset with each post's title, date and link. This one page only, no pagination; save the workflow and run it once."},"idempotencyKey":"open-ex3-ruanyifeng-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_158b1f48de7efc02cea3da7250cdbc48","status":"succeeded","data":{"pageContextId":"page_15ca707c-0b2a-4da3-b620-2cb91f3287aa","revision":"1nvd0ib","url":"https://www.ruanyifeng.com/blog/index.html","title":"阮一峰的网络日志","rendered":true,"authentication":{"status":"no-wall"}}}}
```

```json request
{"method":"dsagent.wizard.start","args":{"kind":"scrape","pageContextId":"page_15ca707c-0b2a-4da3-b620-2cb91f3287aa","taskDescription":"Collect the 最新文章 (latest posts) list on the front page of 阮一峰的网络日志 (ruanyifeng.com/blog) into a dataset with each post's title, date and link. This one page only, no pagination; save the workflow and run it once."},"idempotencyKey":"wizard-ex3-ruanyifeng-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_e8648188aef5de03fb393c4e6de1f970","status":"succeeded","data":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","wizardToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9","kind":"scrape","revision":"1e2889ca5c6eaecb","phase":"pagination","nextActions":["choose","cancel"],"pendingChoice":{"choiceId":"pagination","selection":"single","minSelected":1,"maxSelected":1,"options":[{"optionId":"opt_9a21a4f34905","kind":"pagination-type","label":"none","detail":"detection inconclusive (confidence 10): no pagination was confirmed and none is only the default","recommended":false,"selected":true},{"optionId":"opt_f58b0f7d1773","kind":"pagination-type","label":"next-button","recommended":false,"selected":false}],"values":[{"name":"maxRecords","required":false,"current":50,"suggested":50}]},"summary":{"page":{"title":"阮一峰的网络日志","url":"https://www.ruanyifeng.com/blog/index.html"},"pagination":{"type":"none","maxRecords":50,"maxRecordsSource":"default","nextControlPicked":false},"fields":[],"detailPages":[]}}}}
```

Notice: `wizardToken` appears only here; keep it. The first decision is pagination; the task says one page, so `none` is right even though detection was inconclusive.

## 2. Decide each pending choice from the task

```json request
{"method":"dsagent.wizard.choose","args":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","wizardToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9","expectedRevision":"1e2889ca5c6eaecb","choiceId":"pagination","optionIds":["opt_9a21a4f34905"]},"idempotencyKey":"choose-ex3-pagination-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_cd963ca9b662212ac1a11b5cee133a96","status":"succeeded","data":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","revision":"1672acf7f48aba5c","phase":"data","pendingChoice":{"choiceId":"data-source","selection":"single","minSelected":1,"maxSelected":1,"options":[{"optionId":"opt_ef661af8d9df","kind":"data-block","label":"Lists: Title, Link","count":7,"detail":"7 items · 3 fields · under \"最新文章\"","recommended":true,"selected":true,"samples":["#1 · Field 1: 2026年10月 8日 » | Title: 科技爱好者周刊（第 414 期）：Jev 决策模型有什么用"],"where":{"heading":"最新文章","inViewport":true,"position":"main"}},{"optionId":"opt_3c028f35220e","kind":"action","label":"pick-sample-record","recommended":false,"selected":false}],"values":[{"name":"collectHint","required":false}]}}}}
```

Notice: detection found the 7-item block under the heading the task names; its `samples` are the evidence that it is the right list. `recommended` alone is not a reason.

```json request
{"method":"dsagent.wizard.choose","args":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","wizardToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9","expectedRevision":"1672acf7f48aba5c","choiceId":"data-source","optionIds":["opt_ef661af8d9df"]},"idempotencyKey":"choose-ex3-datasource-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_44f55a5c5fe94e082371eeea8bf9c2dd","status":"succeeded","data":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","revision":"da901fcb16588796","phase":"data","pendingChoice":{"choiceId":"fields","selection":"multiple","minSelected":1,"maxSelected":7,"options":[{"optionId":"opt_6690f03e44a5","kind":"field","label":"Field 1","labelSource":"fallback","detail":"text","recommended":true,"selected":true,"samples":["#1 · 2026年10月 8日 »"]},{"optionId":"opt_ceda14e71bbf","kind":"field","label":"Title","labelSource":"role","detail":"text","recommended":true,"selected":true,"samples":["#1 · 科技爱好者周刊（第 414 期）：Jev 决策模型有什么用"]},{"optionId":"opt_7bca6fb86f81","kind":"field","label":"Link","labelSource":"shape","detail":"link","recommended":true,"selected":true,"samples":["https://www.ruanyifeng.com/blog/2026/10/weekly-issue-414.html"]}],"values":[{"name":"fieldLabels","required":false},{"name":"fieldRules","required":false}]}}}}
```

```json request
{"method":"dsagent.wizard.choose","args":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","wizardToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9","expectedRevision":"da901fcb16588796","choiceId":"fields","optionIds":["opt_6690f03e44a5","opt_ceda14e71bbf","opt_7bca6fb86f81"],"values":{"fieldLabels":[{"optionId":"opt_6690f03e44a5","label":"Date"}]}},"idempotencyKey":"choose-ex3-fields-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_29f82af88163059b005d36f4e40cb5c6","status":"succeeded","data":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","revision":"ec766eda892c30a5","phase":"data","pendingChoice":{"choiceId":"detail-pages","selection":"single","minSelected":1,"maxSelected":1,"options":[{"optionId":"opt_daae5f535e2d","kind":"action","label":"no-detail-pages","recommended":true,"selected":false},{"optionId":"opt_091f8c4ff67a","kind":"link-field","label":"Link","recommended":false,"selected":false}],"values":[{"name":"detailUrlSuffix","required":false}]},"summary":{"fields":["Date","Title","Link"]}}}}
```

Notice: the three fields match the task; `Field 1` is the date, renamed through `values.fieldLabels`, which `pendingChoice.values` lists (send only values the choice lists). Three more choices the task does not need — detail pages, page content, data processing — get the option or empty selection that keeps the task as asked:

```json request
{"method":"dsagent.wizard.choose","args":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","wizardToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9","expectedRevision":"ec766eda892c30a5","choiceId":"detail-pages","optionIds":["opt_daae5f535e2d"]},"idempotencyKey":"choose-ex3-detailpages-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_126aa7451b4ed163e891fc8879a4e67a","status":"succeeded","data":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","revision":"f340fffe0e0d83ff","phase":"data","pendingChoice":{"choiceId":"page-content","selection":"multiple","minSelected":0,"maxSelected":3,"options":[{"optionId":"opt_2c6443136234","kind":"page-content","label":"page-markdown","recommended":false,"selected":false}],"values":[{"name":"pageMarkdown","required":false}]}}}}
```

```json request
{"method":"dsagent.wizard.choose","args":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","wizardToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9","expectedRevision":"f340fffe0e0d83ff","choiceId":"page-content","optionIds":[]},"idempotencyKey":"choose-ex3-pagecontent-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_da0e013e2e76ce3fc8126c4f4ac199f9","status":"succeeded","data":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","revision":"62888973bc79df54","phase":"data","pendingChoice":{"choiceId":"data-processing","selection":"multiple","minSelected":0,"maxSelected":2,"options":[{"optionId":"opt_6b3a25342dfe","kind":"output-destination","label":"csv-export","recommended":false,"selected":false}],"values":[]}}}}
```

```json request
{"method":"dsagent.wizard.choose","args":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","wizardToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9","expectedRevision":"62888973bc79df54","choiceId":"data-processing","optionIds":[]},"idempotencyKey":"choose-ex3-dataprocessing-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_e2da040449dbe24cb5adb4922c4a0f69","status":"succeeded","data":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","revision":"7e549ad70135a426","phase":"naming","pendingChoice":{"choiceId":"workflow-details","selection":"values-only","minSelected":0,"maxSelected":0,"options":[],"values":[{"name":"name","required":true,"suggested":"Scrape · Ruanyifeng"},{"name":"description","required":false,"suggested":"阮一峰的网络日志"}]}}}}
```

## 3. Name it from the task, save, run

```json request
{"method":"dsagent.wizard.choose","args":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","wizardToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9","expectedRevision":"7e549ad70135a426","choiceId":"workflow-details","optionIds":[],"values":{"name":"阮一峰的网络日志 最新文章","description":"Latest posts (date, title, link) from the front page of ruanyifeng.com/blog"}},"idempotencyKey":"choose-ex3-details-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_6e537473dac4f7e65e3e2cd2b08bd6a4","status":"succeeded","data":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","revision":"5ca8f4ea779af57b","phase":"ready-to-save","nextActions":["back","save","cancel"],"pendingChoice":null,"summary":{"page":{"title":"阮一峰的网络日志","url":"https://www.ruanyifeng.com/blog/index.html"},"pagination":{"type":"none","maxRecords":50,"maxRecordsSource":"default","nextControlPicked":false},"fields":["Date","Title","Link"],"detailPages":[],"source":{"kind":"block","label":"Lists: Title, Link","itemCount":7},"workflowName":"阮一峰的网络日志 最新文章"}}}}
```

Notice: `phase=ready-to-save`, `pendingChoice` is null and `nextActions` offers `save`. Check `summary` against the task (7 records, three fields, no pagination), then save without asking the user to confirm the name.

```json request
{"method":"dsagent.wizard.save","args":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","wizardToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9","expectedRevision":"5ca8f4ea779af57b"},"idempotencyKey":"save-ex3-ruanyifeng-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_73953f5e675ae9d87368016729a62ef4","status":"succeeded","data":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","revision":"8dabf35f4669c7b8","phase":"saved","nextActions":["run"],"pendingChoice":null,"workflowId":"e3bc31adcbe63f82efc674eb986761e6"}}}
```

```json request
{"method":"dsagent.wizard.run","args":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","wizardToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9","expectedRevision":"8dabf35f4669c7b8"},"idempotencyKey":"run-ex3-ruanyifeng-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_ae81bc165fb3d534bcc12a321e4337a2","status":"succeeded","data":{"wizardId":"wiz_a08355136f71410b95ea818aa0e9c874","revision":"64c22adedf9499f3","phase":"saved","nextActions":[],"pendingChoice":null,"workflowId":"e3bc31adcbe63f82efc674eb986761e6","executionId":"JJ10MA","runToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9"}}}
```

## 4. Wait for the run, then read the dataset

```json request
{"method":"dsagent.execution.wait","args":{"executionId":"JJ10MA","timeoutMs":25000,"runToken":"74b0a41cecfa45e0927f70b779d6bdbde72b70cb2deb4dbd9bc1caa9e1ed1ab9"}}
```

```json result
{"ok":true,"data":{"operationId":"op_53be33f1be7edafa1bd5e45e20ed0723","status":"succeeded","data":{"executionId":"JJ10MA","workflowId":"e3bc31adcbe63f82efc674eb986761e6","workflowName":"阮一峰的网络日志 最新文章","status":"success","lifecycle":"completed","terminal":true,"timedOut":false,"hasResult":true,"artifactCount":1,"durationMs":10677,"coverage":{"rowsSaved":7,"collectionFulfillment":{"status":"partial","collectedRecords":7,"shortfallVisits":0,"unresolvedVisits":0,"visitedParents":0,"truncated":false},"fieldsMissing":[{"field":"title","count":6}],"degradedOutcomes":[{"kind":"field-identity-refused","field":"title","count":6,"nodeId":"get-text-1792555751988-4"}]}}}}
```

Notice: `terminal=true` with `status=success` is not the whole story — read `coverage`. Here 7 rows were saved but `fieldsMissing` says `title` is empty in 6 of them. Report that; never call such a run complete.

```json request
{"method":"dsagent.artifacts.list","args":{"executionId":"JJ10MA"}}
```

```json result
{"ok":true,"data":{"operationId":"op_ed9ab9c899a0eb1b8a9234f80c1182b5","status":"succeeded","data":{"executionId":"JJ10MA","artifacts":[{"artifactId":"local-dataset:eyJleGVjdXRpb25JZCI6IkpKMTBNQSIsInNoZWV0SWQiOiJhZjc0NGIwZC0xYmIyLTQwNzMtYWRhMC1lYjc2NTIzYmQ1MzAifQ","name":"阮一峰的网络日志 最新文章","kind":"local_dataset","mediaType":"application/x-ndjson","rowCount":7,"columns":["Date","Title","Link"]}]}}}
```

```json request
{"method":"dsagent.artifact.read","args":{"artifactId":"local-dataset:eyJleGVjdXRpb25JZCI6IkpKMTBNQSIsInNoZWV0SWQiOiJhZjc0NGIwZC0xYmIyLTQwNzMtYWRhMC1lYjc2NTIzYmQ1MzAifQ"}}
```

```json result
{"ok":true,"data":{"operationId":"op_70fb19921740eaf2258d2cea80bd0ecb","status":"succeeded","data":{"artifactId":"local-dataset:eyJleGVjdXRpb25JZCI6IkpKMTBNQSIsInNoZWV0SWQiOiJhZjc0NGIwZC0xYmIyLTQwNzMtYWRhMC1lYjc2NTIzYmQ1MzAifQ","mediaType":"application/x-ndjson","cursor":"","nextCursor":null,"eof":true,"records":[{"rowId":"644ada04-cffc-4a89-88ff-431d4e211314","level":0,"data":{"Date":"2026年10月 8日 »","Title":"科技爱好者周刊（第 414 期）：Jev 决策模型有什么用","Link":"https://www.ruanyifeng.com/blog/2026/10/weekly-issue-414.html"}},{"rowId":"f082bedf-c313-4375-aeb7-8f9c0d109422","level":0,"data":{"Date":"2026年09月18日 »","Title":"","Link":"https://www.ruanyifeng.com/blog/2026/09/weekly-issue-413.html"}}]}}}
```

Notice: `eof=true` means the whole dataset is in hand (7 records; two shown). On `RESULT_LIMIT_EXCEEDED` read again with `format: csv` or `jsonl` and follow `nextCursor` to `eof`. Hand the user the data, the saved workflow name and the gap: six titles came back empty although the page shows them — a collection defect to report, not to patch over by reading the page yourself.

```json request
{"method":"dsagent.page.close","args":{"pageContextId":"page_15ca707c-0b2a-4da3-b620-2cb91f3287aa"},"idempotencyKey":"close-ex3-ruanyifeng-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_5d3741b05c6130b642f627cc5bdff29c","status":"succeeded","data":{"pageContextId":"page_15ca707c-0b2a-4da3-b620-2cb91f3287aa","closed":true,"alreadyClosed":true}}}
```

Notice: `alreadyClosed=true` — the finished run had already cleaned up the tab it used. Closing a page you opened is still right; the answer tells you nothing was left behind.
