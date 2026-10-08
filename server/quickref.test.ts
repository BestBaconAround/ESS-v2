import { describe, expect, it } from 'vitest'
import { buildCorpus } from '../shared/ask/corpus'
import { passageFor } from './answer'
import { QUICK_REFS } from '../web/src/QuickRef'

const chunks = new Map(buildCorpus({}).map((c) => [c.id, c]))

describe('Quick ref pages', () => {
  for (const page of QUICK_REFS) {
    it(`${page.title}: the short list is real, sourced lines and stays short`, () => {
      expect(page.steps.length).toBeLessThanOrEqual(6)
      for (const pick of page.steps) {
        const c = chunks.get(pick.passage)
        expect(c, pick.passage).toBeDefined()
        const line = passageFor(c!, 'all', Infinity).lines.find((l) => l.text.startsWith(pick.starts))
        expect(line, pick.starts).toBeDefined()
        expect(line!.sources.length).toBeGreaterThan(0)
      }
    })

    it(`${page.title}: the detail passages exist`, () => {
      for (const id of page.more) expect(chunks.get(id), id).toBeDefined()
    })
  }
})
