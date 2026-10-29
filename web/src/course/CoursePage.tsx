import { useState } from 'react'
import { NotePanel } from '../NotesView'
import { TSM_SECTIONS } from '../TsmPage'
import { makeCheck, type AskedQuestion } from './check'
import { COURSE, COURSE_PARTS, PASS_SHARE, moduleById, type CourseModule } from './index'
import { SKIM_ID } from './SkimView'
import { clearProgress, hasPassed, loadProgress, recordResult, saveProgress, type Progress } from './progress'

const LETTERS = ['A', 'B', 'C', 'D']
const pct = Math.round(PASS_SHARE * 100)

const pages = (m: CourseModule) => (m.pages[0] === m.pages[1] ? `p.${m.pages[0]}` : `pp.${m.pages[0]}-${m.pages[1]}`)

/** The manual section a page is in, so a lesson line can open it. */
const sectionIdForPage = (page: number): string | undefined => TSM_SECTIONS.find((s) => page >= s.from && page <= s.to)?.id

interface Missed {
  asked: AskedQuestion
  picked: number
}

/** The check at the end of a module: every question once, with the manual page that settles it. */
function ModuleCheck({ module: m, onFinish, onManual, next }: { module: CourseModule; onFinish: (score: number, total: number) => void; onManual: (page: number) => void; next?: CourseModule }) {
  const [check, setCheck] = useState<AskedQuestion[] | null>(null)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [missed, setMissed] = useState<Missed[]>([])
  const [done, setDone] = useState(false)

  const start = () => {
    setCheck(makeCheck(m))
    setIndex(0)
    setPicked(null)
    setScore(0)
    setMissed([])
    setDone(false)
  }

  if (!check) {
    return (
      <section className="panel" aria-labelledby={`check-${m.id}`}>
        <div className="titlebar">
          <h2 className="titlebar-text" id={`check-${m.id}`}>
            Check your knowledge
          </h2>
          <span className="titlebar-where">{m.questions.length} QUESTIONS // PASS AT {pct}%</span>
        </div>
        <div className="panel-body quiz">
          <p className="notice">Questions come from the lesson above. After each answer you see the manual page that settles it.</p>
          <button type="button" className="btn primary" onClick={start}>
            START
          </button>
        </div>
      </section>
    )
  }

  if (done) {
    const total = check.length
    const ok = score / total >= PASS_SHARE
    return (
      <section className="panel" aria-labelledby={`check-${m.id}`}>
        <div className="titlebar">
          <h2 className="titlebar-text" id={`check-${m.id}`}>
            Check your knowledge // done
          </h2>
        </div>
        <div className="panel-body quiz">
          <p className="quiz-score" role="status">
            <span className="num">{score}</span> / {total} RIGHT {ok ? '// PASSED' : `// ${pct}% TO PASS`}
          </p>
          {missed.length > 0 && (
            <>
              <p className="notice">Worth another look:</p>
              <ul className="missed">
                {missed.map(({ asked }) => (
                  <li key={asked.question.ask}>
                    <strong>{asked.question.ask}</strong>
                    <br />
                    {asked.question.right} <span className="muted">(p.{asked.question.page})</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="quiz-actions">
            <button type="button" className={`btn ${ok ? '' : 'primary'}`} onClick={start}>
              TRY AGAIN
            </button>
            {next && ok && <span className="muted">Next: {next.title}</span>}
          </div>
        </div>
      </section>
    )
  }

  const asked = check[index]
  const q = asked.question
  const answered = picked !== null

  const choose = (i: number) => {
    if (answered) return
    setPicked(i)
    if (i === asked.answer) setScore((s) => s + 1)
    else setMissed((x) => [...x, { asked, picked: i }])
  }

  const advance = () => {
    if (index + 1 >= check.length) {
      setDone(true)
      onFinish(score, check.length)
    } else {
      setIndex((n) => n + 1)
      setPicked(null)
    }
  }

  return (
    <section className="panel" aria-labelledby={`check-${m.id}`}>
      <div className="titlebar">
        <h2 className="titlebar-text" id={`check-${m.id}`}>
          Check your knowledge
        </h2>
        <span className="titlebar-where">
          QUESTION {index + 1} OF {check.length} // {score} RIGHT
        </span>
      </div>
      <div className="panel-body quiz">
        <p className="course-ask">{q.ask}</p>
        <div className="quiz-options" role="group" aria-label="Choices">
          {asked.options.map((text, i) => {
            const state = !answered ? '' : i === asked.answer ? 'right' : i === picked ? 'wrong' : 'dim'
            return (
              <button key={text} type="button" className={`quiz-option ${state}`} onClick={() => choose(i)} disabled={answered} aria-pressed={picked === i}>
                <span className="quiz-letter" aria-hidden>
                  {LETTERS[i]}
                </span>
                <span>{text}</span>
              </button>
            )
          })}
        </div>
        <div aria-live="polite">
          {answered && (
            <div className={`quiz-feedback ${picked === asked.answer ? 'right' : 'wrong'}`}>
              <p>
                <strong>{picked === asked.answer ? 'CORRECT.' : `NOT QUITE. THE ANSWER IS ${LETTERS[asked.answer]}.`}</strong> {q.why ?? `The manual says: "${q.proof}".`}
              </p>
              <p className="sources">Technical Service Manual, p.{q.page}</p>
              <div className="quiz-actions">
                <button type="button" className="btn primary" onClick={advance} autoFocus>
                  {index + 1 === check.length ? 'SEE RESULT' : 'NEXT'}
                </button>
                <button type="button" className="linkish" onClick={() => onManual(q.page)}>
                  READ IT IN THE MANUAL &rsaquo;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/** One module: the lesson as checklist panels, then the check. */
export function ModuleView({ id, onOpen }: { id: string; onOpen: (id: string) => void }) {
  const m = moduleById(id)
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  if (!m) return null
  const at = COURSE.findIndex((x) => x.id === m.id)
  const next = COURSE[at + 1]
  const manual = (page: number) => {
    const s = sectionIdForPage(page)
    if (s) onOpen(`tsm:${s}@course:${m.id}`)
  }
  const finish = (score: number, total: number) => {
    const p = recordResult(progress, m.id, score, total)
    setProgress(p)
    saveProgress(p)
  }
  const result = progress[m.id]
  return (
    <div className="notes course-module">
      <p className="tsm-kicker">
        COURSE // MODULE {at + 1} OF {COURSE.length} // {m.part.toUpperCase()}
      </p>
      <h1 className="qr-title">{m.title}</h1>
      <p className="lead">{m.intro}</p>
      <p className="muted small">
        Built from the Technical Service Manual, {pages(m)}.{' '}
        <button type="button" className="linkish" onClick={() => manual(m.pages[0])}>
          OPEN THE MANUAL &rsaquo;
        </button>
        {result && (
          <>
            {' '}
            Best so far: {result.best} of {result.total}
            {hasPassed(result) ? ' (passed)' : ''}.
          </>
        )}
      </p>
      <div className="qr-list">
        {m.lessons.map((l, i) => (
          <NotePanel key={l.heading} id={`${m.id}-${i}`} heading={l.heading} where={`MANUAL ${pages(m).toUpperCase()}`} blocks={[{ list: l.facts.map((x) => `${x.say} (p.${x.page})`) }]} />
        ))}
        {m.practice && (
          <NotePanel id={`${m.id}-practice`} heading="Practice" where="TRAINING" blocks={[{ see: { to: m.practice.to, label: m.practice.label } }]} onOpen={onOpen} />
        )}
        <ModuleCheck key={m.id} module={m} onFinish={finish} onManual={manual} next={next} />
      </div>
      <nav className="tsm-pager" aria-label="Neighbouring modules">
        {COURSE[at - 1] ? (
          <button type="button" className="chip" onClick={() => onOpen(`course:${COURSE[at - 1].id}`)}>
            &lt; {COURSE[at - 1].title}
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button type="button" className="chip" onClick={() => onOpen(`course:${next.id}`)}>
            {next.title} &gt;
          </button>
        )}
      </nav>
    </div>
  )
}

/** The course home: every module by part, with the best result on each. */
export default function CourseHome({ onOpen }: { onOpen: (id: string) => void }) {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const passed = COURSE.filter((m) => hasPassed(progress[m.id])).length
  return (
    <div className="notes course-home">
      <h1 className="qr-title">Technical Service Manual course</h1>
      <p className="lead">
        {COURSE.length} short modules built from the manual, in its own order. Read the lesson, then check what you took in. Every line names its manual page, and you pass a module with {pct}% or better.
      </p>
      <p className="course-progress" role="status">
        <span className="num">{passed}</span> OF {COURSE.length} MODULES PASSED
      </p>
      <p>
        <button type="button" className="btn primary" onClick={() => onOpen(`course:${SKIM_ID}`)}>
          SKIM THE WHOLE COURSE
        </button>
      </p>
      {COURSE_PARTS.map((part) => (
        <section key={part} aria-label={part}>
          <h2 className="hub-group">{part.toUpperCase()}</h2>
          <ul className="toc">
            {COURSE.filter((m) => m.part === part).map((m) => {
              const r = progress[m.id]
              return (
                <li key={m.id}>
                  <button type="button" className="toc-item course-row" onClick={() => onOpen(`course:${m.id}`)}>
                    <span className="toc-page">{String(COURSE.indexOf(m) + 1).padStart(2, '0')}</span>
                    <span className="course-row-main">
                      <span>{m.title}</span>
                      <span className="muted small">
                        {pages(m)} // {m.questions.length} questions
                      </span>
                    </span>
                    <span className={`course-status ${hasPassed(r) ? 'passed' : ''}`}>{r ? `${r.best}/${r.total}${hasPassed(r) ? ' ✓' : ''}` : 'NOT STARTED'}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
      {Object.keys(progress).length > 0 && (
        <p>
          <button
            type="button"
            className="linkish"
            onClick={() => {
              clearProgress()
              setProgress({})
            }}
          >
            RESET MY PROGRESS
          </button>{' '}
          <span className="muted small">Progress is kept in this browser only.</span>
        </p>
      )}
    </div>
  )
}
