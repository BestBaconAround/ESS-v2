import { TSM_SECTIONS } from './TsmPage'

/** The Technical Service Manual's table of contents: pick a section to read it. */
export default function TsmContents({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="notes">
      <h1 className="qr-title">Technical Service Manual</h1>
      <p className="lead">The manual, section by section, with its real pages. Pick a section.</p>
      <ul className="toc">
        {TSM_SECTIONS.map((t) => (
          <li key={t.id}>
            <button type="button" className="toc-item" onClick={() => onOpen(t.id)}>
              <span className="toc-page">p.{t.from}</span> {t.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
