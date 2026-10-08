import { useEffect, useState } from 'react'
import { passage as fetchPassage, type AnswerLine, type Passage, type RevisionChoice } from './api'
import AnswerCard from './AnswerCard'

export type QuickRefId = 'loc-battery' | 'loc-inverter'

/** One step of the short list: a line that already exists in a passage, found by how it starts. Nothing is written here. */
interface Pick {
  passage: string
  starts: string
}

interface Page {
  id: QuickRefId
  menu: string
  title: string
  intro: string
  /** The short numbered list, in order. It always starts at step 1. */
  steps: Pick[]
  /** Full passages, shown only when the reader opens them. */
  more: string[]
}

export const QUICK_REFS: Page[] = [
  {
    id: 'loc-battery',
    menu: 'Battery',
    title: 'Loss of communication: battery',
    intro: 'The app says the battery is disconnected. Steps are for Sanctuary 2; Sanctuary 3 is under More detail.',
    steps: [
      { passage: 'ts-battery-no-comm', starts: 'Check the BMS cable first' },
      { passage: 'ts-battery-no-comm', starts: 'Make sure the battery voltage is above 51 V' },
      { passage: 'ts-battery-no-comm', starts: 'Look at the battery BMS port' },
      { passage: 'ts-battery-no-comm', starts: 'Still no communication' },
      { passage: 'ts-battery-no-comm', starts: 'If any of the three has no continuity' },
      { passage: 'ts-battery-no-comm', starts: 'If the BMS connector is good' },
    ],
    more: ['ts-battery-no-comm', 'ts-gen3-battery-comm', 'ts-fault-a2_11'],
  },
  {
    id: 'loc-inverter',
    menu: 'Inverter',
    title: 'Loss of communication: inverter',
    intro: 'Four links can fail. Work down the list. Steps are for Sanctuary 2; Sanctuary 3 is under More detail.',
    steps: [
      { passage: 'proc:p-comms-map', starts: 'If any Ethernet cable fails the tester' },
      { passage: 'proc:p-comms-map', starts: 'Inverter to battery (Sanctuary 2)' },
      { passage: 'proc:p-comms-map', starts: 'Check each battery in the Technician app' },
      { passage: 'proc:p-comms-map', starts: 'Inverter to inverter (parallel)' },
      { passage: 'proc:p-comms-map', starts: 'Communicator to inverter' },
      { passage: 'proc:p-comms-map', starts: 'Communicator to the internet' },
    ],
    more: ['proc:p-comms-map', 'ts-fault-e1_1', 'ts-fault-a1_11'],
  },
]

/** Left off the list: the intro says these steps are for Sanctuary 2, and the universal ones need no label. */
const GENERIC_TAGS = ['All Sanctuary 2 revisions', 'All revisions and Sanctuary 3']

type Loaded = Passage | Error

export default function QuickRef({ page, rev }: { page: Page; rev: RevisionChoice }) {
  const [loaded, setLoaded] = useState<Map<string, Loaded> | null>(null)

  useEffect(() => {
    let live = true
    setLoaded(null)
    const ids = [...new Set([...page.steps.map((s) => s.passage), ...page.more])]
    Promise.all(ids.map((id) => fetchPassage(id, rev, true).then((p): Loaded => p).catch((e: unknown): Loaded => (e instanceof Error ? e : new Error('Could not load that passage.'))))).then((r) => live && setLoaded(new Map(ids.map((id, i) => [id, r[i]]))))
    return () => {
      live = false
    }
  }, [page, rev])

  // Steps that do not apply to the chosen revision drop out, and the list still counts from 1.
  const steps: AnswerLine[] = []
  if (loaded) {
    for (const pick of page.steps) {
      const p = loaded.get(pick.passage)
      const line = p && !(p instanceof Error) ? p.lines.find((l) => l.text.startsWith(pick.starts)) : undefined
      if (line) steps.push(line)
    }
  }
  const sources = [...new Set(steps.flatMap((l) => l.sources))]
  const more = loaded ? page.more.map((id) => loaded.get(id)).filter((p): p is Passage => !!p && !(p instanceof Error)) : []

  return (
    <section className="quickref" aria-label={page.title}>
      <h1 className="qr-title">{page.title}</h1>
      <p className="lead">{page.intro}</p>
      {loaded === null && <p className="muted">LOADING...</p>}
      {loaded && steps.length === 0 && <p className="muted">Nothing here applies to the revision you chose.</p>}
      {steps.length > 0 && (
        <ol className="qr-steps">
          {steps.map((l, i) => (
            <li key={i}>
              <span className="qr-num" aria-hidden>
                {i + 1}
              </span>
              <div>
                {!GENERIC_TAGS.includes(l.revisions) && <span className="tag">{l.revisions}</span>}
                {l.text}
              </div>
            </li>
          ))}
        </ol>
      )}
      {sources.length > 0 && (
        <details className="sources">
          <summary>SOURCES ({sources.length})</summary>
          <ul>
            {sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </details>
      )}
      {more.length > 0 && (
        <details className="qr-more">
          <summary>MORE DETAIL ({more.length})</summary>
          <div className="qr-list">
            {more.map((p, i) => (
              <AnswerCard key={p.id} passage={p} index={i + 1} open />
            ))}
          </div>
        </details>
      )}
    </section>
  )
}
