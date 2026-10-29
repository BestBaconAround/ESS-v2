import { PASS_SHARE } from './index'

/** The best result on a module's check. */
export interface ModuleResult {
  best: number
  total: number
}

export type Progress = Record<string, ModuleResult>

/** The two calls of browser storage that are used, so tests can pass a stand-in. */
export interface Store {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const KEY = 'course:progress:v1'

/** Storage can be missing or blocked (private windows, blocked site data). The course still works without it. */
const browserStore = (): Store | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function loadProgress(store: Store | null = browserStore()): Progress {
  try {
    const raw = store?.getItem(KEY)
    const data: unknown = raw ? JSON.parse(raw) : {}
    if (!data || typeof data !== 'object') return {}
    const out: Progress = {}
    for (const [id, r] of Object.entries(data as Record<string, unknown>)) {
      const { best, total } = (r ?? {}) as Partial<ModuleResult>
      if (Number.isInteger(best) && Number.isInteger(total) && (total as number) > 0 && (best as number) >= 0 && (best as number) <= (total as number)) out[id] = { best: best as number, total: total as number }
    }
    return out
  } catch {
    return {}
  }
}

/** Records a finished check. The best share is kept, so a worse try never lowers it. Returns the new progress. */
export function recordResult(progress: Progress, id: string, score: number, total: number): Progress {
  const old = progress[id]
  const better = !old || score / total > old.best / old.total
  return better ? { ...progress, [id]: { best: score, total } } : progress
}

export function saveProgress(progress: Progress, store: Store | null = browserStore()): void {
  try {
    store?.setItem(KEY, JSON.stringify(progress))
  } catch {
    /* ignore: the result still shows on screen for this visit */
  }
}

export function clearProgress(store: Store | null = browserStore()): void {
  try {
    store?.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

export const hasPassed = (r: ModuleResult | undefined): boolean => !!r && r.best / r.total >= PASS_SHARE
