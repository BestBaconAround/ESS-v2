import { FAULT_CODES, type FaultCode } from '../../shared/content/data/faults'

/** One question: an alarm code, and the descriptions to choose from. */
export interface AlarmQuestion {
  fault: FaultCode
  /** The choices, already shuffled. Exactly one is the code's own description. */
  options: string[]
  /** Index in `options` of the right answer. */
  answer: number
}

/** The stand-in text for a code the manual lists with no description (worded two ways). There is nothing to learn from it. */
const NO_DESCRIPTION = /lists this code with no description/i

/** Longer descriptions make unreadable choices on a phone, so they stay out of the quiz (they remain in the chat). */
const MAX_LENGTH = 400

export type Random = () => number

/**
 * The codes worth quizzing: a real description, short enough to read as a choice, and no `todo`. A `todo` marks a code
 * where the manual and the older guide disagree, and a quiz must not teach a disputed answer.
 */
export const quizPool = (codes: FaultCode[] = FAULT_CODES): FaultCode[] =>
  codes.filter((f) => {
    const d = f.description.trim()
    return d.length > 0 && d.length <= MAX_LENGTH && !NO_DESCRIPTION.test(d) && !f.todo?.length
  })

export function shuffle<T>(items: readonly T[], random: Random = Math.random): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** `A1_12` -> `A1`: the series a code belongs to. Wrong answers from the same series are the believable ones. */
const series = (code: string): string => code.split('_')[0]

/**
 * Builds one question. The wrong choices all differ from the right one and from each other (several codes share the
 * same description, and a repeated choice would make two answers look right). Two come from the code's own series
 * when it has them, so the choice takes some thought.
 */
export function makeQuestion(fault: FaultCode, pool: FaultCode[] = quizPool(), random: Random = Math.random, choices = 4): AlarmQuestion {
  const correct = fault.description.trim()
  const used = new Set([correct])
  const wrong: string[] = []
  const take = (from: FaultCode[], max: number) => {
    for (const f of shuffle(from, random)) {
      if (wrong.length >= max) break
      const d = f.description.trim()
      if (used.has(d)) continue
      used.add(d)
      wrong.push(d)
    }
  }
  const others = pool.filter((f) => f.code !== fault.code)
  take(others.filter((f) => series(f.code) === series(fault.code)), 2)
  take(others, choices - 1)
  const options = shuffle([correct, ...wrong], random)
  return { fault, options, answer: options.indexOf(correct) }
}

/** A round of `count` different codes, in random order. */
export function makeRound(count = 10, random: Random = Math.random, codes: FaultCode[] = FAULT_CODES): AlarmQuestion[] {
  const pool = quizPool(codes)
  return shuffle(pool, random)
    .slice(0, count)
    .map((f) => makeQuestion(f, pool, random))
}
