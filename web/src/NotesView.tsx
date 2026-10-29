import type { NoteBlock, NotesPage } from './trainingNotes'

const Block = ({ block }: { block: NoteBlock }) =>
  'list' in block ? (
    <ul className="lines">
      {block.list.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  ) : (
    <p>{block.p}</p>
  )

/** A Training page made of the author's notes: a heading, a short lead, and one panel per section. */
export default function NotesView({ page }: { page: NotesPage }) {
  return (
    <div className="notes">
      <h1 className="qr-title">{page.title}</h1>
      <p className="lead">{page.lead}</p>
      <div className="qr-list">
        {page.sections.map((s) => (
          <section key={s.id} className="panel" aria-labelledby={`note-${s.id}`}>
            <div className="titlebar">
              <h2 className="titlebar-text" id={`note-${s.id}`}>
                {s.heading}
              </h2>
              <span className="titlebar-where">AUTHOR&apos;S NOTES</span>
            </div>
            <div className="panel-body notes-body">
              {s.blocks.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
