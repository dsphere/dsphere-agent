# Example 2 — search, open a result, read it

**Task:** "On Bing, search for 'DSphere Agent browser automation', open the first organic result and tell me what the page is about." Route: atomic actions; the search is the only effect the task authorises.
**Recorded:** 2026-10-21 on DsWorkspace (Extension 1.1.25.5). Results trimmed as in example 1. It continues in [example 4](04-verification-wall-mid-task.md), because the result page opened behind a verification wall.

## 1. Open the search site

```json request
{"method":"dsagent.page.open","args":{"url":"https://cn.bing.com/","taskDescription":"On Bing, search for \"DSphere Agent browser automation\", open the first organic result and tell me what the page is about. Read only beyond the search itself; do not sign in or submit any other form."},"idempotencyKey":"open-ex2-bing-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_acb8317080de5f10184e5f76b530dd1b","status":"succeeded","data":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","revision":"aga2qj","url":"https://www.bing.com/?mkt=zh-CN","title":"Search - Microsoft Bing","rendered":true,"authentication":{"status":"no-wall"}}}}
```

## 2. Find the search box by what the page shows (read-only)

```json request
{"method":"dsagent.page.find","args":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","query":"搜索"}}
```

```json result
{"ok":true,"data":{"operationId":"op_7ec48413c4bd71b6a832d1bb8b267db7","status":"succeeded","data":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","revision":"kbutwl","query":"搜索","searched":1,"truncated":false,"authentication":{"status":"no-wall"},"matches":[{"score":65,"matchedOn":["role"],"target":{"id":"target-5563f851-d1c3-4887-9ab6-2bf93264771f-8","kind":"interactive","role":"search","ariaRole":"searchbox","fieldPurpose":"search","label":"多地生物地理不计入中考","labelSource":"accessible-name","capabilities":["click","hover","input","press-key"],"inViewport":true,"occluded":false,"state":"empty"}}]}}}
```

Notice: the revision moved from `aga2qj` to `kbutwl` while the page finished rendering. Always act with the newest revision you hold. The odd `label` is the box's placeholder text; `fieldPurpose: search` is the evidence that matters.

## 3. Type and submit as one batch (two steps decided from one observation)

```json request
{"method":"dsagent.page.actions","args":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","expectedRevision":"kbutwl","actions":[{"targetId":"target-5563f851-d1c3-4887-9ab6-2bf93264771f-8","action":"input","value":"DSphere Agent browser automation"},{"targetId":"target-5563f851-d1c3-4887-9ab6-2bf93264771f-8","action":"press-key","key":"Enter"}]},"idempotencyKey":"search-ex2-bing-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_ea5abfecc131e63494ab3724c741f49a","status":"succeeded","data":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","previousRevision":"kbutwl","revision":"12btyf8","executed":2,"stopped":{"index":1,"reason":"navigated"},"receipts":[{"index":0,"action":"input","success":true,"effect":{"kind":"value-changed","confidence":"observed","evidence":["input"]},"previousRevision":"kbutwl","revision":"1d35j4f"},{"index":1,"action":"press-key","success":true,"effect":{"kind":"navigated","confidence":"observed","evidence":["navigationUrl","urlChanged","keyEffectObserved"]},"previousRevision":"1d35j4f","revision":"12btyf8"}],"final":{"action":"press-key","success":true,"change":"full","revision":"12btyf8","url":"https://www.bing.com/search?q=DSphere+Agent+browser+automation&form=QBLH","title":"DSphere Agent browser automation - Search","targets":{"mode":"full","added":[{"id":"target-3cf64e97-e4af-4ab8-9124-9aac23db3a20-17","kind":"interactive","role":"a","ariaRole":"link","label":"Local ds4-agent for Browser Automation and Unrestricted Access","labelContext":{"scopeId":"control-region-1nerf8g","source":"record","text":"17 Jun 2026 · Tabs are created and controlled in the background using the Chrome DevTools Protocol over WebSocket. The agent …"},"navigationUrl":"https://medium.com/coding-nexus/local-ds4-agent-for-browser-automation-and-unrestricted-access-9e3e5bde7955","capabilities":["click","hover","press-key"],"inViewport":true,"occluded":false},{"id":"target-3cf64e97-e4af-4ab8-9124-9aac23db3a20-19","kind":"interactive","role":"a","ariaRole":"link","label":"GitHub - dengpeihua/dsh-browser-use: Native DeepSeek Harness browser ...","navigationUrl":"https://github.com/dengpeihua/dsh-browser-use","capabilities":["click","hover","press-key"],"inViewport":true,"occluded":false}],"changed":[],"removedTargetIds":[]}}}}}
```

Notice: `stopped.reason=navigated` ends the batch and `final` is your next observation: the results page, same `pageContextId`, new revision `12btyf8`, 38 targets (two kept here). The title confirms the search was submitted; typing alone would not have. The monitor's `authentication` verdict sits beside `final` on the reply itself, as on every page read and action, never inside the receipt.

## 4. Click the first result — refused before dispatch

```json request
{"method":"dsagent.page.action","args":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","targetId":"target-3cf64e97-e4af-4ab8-9124-9aac23db3a20-17","expectedRevision":"12btyf8","action":"click"},"idempotencyKey":"click-ex2-result1-2413b7e5-01"}
```

```json result
{"ok":false,"error":{"code":"STALE_OBSERVATION","stage":"pre-dispatch","dispatchStatus":"not-dispatched","retryable":true,"message":"target evidence expired or changed before dispatch; observe again","hint":"Nothing was dispatched: read the page or the catalog again and decide again with the new revision or generation (a new idempotencyKey).","details":{"dispatchStatus":"not-dispatched"}}}
```

Notice: the results page re-rendered after the batch, so `12btyf8` was stale. `dispatchStatus=not-dispatched` means nothing happened; do what `hint` says — read again, then act with the new revision and a **new** key.

## 5. Re-locate the link (read-only), then click with the fresh revision

```json request
{"method":"dsagent.page.find","args":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","query":"Local ds4-agent for Browser Automation","role":"link","limit":2}}
```

```json result
{"ok":true,"data":{"operationId":"op_b306a09342564ede6f1570a64c59885c","status":"succeeded","data":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","revision":"q5kxkv","query":"Local ds4-agent for Browser Automation","searched":11,"truncated":false,"authentication":{"status":"no-wall"},"matches":[{"score":91,"matchedOn":["label"],"target":{"id":"target-3cf64e97-e4af-4ab8-9124-9aac23db3a20-17","kind":"interactive","role":"a","ariaRole":"link","label":"Local ds4-agent for Browser Automation and Unrestricted Access","navigationUrl":"https://medium.com/coding-nexus/local-ds4-agent-for-browser-automation-and-unrestricted-access-9e3e5bde7955","capabilities":["click","hover","press-key"],"inViewport":true,"occluded":false}}]}}}
```

```json request
{"method":"dsagent.page.action","args":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","targetId":"target-3cf64e97-e4af-4ab8-9124-9aac23db3a20-17","expectedRevision":"q5kxkv","action":"click"},"idempotencyKey":"click-ex2-result1-2413b7e5-02"}
```

```json result
{"ok":true,"data":{"operationId":"op_8f06e18df92e77d86a519e8ccf5a2d0e","status":"succeeded","data":{"pageContextId":"page_05954b3d-d308-4912-b5a2-3be0e5eef927","sourcePageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","destinationPageContextId":"page_05954b3d-d308-4912-b5a2-3be0e5eef927","action":"click","success":true,"detail":"Click opened and adopted a browser-created child tab","effect":{"kind":"navigated","confidence":"observed","evidence":["clickOpenedNewTab","urlChanged","navigationUrl"]},"previousRevision":"q5kxkv","revision":"nrax4x","url":"https://medium.com/coding-nexus/local-ds4-agent-for-browser-automation-and-unrestricted-access-9e3e5bde7955","title":"Just a moment...","authentication":{"status":"sign-in-required","type":"BOT_PROTECTION","confidence":80,"waitingOn":"agent","attemptsLeft":12}}}}
```

Notice: the link opened a new tab, so the result's `pageContextId` is the **destination** page (`destinationPageContextId`); the search tab stays open under its old id. And `authentication.status` is `sign-in-required`: a verification wall. No more effects on that page — continue in [example 4](04-verification-wall-mid-task.md).
