import { useEffect, useState } from 'react'
import type { ComponentType, FormEvent } from 'react'
import {
  ArrowRight,
  BellRinging,
  CaretDown,
  ChartBar,
  ChartLineUp,
  Check,
  CheckCircle,
  Clock,
  DeviceMobile,
  Envelope,
  Eye,
  FlowArrow,
  Kanban,
  Layout,
  Lightning,
  List,
  MagicWand,
  PlugsConnected,
  Rocket,
  ShieldCheck,
  SquaresFour,
  Star,
  Users,
  UsersThree,
  X,
} from '@phosphor-icons/react'
import en from '../locales/en/common.json'
import ar from '../locales/ar/common.json'
import { Reveal } from './components/Reveal.tsx'
import { TaglineReveal } from './components/TaglineReveal.tsx'
import Demo from './components/Demo.tsx'

export type Dict = Record<string, unknown>
export type TFn = (path: string) => string
export type TArrFn = (path: string) => Dict[]
type Lang = 'en' | 'ar'
type LegalKey = 'privacy' | 'terms' | 'cookies' | null

function lookup(d: Dict, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Dict)[key]
    return undefined
  }, d)
}

function makeT(d: Dict): TFn {
  return (p) => {
    const v = lookup(d, p)
    return typeof v === 'string' ? v : p
  }
}

function makeTa(d: Dict): TArrFn {
  return (p) => {
    const v = lookup(d, p)
    return Array.isArray(v) ? (v as Dict[]) : []
  }
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

type IconProps = { size?: number | string; className?: string }
const ICONS: Record<string, ComponentType<IconProps>> = {
  Kanban,
  Clock,
  Users,
  UsersThree,
  ChartBar,
  ChartLineUp,
  BellRinging,
  Envelope,
  MagicWand,
  Layout,
  DeviceMobile,
  Rocket,
  PlugsConnected,
  FlowArrow,
  Lightning,
  Eye,
  SquaresFour,
  ShieldCheck,
  CheckCircle,
  Star,
}

const KNOWN_HASHES = ['#features', '#how', '#demo', '#pricing', '#faq', '#signup', '#main', '#top', '']

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('100wp-lang')
    return saved === 'ar' ? 'ar' : 'en'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [legal, setLegal] = useState<LegalKey>(null)
  const [cookie, setCookie] = useState<string>(() => localStorage.getItem('100wp-cookie') ?? '')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const dict = (lang === 'ar' ? ar : en) as unknown as Dict
  const t = makeT(dict)
  const ta = makeTa(dict)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    localStorage.setItem('100wp-lang', lang)
  }, [lang, dir])

  useEffect(() => {
    const check = () => {
      const h = window.location.hash
      setNotFound(h.startsWith('#/') && !KNOWN_HASHES.includes(h))
    }
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen || legal ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, legal])

  const navLinks = [
    { href: '#features', label: t('nav.features') },
    { href: '#how', label: t('nav.how') },
    { href: '#demo', label: t('nav.demo') },
    { href: '#pricing', label: t('nav.pricing') },
    { href: '#faq', label: t('nav.faq') },
  ]

  const chooseCookie = (value: string) => {
    localStorage.setItem('100wp-cookie', value)
    setCookie(value)
  }

  const submitForm = (e: FormEvent) => {
    e.preventDefault()
    const next: { name?: string; email?: string } = {}
    if (name.trim().length < 2) next.name = t('form.errors.name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = t('form.errors.email')
    setErrors(next)
    if (Object.keys(next).length === 0) {
      localStorage.setItem('100wp-signup', JSON.stringify({ name: name.trim(), email: email.trim(), at: new Date().toISOString() }))
      setSubmitted(true)
    }
  }

  const legalText = legal ? t(`footer.${legal}Text`) : ''
  const legalTitle = legal ? t(`footer.${legal}`) : ''

  if (notFound) {
    return (
      <div dir={dir} lang={lang} className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-4 text-center">
        <p className="heading-1 text-accent">404</p>
        <h1 className="heading-3 mt-4">{t('misc.notFoundTitle')}</h1>
        <p className="body-3 text-muted mt-2 max-w-[680px]">{t('misc.notFoundText')}</p>
        <a
          href="#top"
          onClick={() => setNotFound(false)}
          className="button-md mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-white hover:opacity-90"
        >
          {t('misc.backHome')}
          <ArrowRight size={18} className="rtl:rotate-180" />
        </a>
      </div>
    )
  }

  return (
    <div dir={dir} lang={lang} className="min-h-screen bg-paper text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:text-sm">
        {t('misc.skip')}
      </a>

      {/* Navigation */}
      <header className="fixed inset-x-4 top-4 z-50 mx-auto max-w-5xl">
        <nav aria-label={t('nav.label')} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface/85 px-4 py-2 shadow-sm backdrop-blur-md">
          <a href="#top" className="flex items-center gap-2" aria-label={t('nav.home')}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-lg font-bold text-white">F</span>
            <span className="title-1">Flowlink</span>
          </a>
          <ul className="hidden items-center gap-4 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="title-3 text-muted transition-colors duration-300 hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-line p-1" role="group" aria-label={t('nav.language')}>
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`button-sm rounded-lg px-3 py-2 transition-colors duration-300 ${lang === 'en' ? 'bg-accent text-white' : 'text-muted hover:text-ink'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ar')}
                aria-pressed={lang === 'ar'}
                className={`button-sm rounded-lg px-3 py-2 transition-colors duration-300 ${lang === 'ar' ? 'bg-accent text-white' : 'text-muted hover:text-ink'}`}
              >
                عربي
              </button>
            </div>
            <a href="#signup" className="button-sm hidden rounded-xl bg-accent px-3 py-2 text-white transition-opacity duration-300 hover:opacity-90 sm:inline-flex">
              {t('nav.cta')}
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={t('misc.menu')}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
            >
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                {menuOpen ? <X size={20} /> : <List size={20} />}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-paper/95 pt-24 backdrop-blur-md lg:hidden">
          <ul className="flex flex-col gap-4 px-8">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                className="translate-y-6 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transitionDelay: `${i * 60}ms`, transform: 'translateY(0)', opacity: 1 }}
              >
                <a href={link.href} onClick={() => setMenuOpen(false)} className="heading-4 block py-2">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#signup" onClick={() => setMenuOpen(false)} className="button-md mt-4 inline-flex rounded-xl bg-accent px-3 py-2 text-white">
                {t('nav.cta')}
              </a>
            </li>
          </ul>
        </div>
      )}

      <main id="main">
        {/* Hero */}
        <section id="top" className="px-4 pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="mx-auto max-w-5xl text-center">
            <Reveal>
              <p className="caption-4 mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-2">
                <SparkleIcon />
                {t('hero.badge')}
              </p>
              <h1 className="heading-1 mx-auto mt-8 max-w-[680px]">
                {t('hero.title')} <span className="hero-gradient">{t('hero.titleAccent')}</span>
              </h1>
              <p className="body-3 mx-auto mt-4 max-w-[680px] text-muted">{t('hero.subtitle')}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a href="#signup" className="button-md inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-white transition-opacity duration-300 hover:opacity-90">
                  {t('hero.cta')}
                  <ArrowRight size={18} className="rtl:rotate-180" />
                </a>
                <a href="#how" className="button-md inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 transition-colors duration-300 hover:border-accent">
                  {t('hero.secondary')}
                </a>
              </div>
              <p className="caption-2 mt-4 flex flex-wrap items-center justify-center gap-4 text-muted">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle size={16} className="text-accent" />
                  {t('hero.proof1')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} className="text-accent" />
                  {t('hero.proof2')}
                </span>
              </p>
            </Reveal>

            {/* Hero visual: sample dashboard preview */}
            <Reveal className="mt-16">
              <figure className="overflow-hidden rounded-2xl border border-line bg-surface text-start shadow-sm">
                <div className="flex items-center gap-2 border-b border-line px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-line" />
                  <span className="h-2 w-2 rounded-full bg-line" />
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="caption-4 ms-2 text-muted">{t('hero.visualTitle')}</span>
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-3">
                  {ta('hero.visualCards').map((card, i) => (
                    <div key={i} className="rounded-xl border border-line bg-paper p-4">
                      <p className="caption-4 text-muted">{str(card.label)}</p>
                      <p className="title-1 mt-2">{str(card.value)}</p>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${[72, 54, 86][i % 3]}%` }} />
                      </div>
                      <p className="caption-5 mt-2 text-muted">{str(card.note)}</p>
                    </div>
                  ))}
                </div>
                <figcaption className="caption-5 border-t border-line px-4 py-2 text-muted">{t('hero.visualCaption')}</figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* Sample logos */}
        <section aria-label={t('logos.label')} className="border-y border-line bg-surface px-4 py-8">
          <div className="mx-auto max-w-5xl">
            <p className="caption-4 text-center text-muted">{t('logos.label')}</p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {ta('logos.items').map((item, i) => (
                <li key={i} className="title-2 text-muted opacity-80">
                  {str(item.name)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Benefits */}
        <section id="features" className="scroll-mt-24 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="heading-2 text-center">{t('benefits.title')}</h2>
              <p className="body-3 mx-auto mt-4 max-w-[680px] text-center text-muted">{t('benefits.subtitle')}</p>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {ta('benefits.items').map((item, i) => {
                const Icon = ICONS[str(item.icon)] ?? CheckCircle
                return (
                  <Reveal key={i}>
                    <article className="h-full rounded-2xl border border-line bg-surface p-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <Icon size={24} />
                      </span>
                      <h3 className="title-1 mt-4">{str(item.title)}</h3>
                      <p className="body-6 mt-2 text-muted">{str(item.text)}</p>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-24 bg-surface px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="heading-2 text-center">{t('how.title')}</h2>
              <p className="body-3 mx-auto mt-4 max-w-[680px] text-center text-muted">{t('how.subtitle')}</p>
            </Reveal>
            <ol className="mt-12 grid gap-4 md:grid-cols-3">
              {ta('how.steps').map((step, i) => (
                <Reveal key={i}>
                  <li className="h-full rounded-2xl border border-line bg-paper p-8">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-base font-semibold text-white">{i + 1}</span>
                    <h3 className="title-1 mt-4">{str(step.title)}</h3>
                    <p className="body-6 mt-2 text-muted">{str(step.text)}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Tagline reveal */}
        <section aria-label={t('tagline')} className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <TaglineReveal text={t('tagline')} className="mx-auto max-w-[680px] text-center" />
          </div>
        </section>

        {/* Interactive demo */}
        <section id="demo" className="scroll-mt-24 px-4 pb-16 md:pb-24">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="heading-2 text-center">{t('demo.title')}</h2>
              <p className="body-3 mx-auto mt-4 max-w-[680px] text-center text-muted">{t('demo.subtitle')}</p>
            </Reveal>
            <Reveal className="mt-12">
              <Demo t={t} ta={ta} />
            </Reveal>
          </div>
        </section>

        {/* Social proof */}
        <section id="proof" className="bg-surface px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="caption-4 text-center text-accent">{t('social.label')}</p>
              <h2 className="heading-2 mt-2 text-center">{t('social.title')}</h2>
            </Reveal>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {ta('social.items').map((item, i) => (
                <Reveal key={i}>
                  <figure className="flex h-full flex-col rounded-2xl border border-line bg-paper p-8">
                    <div className="flex gap-1 text-accent" aria-label="5 stars">
                      {[0, 1, 2, 3, 4].map((s) => (
                        <Star key={s} size={16} weight="fill" />
                      ))}
                    </div>
                    <blockquote className="body-3 mt-4 flex-1">“{str(item.quote)}”</blockquote>
                    <figcaption className="mt-4">
                      <p className="title-3">{str(item.name)}</p>
                      <p className="caption-2 text-muted">{str(item.role)}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="heading-2 text-center">{t('pricing.title')}</h2>
              <p className="body-3 mx-auto mt-4 max-w-[680px] text-center text-muted">{t('pricing.subtitle')}</p>
            </Reveal>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {ta('pricing.tiers').map((tier, i) => (
                <Reveal key={i}>
                  <article className={`flex h-full flex-col rounded-2xl border bg-surface p-8 ${i === 1 ? 'border-accent' : 'border-line'}`}>
                    {i === 1 && <p className="caption-4 mb-2 inline-flex w-fit rounded-full bg-accent px-3 py-2 text-white">{t('pricing.popular')}</p>}
                    <h3 className="title-1">{str(tier.name)}</h3>
                    <p className="heading-3 mt-4">{str(tier.price)}</p>
                    <p className="caption-2 text-muted">{str(tier.period)}</p>
                    <ul className="mt-4 flex flex-1 flex-col gap-2">
                      {(Array.isArray(tier.features) ? (tier.features as unknown[]) : []).map((f, j) => (
                        <li key={j} className="body-6 flex items-start gap-2">
                          <Check size={16} className="mt-1 shrink-0 text-accent" />
                          <span>{str(f)}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#signup" className={`button-md mt-8 inline-flex items-center justify-center rounded-xl px-3 py-2 text-center transition-opacity duration-300 hover:opacity-90 ${i === 1 ? 'bg-accent text-white' : 'border border-line bg-paper'}`}>
                      {t('pricing.cta')}
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="caption-2 mt-8 text-center text-muted">{t('pricing.note')}</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 bg-surface px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="heading-2 text-center">{t('faq.title')}</h2>
            </Reveal>
            <div className="mt-12 flex flex-col gap-4">
              {ta('faq.items').map((item, i) => (
                <Reveal key={i}>
                  <div className="rounded-2xl border border-line bg-paper">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-2 text-start"
                    >
                      <span className="title-2 py-2">{str(item.q)}</span>
                      <CaretDown size={20} className={`shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && <p className="body-3 px-4 pb-4 text-muted">{str(item.a)}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA + signup form */}
        <section id="signup" className="scroll-mt-24 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="rounded-2xl border border-line bg-surface p-8 text-center md:p-12">
                <h2 className="heading-2">{t('final.title')}</h2>
                <p className="body-3 mx-auto mt-4 max-w-[680px] text-muted">{t('final.subtitle')}</p>
                {submitted ? (
                  <p role="status" className="body-2 mx-auto mt-8 flex max-w-[680px] items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 py-2">
                    <CheckCircle size={20} className="shrink-0 text-accent" />
                    {t('form.success')}
                  </p>
                ) : (
                  <form onSubmit={submitForm} noValidate className="mx-auto mt-8 flex max-w-[680px] flex-col gap-4 text-start">
                    <div>
                      <label htmlFor="signup-name" className="title-3 block">{t('form.name')}</label>
                      <input
                        id="signup-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('form.namePlaceholder')}
                        aria-invalid={Boolean(errors.name)}
                        className="body-3 mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2 placeholder:text-muted"
                      />
                      {errors.name && <p role="alert" className="caption-2 mt-2 text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="signup-email" className="title-3 block">{t('form.email')}</label>
                      <input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('form.emailPlaceholder')}
                        aria-invalid={Boolean(errors.email)}
                        className="body-3 mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2 placeholder:text-muted"
                      />
                      {errors.email && <p role="alert" className="caption-2 mt-2 text-red-600">{errors.email}</p>}
                    </div>
                    <button type="submit" className="button-md inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-white transition-opacity duration-300 hover:opacity-90">
                      {t('form.submit')}
                      <ArrowRight size={18} className="rtl:rotate-180" />
                    </button>
                    <p className="caption-2 text-center text-muted">{t('final.note')}</p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-surface px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <p className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-lg font-bold text-white">F</span>
                <span className="title-1">Flowlink</span>
              </p>
              <p className="body-6 mt-4 max-w-[320px] text-muted">{t('footer.tagline')}</p>
            </div>
            <nav aria-label={t('footer.navLabel')} className="flex gap-16">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="body-6 text-muted transition-colors duration-300 hover:text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-2">
                {(['privacy', 'terms', 'cookies'] as const).map((key) => (
                  <li key={key}>
                    <button type="button" onClick={() => setLegal(key)} className="body-6 text-muted transition-colors duration-300 hover:text-ink">
                      {t(`footer.${key}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="caption-5 mt-8 border-t border-line pt-4 text-muted">{t('footer.rights')}</p>
        </div>
      </footer>

      {/* Legal modal */}
      {legal && (
        <div role="dialog" aria-modal="true" aria-label={legalTitle} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={() => setLegal(null)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-surface p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="heading-4">{legalTitle}</h2>
              <button type="button" onClick={() => setLegal(null)} aria-label={t('misc.close')} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line">
                <X size={18} />
              </button>
            </div>
            <p className="body-3 mt-4 text-muted">{legalText}</p>
          </div>
        </div>
      )}

      {/* Cookie consent */}
      {cookie === '' && (
        <div role="region" aria-label={t('footer.cookies')} className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-3xl rounded-2xl border border-line bg-surface p-4 shadow-lg">
          <p className="body-6">{t('misc.cookieText')}</p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => chooseCookie('accepted')} className="button-sm rounded-xl bg-accent px-3 py-2 text-white">
              {t('misc.cookieAccept')}
            </button>
            <button type="button" onClick={() => chooseCookie('declined')} className="button-sm rounded-xl border border-line px-3 py-2">
              {t('misc.cookieDecline')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0l1.8 5.2L15 7l-5.2 1.8L8 14l-1.8-5.2L1 7l5.2-1.8L8 0z" />
    </svg>
  )
}
