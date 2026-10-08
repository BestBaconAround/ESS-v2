import { createReadStream, existsSync, statSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { REVISION_CHOICES, answer, passageFor, type RevisionChoice } from './answer'
import type { Knowledge } from './knowledge'

export interface AppOptions {
  knowledge: Knowledge
  /** Folder with the built web page. */
  webDir: string
  version: string
  /** Requests per minute per address to /api/ask. */
  rateLimit?: number
}

export const MAX_QUESTION = 500
const MAX_BODY = 8 * 1024

export const SUGGESTIONS = ['Battery reads 0 volts', 'A2_11', 'App cannot connect', 'Which pins are the CTs on?', 'How do I power cycle the inverter?']

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'",
}

function send(res: ServerResponse, status: number, body: unknown, extra: Record<string, string> = {}) {
  const text = JSON.stringify(body)
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY_HEADERS, ...extra })
  res.end(text)
}

function readBody(req: IncomingMessage): Promise<string | null> {
  return new Promise((resolveBody) => {
    let size = 0
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => {
      size += c.length
      if (size > MAX_BODY) {
        resolveBody(null)
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')))
    req.on('error', () => resolveBody(null))
  })
}

const asRevision = (v: unknown): RevisionChoice | null => (typeof v === 'string' && (REVISION_CHOICES as string[]).includes(v) ? (v as RevisionChoice) : null)

/** The request handler. It is a plain function so tests can run it on any port. */
export function createApp(opts: AppOptions) {
  const hits = new Map<string, { count: number; reset: number }>()
  const limit = opts.rateLimit ?? 60
  const webRoot = resolve(opts.webDir)

  const limited = (ip: string): boolean => {
    const now = Date.now()
    const e = hits.get(ip)
    if (!e || e.reset < now) {
      hits.set(ip, { count: 1, reset: now + 60_000 })
      return false
    }
    e.count++
    return e.count > limit
  }

  const serveStatic = (urlPath: string, res: ServerResponse) => {
    let rel: string
    try {
      rel = decodeURIComponent(urlPath.split('?')[0])
    } catch {
      return send(res, 400, { error: 'Bad path.' })
    }
    let file = normalize(join(webRoot, rel === '/' ? 'index.html' : rel))
    // Never serve anything outside the web folder.
    if (file !== webRoot && !file.startsWith(webRoot + sep)) return send(res, 403, { error: 'Not allowed.' })
    if (!existsSync(file) || statSync(file).isDirectory()) file = join(webRoot, 'index.html')
    if (!existsSync(file)) return send(res, 404, { error: 'The web page is not built yet. Run npm run build.' })
    const type = MIME[extname(file)] ?? 'application/octet-stream'
    const immutable = file.includes(`${sep}assets${sep}`)
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache', ...SECURITY_HEADERS })
    createReadStream(file).pipe(res)
  }

  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const url = new URL(req.url ?? '/', 'http://localhost')
    const ip = req.socket.remoteAddress ?? 'unknown'

    if (url.pathname === '/api/health' && req.method === 'GET') {
      return send(res, 200, { ok: true, version: opts.version, passages: opts.knowledge.chunks.length })
    }
    if (url.pathname === '/api/suggestions' && req.method === 'GET') return send(res, 200, { suggestions: SUGGESTIONS })

    if (url.pathname === '/api/ask') {
      if (req.method !== 'POST') return send(res, 405, { error: 'Use POST.' }, { Allow: 'POST' })
      if (limited(ip)) return send(res, 429, { error: 'Too many questions. Wait a minute and try again.' }, { 'Retry-After': '60' })
      const raw = await readBody(req)
      if (raw === null) return send(res, 413, { error: 'That request is too large.' })
      let body: { question?: unknown; revision?: unknown }
      try {
        body = JSON.parse(raw) as typeof body
      } catch {
        return send(res, 400, { error: 'Send JSON like {"question": "..."}.' })
      }
      if (typeof body.question !== 'string' || !body.question.trim()) return send(res, 400, { error: 'Type a question.' })
      if (body.question.length > MAX_QUESTION) return send(res, 400, { error: `Keep the question under ${MAX_QUESTION} characters.` })
      const rev = body.revision === undefined ? 'all' : asRevision(body.revision)
      if (!rev) return send(res, 400, { error: 'Unknown revision.' })
      return send(res, 200, answer(opts.knowledge, body.question, rev))
    }

    if (url.pathname === '/api/passage' && req.method === 'GET') {
      const chunk = opts.knowledge.byId.get(url.searchParams.get('id') ?? '')
      const rev = asRevision(url.searchParams.get('rev') ?? 'all')
      if (!chunk || !rev) return send(res, 404, { error: 'No such passage.' })
      return send(res, 200, passageFor(chunk, rev, url.searchParams.get('full') === '1' ? Infinity : undefined))
    }

    if (url.pathname.startsWith('/api/')) return send(res, 404, { error: 'No such endpoint.' })
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Not allowed.' }, { Allow: 'GET, HEAD' })
    return serveStatic(url.pathname, res)
  }
}
