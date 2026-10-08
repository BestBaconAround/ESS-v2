import { useEffect, useState } from 'react'
import { passage as fetchPassage, type Passage, type RevisionChoice } from './api'
import AnswerCard from './AnswerCard'

export type QuickRefId = 'loc-battery' | 'loc-inverter'

interface Page {
  id: QuickRefId
  menu: string
  title: string
  intro: string
  /** Passages that already exist in the reference material. Nothing is written here that is not in them. */
  passages: string[]
}

export const QUICK_REFS: Page[] = [
  {
    id: 'loc-battery',
    menu: 'Battery',
    title: 'Loss of communication: battery',
    intro: 'Cable first. For a battery that reads above 51 V, test the BMS cable and replace it if it fails.',
    passages: ['ts-battery-no-comm', 'ts-gen3-battery-comm', 'ts-fault-a2_11'],
  },
  {
    id: 'loc-inverter',
    menu: 'Inverter',
    title: 'Loss of communication: inverter',
    intro: 'Four links can fail: inverter to battery, inverter to inverter, communicator to inverter, communicator to the internet.',
    passages: ['proc:p-comms-map', 'ts-fault-e1_1', 'ts-fault-a1_11'],
  },
]

export default function QuickRef({ page, rev }: { page: Page; rev: RevisionChoice }) {
  const [items, setItems] = useState<(Passage | Error)[] | null>(null)

  useEffect(() => {
    let live = true
    setItems(null)
    Promise.all(page.passages.map((id) => fetchPassage(id, rev, true).catch((e: unknown) => (e instanceof Error ? e : new Error('Could not load that passage.'))))).then((r) => live && setItems(r))
    return () => {
      live = false
    }
  }, [page, rev])

  return (
    <section className="quickref" aria-label={page.title}>
      <h1 className="qr-title">{page.title}</h1>
      <p className="lead">{page.intro}</p>
      {items === null && <p className="muted">LOADING...</p>}
      <div className="qr-list">
        {items?.map((p, i) =>
          p instanceof Error ? (
            <p key={page.passages[i]} className="notice bad" role="alert">
              {p.message}
            </p>
          ) : (
            <AnswerCard key={p.id} passage={p} index={i + 1} open />
          ),
        )}
      </div>
    </section>
  )
}
