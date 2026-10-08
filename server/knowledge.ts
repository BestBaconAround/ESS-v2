import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildCorpus, type Chunk } from '../shared/ask/corpus'
import { SearchIndex } from '../shared/ask/search'

export interface Knowledge {
  chunks: Chunk[]
  index: SearchIndex
  byId: Map<string, Chunk>
}

const REFERENCE_DIR = fileURLToPath(new URL('../shared/content/reference/', import.meta.url))

/** Markdown notes dropped into shared/content/reference/*.md. Each heading section becomes a searchable passage. */
export function readReferenceFiles(dir = REFERENCE_DIR): Record<string, string> {
  if (!existsSync(dir)) return {}
  const out: Record<string, string> = {}
  for (const f of readdirSync(dir)) if (f.endsWith('.md')) out[`${dir}/${f}`] = readFileSync(join(dir, f), 'utf8')
  return out
}

/** Builds the search index once from the sourced content. Everything the chatbot can say comes from these passages. */
export function loadKnowledge(reference: Record<string, string> = readReferenceFiles()): Knowledge {
  const chunks = buildCorpus(reference)
  return { chunks, index: new SearchIndex(chunks), byId: new Map(chunks.map((c) => [c.id, c])) }
}
