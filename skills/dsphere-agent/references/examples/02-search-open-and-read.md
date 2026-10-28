# Example 2 — search, open a result, read it

**Task:** "On Bing, search for 'DSphere Agent browser automation', open the first organic result and tell me what the page is about." Route: atomic actions; the search is the only effect the task authorises.
**Recorded:** 2026-10-28 on DsWorkspace (shared build 55784943). Results trimmed as in example 1: a few targets kept, long text cut. If the result opens behind a verification wall, continue as in [example 4](04-verification-wall-mid-task.md).

## 1. Open the search site

```json request
{"method":"dsagent.page.open","args":{"url":"https://cn.bing.com/","taskDescription":"On Bing, search for \"DSphere Agent browser automation\", open the first organic result and tell me what the page is about. Read only beyond the search itself; do not sign in or submit any other form."},"idempotencyKey":"open-ex2-bing-20261028-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_f3ef90412e9e33d830393f7a566f6309","status":"succeeded","data":{"pageContextId":"pigdnq","revision":"1q2d6rc","url":"https://www.bing.com/?mkt=zh-CN","title":"Search - Microsoft Bing","rendered":true,"authentication":{"status":"no-wall"},"change":"full","semanticText":"Microsoft Logo Image Images Videos Translate Maps Academic More Sign in …","targets":{"mode":"full","added":[{"id":"page","kind":"page","label":"Current page","role":"document","capabilities":["fill-form","press-key","reload"]},{"id":"qin9","label":"","role":"searchbox","fieldPurpose":"search","state":"empty","capabilities":["click","edit-text","input","paste","press-key"]},{"id":"qin42","label":"Trending on Bing","role":"link","navigationUrl":"/search?q=Trending%20on%20Bing&form=HPNN01"}],"changed":[],"removedTargetIds":[],"commonCapabilities":["click","dismiss","hover","press-key","upload-file"]},"omittedTargets":9}}}
```

Notice: the open answers with the page's first view, so no separate read is needed. `pigdnq` is the page handle and `qin9` the search box (`fieldPurpose: search`). A same-origin link is listed by its path (`/search?…`). `page.find` gives a link's exact address.

## 2. Type, submit and wait in one batch — refused before dispatch

```json request
{"method":"dsagent.page.actions","args":{"pageContextId":"pigdnq","expectedRevision":"1q2d6rc","actions":[{"targetId":"qin9","action":"input","value":"DSphere Agent browser automation"},{"targetId":"qin9","action":"press-key","key":"Enter"},{"waitFor":{"until":"url-changed","timeoutMs":10000}}]},"idempotencyKey":"search-ex2-bing-20261028-01"}
```

```json result
{"ok":false,"error":{"code":"STALE_OBSERVATION","stage":"pre-dispatch","dispatchStatus":"not-dispatched","retryable":true,"message":"target evidence expired or changed before dispatch; observe again","hint":"Nothing was dispatched: read the page or the catalog again and decide again with the new revision or generation (a new idempotencyKey).","details":{"dispatchStatus":"not-dispatched","sequenceExecuted":"0","sequenceIndex":"0","sequenceSteps":"3","targetCheck":"signature","targetFailure":"context-changed"}}}
```

Notice: `targetCheck: signature` says the box's own words changed: its placeholder rotates through trending topics. Nothing was dispatched, so read the box again.

## 3. Re-locate the box (read-only), then run the batch with the fresh revision

```json request
{"method":"dsagent.page.find","args":{"pageContextId":"pigdnq","query":"search","role":"searchbox","limit":1}}
```

```json result
{"ok":true,"data":{"operationId":"op_51e3989d7295c38f343aa8ee822afce3","status":"succeeded","data":{"pageContextId":"pigdnq","revision":"idt6kh","query":"search","searched":5,"truncated":false,"authentication":{"status":"no-wall"},"matches":[{"score":65,"matchedOn":["role"],"target":{"id":"qin9","label":"西甲主席会见中国大使","role":"searchbox","fieldPurpose":"search","state":"empty","capabilities":["click","dismiss","edit-text","hover","input","paste","press-key"]}}]}}}
```

```json request
{"method":"dsagent.page.actions","args":{"pageContextId":"pigdnq","expectedRevision":"idt6kh","actions":[{"targetId":"qin9","action":"input","value":"DSphere Agent browser automation"},{"targetId":"qin9","action":"press-key","key":"Enter"},{"waitFor":{"until":"url-changed","timeoutMs":10000}}]},"idempotencyKey":"search-ex2-bing-20261028-02"}
```

```json result
{"ok":true,"data":{"operationId":"op_34670b6cdf503eb0aa20bb0b97e22b81","status":"succeeded","data":{"pageContextId":"pigdnq","previousRevision":"idt6kh","revision":"1qz5xen","executed":3,"authentication":{"status":"no-wall"},"receipts":[{"index":0,"action":"input","success":true,"targetId":"qin9","effect":{"kind":"value-changed","confidence":"observed","evidence":["input"]},"previousRevision":"idt6kh","revision":"19gsevj"},{"index":1,"action":"press-key","success":false,"outcomeUnknown":true,"targetId":"qin9","detail":"page action did not return a verified outcome","previousRevision":"19gsevj","revision":"10ukkrq"},{"index":2,"success":true,"detail":"url-changed met","waitFor":{"until":"url-changed","outcome":"met","waitedMs":121},"previousRevision":"10ukkrq","revision":"j2b3bn"}],"final":{"success":true,"change":"full","revision":"1qz5xen","url":"https://www.bing.com/search?q=DSphere+Agent+browser+automation&form=QBLH","title":"DSphere Agent browser automation - Search","targets":{"mode":"full","added":[{"id":"eho12","label":"Academic","role":"link","navigationUrl":"/academic/search?q=DSphere+Agent+browser+automation&FORM=HDRSC4"},{"id":"eho17","label":"Local ds4-agent for Browser Automation and Unrestricted Access","role":"link","navigationUrl":"https://medium.com/coding-nexus/local-ds4-agent-for-browser-automation-and-unrestricted-access-9e3e5bde7955"},{"id":"eho19","label":"GitHub - dsphere/dsphere-agent: DSphere Agent is a native MCP …","role":"link","navigationUrl":"https://github.com/dsphere/dsphere-agent"}],"changed":[],"removedTargetIds":[],"commonCapabilities":["click","dismiss","hover","press-key","upload-file"]},"omittedTargets":18}}}}
```

Notice: the Enter's own outcome is unknown, but the `waitFor` step says what you expected: the address changed. `final` is the results page, so no read is needed before the click. Results on another site keep their full address.

## 4. Click the first result

```json request
{"method":"dsagent.page.action","args":{"pageContextId":"pigdnq","targetId":"eho17","expectedRevision":"1qz5xen","action":"click"},"idempotencyKey":"click-ex2-result1-20261028-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_796cc7339497279cf269c19ed9bf47be","status":"succeeded","data":{"pageContextId":"ptnyl9","sourcePageContextId":"pigdnq","destinationPageContextId":"ptnyl9","action":"click","success":true,"detail":"Click opened and adopted a browser-created child tab","effect":{"kind":"navigated","confidence":"observed","evidence":["clickOpenedNewTab","urlChanged","navigationUrl"]},"previousRevision":"1qz5xen","revision":"1liuxge","url":"https://medium.com/coding-nexus/local-ds4-agent-for-browser-automation-and-unrestricted-access-9e3e5bde7955","title":"Local ds4-agent for Browser Automation and Unrestricted Access | by Jatin Prasad | Coding Nexus | Medium","authentication":{"status":"no-wall"},"change":"full","semanticText":"… Local ds4-agent for Browser Automation and Unrestricted Access ds4 with inference engine and Chrome CDP integration to bypass anti-bot measures 5 min read Jun 17, 2026 What if I told you, you can accomplish all your browser automation tasks simply by connecting a local DeepSeek V4 Flash model directly to your everyday Chrome b"}}}
```

Notice: the link opened a new tab, so the result's `pageContextId` is the **destination** page (`ptnyl9`); the search tab stays open under `pigdnq`. The receipt is the new page's first view, and its `semanticText` already answers the task. Close both pages when done.
