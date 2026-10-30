# Playwright conversion sheet

The person has a Playwright script and wants it to run in DSphere. `dsagent.page.script` runs most Playwright page
code as written: its `page` object understands role-and-name locators, their actions, waits and `expect`. Convert
the rest in four steps, then run it like any script ([script sheet](script.md)).

## 1. Strip the harness

- Delete `import` / `require` lines, `test(...)` and `test.describe(...)` wrappers, `beforeEach`, and every `browser`,
  `context` and `chromium.launch` line. The script body is the test body; `page` is already given.
- Keep the steps inside the test as the script's `source`. Put values the person may change (search words, dates)
  in `input` and read them as `input.<name>`.

## 2. Replace navigation

- `await page.goto(url)` → open the page **before** the script with `dsagent.page.open {url, taskDescription}` and
  pass its `pageContextId`. A script works on the page it was given.
- A script that visits several pages: split it at each `goto` into one script per page.

## 3. Replace selectors

Role-and-name locators run as written. Selectors that point at the page's structure do not: read the page once with
`dsagent.page.observe` (or `dsagent.page.find`) and name the same control by its role and words.

| Playwright | In the script |
|---|---|
| `page.getByRole('button', { name: 'Search' })` | unchanged |
| `page.getByText('…')`, `getByLabel`, `getByPlaceholder`, `getByTitle`, `getByAltText` | unchanged |
| `page.locator('#search')`, `page.locator('input[name=q]')` | `page.getByRole('searchbox', { name: '<its label>' })` |
| `page.locator('text=Sign in')`, `page.locator('xpath=…')` | `page.getByText('Sign in')` / `page.getByRole(role, { name })` |
| `page.getByTestId('submit')` | `page.getByRole('button', { name: '<its label>' })` |
| `.first()`, `.nth(i)`, `.last()` | add words that tell the controls apart, or a role; a script never picks by position |
| `page.click('#id')`, `page.fill('#q', v)` | `page.getByRole(role, { name }).click()` / `.fill(v)` |

## 4. Move what scripts do not do

| Playwright | Instead |
|---|---|
| `page.evaluate(...)`, `page.$eval(...)` | read with `page.readText()` or `page.observe()`; never run code in the page |
| `page.route(...)`, network mocking | not available; drop it |
| `page.frameLocator(...)` | single dsagent calls on the frame's targets |
| `setInputFiles`, file chooser | `dsagent_upload_file`, then a single `dsagent.page.action` `upload-file` |
| `waitForEvent('download' / 'popup')`, dialogs | single dsagent calls (`dsagent.page.files.*`, `handle-dialog`) |
| `page.screenshot()` | `dsagent.page.visual.observe` |
| a final submit, payment, send or delete | end the script before it and do that step as a single call (or ask the person first) |

## What runs as written

| Locator / page call | Notes |
|---|---|
| `.click()`, `.dblclick()`, `.fill(v)`, `.pressSequentially(v)`, `.press(key)`, `.check()`, `.uncheck()`, `.selectOption(v)`, `.hover()` | resolved when it acts: the one control whose name is exactly the words, else the only one containing them, else the only one of that role. None yet: it waits up to 5 s once. Several: `TARGET_AMBIGUOUS` with the candidates |
| `.waitFor({ state })` | `visible`/`attached` or `hidden`/`detached` |
| `.textContent()`, `.innerText()`, `.isVisible()`, `.count()`, `.allTextContents()` | read through `page.find` |
| `page.waitForURL(part)`, `page.waitForLoadState()`, `page.waitForTimeout(ms)` | a URL check matches a part of the address (or a RegExp) |
| `page.keyboard.press(key)`, `page.url()`, `page.title()` | |
| `expect(locator).toBeVisible()/.toBeHidden()/.toHaveText()/.toContainText()/.toHaveCount()`, `expect(page).toHaveURL()/.toHaveTitle()`, `.not` | 5 s default timeout; failure is `EXPECTATION_FAILED` |

Anything not listed throws `INVALID_REQUEST` with a hint that names the replacement; no page call is made.

## Example

Recorded Playwright:

```js
import { test, expect } from '@playwright/test'
test('search', async ({ page }) => {
  await page.goto('https://example.com/')
  await page.locator('#q').fill('running shoes')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page).toHaveURL(/q=running/)
  await page.locator('.result >> nth=0').click()
})
```

Converted: open `https://example.com/` with `dsagent.page.open` first, observe the page to learn that `#q` is the
search box labelled "Search products", and that the first result is a link you choose after the search. Then:

```json
{"method":"dsagent.page.script","args":{"pageContextId":"<id>","description":"Search the shop for the given words and list the first results","input":{"q":"running shoes"},"source":"await page.getByRole('searchbox', { name: 'Search products' }).fill(input.q)\nawait page.getByRole('button', { name: 'Search' }).click()\nawait expect(page).toHaveURL('q=running')\nconst results = await page.find('', { role: 'link', limit: 5 })\nreturn results.matches.map(m => m.target.label)"},"idempotencyKey":"script-<uuid>"}
```

Notice: `.nth=0` became a read of the first results, and you open the one that matches the person's request with a
single `dsagent.page.action` click. Which result to open is a judgment about the content.
