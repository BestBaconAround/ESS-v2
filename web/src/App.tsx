import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ask, health, passage as fetchPassage, suggestions as fetchSuggestions, type AnswerResponse, type Health, type Passage, type RevisionChoice } from './api'
import AnswerCard from './AnswerCard'

const REVISIONS: { value: RevisionChoice; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'rev1', label: 'REV 1' },
  { value: 'rev2', label: 'REV 2' },
  { value: 'rev3', label: 'REV 3' },
  { value: 'rev4', label: 'REV 4' },
  { value: 'gen3', label: 'SANCTUARY 3' },
]

const MAX = 500

type Message =
  | { id: number; from: 'user'; text: string }
  | { id: number; from: 'bot'; response: AnswerResponse; also?: { id: string; title: string; where: string }[] }
  | { id: number; from: 'bot'; passage: Passage }
  | { id: number; from: 'error'; text: string }

function loadRevision(): RevisionChoice {
  try {
    const v = localStorage.getItem('chat:revision') as RevisionChoice | null
    if (v && REVISIONS.some((r) => r.value === v)) return v
  } catch {
    /* storage can be unavailable; the page still works */
  }
  return 'all'
}

function BoltLogo() {
  // A dot-matrix lightning bolt.
  const dots = ['..#..', '.#...', '###..', '..#..', '.#...']
  return (
    <svg aria-hidden viewBox="0 0 50 50" className="logo-mark">
      {dots.flatMap((row, y) => [...row].map((c, x) => (c === '#' ? <circle key={`${x}-${y}`} cx={5 + x * 10} cy={5 + y * 10} r="3.6" /> : <circle key={`${x}-${y}`} cx={5 + x * 10} cy={5 + y * 10} r="1.2" className="dim" />)))}
    </svg>
  )
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [rev, setRev] = useState<RevisionChoice>(loadRevision)
  const [status, setStatus] = useState<Health | null | 'offline'>(null)
  const [chips, setChips] = useState<string[]>([])
  const nextId = useRef(1)
  const lastQuestion = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    health().then(setStatus).catch(() => setStatus('offline'))
    fetchSuggestions().then(setChips).catch(() => setChips([]))
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('chat:revision', rev)
    } catch {
      /* ignore */
    }
  }, [rev])

  // After each new answer, bring the question and the start of its reply into view.
  useEffect(() => {
    if (!messages.length) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    lastQuestion.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }, [messages.length])

  const push = (...m: Message[]) => setMessages((all) => [...all, ...m])

  const submit = async (question: string) => {
    const q = question.trim()
    if (!q || busy) return
    const id = nextId.current
    nextId.current += 2
    setInput('')
    setBusy(true)
    push({ id, from: 'user', text: q })
    try {
      const response = await ask(q, rev)
      push({ id: id + 1, from: 'bot', response, also: response.kind === 'answer' ? response.also : undefined })
    } catch (e) {
      push({ id: id + 1, from: 'error', text: e instanceof Error ? e.message : 'Could not reach the server.' })
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  const openAlso = async (id: string) => {
    const mid = nextId.current
    nextId.current += 1
    try {
      push({ id: mid, from: 'bot', passage: await fetchPassage(id, rev) })
    } catch (e) {
      push({ id: mid, from: 'error', text: e instanceof Error ? e.message : 'Could not load that passage.' })
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void submit(input)
  }

  const online = status !== null && status !== 'offline'
  const lastUser = [...messages].reverse().find((m) => m.from === 'user')?.id

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo-cell">
          <BoltLogo />
          <div>
            <div className="wordmark">LION ESS</div>
            <div className="wordmark-sub">// CHAT</div>
          </div>
        </div>
        <div className="topbar-right">
          <div className="status" aria-live="polite">
            <span className={`dot ${online ? 'on' : status === 'offline' ? 'off' : ''}`} aria-hidden />
            <span>{online ? (status.mode === 'local' ? 'LOADED' : 'ONLINE') : status === 'offline' ? 'OFFLINE' : 'CONNECTING'}</span>
            {online && (
              <span className="muted">
                {' '}
                // {status.passages} PASSAGES // v{status.version}
              </span>
            )}
          </div>
          <label className="rev">
            <span>REVISION</span>
            <select value={rev} onChange={(e) => setRev(e.target.value as RevisionChoice)} aria-label="Hardware revision for the answers">
              {REVISIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="main">
        {messages.length === 0 && (
          <section className="hero">
            <h1>
              <span className="dim-line">ASK THE</span>
              <br />
              SANCTUARY NOTES
            </h1>
            <p className="lead">Answers come only from the Lion documents and the author&apos;s notes loaded into this app, with the source on every line. There is no AI: if nothing matches, it says so.</p>
            <div className="chips" aria-label="Example questions">
              {chips.map((c) => (
                <button key={c} type="button" className="chip" onClick={() => void submit(c)}>
                  &gt; {c}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="log" role="log" aria-live="polite" aria-label="Conversation">
          {messages.map((m) => {
            if (m.from === 'user')
              return (
                <div key={m.id} ref={m.id === lastUser ? lastQuestion : undefined} className="user">
                  <span className="prompt">YOU &gt;</span> {m.text}
                </div>
              )
            if (m.from === 'error')
              return (
                <p key={m.id} className="notice bad" role="alert">
                  {m.text}
                </p>
              )
            if ('passage' in m) return <AnswerCard key={m.id} passage={m.passage} />
            const r = m.response
            return (
              <div key={m.id} className="bot">
                <p className={`notice ${r.kind === 'none' ? 'warn' : ''}`}>{r.message}</p>
                {r.kind !== 'none' && r.passages.map((p, i) => <AnswerCard key={p.id} passage={p} index={r.kind === 'fault-codes' ? i + 1 : undefined} />)}
                {m.also && m.also.length > 0 && (
                  <div className="also">
                    <span className="muted">ALSO RELEVANT:</span>
                    {m.also.map((a) => (
                      <button key={a.id} type="button" className="chip small" onClick={() => void openAlso(a.id)} title={a.where}>
                        {a.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {busy && <p className="muted">SEARCHING THE NOTES...</p>}
        </div>
      </main>

      <footer className="bottombar">
        <form onSubmit={onSubmit} className="inputrow">
          <label className="sr-only" htmlFor="q">
            Your question
          </label>
          <span className="prompt" aria-hidden>
            &gt;
          </span>
          <input id="q" ref={inputRef} value={input} maxLength={MAX} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a battery, inverter or power problem" autoComplete="off" autoFocus />
          <button type="submit" className="btn primary" disabled={!input.trim() || busy}>
            ASK
          </button>
        </form>
        <p className="footnote">ANSWERS COME ONLY FROM THE LOADED REFERENCE MATERIAL // NO AI // NOTHING YOU TYPE IS SAVED</p>
      </footer>
    </div>
  )
}
