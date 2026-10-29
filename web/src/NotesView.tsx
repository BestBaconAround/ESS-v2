import type { NoteBlock, NotesPage } from './trainingNotes'

export const Block = ({ block }: { block: NoteBlock }) =>
  'list' in block ? (
    <ul className="lines">
      {block.list.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  ) : (
    <p>{block.p}</p>
  )

/** One panel: a heading bar with where the content comes from, then the lines to read. */
export function NotePanel({ id, heading, where, blocks }: { id: string; heading: string; where: string; blocks: NoteBlock[] }) {
  return (
    <section className="panel" aria-labelledby={`note-${id}`}>
      <div className="titlebar">
        <h2 className="titlebar-text" id={`note-${id}`}>
          {heading}
        </h2>
        <span className="titlebar-where">{where}</span>
      </div>
      <div className="panel-body notes-body">
        {blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
    </section>
  )
}

/** A Training page made of the author's notes: a heading, a short lead, and one panel per section. */
export default function NotesView({ page }: { page: NotesPage }) {
  return (
    <div className="notes">
      <h1 className="qr-title">{page.title}</h1>
      <p className="lead">{page.lead}</p>
      <div className="qr-list">
        {page.sections.map((s) => (
          <NotePanel key={s.id} id={s.id} heading={s.heading} where="AUTHOR'S NOTES" blocks={s.blocks} />
        ))}
      </div>
    </div>
  )
}
