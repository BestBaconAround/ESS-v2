// The same four calls as api.ts, answered right inside the page. Used for the single-file build, which has no server:
// the search is plain JavaScript over the sourced content, so the whole chatbot runs in the browser.
import { buildCorpus } from '../../shared/ask/corpus'
import { SearchIndex } from '../../shared/ask/search'
import { answer, passageFor, type AnswerLine, type AnswerResponse, type Passage, type RevisionChoice } from '../../server/answer'
import type { Knowledge } from '../../server/knowledge'

export type { AnswerLine, AnswerResponse, Passage, RevisionChoice }

export interface Health {
  ok: boolean
  version: string
  passages: number
  mode?: 'server' | 'local'
}

const VERSION = '0.1.0'
const SUGGESTIONS = ['Battery reads 0 volts', 'A2_11', 'App cannot connect', 'Which pins are the CTs on?', 'How do I power cycle the inverter?']

let knowledge: Knowledge | null = null
const get = (): Knowledge => {
  if (!knowledge) {
    const chunks = buildCorpus({})
    knowledge = { chunks, index: new SearchIndex(chunks), byId: new Map(chunks.map((c) => [c.id, c])) }
  }
  return knowledge
}

export const ask = async (question: string, revision: RevisionChoice): Promise<AnswerResponse> => answer(get(), question.slice(0, 500), revision)

export const passage = async (id: string, revision: RevisionChoice, full = false): Promise<Passage> => {
  const chunk = get().byId.get(id)
  if (!chunk) throw new Error('No such passage.')
  return passageFor(chunk, revision, full ? Infinity : undefined)
}

export const health = async (): Promise<Health> => ({ ok: true, version: VERSION, passages: get().chunks.length, mode: 'local' })

export const suggestions = async (): Promise<string[]> => SUGGESTIONS
