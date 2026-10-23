# Example 4 — a verification wall mid-task

**Task:** the continuation of [example 2](02-search-open-and-read.md): the clicked result opened behind a Cloudflare check. Route: the wall pauses the task; it never ends it and you never try to pass it yourself.
**Recorded:** 2026-10-21 on DsWorkspace (Extension 1.1.25.5). Values already held from example 2:

```json context
{"searchPageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","resultTargetId":"target-3cf64e97-e4af-4ab8-9124-9aac23db3a20-17","revision":"q5kxkv"}
```

## 1. The click whose destination is a wall (from example 2, step 5)

```json request
{"method":"dsagent.page.action","args":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","targetId":"target-3cf64e97-e4af-4ab8-9124-9aac23db3a20-17","expectedRevision":"q5kxkv","action":"click"},"idempotencyKey":"click-ex2-result1-2413b7e5-02"}
```

```json result
{"ok":true,"data":{"operationId":"op_8f06e18df92e77d86a519e8ccf5a2d0e","status":"succeeded","data":{"pageContextId":"page_05954b3d-d308-4912-b5a2-3be0e5eef927","destinationPageContextId":"page_05954b3d-d308-4912-b5a2-3be0e5eef927","action":"click","success":true,"effect":{"kind":"navigated","confidence":"observed","evidence":["clickOpenedNewTab","urlChanged"]},"revision":"nrax4x","url":"https://medium.com/coding-nexus/local-ds4-agent-for-browser-automation-and-unrestricted-access-9e3e5bde7955","title":"Just a moment...","authentication":{"status":"sign-in-required","type":"BOT_PROTECTION","confidence":80,"waitingOn":"agent","attemptsLeft":12},"targets":{"mode":"full","added":[{"id":"target-4b886f0e-0f44-4701-b000-8ca4683d9dbe-1","kind":"interactive","role":"a","ariaRole":"link","label":"Cloudflare, opens in a new tab","capabilities":["click","hover"],"inViewport":true,"occluded":false}],"changed":[],"removedTargetIds":[]}}}}
```

Notice: the click itself succeeded; the **page** is the problem. `authentication.status=sign-in-required`, `type=BOT_PROTECTION`, `waitingOn=agent`, `attemptsLeft=12`: a verification challenge **you** hold and try to pass first, as a person would — `dsagent.page.visual.observe` to see it, `dsagent.page.observe` / `dsagent.page.find` for its controls, then click a checkbox or tile, drag a slider, or type a code, and read again after each try. Here the only targets are Cloudflare's own links: a non-interactive check with nothing to act on, so this recording went straight to waiting (step 2) without a `visual.observe`. A sign-in wall is the other case (`waitingOn=person`, LOGIN_FORM / PHONE_LOGIN / SSO): no effects and no `dsagent.page.ask`; open the page through the saved application account first when the user named one (`dsagent.page.open` with its `accountId`), otherwise DSphere shows the wall to the person and you tell the user once to sign in and click Resume in the DSphere side panel.

## 2. Wait read-only for the wall to clear

```json request
{"method":"dsagent.page.wait","args":{"pageContextId":"page_05954b3d-d308-4912-b5a2-3be0e5eef927","until":"authentication-cleared","timeoutMs":25000}}
```

```json result
{"ok":true,"data":{"operationId":"op_6a23c7132b4c0171a1a0b6d3dfff2611","status":"succeeded","data":{"pageContextId":"page_05954b3d-d308-4912-b5a2-3be0e5eef927","until":"authentication-cleared","outcome":"met","waitedMs":217,"revision":"cp5vxh","url":"https://medium.com/coding-nexus/local-ds4-agent-for-browser-automation-and-unrestricted-access-9e3e5bde7955"}}}
```

Notice: here the check passed on its own in 217 ms. Had it stayed, the next tries would spend `attemptsLeft` (12 effect calls, 5 minutes); when they are spent, or you cannot pass it, call `dsagent.page.notify` on this page and the challenge becomes the person's (`waitingOn=person`). From then on, as for a sign-in wall, it takes as long as the person takes: `outcome: timed-out` is an honest answer, so call `dsagent.page.wait` again (or `dsagent.page.observe` every 20–30 s), tell the user once, and report the task as blocked only if they will not do it. Never retry the original click to "get past" a wall, and never close a challenge to skip it.

## 3. Continue at the same step: read the page

```json request
{"method":"dsagent.page.markdown","args":{"pageContextId":"page_05954b3d-d308-4912-b5a2-3be0e5eef927"}}
```

```json result
{"ok":true,"data":{"operationId":"op_9af43fbd60b9bd07ccc3fd4817f5ca8e","status":"succeeded","data":{"pageContextId":"page_05954b3d-d308-4912-b5a2-3be0e5eef927","revision":"1ggncoq","format":"markdown","title":"Local ds4-agent for Browser Automation and Unrestricted Access | by Jatin Prasad | Coding Nexus | Medium","markdown":"# Local ds4-agent for Browser Automation and Unrestricted Access\n\n## ds4 with inference engine and Chrome CDP integration to bypass anti-bot measures\n\nJatin Prasad⟨15⟩\n\n5 min readJun 17, 2026\n\nWhat if I told you, you can accomplish all your browser automation tasks simply by connecting a local DeepSeek V4 Flash model directly to your everyday Chrome browser via the Chrome DevTools Protocol (CDP). …\n\n## What Is ds4 and Why It Matters\n\nDwarfStar (ds4) is a small, native inference engine written primarily in C by Salvatore Sanfilippo (antirez), the creator of Redis. …\n\n## Create an account to read the full story.\n\nThe author made this story available to Medium members only.\n…","truncated":false,"metadata":{"author":"Jatin Prasad","publishedAt":"2026-06-17T05:51:00.544Z","language":"en","siteName":"Medium","description":"Run DeepSeek V4 Flash locally on Apple Silicon with Chrome browsing for unrestricted searches. Full setup guide, architecture insights, and productivity ideas."},"authentication":{"status":"no-wall"},"url":"https://medium.com/coding-nexus/local-ds4-agent-for-browser-automation-and-unrestricted-access-9e3e5bde7955"}}}
```

Notice: `authentication` is back to `no-wall`, so the task resumes exactly where it paused. The "Create an account to read the full story" block is a paywall, not a wall for you: answer from what is readable (a Medium article on running DeepSeek V4 Flash locally with ds4 and driving Chrome over CDP) and say the rest is members-only.

## 4. Close both pages the task opened

```json request
{"method":"dsagent.page.close","args":{"pageContextId":"page_05954b3d-d308-4912-b5a2-3be0e5eef927"},"idempotencyKey":"close-ex2-medium-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_60d33085c0853935bfba4fbff8e0f3c8","status":"succeeded","data":{"pageContextId":"page_05954b3d-d308-4912-b5a2-3be0e5eef927","closed":true,"alreadyClosed":false}}}
```

```json request
{"method":"dsagent.page.close","args":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec"},"idempotencyKey":"close-ex2-bing-2413b7e5-01"}
```

```json result
{"ok":true,"data":{"operationId":"op_8d77486838c702165958e1ae104a6d5f","status":"succeeded","data":{"pageContextId":"page_21463d51-cb70-4bea-91f9-f2a6d2497bec","closed":true,"alreadyClosed":false}}}
```
