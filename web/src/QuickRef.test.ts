import { describe, expect, it } from 'vitest'
import { QUICK_REFS } from './QuickRef'
import { LOSS_OF_COMMUNICATION_NOTES, type NoteBlock } from './trainingNotes'

const lines = (b: NoteBlock): string[] => ('list' in b ? b.list : 'p' in b ? [b.p] : [b.see.label])
const noteLines = (id: string) => LOSS_OF_COMMUNICATION_NOTES.find((s) => s.id === id)!.blocks.flatMap(lines)

describe("the loss of communication pages use the author's wording where the notes cover the topic", () => {
  const page = (id: string) => QUICK_REFS.find((q) => q.id === id)!

  it("battery loss of communication shows the author's checklist instead of the short list", () => {
    const s = page('loc-battery').sections[0]
    expect(s.replaceSteps).toBe(true)
    expect(s.notes).toHaveLength(1)
    expect(s.notes![0].blocks.flatMap(lines)).toEqual(noteLines('battery-comm'))
  })

  it("inverter loss of communication adds the author's parallel checklist and keeps the sourced list", () => {
    const s = page('loc-inverter').sections[0]
    expect(s.replaceSteps).toBeFalsy()
    expect(s.steps.length).toBeGreaterThan(0)
    expect(s.notes![0].blocks.flatMap(lines)).toEqual(noteLines('parallel-comm'))
  })
})
