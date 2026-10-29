import { describe, expect, it } from 'vitest'
import { COMMON_QUESTIONS, TAKING_A_CALL, TROUBLESHOOTING, type NotesPage } from './trainingNotes'
import { TRAINING_PAGES } from './TrainingPage'

const PAGES: NotesPage[] = [TAKING_A_CALL, TROUBLESHOOTING, COMMON_QUESTIONS]
const text = (p: NotesPage) => p.sections.flatMap((s) => [s.heading, ...s.blocks.flatMap((b) => ('list' in b ? b.list : [b.p]))])

describe('training notes', () => {
  it('every page has sections and every section has content', () => {
    for (const p of PAGES) {
      expect(p.sections.length).toBeGreaterThan(0)
      for (const s of p.sections) expect(s.blocks.length).toBeGreaterThan(0)
    }
  })

  it('section ids are unique within a page', () => {
    for (const p of PAGES) expect(new Set(p.sections.map((s) => s.id)).size).toBe(p.sections.length)
  })

  it('has no personal contact details (the site is public)', () => {
    for (const line of PAGES.flatMap(text)) {
      expect(line).not.toMatch(/[\w.+-]+@[\w-]+\.\w+/)
      expect(line).not.toMatch(/\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/)
    }
  })
})

describe('training hub', () => {
  it('lists Loss of communication first, with unique page ids', () => {
    expect(TRAINING_PAGES[0].id).toBe('loss-of-communication')
    expect(new Set(TRAINING_PAGES.map((t) => t.id)).size).toBe(TRAINING_PAGES.length)
  })
})
