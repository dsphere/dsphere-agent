# Bounded capability discovery / 有界能力发现

Known method: invoke it directly from `references/capabilities/<method>.md` (the same rule as SKILL.md); no discovery call comes before the first call. Query the live contract only after `INVALID_REQUEST` or `CAPABILITY_UNAVAILABLE`, and then only that exact method. The current runtime descriptor determines capability version, inputs, outputs and constraints. Cache a fetched descriptor by instanceId, generation and method; refresh after instance/generation changes or contract rejection. Do not compare Extension build versions to decide compatibility.

已知方法直接按 `references/capabilities/<method>.md` 调用（与 SKILL.md 同一规则），第一次调用前不做发现；只有收到 `INVALID_REQUEST` 或 `CAPABILITY_UNAVAILABLE` 后才查询该 method 的实时契约，并按 instanceId、generation、method 缓存；实例或 generation 变化、契约被拒绝时刷新。构建来源清单仅供追溯，不能证明兼容性。不要反复查询全量目录或猜测参数。

```json
{"instanceId":"<selected live instance>","method":"dsagent.page.action","limit":1}
```

These are arguments for `dsagent_list_capabilities`, not for `dsagent_invoke`. Omit instanceId only when exactly one instance is online. The method filter is exact; no wildcard or prefix matching. An unavailable method returns `total:0`, `capabilities:[]`, `hasMore:false`; it must not trigger a different effectful method automatically.

To explore genuinely unknown methods, omit method and read only enough pages to find the relevant capability. Default limit is 20 complete descriptors, maximum 20, and the byte budget can return fewer. Keep the same instanceId and method when continuing with the returned opaque nextCursor. A no-argument call now returns a page, not a guarantee of the whole catalog.

Successful discovery data contains instanceId, generation, extensionVersion, capabilities, total, hasMore and nextCursor. Omit `expectedGeneration` on `dsagent_invoke` and `dsagent_read` (as SKILL.md says; `dsagent_read` refuses one that is not live): the Connector applies the live generation itself and warns with `GENERATION_ADVANCED` when it moved while a method's contract stayed the same; the `generation` here is for caching a fetched descriptor, not for passing back. Every complete descriptor retains full input/output schemas and descriptions. hasMore=false and empty nextCursor mean the filtered catalog is exhausted.

## Oversized individual contract

One descriptor may exceed the 32 KiB MCP response budget of `detail=full` and `detail=invoke`, which counts both structuredContent and escaped JSON text plus a framing reserve (`detail=index` rows carry no schema and have a 64 KiB budget, so the whole catalog arrives on one page; still read `hasMore` there too). Such a response has `descriptorFragment` instead of an incomplete schema in capabilities:

- method: the descriptor being transferred.
- encoding: `json`.
- text: one UTF-8 fragment of the serialized descriptor. It is not necessarily valid JSON by itself.
- offset / totalBytes: byte position and total UTF-8 byte length.
- sha256: hash of the complete serialized descriptor, identical across its fragments.
- complete: whether this is the last fragment of this descriptor; other methods may still follow.

Follow nextCursor, check contiguous byte offsets and stable hash, concatenate decoded text strings, then parse JSON only after complete=true. Where local tools are available, assemble locally and return only the necessary schema fields to the model. Never invoke using a partial fragment or mistake complete=true for hasMore=false.

单项过大时按 nextCursor 续读 descriptorFragment，按 UTF-8 字节偏移连续拼接 text，核对完整长度和 SHA-256，直到 complete=true 才解析为完整 descriptor。不能把片段当成已完成的 schema；complete 只表示当前项结束，hasMore 才表示目录是否还有内容。

## Recovery and older installations

STALE_OBSERVATION means the instance, catalog or method changed: discard the cursor, partial descriptor and old generation, then repeat the exact-method query without cursor. INVALID_REQUEST means malformed cursor/filter/limit: do not replay it unchanged. Neither condition authorizes replay of an effectful invocation.

During connection setup, dsagent_list_instances is sufficient to establish an online route. If a specific schema is needed, request only its method. If an older connector rejects method/cursor/limit, update the Skill-managed Native Agent through its normal channel before confirming the contract; do not fall back to an unfiltered full-catalog call. Do not manually replace the Native Agent binary.

连接和恢复先调用 dsagent_list_instances，仅按需查询目标方法。旧 Connector 不支持 method/cursor/limit 时不要退回无过滤全量查询；按正式渠道更新 Skill 管理的 Native Agent 后确认契约。发生不确定的业务结果时，仍禁止盲目重放操作。
