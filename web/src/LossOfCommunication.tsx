import { useState } from 'react'
import type { RevisionChoice } from './api'
import QuickRef, { QUICK_REFS } from './QuickRef'

const GROUP = 'LOSS OF COMMUNICATION'

/**
 * Loss of communication: the sourced step lists for the battery and for the inverter, one at a time. They are the same
 * lists as the Quick ref pages (so there is one copy to keep right), with the revision choice applied.
 */
export default function LossOfCommunication({ rev }: { rev: RevisionChoice }) {
  const pages = QUICK_REFS.filter((q) => q.group === GROUP)
  const [id, setId] = useState(pages[0]?.id)
  const page = pages.find((p) => p.id === id) ?? pages[0]
  if (!page) return null
  return (
    <div className="loc">
      <div className="chips" role="group" aria-label="What lost communication">
        {pages.map((p) => (
          <button key={p.id} type="button" className={`chip ${p.id === page.id ? 'on' : ''}`} aria-pressed={p.id === page.id} onClick={() => setId(p.id)}>
            {p.menu.toUpperCase()}
          </button>
        ))}
      </div>
      <QuickRef page={page} rev={rev} />
    </div>
  )
}
