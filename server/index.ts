import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { createApp } from './app'
import { loadKnowledge } from './knowledge'

const root = fileURLToPath(new URL('..', import.meta.url))
const pkg = JSON.parse(readFileSync(`${root}package.json`, 'utf8')) as { version: string }

const port = Number(process.env.PORT ?? 3000)
// Local only by default. Set HOST=0.0.0.0 to let other computers on the network reach it.
const host = process.env.HOST ?? '127.0.0.1'

const knowledge = loadKnowledge()
// TRUST_PROXY=1 when it sits behind a tunnel, so the rate limit counts each visitor separately.
const app = createApp({ knowledge, webDir: `${root}web/dist`, version: pkg.version, trustProxy: process.env.TRUST_PROXY === '1' })
createServer((req, res) => {
  app(req, res).catch(() => {
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Something went wrong.' }))
  })
}).listen(port, host, () => {
  console.log(`Sanctuary chat v${pkg.version}: ${knowledge.chunks.length} passages. Open http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`)
})
