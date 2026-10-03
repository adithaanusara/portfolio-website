import { lazy, Suspense, useState } from 'react'
import Container from './Container.jsx'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import LocalTime from './LocalTime.jsx'
import { CheckIcon, CopyIcon, MailIcon, PhoneIcon, SendIcon } from './Icons.jsx'
import { profile } from '../data/portfolio.js'

const MAX = 500

// cobe (WebGL) only loads when the contact section is reached.
const Globe = lazy(() => import('./Globe.jsx'))

const fieldClass =
  'w-full rounded-xl border border-border bg-bg/70 px-4 py-3.5 text-sm text-fg placeholder:text-subtle transition-colors outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20'

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(profile.email)
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      }}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/70 px-4 py-2 text-xs text-accent transition-colors hover:border-accent/60"
    >
      {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
      {copied ? 'copied!' : profile.email}
    </button>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  // No backend: compose the message in the visitor's own email app.
  const onSubmit = (e) => {
    e.preventDefault()
    const subject = `Portfolio enquiry from ${form.name}`
    const body = `${form.message}\n\n— ${form.name} (${form.email})`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="contact" className="relative isolate scroll-mt-24 overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16">
      {/* Grid that fades out towards the edges. The fade is a gradient painted
          over the grid rather than a mask: same look, no mask layer. */}
      <div className="absolute inset-0 -z-20 bg-grid" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,transparent,var(--color-bg)_75%)]" />
      <Container size="lg">
        <SectionHeader
          badge="contact"
          Icon={MailIcon}
          title="Let's talk."
          meta="Have a project, an internship or an idea? Drop me a message."
          bgWord="HELLO"
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-border bg-surface/95 p-6 shadow-2xl shadow-black/50 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold tracking-[0.25em] text-subtle uppercase">name</span>
                  <input required value={form.name} onChange={update('name')} placeholder="Your name" autoComplete="name" className={fieldClass} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold tracking-[0.25em] text-subtle uppercase">email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className={fieldClass}
                  />
                </label>
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-[10px] font-semibold tracking-[0.25em] text-subtle uppercase">message</span>
                <textarea
                  required
                  rows={5}
                  maxLength={MAX}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell me about your project…"
                  className={`${fieldClass} resize-none`}
                  data-lenis-prevent
                />
              </label>
              <p className="mt-1 text-right text-[10px] text-subtle">
                {form.message.length}/{MAX}
              </p>
              <button
                type="submit"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-2 px-6 py-4 text-sm font-bold text-ink shadow-[0_10px_40px_-10px] shadow-accent/70 transition-transform hover:scale-[1.01]"
              >
                <SendIcon width={16} height={16} /> send message
              </button>
              <p className="mt-2 text-center text-[10px] text-subtle">opens your email app with the message ready to send</p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
                <span className="text-[10px] tracking-[0.2em] text-subtle uppercase">or reach me at</span>
                <div className="flex flex-wrap gap-2">
                  <CopyEmail />
                  <a
                    href={`tel:${profile.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/70 px-4 py-2 text-xs text-fg transition-colors hover:border-accent/60"
                  >
                    <PhoneIcon width={14} height={14} className="text-accent" />
                    {profile.phone}
                  </a>
                </div>
              </div>
            </form>
          </Reveal>

          <div className="relative mx-auto w-full max-w-[520px]">
            {/* Soft halo behind the globe. A plain gradient, not a blurred
                disc: a large blur filter here was one of the biggest costs
                when scrolling through this section. */}
            <div className="absolute -inset-[19%] -z-10 bg-[radial-gradient(closest-side,rgb(74_222_128/0.14),rgb(74_222_128/0.075)_55%,rgb(74_222_128/0.024)_78%,transparent)]" />
            <Suspense fallback={<div className="aspect-square w-full" />}>
              <Globe location={profile.coordinates} />
            </Suspense>
            <div className="absolute top-[30%] right-[4%] rounded-xl border border-accent/40 bg-bg/95 px-3 py-2 text-xs sm:right-[8%]">
              <p className="flex items-center gap-2 font-semibold text-accent">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Colombo, Sri Lanka
              </p>
              <LocalTime timeZone={profile.timeZone} className="mt-1 block text-[11px] text-muted" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
