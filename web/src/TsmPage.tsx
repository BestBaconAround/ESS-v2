import { useState } from 'react'
import data from '../../shared/tsm/sections.json'
import { FAULT_CODES } from '../../shared/content/data/faults'
import { passage as fetchPassage, type Passage, type RevisionChoice } from './api'
import AnswerCard from './AnswerCard'

type Block = { h?: string; p?: string; page: number }
export interface TsmSection {
  id: string
  title: string
  from: number
  to: number
  faults?: boolean
  blocks: Block[]
}

export const TSM_SECTIONS: TsmSection[] = data.sections as TsmSection[]
export const TSM_SOURCE: string = data.source

const pages = (s: TsmSection) => (s.from === s.to ? `p.${s.from}` : `pp.${s.from}-${s.to}`)

/** Every alarm, fault and status code of the manual's tables, each opening the entry the chatbot already has for it. */
function FaultList({ rev }: { rev: RevisionChoice }) {
  const [open, setOpen] = useState<string | null>(null)
  const [shown, setShown] = useState<Passage | Error | null>(null)

  const pick = (code: string) => {
    if (open === code) {
      setOpen(null)
      return
    }
    setOpen(code)
    setShown(null)
    fetchPassage(`ts-fault-${code.toLowerCase()}`, rev, true).then(setShown, (e: unknown) => setShown(e instanceof Error ? e : new Error('Could not load that code.')))
  }

  return (
    <div className="tsm-faults">
      <p className="muted">The code tables run on pp.67-96. Tap a code for its description and steps.</p>
      <ul className="fault-list">
        {FAULT_CODES.map((f) => (
          <li key={f.code}>
            <button type="button" className={`fault-btn ${open === f.code ? 'current' : ''}`} onClick={() => pick(f.code)} aria-expanded={open === f.code}>
              <span className="fault-code">{f.code}</span> {f.name}
            </button>
            {open === f.code && (shown === null ? <p className="muted">LOADING...</p> : shown instanceof Error ? <p className="notice bad">{shown.message}</p> : <AnswerCard passage={shown} open />)}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TsmPage({ section, rev, onGo }: { section: TsmSection; rev: RevisionChoice; onGo: (id: string) => void }) {
  const i = TSM_SECTIONS.findIndex((s) => s.id === section.id)
  const prev = TSM_SECTIONS[i - 1]
  const next = TSM_SECTIONS[i + 1]
  let lastPage = 0

  return (
    <section className="quickref tsm" aria-label={section.title}>
      <p className="tsm-kicker">TECHNICAL SERVICE MANUAL // {pages(section).toUpperCase()}</p>
      <h1 className="qr-title">{section.title}</h1>
      <p className="muted small">The manual&apos;s own text. Figures, photos and some tables are not included: open the PDF for those.</p>
      <div className="tsm-body">
        {section.blocks.map((b, n) => {
          const mark = b.page !== lastPage
          lastPage = b.page
          return (
            <div key={n} className="tsm-block">
              {mark && <span className="tsm-page">p.{b.page}</span>}
              {b.h ? <h2 className="tsm-h">{b.h}</h2> : <p>{b.p}</p>}
            </div>
          )
        })}
      </div>
      {section.faults && <FaultList rev={rev} />}
      <nav className="tsm-pager" aria-label="Neighbouring sections">
        {prev ? (
          <button type="button" className="chip" onClick={() => onGo(prev.id)}>
            &lt; {prev.title}
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button type="button" className="chip" onClick={() => onGo(next.id)}>
            {next.title} &gt;
          </button>
        )}
      </nav>
      <p className="muted small">Source: {TSM_SOURCE}.</p>
    </section>
  )
}
