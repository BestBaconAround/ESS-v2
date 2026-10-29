import type { ComponentType } from 'react'
import type { RevisionChoice } from './api'
import CourseHome, { ModuleView } from './course/CoursePage'
import { COURSE } from './course'
import SkimView, { SKIM_ID } from './course/SkimView'
import LearnAlarms from './LearnAlarms'
import LossOfCommunication from './LossOfCommunication'
import NotesView from './NotesView'
import QuickRef, { QUICK_REFS } from './QuickRef'
import TsmContents from './TsmContents'
import TsmPage, { TSM_SECTIONS } from './TsmPage'
import { COMMON_QUESTIONS, TAKING_A_CALL, TROUBLESHOOTING } from './trainingNotes'

interface PageProps {
  rev: RevisionChoice
  /** Open another Training page by its id. */
  onOpen: (id: string) => void
}

interface TrainingEntry {
  id: string
  /** The heading above its cards on the hub. */
  group: string
  /** The card on the hub. */
  title: string
  /** One line on the card saying what the page is for. */
  blurb: string
  Page: ComponentType<PageProps>
}

const TROUBLESHOOT = 'TROUBLESHOOT'
const COURSE_GROUP = 'COURSE'
const ON_A_CALL = 'ON A CALL'
const PRACTICE = 'PRACTICE'
const REFERENCE = 'REFERENCE'

/** The Quick ref pages for the power inputs: the same step lists, now pages of the hub. */
const POWER_INPUTS: TrainingEntry[] = QUICK_REFS.filter((q) => q.group !== 'LOSS OF COMMUNICATION').map((q) => ({
  id: q.id,
  group: TROUBLESHOOT,
  title: q.title,
  blurb: q.intro,
  Page: ({ rev }) => <QuickRef page={q} rev={rev} />,
}))

/** The pages the Training hub offers, grouped on the hub in the order the groups first appear. To add one, add an entry here and its page component. */
export const TRAINING_PAGES: TrainingEntry[] = [
  {
    id: 'loss-of-communication',
    group: TROUBLESHOOT,
    title: 'Loss of communication',
    blurb: 'The app says the battery is disconnected or the inverter is offline. The checks to work through, in order, for each.',
    Page: LossOfCommunication,
  },
  ...POWER_INPUTS,
  {
    id: 'troubleshooting',
    group: TROUBLESHOOT,
    title: 'Troubleshooting by problem',
    blurb: 'What to check for low solar production and for grid voltage too high or too low.',
    Page: ({ onOpen }) => <NotesView page={TROUBLESHOOTING} onOpen={onOpen} />,
  },
  {
    id: 'course',
    group: COURSE_GROUP,
    title: 'Technical Service Manual course',
    blurb: `${COURSE.length} short modules built from the manual: a lesson, then a check, with your best result kept.`,
    Page: ({ onOpen }) => <CourseHome onOpen={onOpen} />,
  },
  {
    id: 'taking-a-call',
    group: ON_A_CALL,
    title: 'Taking a call',
    blurb: 'How a support call starts, and a worked example: the power keeps going off.',
    Page: () => <NotesView page={TAKING_A_CALL} />,
  },
  {
    id: 'common-questions',
    group: ON_A_CALL,
    title: 'Common questions',
    blurb: 'Offline systems, shared access, adding solar, warranty: the short answers.',
    Page: () => <NotesView page={COMMON_QUESTIONS} />,
  },
  {
    id: 'alarms',
    group: PRACTICE,
    title: 'Learn alarms',
    blurb: 'An alarm code comes up. Pick the description that goes with it. Rounds of 10, with the codes you missed at the end.',
    Page: LearnAlarms,
  },
  {
    id: 'tsm',
    group: REFERENCE,
    title: 'Technical Service Manual',
    blurb: 'The manual, section by section, with its real pages.',
    Page: ({ onOpen }) => <TsmContents onOpen={(id) => onOpen(`tsm:${id}`)} />,
  },
]

/** The page the hub opens for a view like `training:alarms`, if there is one. */
export const trainingPageFor = (id: string): TrainingEntry | undefined => TRAINING_PAGES.find((t) => t.id === id)

const groups = [...new Set(TRAINING_PAGES.map((t) => t.group))]

/** The Training hub: pick a page to open. Opening one shows it with a way back. `open` is a page id, or `tsm:<section>` for a manual section. */
export default function TrainingPage({ open, rev, onOpen }: { open: string | null; rev: RevisionChoice; onOpen: (id: string | null) => void }) {
  // `tsm:<section>@course:<module>` is a manual page opened from a module: Back returns to that module, which stays mounted
  // (hidden) meanwhile, so a check in progress is not lost.
  const [pageId = '', returnTo] = (open ?? '').split('@')
  const tsmSection = pageId.startsWith('tsm:') ? TSM_SECTIONS.find((t) => `tsm:${t.id}` === pageId) : undefined
  const courseId = pageId.startsWith('course:') ? pageId.slice('course:'.length) : returnTo?.startsWith('course:') ? returnTo.slice('course:'.length) : undefined

  if (courseId) {
    return (
      <div className="training">
        <div hidden={!!tsmSection}>
          <button type="button" className="back" onClick={() => onOpen('course')}>
            &lsaquo; COURSE
          </button>
          {courseId === SKIM_ID ? <SkimView onOpen={onOpen} /> : <ModuleView key={courseId} id={courseId} onOpen={onOpen} />}
        </div>
        {tsmSection && (
          <div>
            <button type="button" className="back" onClick={() => onOpen(`course:${courseId}`)}>
              &lsaquo; BACK TO THE MODULE
            </button>
            <TsmPage section={tsmSection} rev={rev} onGo={(id) => onOpen(`tsm:${id}@course:${courseId}`)} />
          </div>
        )}
      </div>
    )
  }
  if (tsmSection) {
    return (
      <div className="training">
        <button type="button" className="back" onClick={() => onOpen('tsm')}>
          &lsaquo; TECHNICAL SERVICE MANUAL
        </button>
        <TsmPage section={tsmSection} rev={rev} onGo={(id) => onOpen(`tsm:${id}`)} />
      </div>
    )
  }
  const entry = pageId ? trainingPageFor(pageId) : undefined
  if (entry) {
    return (
      <div className="training">
        <button type="button" className="back" onClick={() => onOpen(null)}>
          &lsaquo; TRAINING
        </button>
        <entry.Page rev={rev} onOpen={onOpen} />
      </div>
    )
  }
  return (
    <div className="training">
      <h1 className="qr-title">Training</h1>
      <p className="lead">Practice and quick references for the Sanctuary ESS. Pick a page. The content comes from the loaded reference material, the same text the chat answers from.</p>
      {groups.map((g) => (
        <section key={g} aria-label={g}>
          <h2 className="hub-group">{g}</h2>
          <div className="hub">
            {TRAINING_PAGES.filter((t) => t.group === g).map((t) => (
              <button key={t.id} type="button" className="hub-card" onClick={() => onOpen(t.id)}>
                <span className="hub-card-title">{t.title}</span>
                <span className="hub-card-text">{t.blurb}</span>
                <span className="hub-card-go">OPEN &rsaquo;</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
