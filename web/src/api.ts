import type { AnswerResponse, Passage, RevisionChoice } from '../../server/answer'

export type { AnswerResponse, Passage, RevisionChoice }

export interface Health {
  ok: boolean
  version: string
  passages: number
  mode?: 'server' | 'local'
}

async function json<T>(r: Response): Promise<T> {
  const body = (await r.json().catch(() => null)) as (T & { error?: string }) | null
  if (!r.ok) throw new Error(body?.error ?? `The server answered ${r.status}.`)
  return body as T
}

export const ask = (question: string, revision: RevisionChoice): Promise<AnswerResponse> =>
  fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, revision }) }).then((r) => json<AnswerResponse>(r))

export const passage = (id: string, revision: RevisionChoice): Promise<Passage> => fetch(`/api/passage?id=${encodeURIComponent(id)}&rev=${revision}`).then((r) => json<Passage>(r))

export const health = (): Promise<Health> => fetch('/api/health').then((r) => json<Health>(r))

export const suggestions = (): Promise<string[]> => fetch('/api/suggestions').then((r) => json<{ suggestions: string[] }>(r)).then((b) => b.suggestions)
