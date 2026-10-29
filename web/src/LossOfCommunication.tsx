import { useState } from 'react'
import type { RevisionChoice } from './api'
import { NotePanel } from './NotesView'
import QuickRef, { QUICK_REFS } from './QuickRef'

const GROUP = 'LOSS OF COMMUNICATION'

/**
 * Loss of communication: the checks for the battery and for the inverter as short lines to work down on a call. The
 * lines are the same ones the Quick ref pages use (one copy to keep right). The full wording, the sources and the
 * Sanctuary 3 differences are one tap away, shown with the revision choice applied.
 */
export default function LossOfCommunication({ rev }: { rev: RevisionChoice }) {
  const pages = QUICK_REFS.filter((q) => q.group === GROUP)
  const [id, setId] = useState(pages[0]?.id)
  const full = pages.find((p) => p.id === id) ?? pages[0]
  if (!full) return null
  return (
    <div className="loc notes">
      <h1 className="qr-title">Loss of communication</h1>
      <p className="lead">Work down each list in order. These checks are for Sanctuary 2. For Sanctuary 3, open the full steps.</p>
      <div className="qr-list">
        {pages.flatMap((p) =>
          p.sections.flatMap((s, i) => [
            <NotePanel key={`${p.id}-${s.id}`} id={`${p.id}-${s.id}`} heading={s.heading ? `${p.menu}: ${s.heading}` : p.menu} where="SANCTUARY 2" blocks={[{ list: s.steps.map((x) => x.short) }]} />,
            ...(s.advanced?.length
              ? [<NotePanel key={`${p.id}-${s.id}-adv-${i}`} id={`${p.id}-${s.id}-adv`} heading={`${p.menu}: if all other steps fail`} where="SANCTUARY 2" blocks={[{ list: s.advanced.map((x) => x.short) }]} />]
              : []),
          ]),
        )}
      </div>
      <details className="qr-more">
        <summary>FULL STEPS, SOURCES AND SANCTUARY 3</summary>
        <div className="chips" role="group" aria-label="What lost communication">
          {pages.map((p) => (
            <button key={p.id} type="button" className={`chip ${p.id === full.id ? 'on' : ''}`} aria-pressed={p.id === full.id} onClick={() => setId(p.id)}>
              {p.menu.toUpperCase()}
            </button>
          ))}
        </div>
        <QuickRef page={full} rev={rev} />
      </details>
    </div>
  )
}
