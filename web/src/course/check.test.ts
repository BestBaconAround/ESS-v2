import { describe, expect, it } from 'vitest'
import { makeCheck } from './check'
import { COURSE, PASS_SHARE } from './index'
import { clearProgress, hasPassed, loadProgress, recordResult, saveProgress, type Store } from './progress'

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

const memoryStore = (): Store & { data: Map<string, string> } => {
  const data = new Map<string, string>()
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v), removeItem: (k) => void data.delete(k) }
}

describe('makeCheck', () => {
  it('asks every question once, with the right answer where it says', () => {
    for (const m of COURSE) {
      const check = makeCheck(m, seeded(5))
      expect(check).toHaveLength(m.questions.length)
      expect(new Set(check.map((c) => c.question.ask)).size).toBe(m.questions.length)
      for (const c of check) {
        expect(c.options).toHaveLength(4)
        expect(c.options[c.answer]).toBe(c.question.right)
        expect(c.options.filter((o) => o === c.question.right)).toHaveLength(1)
      }
    }
  })

  it('moves the right answer around, so no letter gives it away', () => {
    const m = COURSE[0]
    const spots = new Set<number>()
    for (let s = 1; s <= 40; s++) for (const c of makeCheck(m, seeded(s))) spots.add(c.answer)
    expect(spots.size).toBe(4)
  })

  it('does not change the course data', () => {
    const m = COURSE[0]
    const before = JSON.stringify(m)
    makeCheck(m, seeded(1))
    expect(JSON.stringify(m)).toBe(before)
  })
})

describe('progress', () => {
  it('keeps the best result, never a worse one', () => {
    let p = recordResult({}, 'safety', 4, 6)
    p = recordResult(p, 'safety', 2, 6)
    expect(p.safety).toEqual({ best: 4, total: 6 })
    p = recordResult(p, 'safety', 6, 6)
    expect(p.safety).toEqual({ best: 6, total: 6 })
  })

  it('passes at the pass share', () => {
    expect(hasPassed(undefined)).toBe(false)
    expect(hasPassed({ best: 4, total: 5 })).toBe(PASS_SHARE <= 0.8)
    expect(hasPassed({ best: 3, total: 5 })).toBe(false)
  })

  it('saves and loads through storage, and clears', () => {
    const store = memoryStore()
    saveProgress(recordResult({}, 'safety', 5, 6), store)
    expect(loadProgress(store)).toEqual({ safety: { best: 5, total: 6 } })
    clearProgress(store)
    expect(loadProgress(store)).toEqual({})
  })

  it('works with no storage, and ignores damaged data', () => {
    expect(loadProgress(null)).toEqual({})
    expect(() => saveProgress({ a: { best: 1, total: 2 } }, null)).not.toThrow()
    const store = memoryStore()
    store.setItem('course:progress:v1', '{not json')
    expect(loadProgress(store)).toEqual({})
    store.setItem('course:progress:v1', JSON.stringify({ ok: { best: 2, total: 3 }, bad: { best: 9, total: 3 }, worse: { best: 'x' }, zero: { best: 0, total: 0 } }))
    expect(loadProgress(store)).toEqual({ ok: { best: 2, total: 3 } })
  })
})
