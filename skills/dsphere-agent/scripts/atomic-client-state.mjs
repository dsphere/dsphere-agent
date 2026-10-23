/** Caller-side bookkeeping only. Never plans, dispatches effects, retries, or answers a question. */
export function unwrapMcpResult(result) {
  if (result?.structuredContent !== undefined) {
    if (typeof result.structuredContent?.ok !== 'boolean') throw new Error('Malformed structured envelope; reconcile before repeating an effect')
    return result.structuredContent
  }
  if (typeof result?.ok === 'boolean') return result
  for (const item of result?.content ?? []) {
    if (item.type !== 'text') continue
    try {
      const value = JSON.parse(item.text)
      if (typeof value?.ok === 'boolean') return value
    } catch { /* Non-JSON diagnostic text is not a result envelope. */ }
  }
  throw new Error('MCP result has no structured envelope; do not repeat an uncertain effect')
}

/** An additive operation view; the caller retains all metadata and decides recovery. */
export function readOperationResult(result) {
  const envelope = unwrapMcpResult(result)
  if (!envelope.ok) return { envelope, status: 'error', payload: undefined }
  if (typeof envelope.data?.status !== 'string') throw new Error('Operation status is missing; do not assume success')
  return { envelope, status: envelope.data.status,
    payload: envelope.data.status === 'succeeded' ? envelope.data.data : undefined }
}

/** One inventory per page, preserving removal evidence and rejecting gaps instead of resurrecting IDs. */
export function reducePageEvidence(previous, receipt) {
  if (receipt?.stopped?.reason === 'failed' || receipt?.stopped?.reason === 'canceled') {
    throw new Error('Stopped batch final is historical evidence; inspect current state before continuing')
  }
  const current = receipt?.final ?? receipt
  if (!current?.pageContextId || !current.revision || !current.targets) throw new Error('Page evidence is incomplete')
  const delta = current.targets
  if (!['full', 'delta', 'unchanged'].includes(delta.mode)
    || !Array.isArray(delta.added) || !Array.isArray(delta.changed) || !Array.isArray(delta.removedTargetIds)) {
    throw new Error('Target delta is incomplete; retain removedTargetIds')
  }
  const base = current.baseRevision ?? current.previousRevision
  // A delta or unchanged receipt names the revision it builds on; without one it
  // cannot be applied to anything (audit D67: a base-less delta was applied silently).
  if (delta.mode !== 'full' && (!previous || previous.pageContextId !== current.pageContextId
    || !base || base !== previous.revision)) throw new Error('Evidence base is missing; request a full observation')
  const targets = new Map(delta.mode === 'full' ? [] : previous.targets.map(target => [target.id, target]))
  for (const id of delta.removedTargetIds) targets.delete(id)
  for (const target of [...delta.added, ...delta.changed]) {
    if (!target?.id) throw new Error('Target identity is missing')
    targets.set(target.id, target)
  }
  return {
    receipt,
    pageContextId: current.pageContextId, revision: current.revision,
    semanticText: delta.mode === 'unchanged' && !current.semanticText
      ? previous?.semanticText ?? '' : current.semanticText ?? '',
    targets: [...targets.values()],
    // Keep the removal facts visible to the caller even when compacting output.
    removedTargetIds: [...delta.removedTargetIds],
  }
}

/** Validate only the caller's proposed steps; selection and authorization remain with the caller. */
export function bindKnownActions(evidence, actions) {
  if (!evidence || !Array.isArray(actions) || actions.length < 1 || actions.length > 8) throw new Error('Expected 1–8 already-decided actions')
  for (const action of actions) {
    const target = evidence.targets.find(candidate => candidate.id === action.targetId)
    if (!target?.capabilities?.includes(action.action)) throw new Error('Action target is absent or unsupported in current evidence')
  }
  return { pageContextId: evidence.pageContextId, expectedRevision: evidence.revision, actions }
}

/** Exact-method discovery with complete fragment assembly and concurrent request deduplication. */
export function createCapabilityCache(listCapabilities) {
  const cache = new Map()
  const pending = new Map()
  const generations = new Map()
  return {
    async get(instanceId, generation, method) {
      if (!instanceId || !Number.isSafeInteger(generation) || !method?.startsWith('dsagent.')) throw new Error('Exact instance, generation and method are required')
      const key = JSON.stringify([instanceId, generation, method])
      if (generations.get(instanceId) !== generation) {
        generations.set(instanceId, generation)
        for (const entry of cache.keys()) if (JSON.parse(entry)[0] === instanceId) cache.delete(entry)
      }
      if (cache.has(key)) return cache.get(key)
      if (pending.has(key)) return pending.get(key)
      const read = (async () => {
        let cursor, fragments = '', descriptor
        const cursors = new Set()
        for (let page = 0; page < 128; page += 1) {
          const result = unwrapMcpResult(await listCapabilities({ instanceId, method, ...(cursor ? { cursor } : {}) }))
          if (!result.ok) throw Object.assign(new Error(result.error?.message ?? 'Discovery failed'), { code: result.error?.code })
          const data = result.data
          if (data?.generation !== generation || generations.get(instanceId) !== generation) throw new Error('Catalog generation changed; discard fragments and refresh')
          if (data.descriptorFragment) fragments += data.descriptorFragment.text
          for (const candidate of data.capabilities ?? []) {
            if (candidate.method === method) descriptor = candidate
          }
          if (fragments.length > 1_048_576) throw new Error('Capability descriptor exceeds caller bound')
          if (!data.hasMore) {
            const complete = fragments ? JSON.parse(fragments) : descriptor
            if (complete?.method !== method || !complete.inputSchema || !complete.outputSchema) throw new Error('Capability descriptor is incomplete')
            cache.set(key, complete)
            return complete
          }
          if (!data.nextCursor || cursors.has(data.nextCursor)) throw new Error('Discovery cursor did not advance')
          cursor = data.nextCursor
          cursors.add(cursor)
        }
        throw new Error('Capability discovery exceeded its page bound')
      })()
      pending.set(key, read)
      try { return await read } finally { pending.delete(key) }
    },
  }
}

/** Record boundaries around the existing tool callback; no args, values, URLs or response bodies. */
export async function measureToolCall(method, call, record, now = Date.now) {
  const dispatchedAt = now()
  let result
  try {
    result = unwrapMcpResult(await call())
    return result
  } finally {
    // Telemetry never changes the outcome of the call: a recorder that throws
    // must not turn a succeeded effect into an exception the caller might resend.
    try {
      record({ method, dispatchedAt, returnedAt: now(),
        ...(result?.data?.operationId ? { operationId: result.data.operationId } : {}),
        status: result ? result.ok ? result.data?.status ?? 'unknown' : 'failed' : 'unknown' })
    } catch {}
  }
}
