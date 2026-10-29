import { useState } from 'react'
import { sourceText } from '../../shared/content/labels'
import { makeRound, type AlarmQuestion } from './alarmQuiz'

const ROUND = 10
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

interface Missed {
  question: AlarmQuestion
  picked: number
}

/** Learn alarms: an alarm code comes up, and you pick its description from four. */
export default function LearnAlarms() {
  const [round, setRound] = useState<AlarmQuestion[]>(() => makeRound(ROUND))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [missed, setMissed] = useState<Missed[]>([])

  const finished = index >= round.length
  const q = round[index]
  const answered = picked !== null

  const choose = (i: number) => {
    if (answered) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
    else setMissed((m) => [...m, { question: q, picked: i }])
  }

  const next = () => {
    setPicked(null)
    setIndex((n) => n + 1)
  }

  const again = () => {
    setRound(makeRound(ROUND))
    setIndex(0)
    setPicked(null)
    setScore(0)
    setMissed([])
  }

  if (finished) {
    return (
      <section className="panel" aria-labelledby="learn-alarms-title">
        <div className="titlebar">
          <span className="titlebar-text" id="learn-alarms-title">
            Learn alarms // round done
          </span>
        </div>
        <div className="panel-body quiz">
          <p className="quiz-score" role="status">
            <span className="num">{score}</span> / {round.length} RIGHT
          </p>
          {missed.length === 0 ? (
            <p className="notice">No misses. Start another round to see different codes.</p>
          ) : (
            <>
              <p className="notice">Codes to look at again:</p>
              <ul className="missed">
                {missed.map(({ question }) => (
                  <li key={question.fault.code}>
                    <span className="quiz-code small">{question.fault.code}</span> <strong>{question.fault.name}</strong>
                    <br />
                    {question.options[question.answer]}
                  </li>
                ))}
              </ul>
            </>
          )}
          <button type="button" className="btn primary" onClick={again} autoFocus>
            NEW ROUND
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="panel" aria-labelledby="learn-alarms-title">
      <div className="titlebar">
        <span className="titlebar-text" id="learn-alarms-title">
          Learn alarms
        </span>
        <span className="titlebar-where">
          QUESTION {index + 1} OF {round.length} // {score} RIGHT
        </span>
      </div>
      <div className="panel-body quiz">
        <p className="notice">Which description goes with this code?</p>
        <p className="quiz-code" aria-label={`Alarm code ${q.fault.code}`}>
          {q.fault.code}
        </p>
        <div className="quiz-options" role="group" aria-label="Descriptions">
          {q.options.map((text, i) => {
            const state = !answered ? '' : i === q.answer ? 'right' : i === picked ? 'wrong' : 'dim'
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
            <div className={`quiz-feedback ${picked === q.answer ? 'right' : 'wrong'}`}>
              <p>
                <strong>{picked === q.answer ? 'CORRECT.' : `NOT QUITE. THE ANSWER IS ${LETTERS[q.answer]}.`}</strong> {q.fault.code} is <strong>{q.fault.name}</strong>.
              </p>
              <p className="sources">{q.fault.sources.map(sourceText).join(' // ')}</p>
              <button type="button" className="btn primary" onClick={next} autoFocus>
                {index + 1 === round.length ? 'SEE RESULT' : 'NEXT'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
