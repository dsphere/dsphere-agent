# Feishu data in browser tasks (lark-cli + dsphere-agent)

A person keeps goods, posts or form data in a Feishu Base (多维表格), Sheet or Doc, and wants each row entered into a
web page (a store back office, a creator center). Read the data with the Feishu CLI (`lark-cli`), put it on the page
with dsphere-agent, write the outcome back. Feishu is never opened in the browser for this; lark-cli reads it.

## 1. Read rows: keyed NDJSON, only the columns you need

```text
lark-cli base +record-list --base-token <base> --table-id <table> --field-id 标题 --field-id 图片 --as user --output rows.ndjson
```

- Each line is one row with field names as keys (`record_id`, `标题`, …). Do not use `+record-get` or `--format json`
  for rows: they return positional arrays you must match to a separate `fields` list.
- Success is the JSON `ok: true`, not the exit code. `--output` and `@file` paths are relative to the working folder.
- Read a page of rows (`--limit`, `--offset`), not the whole table, when a run covers a few rows.

## 2. Attachments: one token, one named file, by column

An attachment cell is a list of `{file_token, name, size}`. Download each file on its own, named by column and order,
so two attachments with the same name don't collide (lark-cli would rename one to `<name>_<token>`):

```text
lark-cli base +record-download-attachment --base-token <base> --table-id <table> --record-id <rec> --file-token <token> --output files/<rec>-<column>-1.png --as user
```

Save into the working folder (or `~/files`, or the temp folder): anywhere but an operating-system folder. Keep the
cell's order: the first image of a gallery is usually the cover.

## 3. Stage, then upload into the page

- `dsagent_upload_file {path, instanceId}` right before the page needs the file; one uploadId per page use (a page that
  accepts it frees it). Stage by `path`: never send a downloaded file as base64 content chunks.
- First image: `upload-file` on the `page` target (the extension finds the page's upload slot) or on the slot's
  target. More images: the page's "add" control (继续添加, 添加图片), never one that clears or replaces
  (清空并重新上传, 替换). After each file, check the page's count ("已添加N张图片") or file name, not only the receipt.

## 4. One task per row

Open the form with the whole row as the task, so the person sees it, and end it when the row is done:

```json
{"method":"dsagent.page.open","args":{"url":"<form entry page>","taskDescription":"<the row: title, fields, files; stop before submit>","taskMode":"continue","taskSteps":["Open the form","Upload the images","Fill the text fields","Add tags","Check and stop before submit"]},"idempotencyKey":"open-<uuid>"}
```

`dsagent.agent.work.finish {pageContextId, status, keep: []}` closes the row's page.

## 5. Text fields: one fill-form call

Run `detect-form-fields` once, then `fill-form` with the detected `fieldId`s; title and description go in one call,
multi-line text as it is (keep its `\n`). When a verdict is uncertain (`OUTCOME_UNKNOWN`, `TEXT_ENTRY_INCOMPLETE`),
read the field or the page's counter (`dsagent.page.markdown`, "175 / 1000") before acting: never type the value again
unread, or it is entered twice.

## 6. Tags, topics, categories with suggestions

A picked tag usually becomes a chip that text cannot be inserted into, so insert every tag after the same sentence
of your text, last tag first: the chips then read in the row's order. One `page.actions` call per tag:
`edit-text insert-after` → `waitFor target-present {name: "#tag"}` → `click {target: {name: "#tag"}}`. Suggestion
labels carry counts ("#AI浏览器9064.7万"); when several start with the tag the click stops `target-unresolved` with
`candidates`: click the one that is the exact tag plus its count, never a longer tag.

## 7. Rich descriptions from a Doc

`lark-cli docs +fetch --doc <url or token> --doc-format markdown --as user` reads the text; put it in with the
`paste` action (`html` or `plainText`) when the page's editor keeps formatting, or `fill-form` for plain text.

## 8. Write back

```text
lark-cli base +record-batch-update --base-token <base> --table-id <table> --json @update.json --as user
```

Write each row's outcome (a status, the reason when it failed) right after the row; one table at a time, at most
200 rows per call; read the rows back once the run ends.

## 9. Many rows

- Keep one MCP session; `page.open` each row and finish it; act on the targets a call returns instead of observing
  again by habit.
- A saved workflow replays text and select fields, but its upload fields take no per-run file: rows with images
  use the steps above.
- Stop before the final 发布 / submit / 上架 unless the person asked to publish; a published post or listing cannot
  be taken back by the agent.
