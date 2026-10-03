import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useScroll, useTransform } from 'motion/react'
import Container from './Container.jsx'
import Reveal from './Reveal.jsx'
import TerminalCard from './TerminalCard.jsx'
import { TerminalIcon } from './Icons.jsx'
import { profile, projects, skills } from '../data/portfolio.js'

const stats = [
  { value: projects.length, suffix: '', label: 'featured projects' },
  { value: skills.reduce((n, g) => n + g.items.length, 0), suffix: '', label: 'tools & technologies' },
  { value: 2023, suffix: '', label: 'started at UCSC', plain: true },
  { text: 'National', label: 'level badminton player' },
]

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <span className="relative mr-[0.28em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

function CountUp({ value, suffix, plain }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [display, setDisplay] = useState(plain ? value : 0)

  useEffect(() => {
    if (!inView || plain) return
    const controls = animate(0, value, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) })
    return () => controls.stop()
  }, [inView, value, plain])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const words = profile.about.split(' ')

  return (
    <section id="about" className="relative isolate scroll-mt-24 py-28 sm:py-40">
      <Container size="lg">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-[11px] font-medium tracking-[0.25em] text-muted uppercase">
            <TerminalIcon width={14} height={14} className="text-accent" />
            about me
          </span>
        </Reveal>

        <p ref={ref} className="mt-10 text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1.3] font-semibold tracking-tight text-fg">
          {words.map((word, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
            </Word>
          ))}
        </p>

        <div className="mt-20 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr] [&>*]:min-w-0">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 [&>*]:min-w-0">
            {stats.map((s) => (
              <li key={s.label}>
                <Reveal>
                  <div className="group h-full rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/40 sm:p-6">
                    <p
                      className={`text-gradient font-extrabold tracking-tight ${s.text ? 'text-2xl sm:text-4xl lg:text-[2.6rem]' : 'text-4xl sm:text-5xl'}`}
                    >
                      {s.text ?? <CountUp value={s.value} suffix={s.suffix} plain={s.plain} />}
                    </p>
                    <p className="mt-3 text-xs tracking-wider text-muted uppercase">{s.label}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal>
            <TerminalCard />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
