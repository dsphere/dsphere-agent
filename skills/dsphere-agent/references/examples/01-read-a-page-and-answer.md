# Example 1 — read a page and answer a question

**Task:** "Open 阮一峰的网络日志 (ruanyifeng.com/blog) and tell me the title and date of the most recent post." Route: atomic actions, read-only.
**Recorded:** 2026-10-21 on DsWorkspace (Extension 1.1.25.5), one browser online so no `instanceId`. Results are the real tool outputs with long arrays and text shortened; every field name is real. Targets re-encoded 2026-10-28 to the compact target contract (one role, no default fields, `page` for the page itself).

Four calls: open the page → observe it → read its text → close the page you opened. Each fence tagged `request` is the exact `dsagent_invoke` arguments; each `result` is what came back.

## 1. Open the page (an effect: needs a fresh `idempotencyKey`; the first call names the task)

```json request
{"method":"dsagent.page.open","args":{"url":"https://www.ruanyifeng.com/blog/","taskDescription":"Open 阮一峰的网络日志 (ruanyifeng.com/blog) and tell me the title and date of the most recent post on the front page. Read only; do not click anything."},"idempotencyKey":"open-ex1-ruanyifeng-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_ff41ca8c564a8023de5c4e4942cc739c","status":"succeeded","data":{"pageContextId":"page_b3bdc86a-4d40-4276-80d4-20ae6838c034","revision":"evhs36","url":"https://www.ruanyifeng.com/blog/index.html","title":"阮一峰的网络日志","rendered":true,"authentication":{"status":"no-wall"}}}}
```

Notice: the business payload sits at `data.data`; the outer `operationId` only names this call. Copy `pageContextId` into every later call on this page. `authentication.status` is `no-wall`, so you may continue.

## 2. Observe the page (read-only: no key)

```json request
{"method":"dsagent.page.observe","args":{"pageContextId":"page_b3bdc86a-4d40-4276-80d4-20ae6838c034"}}
```

```json result
{"ok":true,"data":{"operationId":"op_0a3458a8d5fa828bda48ecc280da554d","status":"succeeded","data":{"pageContextId":"page_b3bdc86a-4d40-4276-80d4-20ae6838c034","revision":"evhs36","change":"full","url":"https://www.ruanyifeng.com/blog/index.html","title":"阮一峰的网络日志","authentication":{"status":"no-wall"},"structure":{"headings":[{"level":1,"text":"阮一峰的网络日志"},{"level":2,"text":"科技爱好者周刊（第 415 期）：3D 版《看不见的城市》"},{"level":3,"text":"最新文章"}],"landmarks":[],"truncated":false},"semanticText":"搜索 订阅Feed 科技爱好者周刊（第 415 期）：3D 版《看不见的城市》 周刊 继续阅读全文 » 留言（19） 科技爱好者周刊（第 414 期）：Jev 决策模型有什么用 [context: 2026年10月 8日 »] …","semanticTextKind":"control-labels","targets":{"mode":"full","added":[{"id":"page","kind":"page","role":"document","label":"Current page","capabilities":["detect-form-fields","fill-form","press-key","scroll","reload"]},{"id":"target-e3a2f884-e2cf-4c90-b162-ec2a917238b5-1","role":"textbox","label":"","fieldPurpose":"search","capabilities":["click","hover","input","press-key"],"state":"empty"},{"id":"target-e3a2f884-e2cf-4c90-b162-ec2a917238b5-4","role":"link","label":"科技爱好者周刊（第 415 期）：3D 版《看不见的城市》","navigationUrl":"https://www.ruanyifeng.com/blog/2026/10/weekly-issue-415.html","capabilities":["click","hover","press-key"]}],"changed":[],"removedTargetIds":[]},"truncation":{"targets":{"candidates":28,"omitted":0,"published":28,"reach":"viewport"},"semanticText":{"chars":1055,"truncated":false}},"visibleRecordCount":17}}}
```

Notice: `revision` (`evhs36`) is the page's state stamp and `targets.added[].id` are the only handles a later `dsagent.page.action` accepts; both are copied, never invented. `semanticText` and `structure` are a bounded summary for planning, not the whole page. 28 targets came back; the example keeps three.

## 3. Read the text (read-only)

```json request
{"method":"dsagent.page.markdown","args":{"pageContextId":"page_b3bdc86a-4d40-4276-80d4-20ae6838c034"}}
```

```json result
{"ok":true,"data":{"operationId":"op_6cd2c1622f7b4da4a86f0a1318a0424e","status":"succeeded","data":{"pageContextId":"page_b3bdc86a-4d40-4276-80d4-20ae6838c034","revision":"evhs36","format":"markdown","markdown":"# 阮一峰的网络日志\n\n## 科技爱好者周刊（第 415 期）：3D 版《看不见的城市》⟨3⟩\n\n分类： 周刊⟨4⟩\n\n这里记录每周值得分享的科技内容，周五发布。\n\n2026年10月16日 08:02 | 留言（19）⟨5⟩\n\n### 最新文章\n\n- 2026年10月 8日 » 科技爱好者周刊（第 414 期）：Jev 决策模型有什么用⟨6⟩\n- 2026年09月18日 » 科技爱好者周刊（第 413 期）：再见了，React Native⟨7⟩\n…","references":[{"index":3,"text":"科技爱好者周刊（第 415 期）：3D 版《看不见的城市》","url":"https://www.ruanyifeng.com/blog/2026/10/weekly-issue-415.html"}],"truncated":false,"metadata":{"capturedAt":"2026-10-21T03:50:43.337Z","language":"zh-CN"},"url":"https://www.ruanyifeng.com/blog/index.html","title":"阮一峰的网络日志"}}}
```

Notice: `markdown` answers the question (latest post: 科技爱好者周刊（第 415 期）：3D 版《看不见的城市》, 2026-10-16). The `⟨n⟩` marks are citation indexes into `references`; they are evidence of the links, not an invitation to open them.

## 4. Close the page you opened (an effect)

```json request
{"method":"dsagent.page.close","args":{"pageContextId":"page_b3bdc86a-4d40-4276-80d4-20ae6838c034"},"idempotencyKey":"close-ex1-ruanyifeng-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_f52c078856b51bd8b6f1b1fe273ccf24","status":"succeeded","data":{"pageContextId":"page_b3bdc86a-4d40-4276-80d4-20ae6838c034","closed":true,"alreadyClosed":false}}}
```

Then answer the user from step 3. Only pages you opened with `dsagent.page.open` may be closed; the user's own tabs stay.
