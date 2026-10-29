import { shuffle, type Random } from '../alarmQuiz'
import type { CourseModule, CourseQuestion } from './types'

/** A question as asked: the choices in a random order, and where the right one landed. */
export interface AskedQuestion {
  question: CourseQuestion
  options: string[]
  answer: number
}

/** The check for a module: every question once, in random order, each with its choices shuffled. */
export function makeCheck(m: CourseModule, random: Random = Math.random): AskedQuestion[] {
  return shuffle(m.questions, random).map((question) => {
    const options = shuffle([question.right, ...question.wrong], random)
    return { question, options, answer: options.indexOf(question.right) }
  })
}
