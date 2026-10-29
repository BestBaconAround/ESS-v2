import type { ComponentType } from 'react'
import type { RevisionChoice } from './api'
import LearnAlarms from './LearnAlarms'
import LossOfCommunication from './LossOfCommunication'
import NotesView from './NotesView'
import { COMMON_QUESTIONS, TAKING_A_CALL, TROUBLESHOOTING } from './trainingNotes'

interface TrainingEntry {
  id: string
  /** The card on the hub, and the page's heading. */
  title: string
  /** One line on the card saying what the page is for. */
  blurb: string
  Page: ComponentType<{ rev: RevisionChoice }>
}

/** The pages the Training hub offers. To add one, add an entry here and its page component. */
export const TRAINING_PAGES: TrainingEntry[] = [
  {
    id: 'loss-of-communication',
    title: 'Loss of communication',
    blurb: 'The app says the battery is disconnected or the inverter is offline. The checks to work through, in order, for each.',
    Page: LossOfCommunication,
  },
  {
    id: 'taking-a-call',
    title: 'Taking a call',
    blurb: 'How a support call starts, and a worked example: the power keeps going off.',
    Page: () => <NotesView page={TAKING_A_CALL} />,
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting by problem',
    blurb: 'What to check for battery or parallel communication, low solar production, and grid voltage too high or too low.',
    Page: () => <NotesView page={TROUBLESHOOTING} />,
  },
  {
    id: 'common-questions',
    title: 'Common questions',
    blurb: 'Offline systems, shared access, adding solar, warranty: the short answers.',
    Page: () => <NotesView page={COMMON_QUESTIONS} />,
  },
  {
    id: 'alarms',
    title: 'Learn alarms',
    blurb: 'An alarm code comes up. Pick the description that goes with it. Rounds of 10, with the codes you missed at the end.',
    Page: LearnAlarms,
  },
]

/** The page the hub opens for a view like `training:alarms`, if there is one. */
export const trainingPageFor = (id: string): TrainingEntry | undefined => TRAINING_PAGES.find((t) => t.id === id)

/** The Training hub: pick a page to open. Opening one shows it with a way back. */
export default function TrainingPage({ open, rev, onOpen, onBack }: { open: string | null; rev: RevisionChoice; onOpen: (id: string) => void; onBack: () => void }) {
  const entry = open ? trainingPageFor(open) : undefined
  if (entry) {
    return (
      <div className="training">
        <button type="button" className="back" onClick={onBack}>
          &lsaquo; TRAINING
        </button>
        <entry.Page rev={rev} />
      </div>
    )
  }
  return (
    <div className="training">
      <h1 className="qr-title">Training</h1>
      <p className="lead">Practice for the Sanctuary ESS. Pick a page. The content comes from the loaded reference material, the same text the chat answers from.</p>
      <div className="hub">
        {TRAINING_PAGES.map((t) => (
          <button key={t.id} type="button" className="hub-card" onClick={() => onOpen(t.id)}>
            <span className="hub-card-title">{t.title}</span>
            <span className="hub-card-text">{t.blurb}</span>
            <span className="hub-card-go">OPEN &rsaquo;</span>
          </button>
        ))}
      </div>
    </div>
  )
}
