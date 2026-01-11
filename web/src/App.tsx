import { useMemo, useState } from 'react'

type Step = 'setup' | 'interview' | 'feedback'

type InterviewMode = 'technical' | 'behavioral' | 'mixed'

type Competency =
  | 'Technical depth'
  | 'Problem solving'
  | 'Communication'
  | 'Behavioral'
  | 'Spontaneous thinking'

type FeedbackItem = {
  competency: Competency
  score: 1 | 2 | 3 | 4 | 5
  signal: string
  improvement: string
}

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {label}
    </span>
  )
}

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 4
      ? 'bg-emerald-400/15 text-emerald-200 border-emerald-400/30'
      : score === 3
        ? 'bg-amber-400/15 text-amber-200 border-amber-400/30'
        : 'bg-rose-400/15 text-rose-200 border-rose-400/30'
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        color,
      )}
    >
      {score}/5
    </span>
  )
}

function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean },
) {
  const { className, loading, disabled, children, ...rest } = props
  const isDisabled = disabled || loading
  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-950',
        'shadow-sm shadow-black/20 transition active:translate-y-px',
        'hover:bg-white disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/20 border-t-slate-950" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props
  return (
    <button
      {...rest}
      className={classNames(
        'inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-sm font-semibold text-slate-100',
        'transition hover:bg-slate-900 active:translate-y-px',
        className,
      )}
    />
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={classNames(
        'rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-sm shadow-black/30',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Header({ step, onReset }: { step: Step; onReset: () => void }) {
  const items: Array<{ key: Step; label: string }> = [
    { key: 'setup', label: 'Setup' },
    { key: 'interview', label: 'Interview' },
    { key: 'feedback', label: 'Feedback' },
  ]

  return (
    <header className="sticky top-0 z-20 border-b border-slate-900/60 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-950 shadow-sm shadow-black/30">
            <span className="text-base font-black tracking-tight">HM</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-50">HireMetry</div>
            <div className="text-xs text-slate-400">AI interview practice UI (mock)</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {items.map((i) => (
            <div
              key={i.key}
              className={classNames(
                'rounded-full px-3 py-1 text-xs font-semibold',
                step === i.key
                  ? 'bg-slate-100 text-slate-950'
                  : 'bg-slate-900/30 text-slate-300',
              )}
            >
              {i.label}
            </div>
          ))}
        </div>

        <SecondaryButton onClick={onReset}>New session</SecondaryButton>
      </div>
    </header>
  )
}

function App() {
  const [step, setStep] = useState<Step>('setup')
  const [role, setRole] = useState('Software Engineer')
  const [level, setLevel] = useState('Mid')
  const [mode, setMode] = useState<InterviewMode>('mixed')
  const [duration, setDuration] = useState(25)
  const [loading, setLoading] = useState(false)

  const [questionIndex, setQuestionIndex] = useState(0)
  const [transcript, setTranscript] = useState(
    "Hi! I’m ready. Could you clarify the constraints and expected runtime?",
  )
  const [notes, setNotes] = useState('')

  const questions = useMemo(
    () =>
      [
        {
          title: 'Clarify + plan',
          prompt:
            'Design an algorithm to detect a duplicate in an array. Talk through constraints and tradeoffs.',
        },
        {
          title: 'Deep dive',
          prompt:
            'What edge cases could break your approach? How would you test it quickly?',
        },
        {
          title: 'Behavioral',
          prompt:
            'Tell me about a time you disagreed with a teammate. How did you handle it?',
        },
        {
          title: 'Spontaneous',
          prompt:
            'You have 30 seconds: summarize your solution for a non-technical stakeholder.',
        },
      ],
    [],
  )

  const feedback: FeedbackItem[] = useMemo(
    () =>
      [
        {
          competency: 'Problem solving',
          score: 4,
          signal: 'You asked clarifying questions and stated assumptions early.',
          improvement: 'Add a quick complexity estimate before coding (time + space).',
        },
        {
          competency: 'Communication',
          score: 3,
          signal: 'Clear structure, but you sometimes jumped ahead.',
          improvement: 'Use signposting: “Plan → Approach → Edge cases → Complexity → Tests”.',
        },
        {
          competency: 'Technical depth',
          score: 3,
          signal: 'Good baseline solution, limited discussion of alternatives.',
          improvement: 'Mention at least one alternative and why you didn’t choose it.',
        },
        {
          competency: 'Behavioral',
          score: 4,
          signal: 'Strong ownership and reflection.',
          improvement: 'Quantify impact (what improved, how you measured).',
        },
        {
          competency: 'Spontaneous thinking',
          score: 3,
          signal: 'Stayed composed under time pressure.',
          improvement: 'Lead with the headline first, then 2 supporting points.',
        },
      ],
    [],
  )

  const overall = useMemo(() => {
    const avg =
      feedback.reduce((sum, f) => sum + f.score, 0) / Math.max(1, feedback.length)
    return Math.round(avg * 10) / 10
  }, [feedback])

  async function startInterview() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 550))
    setLoading(false)
    setStep('interview')
  }

  async function generateFeedback() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 650))
    setLoading(false)
    setStep('feedback')
  }

  function reset() {
    setStep('setup')
    setQuestionIndex(0)
    setTranscript("Hi! I’m ready. Could you clarify the constraints and expected runtime?")
    setNotes('')
  }

  return (
    <div className="min-h-dvh">
      <Header step={step} onReset={reset} />

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        {step === 'setup' ? (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-xs font-semibold text-slate-300">
                  New session
                  <span className="text-slate-500">•</span>
                  {new Date().toLocaleDateString()}
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
                  Practice interviews. Get structured feedback.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  This is a UI-only prototype. It simulates an AI interviewer that
                  observes technical, behavioral, spontaneous thinking, and problem
                  solving patterns.
                </p>
              </div>

              <Card>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">
                      Role
                    </label>
                    <select
                      className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 focus:border-slate-700"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option>Software Engineer</option>
                      <option>Data Scientist</option>
                      <option>DevOps Engineer</option>
                      <option>ML Engineer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">
                      Level
                    </label>
                    <select
                      className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 focus:border-slate-700"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                    >
                      <option>Junior</option>
                      <option>Mid</option>
                      <option>Senior</option>
                      <option>Staff</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">
                      Interview mode
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {([
                        { k: 'technical', label: 'Technical' },
                        { k: 'behavioral', label: 'Behavioral' },
                        { k: 'mixed', label: 'Mixed' },
                      ] as const).map((x) => (
                        <button
                          key={x.k}
                          type="button"
                          onClick={() => setMode(x.k)}
                          className={classNames(
                            'rounded-xl border px-3 py-2 text-xs font-semibold transition',
                            mode === x.k
                              ? 'border-slate-700 bg-slate-100 text-slate-950'
                              : 'border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-900/40',
                          )}
                        >
                          {x.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">
                      Duration
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="range"
                        min={10}
                        max={45}
                        step={5}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="w-12 text-right text-sm font-semibold text-slate-200">
                        {duration}m
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Pill label="Live transcript" />
                    <Pill label="Competency rubric" />
                    <Pill label="Actionable coaching" />
                  </div>

                  <PrimaryButton loading={loading} onClick={startInterview}>
                    Start interview
                  </PrimaryButton>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-50">
                      Preview
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      Role template and scoring focus
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-900/40 px-2.5 py-1 text-xs font-semibold text-slate-300">
                    {mode}
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-xs font-semibold text-slate-300">Role</div>
                    <div className="mt-1 text-sm font-semibold text-slate-100">{role}</div>
                    <div className="mt-1 text-xs text-slate-400">Level: {level}</div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-xs font-semibold text-slate-300">What we score</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(
                        [
                          'Technical depth',
                          'Problem solving',
                          'Communication',
                          'Behavioral',
                          'Spontaneous thinking',
                        ] as const
                      ).map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-slate-800 bg-slate-900/40 px-2.5 py-1 text-xs font-semibold text-slate-200"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-xs font-semibold text-slate-300">Session outcome</div>
                    <div className="mt-2 text-sm text-slate-200">
                      You’ll get strengths, improvements, and a practice plan.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : step === 'interview' ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-50">Interview</div>
                    <div className="mt-1 text-xs text-slate-400">
                      {role} • {level} • {duration}m
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>

                <div className="mt-5 grid gap-2">
                  {questions.map((q, idx) => (
                    <button
                      key={q.title}
                      type="button"
                      onClick={() => setQuestionIndex(idx)}
                      className={classNames(
                        'flex w-full items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left transition',
                        idx === questionIndex
                          ? 'border-slate-700 bg-slate-950'
                          : 'border-slate-900/60 bg-slate-950/40 hover:bg-slate-950',
                      )}
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {idx + 1}. {q.title}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-slate-400">
                          {q.prompt}
                        </div>
                      </div>
                      <span
                        className={classNames(
                          'mt-0.5 rounded-full px-2 py-1 text-[11px] font-semibold',
                          idx === questionIndex
                            ? 'bg-slate-100 text-slate-950'
                            : 'bg-slate-900/40 text-slate-300',
                        )}
                      >
                        {idx === questionIndex ? 'Now' : 'Next'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex gap-2">
                  <SecondaryButton
                    onClick={() => setQuestionIndex((i) => Math.max(0, i - 1))}
                    disabled={questionIndex === 0}
                    className="w-full disabled:opacity-50"
                  >
                    Previous
                  </SecondaryButton>
                  <SecondaryButton
                    onClick={() =>
                      setQuestionIndex((i) => Math.min(questions.length - 1, i + 1))
                    }
                    disabled={questionIndex === questions.length - 1}
                    className="w-full disabled:opacity-50"
                  >
                    Next
                  </SecondaryButton>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-8">
              <div className="grid gap-6">
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-400">Question</div>
                      <div className="mt-2 text-lg font-semibold text-slate-50">
                        {questions[questionIndex]?.prompt}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-xs font-semibold text-slate-200">
                        Mock audio
                      </span>
                      <span className="rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-xs font-semibold text-slate-200">
                        Mock timer
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-300">Live transcript</div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        className="mt-3 h-40 w-full resize-none rounded-xl border border-slate-900 bg-slate-950 p-3 text-sm text-slate-100 outline-none focus:border-slate-700"
                        placeholder="Your response transcript…"
                      />
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span>Tip: summarize before you code.</span>
                        <span>{transcript.trim().length} chars</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <div className="text-xs font-semibold text-slate-300">Notes (private)</div>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-3 h-40 w-full resize-none rounded-xl border border-slate-900 bg-slate-950 p-3 text-sm text-slate-100 outline-none focus:border-slate-700"
                        placeholder="Constraints, edge cases, tests, etc."
                      />
                      <div className="mt-3 text-xs text-slate-400">
                        This is not evaluated in the mock.
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-50">Mock coding area</div>
                      <div className="mt-1 text-xs text-slate-400">
                        Replace with Monaco/CodeMirror later.
                      </div>
                    </div>
                    <PrimaryButton loading={loading} onClick={generateFeedback}>
                      Generate feedback
                    </PrimaryButton>
                  </div>

                  <pre className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left text-xs leading-5 text-slate-200">
{`// Example scaffold
function hasDuplicate(nums: number[]): boolean {
  const seen = new Set<number>()
  for (const n of nums) {
    if (seen.has(n)) return true
    seen.add(n)
  }
  return false
}

// Next: discuss time O(n), space O(n) and edge cases.`}
                  </pre>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Card>
                <div className="text-sm font-semibold text-slate-50">Session summary</div>
                <div className="mt-2 text-xs text-slate-400">
                  {role} • {level} • {duration}m • {mode}
                </div>

                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-xs font-semibold text-slate-300">Overall</div>
                  <div className="mt-2 flex items-end justify-between">
                    <div className="text-4xl font-bold tracking-tight text-slate-50">
                      {overall}
                    </div>
                    <div className="text-xs text-slate-400">out of 5</div>
                  </div>
                  <div className="mt-3 text-xs text-slate-300">
                    Strong baseline. Focus on tighter structure and more explicit tradeoffs.
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <SecondaryButton onClick={() => setStep('interview')} className="w-full">
                    Back to interview
                  </SecondaryButton>
                  <PrimaryButton onClick={reset} className="w-full">
                    New session
                  </PrimaryButton>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-8">
              <Card>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-50">
                      Competency feedback
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      Scores and specific improvement suggestions.
                    </div>
                  </div>
                  <span className="rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-xs font-semibold text-slate-200">
                    Mock evaluation
                  </span>
                </div>

                <div className="mt-6 grid gap-3">
                  {feedback.map((f) => (
                    <div
                      key={f.competency}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-slate-50">
                            {f.competency}
                          </div>
                          <div className="mt-2 text-xs text-slate-400">Signal</div>
                          <div className="mt-1 text-sm text-slate-200">{f.signal}</div>
                        </div>
                        <ScorePill score={f.score} />
                      </div>

                      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                        <div className="text-xs font-semibold text-slate-300">Next improvement</div>
                        <div className="mt-1 text-sm text-slate-200">{f.improvement}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="mt-6">
                <div className="text-sm font-semibold text-slate-50">Practice plan</div>
                <div className="mt-1 text-xs text-slate-400">
                  A simple, repeatable routine.
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {[
                    {
                      title: '10 min',
                      body: 'Explain a solution out loud: headline → steps → tradeoffs.',
                    },
                    {
                      title: '15 min',
                      body: 'Solve 1 small problem and list edge cases + tests.',
                    },
                    {
                      title: '5 min',
                      body: 'Write a STAR story with impact quantified.',
                    },
                  ].map((x) => (
                    <div key={x.title} className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                      <div className="text-xs font-semibold text-slate-300">{x.title}</div>
                      <div className="mt-2 text-sm font-semibold text-slate-50">{x.body}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>HireMetry • UI prototype</div>
          <div>Next: auth, sessions, realtime STT, scoring engine</div>
        </div>
      </footer>
    </div>
  )
}

export default App
