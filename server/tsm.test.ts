import { describe, expect, it } from 'vitest'
import { TSM_SECTIONS } from '../web/src/TsmPage'
import { FAULT_CODES } from '../shared/content/data/faults'
import { buildCorpus } from '../shared/ask/corpus'

describe('Technical Service Manual pages', () => {
  it('has the 24 sections of the table of contents, in page order', () => {
    expect(TSM_SECTIONS.length).toBe(24)
    for (let i = 1; i < TSM_SECTIONS.length; i++) expect(TSM_SECTIONS[i].from).toBeGreaterThanOrEqual(TSM_SECTIONS[i - 1].from)
    expect(new Set(TSM_SECTIONS.map((s) => s.id)).size).toBe(TSM_SECTIONS.length)
  })

  it('every section has text, and every page range makes sense', () => {
    for (const s of TSM_SECTIONS) {
      expect(s.blocks.length, s.title).toBeGreaterThan(0)
      expect(s.to, s.title).toBeGreaterThanOrEqual(s.from)
    }
  })

  it('the codes page can open an entry for every code', () => {
    const ids = new Set(buildCorpus({}).map((c) => c.id))
    for (const f of FAULT_CODES) expect(ids.has(`ts-fault-${f.code.toLowerCase()}`), f.code).toBe(true)
  })
})
