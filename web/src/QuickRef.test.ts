import { describe, expect, it } from 'vitest'
import { QUICK_REFS } from './QuickRef'
import { TROUBLESHOOTING } from './trainingNotes'

const noteLines = (id: string) => TROUBLESHOOTING.sections.find((s) => s.id === id)!.blocks.flatMap((b) => ('list' in b ? b.list : [b.p]))

describe('quick ref pages use the author\'s wording where the notes cover the topic', () => {
  const page = (id: string) => QUICK_REFS.find((q) => q.id === id)!

  it('battery loss of communication shows the author\'s checklist instead of the short list', () => {
    const s = page('loc-battery').sections[0]
    expect(s.replaceSteps).toBe(true)
    expect(s.notes).toHaveLength(1)
    expect(s.notes![0].blocks.flatMap((b) => ('list' in b ? b.list : [b.p]))).toEqual(noteLines('battery-comm'))
  })

  it('inverter loss of communication adds the author\'s parallel checklist and keeps the sourced list', () => {
    const s = page('loc-inverter').sections[0]
    expect(s.replaceSteps).toBeFalsy()
    expect(s.steps.length).toBeGreaterThan(0)
    expect(s.notes![0].blocks.flatMap((b) => ('list' in b ? b.list : [b.p]))).toEqual(noteLines('parallel-comm'))
  })
})
