import { useEffect, useRef, useState } from 'react'

/** Tagline reveal (B11): each word fades from 30% to full color in reading order. */
export function TaglineReveal({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ')
  const [visible, setVisible] = useState<boolean[]>(() => words.map(() => false))
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    refs.current.forEach((el, i) => {
      if (!el) return
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisible((prev) => {
              const next = [...prev]
              next[i] = true
              return next
            })
            observer.disconnect()
          }
        },
        { threshold: 0.6 },
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <p className={`heading-2 ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          ref={(el) => {
            refs.current[i] = el
          }}
          className={`tagline-word ${visible[i] ? 'is-visible' : ''}`}
          style={{ transitionDelay: `${Math.min(i * 60, 600)}ms` }}
        >
          {word}{' '}
        </span>
      ))}
    </p>
  )
}
