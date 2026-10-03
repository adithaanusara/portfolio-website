import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Container from './Container.jsx'
import Avatar from './Avatar.jsx'
import NetworkCanvas from './NetworkCanvas.jsx'
import ContributionGraph from './ContributionGraph.jsx'
import LocalTime from './LocalTime.jsx'
import { ArrowRightIcon, GitHubIcon, LinkedInIcon, MailIcon, MapPinIcon } from './Icons.jsx'
import { scrollToId } from '../lib/scroll.js'
import { profile } from '../data/portfolio.js'

const socials = [
  { label: 'GitHub', href: profile.github, Icon: GitHubIcon },
  { label: 'LinkedIn', href: profile.linkedin, Icon: LinkedInIcon },
  { label: 'Email', href: `mailto:${profile.email}`, Icon: MailIcon },
]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.15'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1])
  const y = useTransform(scrollYProgress, [0, 1], [60, 0])

  return (
    <section ref={ref} className="relative px-3 sm:px-5">
      <motion.div
        style={{ scale, y }}
        className="relative isolate mx-auto flex min-h-[640px] max-w-7xl flex-col justify-between overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_40px_120px_-30px] shadow-accent/15 sm:h-[86svh]"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_75%_10%,rgba(45,212,191,0.12),transparent),radial-gradient(ellipse_60%_50%_at_10%_90%,rgba(74,222,128,0.10),transparent)]" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
        <NetworkCanvas className="-z-10" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-surface via-surface/70 to-transparent" />

        {/* top bar */}
        <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-8">
          <div className="flex items-center gap-3 rounded-full border border-border bg-bg/60 py-1.5 pr-4 pl-1.5 backdrop-blur">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/15 text-accent">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_2px] shadow-accent/60" />
            </span>
            <span className="text-[11px] tracking-[0.2em] text-muted uppercase">{profile.role}</span>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-border bg-bg/60 px-4 py-2 text-[11px] tracking-wider text-muted backdrop-blur">
            <MapPinIcon width={13} height={13} className="text-accent" />
            {profile.location}
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <LocalTime timeZone={profile.timeZone} className="text-fg" />
          </div>
        </div>

        {/* bottom: name + graph */}
        <div className="flex flex-col gap-8 p-5 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-4 sm:mb-6 sm:gap-5">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28" />
              <p className="text-sm text-accent sm:text-base">
                <span className="text-subtle">~/</span>hello, I&apos;m
              </p>
            </div>
            <h1 className="text-[clamp(4.5rem,15vw,12.5rem)] leading-[0.82] font-extrabold tracking-tighter text-[#e9f5ee]">
              {profile.firstName}
              <span
                aria-hidden="true"
                className="ml-[0.06em] inline-block h-[0.08em] w-[0.38em] animate-blink bg-accent shadow-[0_0_24px] shadow-accent/60"
              />
              <span className="sr-only"> Anusara</span>
            </h1>
            <p className="mt-5 text-lg text-muted sm:text-xl" aria-hidden="true">
              Anusara <span className="text-subtle">—</span>{' '}
              <span className="text-fg">{profile.tagline}</span>
            </p>
          </div>

          <div className="shrink-0 lg:max-w-sm">
            <div className="hidden sm:block">
              <ContributionGraph username={profile.handle} weeks={22} />
            </div>
            <div className="sm:hidden">
              <ContributionGraph username={profile.handle} weeks={16} />
            </div>
            <p className="mt-5 text-sm leading-6 text-muted italic">&ldquo;{profile.quote}&rdquo;</p>
          </div>
        </div>
      </motion.div>

      <Container size="xl" className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('projects')
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-ink shadow-[0_0_30px_-6px] shadow-accent/70 transition-transform hover:scale-[1.03]"
          >
            view projects
            <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('contact')
            }}
            className="rounded-full border border-border bg-surface px-5 py-3 text-sm text-fg transition-colors hover:border-accent/60"
          >
            get in touch
          </a>
        </div>
        <ul className="flex items-center gap-2">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent/60 hover:text-accent"
              >
                <Icon />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
