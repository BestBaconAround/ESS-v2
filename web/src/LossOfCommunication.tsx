import type { RevisionChoice } from './api'
import QuickRef, { QUICK_REFS } from './QuickRef'

const GROUP = 'LOSS OF COMMUNICATION'

/** Loss of communication: the Battery and Inverter Quick ref pages one after the other, so there is one copy to keep right. */
export default function LossOfCommunication({ rev }: { rev: RevisionChoice }) {
  const pages = QUICK_REFS.filter((q) => q.group === GROUP)
  return (
    <div className="loc notes">
      <h1 className="qr-title">Loss of communication</h1>
      <p className="lead">Work down each list in order. These checks are for Sanctuary 2. For Sanctuary 3, open More detail.</p>
      {pages.map((p) => (
        <QuickRef key={p.id} page={p} rev={rev} bare />
      ))}
    </div>
  )
}
