import { describe, expect, it } from 'vitest'
import data from '../../../shared/tsm/sections.json'
import { COURSE, COURSE_PARTS, moduleById } from './index'

type Block = { h?: string; p?: string; page: number }

/** Letters and digits only, lower case: the manual's text has odd dashes and quote marks that must not matter. */
const alnum = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '')

/** The manual's text for each page, from the same data the Technical Service Manual pages show. */
const PAGE_TEXT = new Map<number, string>()
for (const s of data.sections as { blocks: Block[] }[])
  for (const b of s.blocks) PAGE_TEXT.set(b.page, (PAGE_TEXT.get(b.page) ?? '') + ' ' + (b.h ?? b.p ?? ''))
/** A quote must be a real stretch of words (an empty or tiny one would match anything). */
const onPage = (page: number, proof: string) => alnum(proof).length >= 12 && alnum(PAGE_TEXT.get(page) ?? '').includes(alnum(proof))

const everyFact = COURSE.flatMap((m) => m.lessons.flatMap((l) => l.facts.map((fact) => ({ m, fact }))))
const everyQuestion = COURSE.flatMap((m) => m.questions.map((qu) => ({ m, qu })))

describe('course structure', () => {
  it('has modules with unique ids, grouped in parts', () => {
    expect(COURSE.length).toBeGreaterThan(0)
    expect(new Set(COURSE.map((m) => m.id)).size).toBe(COURSE.length)
    expect(COURSE_PARTS.length).toBeGreaterThan(0)
    for (const m of COURSE) expect(moduleById(m.id)).toBe(m)
  })

  it('every module has a lesson and enough questions to score', () => {
    for (const m of COURSE) {
      expect(m.lessons.length, m.id).toBeGreaterThan(0)
      for (const l of m.lessons) expect(l.facts.length, `${m.id}: ${l.heading}`).toBeGreaterThan(0)
      expect(m.questions.length, m.id).toBeGreaterThanOrEqual(4)
    }
  })

  it('page ranges are in order', () => {
    for (const m of COURSE) expect(m.pages[0], m.id).toBeLessThanOrEqual(m.pages[1])
  })
})

describe('every line of the course comes from the manual', () => {
  it('each lesson line cites a page inside its module and quotes words that are on that page', () => {
    for (const { m, fact } of everyFact) {
      expect(fact.page, `${m.id}: "${fact.say.slice(0, 50)}" page ${fact.page} is outside ${m.pages}`).toBeGreaterThanOrEqual(m.pages[0])
      expect(fact.page, `${m.id}: page ${fact.page} is outside ${m.pages}`).toBeLessThanOrEqual(m.pages[1])
      expect(onPage(fact.page, fact.proof), `${m.id}: not on p.${fact.page}: "${fact.proof}"`).toBe(true)
    }
  })

  it('each question cites a page inside its module and quotes words that are on that page', () => {
    for (const { m, qu } of everyQuestion) {
      expect(qu.page, `${m.id}: "${qu.ask.slice(0, 50)}" page ${qu.page} is outside ${m.pages}`).toBeGreaterThanOrEqual(m.pages[0])
      expect(qu.page, `${m.id}: page ${qu.page} is outside ${m.pages}`).toBeLessThanOrEqual(m.pages[1])
      expect(onPage(qu.page, qu.proof), `${m.id}: not on p.${qu.page}: "${qu.proof}"`).toBe(true)
    }
  })
})

describe('every question is fair', () => {
  it('has four different choices, with the right one among them once', () => {
    for (const { m, qu } of everyQuestion) {
      // Compared as written (not with punctuation stripped): "28 A" and "2.8 A" are different choices.
      const all = [qu.right, ...qu.wrong].map((t) => t.trim().toLowerCase().replace(/\s+/g, ' '))
      expect(new Set(all).size, `${m.id}: "${qu.ask}" has repeated choices`).toBe(4)
      for (const t of [qu.ask, qu.right, ...qu.wrong]) expect(t.trim().length, `${m.id}: empty text`).toBeGreaterThan(1)
    }
  })

  it('does not ask the same question twice in a module', () => {
    for (const m of COURSE) expect(new Set(m.questions.map((x) => alnum(x.ask))).size, m.id).toBe(m.questions.length)
  })

  it('does not give the answer away by always being the longest choice', () => {
    for (const m of COURSE) {
      const longest = m.questions.filter((x) => x.right.length > Math.max(...x.wrong.map((w) => w.length))).length
      expect(longest / m.questions.length, `${m.id}: the right answer is the longest choice in ${longest} of ${m.questions.length} questions`).toBeLessThanOrEqual(0.7)
    }
  })
})

describe('public site hold-backs', () => {
  const all = COURSE.flatMap((m) => [m.title, m.intro, ...m.lessons.flatMap((l) => [l.heading, ...l.facts.map((x) => x.say)]), ...m.questions.flatMap((x) => [x.ask, x.right, ...x.wrong, x.why ?? ''])])

  it('has no personal contact details', () => {
    for (const t of all) {
      expect(t).not.toMatch(/[\w.+-]+@[\w-]+\.\w+/)
      expect(t).not.toMatch(/\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/)
    }
  })

  it('has no register addresses or register-read steps', () => {
    for (const t of all) expect(t).not.toMatch(/0x[0-9a-f]{3,4}/i)
  })
})
