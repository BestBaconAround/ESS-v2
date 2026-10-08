import { useEffect, useState } from 'react'
import { passage as fetchPassage, type AnswerLine, type Passage, type RevisionChoice } from './api'
import AnswerCard from './AnswerCard'

export type QuickRefId = 'loc-battery' | 'loc-inverter' | 'power-inputs'

/** One step of the short list: a line that already exists in a passage, found by how it starts. */
interface Pick {
  passage: string
  starts: string
  /** A short reading of that line for quick scanning. The full line stays one tap away. */
  short: string
}

interface Section {
  id: string
  /** Shown above the list when a page has more than one section. */
  heading?: string
  /** The short numbered list, in order. It always starts at step 1. */
  steps: Pick[]
  /** Harder checks for when every step above has failed. Its own section, numbered from 1. */
  advanced?: Pick[]
  /** Full passages, shown only when the reader opens them. */
  more: string[]
}

interface Page {
  id: QuickRefId
  /** Menu group heading, and the entry under it. */
  group: string
  menu: string
  title: string
  intro: string
  sections: Section[]
}

const P = (passage: string, starts: string, short: string): Pick => ({ passage, starts, short })
const T = 'ts-battery-no-comm'
const C = 'proc:p-comms-map'

export const QUICK_REFS: Page[] = [
  {
    id: 'loc-battery',
    group: 'LOSS OF COMMUNICATION',
    menu: 'Battery',
    title: 'Loss of communication: battery',
    intro: 'The app says the battery is disconnected. Steps are for Sanctuary 2; Sanctuary 3 is under More detail.',
    sections: [
      {
        id: 'battery',
        steps: [P(T, 'Check the BMS cable first', 'Test the BMS cable. Replace it if it fails.'), P(T, 'Make sure the battery voltage is above 51 V', 'Battery voltage above 51 V? If not, use the "will not address, or reads 0 V" entry.')],
        advanced: [
          P(T, 'Look at the battery BMS port', 'Check the BMS port: round 4-pin or Ethernet.'),
          P(T, 'Still no communication', 'Round 4-pin: check continuity of the port and connector.'),
          P(T, 'If any of the three has no continuity', 'No continuity: replace the BMS connector.'),
          P(T, 'If the BMS connector is good', 'Still no communication: replace the BMS or the battery.'),
        ],
        more: [T, 'ts-gen3-battery-comm', 'ts-fault-a2_11'],
      },
    ],
  },
  {
    id: 'loc-inverter',
    group: 'LOSS OF COMMUNICATION',
    menu: 'Inverter',
    title: 'Loss of communication: inverter',
    intro: 'Four links can fail. Work down the list. Steps are for Sanctuary 2; Sanctuary 3 is under More detail.',
    sections: [
      {
        id: 'inverter',
        steps: [
          P(C, 'If any Ethernet cable fails the tester', 'Test every Ethernet cable. Replace any that fail.'),
          P(C, 'Inverter to battery (Sanctuary 2)', 'Battery link (A2_11): all batteries on one bus, each with an address.'),
          P(C, 'Check each battery in the Technician app', 'Technician app: Read Battery Address on each battery.'),
          P(C, 'Inverter to inverter (parallel)', 'Parallel link (A1_11): check cables and matching firmware.'),
          P(C, 'Communicator to inverter', 'Communicator link (E1_1): inverters on, cables right, power-cycle it.'),
          P(C, 'Communicator to the internet', 'Internet: reset the communicator, wait 3 minutes, use 2.4 GHz Wi-Fi.'),
        ],
        more: [C, 'ts-fault-e1_1', 'ts-fault-a1_11'],
      },
    ],
  },
  {
    id: 'power-inputs',
    group: 'POWER INPUTS',
    menu: 'CTs, solar, AC solar, generator',
    title: 'Quick ref: CTs, solar, AC solar, generator',
    intro: 'Pick one. Each has a short list, harder checks if those fail, and the full entries.',
    sections: [
      {
        id: 'cts',
        heading: 'CTs',
        steps: [
          P('ts-ct-check', 'The CT arrows must point away', 'Arrows point away from the main panel, toward the grid.'),
          P('ts-ct-check', 'On a Rev 4, the L1 CT', 'Rev 4: L1 CT on pins 3 and 6, L2 CT on pins 1 and 2.'),
          P('ts-ct-check', 'In a system with several inverters', 'Parallel: only the parent inverter has the CTs.'),
          P('ts-ct-check', 'Two CT sizes have shipped', 'CT size must match the Current Transducer Ratio setting.'),
          P('ts-ct-check', 'On Rev 4 and Sanctuary 3 both CTs share one plug', 'Rev 4 and Sanctuary 3: the CT plug goes in the CT port, not the meter port.'),
        ],
        advanced: [P('ts-ct-check', 'Fault A1_12', 'A1_12 does not catch a bad CT install. Check them by eye.'), P('ts-ct-check', 'Sanctuary 3: wrong CTs can stop', 'Sanctuary 3: wrong CTs can drain the batteries. Fix them, then power cycle the batteries.')],
        more: ['ts-ct-check', 'proc:p-fix-cts'],
      },
      {
        id: 'solar',
        heading: 'Solar',
        steps: [
          P('ts-no-solar', 'Check the PV Disconnect', 'Check the PV Disconnect is on.'),
          P('ts-no-solar', 'With AC/DC off (Rev 4)', 'Rev 4: the AC/DC button must be on for PV.'),
          P('proc:p-string-down', 'The MPPT needs at least 120 V', 'String voltage: at least 120 V, never above 500 V open circuit (cold).'),
          P('proc:p-string-down', 'Polarity', 'Polarity: about -1 V from PV1+ to PV1- means reversed.'),
          P('proc:p-string-down', 'Rapid shutdown', 'Panels with MLPE need the right rapid shutdown transmitter.'),
        ],
        advanced: [
          P('proc:p-string-down', 'Ground leakage', 'Ground leakage: look for water or cracks, often after rain.'),
          P('proc:p-string-down', 'Arc fault (A2_15)', 'A2_15 arc fault: check connectors, then restart.'),
          P('proc:p-string-down', 'PV miswiring (A2_12)', 'A2_12: a PV- terminal is tied to ground. Do not turn on the DC switch.'),
          P('proc:p-string-down', 'Low PV insulation impedance (F1_5)', 'F1_5: low PV insulation. Check panels and wiring for leakage.'),
        ],
        more: ['ts-no-solar', 'proc:p-string-down', 'ts-gfci-solar'],
      },
      {
        id: 'ac-solar',
        heading: 'AC solar',
        steps: [
          P('proc:p-acsolar', 'If the generator port measures 240 V AC', 'Generator port reads 240 V AC? Then it is ready for AC solar.'),
          P('proc:p-acsolar', 'Set the AC Port setting', 'Set AC Port to "generator port".'),
          P('proc:p-acsolar', 'The Sanctuary can accept another solar', 'The AC solar inverter must be grid-following, not off-grid.'),
          P('proc:p-acsolar', '"Power Frequency Response" needs', 'Power Frequency Response must be on. Support sets it.'),
          P('proc:p-acsolar', 'Time of use', 'Leave grid charge on in time of use so AC solar can charge.'),
        ],
        advanced: [
          P('proc:p-acsolar', 'AC Coupled Solar Battery Charge Disable SoC', 'Off-grid: the generator port turns off at 85% SoC by default.'),
          P('proc:p-acsolar', 'The inverter reduces AC solar power', 'The inverter raises frequency to cut AC solar. It trips at 65 Hz by default.'),
          P('proc:p-acsolar', 'The inverter can only limit sell-back', 'It cannot limit AC solar sell-back.'),
        ],
        more: ['proc:p-acsolar'],
      },
      {
        id: 'generator',
        heading: 'Generator',
        steps: [
          P('proc:p-generator-setup', 'Generator Input: enabled', 'Generator Input must be enabled.'),
          P('proc:p-generator-setup', 'The Sanctuary will not accept generator power', 'The inverter will not take generator power while on the grid.'),
          P('proc:p-generator-setup', 'Auto Start: enabled', 'Auto Start on: the inverter starts it. Off: start it by hand.'),
          P('proc:p-generator-setup', 'Start Percent', 'It starts when the battery falls to Start Percent, stops at Stop Percent.'),
          P('proc:p-generator-trouble', 'The inverter ignores a generator that was started manually', 'Started by hand after auto-start: ignored until the inverter calls for it.'),
          P('proc:p-generator-trouble', 'Generator will not start with auto-start', 'Will not auto-start: measure the two start wires. 0 V means relay on or generator not ready.'),
        ],
        advanced: [
          P('proc:p-generator-trouble', 'Generator keeps running', 'Keeps running: unplug the start wire. If it stops, the TVS diode may be leaking.'),
          P('proc:p-generator-trouble', 'Generator turns off on its own', 'Turns off by itself: low load for the Stop Buffer Time (5 min default).'),
          P('proc:p-generator-trouble', 'Other reasons it stops', 'Other stops: Stop Percent, max Operating Time, or voltage/frequency out of range.'),
          P('proc:p-generator-trouble', 'A1_8 with a generator', 'A1_8: check generator frequency settings or lower the charge current.'),
        ],
        more: ['proc:p-generator-setup', 'proc:p-generator-trouble'],
      },
    ],
  },
]

/** Left off the list: the intro says these steps are for Sanctuary 2, and the universal ones need no label. */
const GENERIC_TAGS = ['All Sanctuary 2 revisions', 'All revisions and Sanctuary 3']

type Loaded = Passage | Error
type Resolved = { line: AnswerLine; short: string }[]

function StepList({ steps }: { steps: Resolved }) {
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

function SectionView({ section, loaded }: { section: Section; loaded: Map<string, Loaded> }) {
  const resolve = (picks: Pick[] = []): Resolved => {
    const out: Resolved = []
    for (const pick of picks) {
      const p = loaded.get(pick.passage)
      const line = p && !(p instanceof Error) ? p.lines.find((l) => l.text.startsWith(pick.starts)) : undefined
      if (line) out.push({ line, short: pick.short })
    }
    return out
  }
  const steps = resolve(section.steps)
  const advanced = resolve(section.advanced)
  const sources = [...new Set([...steps, ...advanced].flatMap((s) => s.line.sources))]
  const more = section.more.map((id) => loaded.get(id)).filter((p): p is Passage => !!p && !(p instanceof Error))

  return (
    <section className="qr-section" id={`qr-${section.id}`} aria-label={section.heading ?? section.id}>
      {section.heading && <h2 className="qr-heading">{section.heading}</h2>}
      {steps.length === 0 && advanced.length === 0 && <p className="muted">Nothing here applies to the revision you chose.</p>}
      {steps.length > 0 && <StepList steps={steps} />}
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

export default function QuickRef({ page, rev }: { page: Page; rev: RevisionChoice }) {
  const [loaded, setLoaded] = useState<Map<string, Loaded> | null>(null)

  useEffect(() => {
    let live = true
    setLoaded(null)
    const ids = [...new Set(page.sections.flatMap((s) => [...s.steps, ...(s.advanced ?? [])].map((p) => p.passage).concat(s.more)))]
    Promise.all(ids.map((id) => fetchPassage(id, rev, true).then((p): Loaded => p).catch((e: unknown): Loaded => (e instanceof Error ? e : new Error('Could not load that passage.'))))).then((r) => live && setLoaded(new Map(ids.map((id, i) => [id, r[i]]))))
    return () => {
      live = false
    }
  }, [page, rev])

  const jump = (id: string) => document.getElementById(`qr-${id}`)?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })

  return (
    <section className="quickref" aria-label={page.title}>
      <h1 className="qr-title">{page.title}</h1>
      <p className="lead">{page.intro}</p>
      {page.sections.length > 1 && (
        <div className="chips qr-jump" aria-label="Jump to a section">
          {page.sections.map((s) => (
            <button key={s.id} type="button" className="chip" onClick={() => jump(s.id)}>
              {s.heading}
            </button>
          ))}
        </div>
      )}
      {loaded === null && <p className="muted">LOADING...</p>}
      {loaded && page.sections.map((s) => <SectionView key={s.id} section={s} loaded={loaded} />)}
    </section>
  )
}
