import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import Container from './Container.jsx'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import { AwardIcon, CodeIcon, GraduationIcon, LayersIcon } from './Icons.jsx'
import { journey } from '../data/portfolio.js'

const kindIcon = {
  School: LayersIcon,
  University: GraduationIcon,
  Program: CodeIcon,
  Certification: AwardIcon,
}

function Card({ item, index }) {
  const Icon = kindIcon[item.kind]
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface/90 p-6 backdrop-blur transition-colors hover:border-accent/40 sm:p-7">
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
      <span className="absolute top-5 right-6 text-4xl font-extrabold text-white/[0.05]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex items-center gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
          <Icon width={20} height={20} />
        </span>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.25em] text-accent uppercase">{item.kind}</p>
          <h3 className="mt-1 text-lg font-bold text-fg">{item.title}</h3>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted">{item.institution}</p>
      <p className="mt-1 text-sm text-subtle">{item.detail}</p>
      {item.period && (
        <p className="mt-5 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
          {item.period}
        </p>
      )}
    </div>
  )
}

export default function Journey() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="journey" className="relative isolate scroll-mt-24 py-24 sm:py-32">
      <div className="absolute inset-0 -z-20 bg-grid [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      <Container size="lg">
        <SectionHeader
          badge="my journey"
          Icon={GraduationIcon}
          title="Learn. Build. Repeat."
          meta={`${journey.length} milestones · education & growth`}
          bgWord="JOURNEY"
        />

        <ol ref={ref} className="relative mt-20 sm:mt-28">
          {/* track */}
          <span className="absolute top-0 bottom-0 left-5 w-px bg-border md:left-1/2" aria-hidden="true" />
          <motion.span
            style={{ scaleY: fill }}
            className="absolute top-0 bottom-0 left-5 w-px origin-top bg-gradient-to-b from-accent to-accent-2 shadow-[0_0_12px] shadow-accent md:left-1/2"
            aria-hidden="true"
          />

          {journey.map((item, i) => {
            const left = i % 2 === 0
            return (
              <li
                key={item.title}
                className={`relative pb-10 pl-14 last:pb-0 md:grid md:grid-cols-2 md:gap-16 md:pb-0 md:pl-0 ${i > 0 ? 'md:-mt-20' : ''}`}
              >
                <span
                  className="absolute top-7 left-5 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full border border-accent bg-bg md:left-1/2"
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_2px] shadow-accent/70" />
                </span>
                <div className={left ? 'md:col-start-1' : 'md:col-start-2'}>
                  <Reveal>
                    <Card item={item} index={i} />
                  </Reveal>
                </div>
              </li>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}
