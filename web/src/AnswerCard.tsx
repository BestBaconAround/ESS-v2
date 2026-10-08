import { useState } from 'react'
import type { Passage } from './api'

/** Steps shown before "Show all". Keeps one answer from filling the screen. */
const PREVIEW_LINES = 3

export default function AnswerCard({ passage, index }: { passage: Passage; index?: number }) {
  const [all, setAll] = useState(false)
  const shown = all ? passage.lines : passage.lines.slice(0, PREVIEW_LINES)
  const sources = [...new Set(passage.lines.flatMap((l) => l.sources))]
  const more = passage.total - PREVIEW_LINES
  return (
    <article className="panel answer" aria-label={passage.title}>
      <header className="titlebar">
        <span className="titlebar-text">
          {index !== undefined && <span className="num">{String(index).padStart(2, '0')} / </span>}
          {passage.title}
        </span>
        <span className="titlebar-where">{passage.where}</span>
      </header>
      <div className="panel-body">
        {passage.lines.length > 0 ? (
          <ul className="lines">
            {shown.map((l, i) => (
              <li key={i}>
                <span className="tag">{l.revisions}</span>
                {l.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Nothing in this passage applies to the revision you chose.</p>
        )}
        {more > 0 && (
          <button type="button" className="linkish" onClick={() => setAll((v) => !v)} aria-expanded={all}>
            {all ? '[ SHOW FEWER ]' : `[ SHOW ALL ${passage.total} STEPS ]`}
          </button>
        )}
        {all && passage.total > passage.lines.length && <p className="muted small">Showing the first {passage.lines.length} of {passage.total}.</p>}
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
      </div>
    </article>
  )
}
