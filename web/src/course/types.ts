/** One line of a lesson, with the manual page it comes from and a short quote that is on that page. */
export interface CourseFact {
  say: string
  page: number
  /** Words copied from the manual page. A test checks they are on that page, so a lesson cannot drift from the manual. */
  proof: string
}

/** A multiple-choice question. The choices are shuffled when it is asked. */
export interface CourseQuestion {
  ask: string
  right: string
  wrong: [string, string, string]
  page: number
  /** Words copied from the manual page that make `right` the answer. */
  proof: string
  /** Shown after answering. When left out, the quote from the manual is shown. */
  why?: string
}

export interface CourseLesson {
  heading: string
  facts: CourseFact[]
}

export interface CourseModule {
  id: string
  /** The group it sits in on the course page. */
  part: string
  title: string
  /** One or two lines on what the module covers. */
  intro: string
  /** The manual pages the module is built from, first and last. Every fact and question must fall inside. */
  pages: [number, number]
  lessons: CourseLesson[]
  questions: CourseQuestion[]
  /** A related Training page to practise on after the lesson, by its hub id. */
  practice?: { to: string; label: string }
}

export const f = (page: number, say: string, proof: string): CourseFact => ({ say, page, proof })

export const q = (page: number, ask: string, right: string, wrong: [string, string, string], proof: string, why?: string): CourseQuestion => ({ ask, right, wrong, page, proof, why })
