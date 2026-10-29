import { describe, expect, it } from 'vitest'
import { FAULT_CODES } from '../../shared/content/data/faults'
import { makeQuestion, makeRound, quizPool, shuffle } from './alarmQuiz'

/** A small repeatable random source, so a failing run can be run again. */
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

describe('quizPool', () => {
  const pool = quizPool()

  it('has plenty of codes to learn', () => {
    expect(pool.length).toBeGreaterThan(30)
  })

  it('leaves out codes with no real description and codes the sources disagree on', () => {
    for (const f of pool) {
      expect(f.description).not.toMatch(/lists this code with no description/)
      expect(f.todo ?? []).toHaveLength(0)
    }
    expect(pool.some((f) => f.code === 'A1_12')).toBe(false)
  })
})

describe('makeQuestion', () => {
  const pool = quizPool()

  it('gives four distinct choices with exactly one right answer for every code in the pool', () => {
    for (const f of pool) {
      const q = makeQuestion(f, pool, seeded(7))
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options[q.answer]).toBe(f.description.trim())
      expect(q.options.filter((o) => o === f.description.trim())).toHaveLength(1)
    }
  })

  it('does not offer a second copy of a description that several codes share', () => {
    const a22 = FAULT_CODES.find((f) => f.code === 'A2_2')!
    for (let s = 1; s <= 20; s++) {
      const q = makeQuestion(a22, pool, seeded(s))
      expect(new Set(q.options).size).toBe(q.options.length)
    }
  })

  it('moves the right answer around', () => {
    const f = pool[0]
    const spots = new Set(Array.from({ length: 40 }, (_, s) => makeQuestion(f, pool, seeded(s + 1)).answer))
    expect(spots.size).toBeGreaterThan(1)
  })
})

describe('makeRound', () => {
  it('asks about different codes each time in a round', () => {
    const round = makeRound(10, seeded(3))
    expect(round).toHaveLength(10)
    expect(new Set(round.map((q) => q.fault.code)).size).toBe(10)
  })

  it('never asks for more than the pool holds', () => {
    expect(makeRound(10_000, seeded(3)).length).toBe(quizPool().length)
  })
})

describe('shuffle', () => {
  it('keeps every item and does not change the input', () => {
    const input = [1, 2, 3, 4, 5]
    const out = shuffle(input, seeded(9))
    expect([...out].sort()).toEqual(input)
    expect(input).toEqual([1, 2, 3, 4, 5])
  })
})
