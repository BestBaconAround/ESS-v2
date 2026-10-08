import { describe, expect, it } from 'vitest'
import { buildCorpus } from '../shared/ask/corpus'
import { passageFor } from './answer'
import { QUICK_REFS } from '../web/src/QuickRef'

const chunks = new Map(buildCorpus({}).map((c) => [c.id, c]))

describe('Quick ref pages', () => {
  for (const page of QUICK_REFS) {
    it(`${page.title}: every passage exists and has sourced lines`, () => {
      for (const id of page.passages) {
        const c = chunks.get(id)
        expect(c, id).toBeDefined()
        const p = passageFor(c!, 'all', Infinity)
        expect(p.lines.length).toBe(p.total)
        expect(p.lines.every((l) => l.sources.length > 0)).toBe(true)
      }
    })
  }
})
