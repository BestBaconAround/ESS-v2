import type { CourseModule } from './types'
import { PART_1 } from './part1'
import { PART_2 } from './part2'
import { PART_3 } from './part3'
import { PART_4 } from './part4'
import { PART_5 } from './part5'

export type { CourseFact, CourseLesson, CourseModule, CourseQuestion } from './types'

/** The course, in order. Each module is built from a stretch of the Technical Service Manual. */
export const COURSE: CourseModule[] = [...PART_1, ...PART_2, ...PART_3, ...PART_4, ...PART_5]

/** Passing a module's check takes this share of the questions. */
export const PASS_SHARE = 0.8

export const moduleById = (id: string): CourseModule | undefined => COURSE.find((m) => m.id === id)

/** The parts in the order they first appear. */
export const COURSE_PARTS: string[] = [...new Set(COURSE.map((m) => m.part))]
