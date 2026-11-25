import { useEffect, useRef, useState } from 'react'
import { CheckCircle, Play, Lightning, ArrowRight } from '@phosphor-icons/react'
import type { Dict, TArrFn, TFn } from '../App.tsx'

type StepState = 'idle' | 'running' | 'done'

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

export default function Demo({ t, ta }: { t: TFn; ta: TArrFn }) {
  const steps = ta('demo.steps')
  const [enabled, setEnabled] = useState<boolean[]>(() => steps.map(() => true))
  const [status, setStatus] = useState<StepState[]>(() => steps.map(() => 'idle'))
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const current = timers.current
    return () => current.forEach((id) => window.clearTimeout(id))
  }, [])

  const toggle = (i: number) => {
    if (running) return
    setEnabled((prev) => prev.map((v, j) => (j === i ? !v : v)))
  }

  const run = () => {
    if (running) return
    setRunning(true)
    setStatus(steps.map(() => 'idle'))
    setLog([t('demo.logStart')])
    const active = steps.map((_, i) => i).filter((i) => enabled[i])
    active.forEach((stepIndex, order) => {
      const startId = window.setTimeout(() => {
        setStatus((prev) => prev.map((s, j) => (j === stepIndex ? 'running' : s)))
        setLog((prev) => [...prev, t('demo.logRunning').replace('{step}', str(steps[stepIndex]?.app))])
      }, order * 1100)
      const doneId = window.setTimeout(() => {
        setStatus((prev) => prev.map((s, j) => (j === stepIndex ? 'done' : s)))
        setLog((prev) => [...prev, t('demo.logDone').replace('{step}', str(steps[stepIndex]?.app))])
        if (order === active.length - 1) {
          setRunning(false)
          setLog((prev) => [...prev, t('demo.logFinished')])
        }
      }, order * 1100 + 900)
      timers.current.push(startId, doneId)
    })
    if (active.length === 0) {
      setRunning(false)
      setLog((prev) => [...prev, t('demo.logNone')])
    }
  }

  const reset = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    setRunning(false)
    setStatus(steps.map(() => 'idle'))
    setLog([])
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="title-2">{t('demo.boardTitle')}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="button-md inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-40"
          >
            <Play size={16} weight="fill" />
            {running ? t('demo.running') : t('demo.run')}
          </button>
          <button
            type="button"
            onClick={reset}
            className="button-md rounded-xl border border-line px-3 py-2 transition-colors duration-300 hover:border-accent"
          >
            {t('demo.reset')}
          </button>
        </div>
      </div>

      <ol className="mt-8 flex flex-col gap-2 md:flex-row md:items-stretch">
        {steps.map((step, i) => {
          const s: Dict = step as Dict
          return (
            <li key={i} className="flex flex-1 flex-col">
              <div
                className={`flex-1 rounded-2xl border p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  status[i] === 'done' ? 'border-accent bg-accent/10' : status[i] === 'running' ? 'border-accent bg-paper' : 'border-line bg-paper'
                } ${enabled[i] ? '' : 'opacity-50'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Lightning size={18} />
                  </span>
                  {status[i] === 'done' ? (
                    <CheckCircle size={20} className="text-accent" />
                  ) : status[i] === 'running' ? (
                    <span className="caption-4 rounded-full bg-accent px-3 py-2 text-white">{t('demo.statusRunning')}</span>
                  ) : (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled[i]}
                      aria-label={str(s.app)}
                      onClick={() => toggle(i)}
                      className={`relative h-6 w-12 shrink-0 rounded-full transition-colors duration-300 ${enabled[i] ? 'bg-accent' : 'bg-line'}`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${enabled[i] ? 'translate-x-7 rtl:-translate-x-7' : 'translate-x-1 rtl:-translate-x-1'}`}
                      />
                    </button>
                  )}
                </div>
                <p className="title-3 mt-4">{str(s.app)}</p>
                <p className="body-6 mt-2 text-muted">{str(s.action)}</p>
              </div>
              {i < steps.length - 1 && (
                <span className="flex justify-center py-2 md:hidden" aria-hidden="true">
                  <ArrowRight size={18} className="rotate-90 text-muted rtl:-rotate-90" />
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-8">
        <p className="title-3">{t('demo.logLabel')}</p>
        {log.length === 0 ? (
          <p className="body-3 mt-4 rounded-xl border border-dashed border-line p-4 text-muted">{t('demo.logEmpty')}</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2 rounded-2xl border border-line bg-paper p-4">
            {log.map((line, i) => (
              <li key={i} className="body-6">
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="caption-5 mt-4 text-muted">{t('demo.note')}</p>
    </div>
  )
}
