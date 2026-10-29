import { describe, expect, it } from 'vitest'
import { COMMON_QUESTIONS, LOSS_OF_COMMUNICATION_NOTES, TAKING_A_CALL, TROUBLESHOOTING, type NoteBlock, type NotesPage } from './trainingNotes'
import { QUICK_REFS } from './QuickRef'
import { TSM_SECTIONS } from './TsmPage'
import { TRAINING_PAGES } from './TrainingPage'

const PAGES: NotesPage[] = [TAKING_A_CALL, TROUBLESHOOTING, COMMON_QUESTIONS]
const lines = (b: NoteBlock): string[] => ('list' in b ? b.list : 'p' in b ? [b.p] : [b.see.label])
const text = (p: NotesPage) => p.sections.flatMap((s) => [s.heading, ...s.blocks.flatMap(lines)])

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
    for (const line of [...PAGES.flatMap(text), ...LOSS_OF_COMMUNICATION_NOTES.flatMap((s) => s.blocks.flatMap(lines))]) {
      expect(line).not.toMatch(/[\w.+-]+@[\w-]+\.\w+/)
      expect(line).not.toMatch(/\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/)
    }
  })

  it('shows each checklist line once: no identical line in two panels', () => {
    const seen = new Map<string, string>()
    const panels = [...PAGES.flatMap((p) => p.sections), ...LOSS_OF_COMMUNICATION_NOTES]
    for (const s of panels)
      for (const b of s.blocks)
        if ('list' in b)
          for (const line of b.list) {
            expect(seen.get(line), `"${line}" is in both "${seen.get(line)}" and "${s.heading}"`).toBeUndefined()
            seen.set(line, s.heading)
          }
  })

  it('points to Loss of communication for battery and parallel problems, which are not repeated in Troubleshooting', () => {
    const pointer = TROUBLESHOOTING.sections.find((s) => s.id === 'comm-pointer')!
    expect(pointer.blocks.some((b) => 'see' in b && b.see.to === 'loss-of-communication')).toBe(true)
    expect(TROUBLESHOOTING.sections.some((s) => s.id === 'battery-comm' || s.id === 'parallel-comm')).toBe(false)
  })
})

describe('training hub', () => {
  const ids = TRAINING_PAGES.map((t) => t.id)

  it('lists Loss of communication first, with unique page ids', () => {
    expect(ids[0]).toBe('loss-of-communication')
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has every page the Quick ref menu had, so nothing was lost when the menu went', () => {
    for (const q of QUICK_REFS) {
      if (q.group === 'LOSS OF COMMUNICATION') continue
      expect(ids, `${q.id} should be on the hub`).toContain(q.id)
    }
    expect(ids).toContain('loss-of-communication')
    expect(ids).toContain('tsm')
    expect(TSM_SECTIONS.length).toBeGreaterThan(0)
  })

  it('a link block always points at a real hub page', () => {
    for (const p of PAGES)
      for (const s of p.sections)
        for (const b of s.blocks) if ('see' in b) expect(ids).toContain(b.see.to)
  })
})
