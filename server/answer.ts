import { appliesToRevision, revisionText, sourceText } from '../shared/content/labels'
import type { Revision } from '../shared/content/types'
import type { Chunk } from '../shared/ask/corpus'
import type { Knowledge } from './knowledge'

export type RevisionChoice = Revision | 'all'
export const REVISION_CHOICES: RevisionChoice[] = ['all', 'rev1', 'rev2', 'rev3', 'rev4', 'gen3']

export interface AnswerLine {
  text: string
  /** Which hardware the line is about, in words. */
  revisions: string
  sources: string[]
}

export interface Passage {
  id: string
  title: string
  where: string
  kind: Chunk['kind']
  lines: AnswerLine[]
  /** Lines in the whole passage that apply to the chosen revision (the list sent may be cut for length). */
  total: number
}

export interface Also {
  id: string
  title: string
  where: string
}

export type AnswerResponse =
  | { kind: 'answer'; message: string; passages: Passage[]; also: Also[] }
  | { kind: 'fault-codes'; message: string; passages: Passage[]; missing: string[] }
  | { kind: 'none'; message: string }

const MAX_LINES = 12

/** One passage as the page shows it: only the lines for the chosen revision, each with its sources. */
export function passageFor(chunk: Chunk, rev: RevisionChoice, limit = MAX_LINES): Passage {
  const all = chunk.lines.filter((l) => appliesToRevision(l.revisions, rev))
  return {
    id: chunk.id,
    title: chunk.title,
    where: chunk.where,
    kind: chunk.kind,
    total: all.length,
    lines: all.slice(0, limit).map((l) => ({ text: l.text, revisions: revisionText(l.revisions), sources: [...new Set(l.sources.map(sourceText))] })),
  }
}

export const NONE_MESSAGE = 'Nothing in the reference material matches that. Try a fault code, a symptom or a part name.'

/**
 * Answers a question using only passages that exist in the reference material. There is no AI here: it matches words
 * to the sourced content. Two or more fault codes in one question get one answer each, in the order typed. When
 * nothing matches well it says so instead of guessing.
 */
export function answer(k: Knowledge, question: string, rev: RevisionChoice = 'all'): AnswerResponse {
  const q = question.trim()
  const codes = k.index.faultCodeHits(q)
  if (codes.found.length + codes.missing.length >= 2) {
    const passages = codes.found.map((h) => passageFor(h.chunk, rev))
    const missing = codes.missing
    return {
      kind: 'fault-codes',
      message: missing.length ? `Found ${passages.length} of ${passages.length + missing.length} codes. No entry for ${missing.join(', ')} in the reference material.` : 'Here is each code, in the order you typed them.',
      passages,
      missing,
    }
  }
  const hits = k.index.search(q, 3)
  if (hits.length === 0) return { kind: 'none', message: NONE_MESSAGE }
  const [best, ...others] = hits
  const main = passageFor(best.chunk, rev)
  return {
    kind: 'answer',
    message: main.lines.length ? 'Here is what the reference material says.' : 'The best match has nothing for the revision you chose. Try another revision.',
    passages: [main],
    also: others.map((h) => ({ id: h.chunk.id, title: h.chunk.title, where: h.chunk.where })),
  }
}
