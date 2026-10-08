import { useEffect, useState } from 'react'
import { passage as fetchPassage, type AnswerLine, type Passage, type RevisionChoice } from './api'
import AnswerCard from './AnswerCard'

export type QuickRefId = 'loc-battery' | 'loc-inverter'

/** One step of the short list: a line that already exists in a passage, found by how it starts. Nothing is written here. */
interface Pick {
  passage: string
  starts: string
  /** A short reading of that line for quick scanning. The full line stays one tap away. */
  short: string
}

interface Page {
  id: QuickRefId
  menu: string
  title: string
  intro: string
  /** The short numbered list, in order. It always starts at step 1. */
  steps: Pick[]
  /** Harder checks for when every step above has failed. Its own section, numbered from 1. */
  advanced?: Pick[]
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
      { passage: 'ts-battery-no-comm', starts: 'Check the BMS cable first', short: 'Test the BMS cable. Replace it if it fails.' },
      { passage: 'ts-battery-no-comm', starts: 'Make sure the battery voltage is above 51 V', short: 'Battery voltage above 51 V? If not, use the "will not address, or reads 0 V" entry.' },
    ],
    advanced: [
      { passage: 'ts-battery-no-comm', starts: 'Look at the battery BMS port', short: 'Check the BMS port: round 4-pin or Ethernet.' },
      { passage: 'ts-battery-no-comm', starts: 'Still no communication', short: 'Round 4-pin: check continuity of the port and connector.' },
      { passage: 'ts-battery-no-comm', starts: 'If any of the three has no continuity', short: 'No continuity: replace the BMS connector.' },
      { passage: 'ts-battery-no-comm', starts: 'If the BMS connector is good', short: 'Still no communication: replace the BMS or the battery.' },
    ],
    more: ['ts-battery-no-comm', 'ts-gen3-battery-comm', 'ts-fault-a2_11'],
  },
  {
    id: 'loc-inverter',
    menu: 'Inverter',
    title: 'Loss of communication: inverter',
    intro: 'Four links can fail. Work down the list. Steps are for Sanctuary 2; Sanctuary 3 is under More detail.',
    steps: [
      { passage: 'proc:p-comms-map', starts: 'If any Ethernet cable fails the tester', short: 'Test every Ethernet cable. Replace any that fail.' },
      { passage: 'proc:p-comms-map', starts: 'Inverter to battery (Sanctuary 2)', short: 'Battery link (A2_11): all batteries on one bus, each with an address.' },
      { passage: 'proc:p-comms-map', starts: 'Check each battery in the Technician app', short: 'Technician app: Read Battery Address on each battery.' },
      { passage: 'proc:p-comms-map', starts: 'Inverter to inverter (parallel)', short: 'Parallel link (A1_11): check cables and matching firmware.' },
      { passage: 'proc:p-comms-map', starts: 'Communicator to inverter', short: 'Communicator link (E1_1): inverters on, cables right, power-cycle it.' },
      { passage: 'proc:p-comms-map', starts: 'Communicator to the internet', short: 'Internet: reset the communicator, wait 3 minutes, use 2.4 GHz Wi-Fi.' },
    ],
    more: ['proc:p-comms-map', 'ts-fault-e1_1', 'ts-fault-a1_11'],
  },
]

/** Left off the list: the intro says these steps are for Sanctuary 2, and the universal ones need no label. */
const GENERIC_TAGS = ['All Sanctuary 2 revisions', 'All revisions and Sanctuary 3']

type Loaded = Passage | Error

function StepList({ steps }: { steps: { line: AnswerLine; short: string }[] }) {
  return (
    <ol className="qr-steps">
      {steps.map(({ line: l, short }, i) => (
        <li key={i}>
          <span className="qr-num" aria-hidden>
            {i + 1}
          </span>
          <div>
            {!GENERIC_TAGS.includes(l.revisions) && <span className="tag">{l.revisions}</span>}
            <span className="qr-short">{short}</span>
            <details className="qr-full">
              <summary>FULL STEP</summary>
              <p>{l.text}</p>
            </details>
          </div>
        </li>
      ))}
    </ol>
  )
}

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
  const resolve = (picks: Pick[] = []) => {
    const out: { line: AnswerLine; short: string }[] = []
    for (const pick of picks) {
      const p = loaded?.get(pick.passage)
      const line = p && !(p instanceof Error) ? p.lines.find((l) => l.text.startsWith(pick.starts)) : undefined
      if (line) out.push({ line, short: pick.short })
    }
    return out
  }
  const steps = resolve(page.steps)
  const advanced = resolve(page.advanced)
  const sources = [...new Set([...steps, ...advanced].flatMap((s) => s.line.sources))]
  const more = loaded ? page.more.map((id) => loaded.get(id)).filter((p): p is Passage => !!p && !(p instanceof Error)) : []

  return (
    <section className="quickref" aria-label={page.title}>
      <h1 className="qr-title">{page.title}</h1>
      <p className="lead">{page.intro}</p>
      {loaded === null && <p className="muted">LOADING...</p>}
      {loaded && steps.length === 0 && <p className="muted">Nothing here applies to the revision you chose.</p>}
      {steps.length > 0 && (
        <StepList steps={steps} />
      )}
      {advanced.length > 0 && (
        <details className="qr-adv">
          <summary>ADVANCED: IF ALL OTHER STEPS FAIL</summary>
          <StepList steps={advanced} />
        </details>
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
