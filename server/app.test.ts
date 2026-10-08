import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { MAX_QUESTION, createApp } from './app'
import { answer, passageFor } from './answer'
import { loadKnowledge } from './knowledge'

const knowledge = loadKnowledge({})
let server: Server
let base = ''
let webDir = ''

const start = (rateLimit?: number) =>
  new Promise<void>((done) => {
    const app = createApp({ knowledge, webDir, version: '9.9.9', rateLimit })
    server = createServer((req, res) => void app(req, res))
    server.listen(0, '127.0.0.1', () => {
      base = `http://127.0.0.1:${(server.address() as { port: number }).port}`
      done()
    })
  })

const ask = (question: unknown, revision?: unknown) =>
  fetch(`${base}/api/ask`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, ...(revision === undefined ? {} : { revision }) }) })

beforeAll(async () => {
  webDir = mkdtempSync(join(tmpdir(), 'chat-web-'))
  mkdirSync(join(webDir, 'assets'))
  writeFileSync(join(webDir, 'index.html'), '<!doctype html><title>chat</title>')
  writeFileSync(join(webDir, 'assets', 'app.js'), 'console.log(1)')
  await start()
})
afterAll(() => new Promise<void>((done) => server.close(() => done())))

describe('answer (no AI, only sourced passages)', () => {
  it('answers a fault code from its own entry, with sources on every line', () => {
    const r = answer(knowledge, 'A2_10')
    expect(r.kind).toBe('answer')
    if (r.kind !== 'answer') return
    expect(r.passages[0].id).toBe('ts-fault-a2_10')
    expect(r.passages[0].lines.length).toBeGreaterThan(0)
    for (const l of r.passages[0].lines) expect(l.sources.length).toBeGreaterThan(0)
  })

  it('gives each of several fault codes its own answer, in the order typed, and names a missing code', () => {
    const r = answer(knowledge, 'A2_11, A1_3 and Z9_99')
    expect(r.kind).toBe('fault-codes')
    if (r.kind !== 'fault-codes') return
    expect(r.passages.map((p) => p.id)).toEqual(['ts-fault-a2_11', 'ts-fault-a1_3'])
    expect(r.missing).toEqual(['Z9_99'])
  })

  it('says so instead of guessing when nothing matches', () => {
    const r = answer(knowledge, 'what is the capital of france')
    expect(r.kind).toBe('none')
    expect(r.message).toMatch(/nothing in the reference material/i)
  })

  it('only returns lines that apply to the chosen revision', () => {
    for (const q of ['battery wont address', 'app cannot connect', 'how do I power cycle the inverter']) {
      const rev4 = answer(knowledge, q, 'rev4')
      const all = answer(knowledge, q, 'all')
      if (rev4.kind !== 'answer' || all.kind !== 'answer') continue
      expect(rev4.passages[0].total).toBeLessThanOrEqual(all.passages[0].total)
    }
  })

  it('every passage the index can return has lines with sources', () => {
    for (const chunk of knowledge.chunks.slice(0, 400)) {
      const p = passageFor(chunk, 'all')
      for (const l of p.lines) expect(l.sources.length, chunk.id).toBeGreaterThan(0)
    }
  })
})

describe('server', () => {
  it('reports health with the version and the number of passages', async () => {
    const r = await fetch(`${base}/api/health`)
    expect(r.status).toBe(200)
    expect(await r.json()).toMatchObject({ ok: true, version: '9.9.9', passages: knowledge.chunks.length })
  })

  it('answers a question over HTTP and sets security headers', async () => {
    const r = await ask('battery reads 0 volts')
    expect(r.status).toBe(200)
    expect(r.headers.get('x-content-type-options')).toBe('nosniff')
    expect(r.headers.get('content-security-policy')).toContain("default-src 'self'")
    const body = (await r.json()) as { kind: string }
    expect(body.kind).toBe('answer')
  })

  it('rejects bad input with a clear message and the right status', async () => {
    expect((await ask('')).status).toBe(400)
    expect((await ask(42)).status).toBe(400)
    expect((await ask('x'.repeat(MAX_QUESTION + 1))).status).toBe(400)
    expect((await ask('battery', 'rev9')).status).toBe(400)
    const notJson = await fetch(`${base}/api/ask`, { method: 'POST', body: 'hello' })
    expect(notJson.status).toBe(400)
    const big = await fetch(`${base}/api/ask`, { method: 'POST', body: JSON.stringify({ question: 'a'.repeat(20000) }) }).catch(() => null)
    expect(big === null || big.status === 413).toBe(true)
    expect((await fetch(`${base}/api/ask`)).status).toBe(405)
  })

  it('returns one passage by id, and 404 for an unknown id', async () => {
    const ok = await fetch(`${base}/api/passage?id=ts-fault-a2_10&rev=all`)
    expect(ok.status).toBe(200)
    expect(((await ok.json()) as { id: string }).id).toBe('ts-fault-a2_10')
    expect((await fetch(`${base}/api/passage?id=nope`)).status).toBe(404)
  })

  it('serves the web page and its assets, and falls back to the page for other paths', async () => {
    const page = await fetch(`${base}/`)
    expect(page.status).toBe(200)
    expect(await page.text()).toContain('<title>chat</title>')
    const asset = await fetch(`${base}/assets/app.js`)
    expect(asset.headers.get('content-type')).toContain('javascript')
    expect(asset.headers.get('cache-control')).toContain('immutable')
    expect(await (await fetch(`${base}/some/route`)).text()).toContain('<title>chat</title>')
  })

  it('never serves files outside the web folder', async () => {
    for (const path of ['/../package.json', '/..%2Fpackage.json', '/%2e%2e/%2e%2e/package.json', '/assets/../../package.json']) {
      const r = await fetch(`${base}${path}`)
      const text = await r.text()
      expect(text, path).not.toContain('sanctuary-chat')
    }
  })

  it('limits how fast one address can ask', async () => {
    await new Promise<void>((done) => server.close(() => done()))
    await start(3)
    const codes: number[] = []
    for (let i = 0; i < 5; i++) codes.push((await ask('A2_10')).status)
    expect(codes).toEqual([200, 200, 200, 429, 429])
  })
})
