import Container from './Container.jsx'
import Ribbon from './Ribbon.jsx'
import Reveal from './Reveal.jsx'
import { ArrowRightIcon, ArrowUpIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons.jsx'
import { scrollToId } from '../lib/scroll.js'
import { profile, ribbons } from '../data/portfolio.js'

const pill =
  'inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-xs text-muted transition-colors hover:border-accent/60 hover:text-fg'

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden pt-10">
      <div className="relative h-36 sm:h-40">
        <Ribbon items={ribbons.footer} tilt={-2.5} className="absolute inset-x-0 top-0" />
        <Ribbon items={ribbons.intro} tone="accent" tilt={2} reverse duration={50} className="absolute inset-x-0 top-10" />
      </div>

      {/* Grid fading in from the top, and a soft glow at the bottom — both as
          plain gradients, so there is no mask layer or blur filter to render. */}
      <div className="absolute inset-0 -z-10 bg-grid" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--color-bg),transparent_30%)]" />
      <div className="absolute -bottom-60 left-1/2 -z-10 h-[60rem] w-[80rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(74_222_128/0.055),rgb(74_222_128/0.03)_52%,rgb(74_222_128/0.01)_78%,transparent)]" />

      <Container size="lg" className="pt-20 pb-10 text-center sm:pt-28">
        <Reveal>
          <p className="text-[11px] tracking-[0.35em] text-subtle uppercase">
            <span className="text-accent">❯</span> what&apos;s next?
          </p>
          <h2 className="text-gradient text-glow mt-6 text-[clamp(2.75rem,8vw,6.5rem)] leading-none font-extrabold tracking-tighter">
            Let&apos;s ship something.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('contact')
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-ink shadow-[0_0_30px_-6px] shadow-accent/70 transition-transform hover:scale-[1.03]"
            >
              get in touch
              <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('projects')
              }}
              className="rounded-full border border-border bg-surface px-6 py-3.5 text-sm text-fg transition-colors hover:border-accent/60"
            >
              view projects
            </a>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <a href={profile.github} target="_blank" rel="noreferrer" className={pill}>
              <GitHubIcon width={14} height={14} /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className={pill}>
              <LinkedInIcon width={14} height={14} /> LinkedIn
            </a>
            <a href={`mailto:${profile.email}`} className={pill}>
              <MailIcon width={14} height={14} /> Email
            </a>
          </div>
        </Reveal>
      </Container>

      <div className="relative">
        <p
          aria-hidden="true"
          className="-mb-[0.18em] bg-[linear-gradient(to_bottom,rgb(255_255_255/0.05)_40%,transparent)] bg-clip-text text-center text-[clamp(5rem,24vw,22rem)] leading-[0.85] font-extrabold tracking-tighter text-transparent select-none"
        >
          ADITHA
        </p>
        <Container size="xl" className="absolute inset-x-0 bottom-6 flex items-center justify-between gap-4 text-[10px] tracking-[0.25em] text-subtle uppercase">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span className="hidden sm:inline">{profile.location}</span>
          <button
            type="button"
            onClick={() => scrollToId('top')}
            aria-label="Back to top"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent/60 hover:text-accent"
          >
            <ArrowUpIcon width={16} height={16} />
          </button>
        </Container>
      </div>
    </footer>
  )
}
