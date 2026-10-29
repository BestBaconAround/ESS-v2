import { NotePanel } from '../NotesView'
import { COURSE, COURSE_PARTS } from './index'

/**
 * TEMPORARY: skim the whole course on one page, lessons only, no checks. To remove it, delete this file, the "Skim" button in
 * CoursePage.tsx and the `skim` branch in TrainingPage.tsx. The id `skim` is reserved (a test keeps it from clashing with a module).
 */
export const SKIM_ID = 'skim'

const jump = (id: string) =>
  document.getElementById(`skim-${id}`)?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })

const pages = (a: number, b: number) => (a === b ? `p.${a}` : `pp.${a}-${b}`)

export default function SkimView({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="notes course-skim">
      <h1 className="qr-title">Skim the course</h1>
      <p className="lead">Every lesson on one page, with no questions. Use the list to jump to a module, or open a module to take its check.</p>
      <div className="chips skim-jump" role="group" aria-label="Jump to a module">
        {COURSE.map((m, i) => (
          <button key={m.id} type="button" className="chip small" onClick={() => jump(m.id)}>
            {String(i + 1).padStart(2, '0')} {m.title}
          </button>
        ))}
      </div>
      {COURSE_PARTS.map((part) => (
        <section key={part} aria-label={part}>
          <h2 className="hub-group">{part.toUpperCase()}</h2>
          {COURSE.filter((m) => m.part === part).map((m) => (
            <article key={m.id} id={`skim-${m.id}`} className="skim-module" aria-labelledby={`skim-h-${m.id}`}>
              <h3 className="skim-title" id={`skim-h-${m.id}`}>
                <span className="skim-num">{String(COURSE.indexOf(m) + 1).padStart(2, '0')}</span> {m.title}
              </h3>
              <p className="muted small">
                {m.intro} ({pages(m.pages[0], m.pages[1])}){' '}
                <button type="button" className="linkish" onClick={() => onOpen(`course:${m.id}`)}>
                  TAKE THE CHECK &rsaquo;
                </button>
              </p>
              <div className="qr-list">
                {m.lessons.map((l, i) => (
                  <NotePanel key={l.heading} id={`skim-${m.id}-${i}`} heading={l.heading} where={`MANUAL ${pages(m.pages[0], m.pages[1]).toUpperCase()}`} blocks={[{ list: l.facts.map((x) => `${x.say} (p.${x.page})`) }]} />
                ))}
              </div>
            </article>
          ))}
        </section>
      ))}
    </div>
  )
}
