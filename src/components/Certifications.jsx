import { motion } from 'motion/react'
import Container from './Container.jsx'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import { AwardIcon, ShieldCheckIcon, TrophyIcon } from './Icons.jsx'
import { achievements, certifications } from '../data/portfolio.js'

function Seal({ label }) {
  const text = `${label} • `.repeat(3)
  return (
    <div className="relative h-40 w-40 sm:h-44 sm:w-44">
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        <defs>
          <path id="seal-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-accent text-[11.5px] font-semibold tracking-[0.25em] uppercase">
          <textPath href="#seal-circle">{text}</textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-7 grid place-items-center rounded-full border border-accent/40 bg-accent/10 shadow-[0_0_40px_-6px] shadow-accent/50">
        <AwardIcon width={44} height={44} className="text-accent" />
      </div>
    </div>
  )
}

function Levels({ levels }) {
  return (
    <div className="flex h-44 items-end gap-3" aria-hidden="true">
      {levels.map((level, i) => (
        <div key={level} className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: `${(i + 1) * 30 + 20}px` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            className={`w-14 rounded-t-lg sm:w-16 ${
              i === levels.length - 1 ? 'bg-accent shadow-[0_0_30px_-4px] shadow-accent' : 'bg-accent/25'
            }`}
          />
          <span className="text-[9px] tracking-[0.2em] text-muted uppercase">{level}</span>
        </div>
      ))}
    </div>
  )
}

function CardShell({ index, badge, visual, category, title, subtitle, description, children }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/20 bg-ink text-fg shadow-[12px_12px_0_0] shadow-ink/25 transition-transform duration-300 hover:-translate-y-1">
      <span className="absolute top-0 left-0 z-10 rounded-br-xl bg-accent px-3 py-1.5 text-[11px] font-bold text-ink">
        {String(index).padStart(2, '0')}
      </span>
      <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-ink/80 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-accent uppercase">
        <ShieldCheckIcon width={12} height={12} /> {badge}
      </span>
      <div className="relative grid h-64 place-items-center overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.12),transparent_70%)]">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="relative">{visual}</div>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="text-[10px] font-semibold tracking-[0.25em] text-subtle uppercase">{category}</p>
        <h3 className="mt-3 text-xl font-extrabold tracking-tight text-fg sm:text-2xl">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-accent">{subtitle}</p>}
        <p className="mt-4 text-sm leading-6 text-muted">{description}</p>
        {children}
      </div>
    </article>
  )
}

export default function Certifications() {
  const cert = certifications[0]
  const award = achievements[0]

  return (
    <section
      id="certifications"
      className="relative isolate scroll-mt-24 overflow-hidden bg-accent py-24 text-ink sm:py-32"
    >
      <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,rgba(4,20,10,0.05)_0_2px,transparent_2px_14px)]" />
      <Container size="lg">
        <SectionHeader
          tone="accent"
          align="left"
          badge="credentials & achievements"
          Icon={ShieldCheckIcon}
          title={
            <>
              Certified in{' '}
              <span className="inline-block -rotate-1 rounded-lg bg-ink px-3 text-accent">code.</span>
              <br />
              Captain on court.
            </>
          }
          meta="Professional Java certification from IJSE, and years of leading a team on the badminton court."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Reveal>
            <CardShell
              index={1}
              badge="certified"
              visual={<Seal label={cert.short + ' • IJSE'} />}
              category={cert.category}
              title={cert.title}
              subtitle={cert.issuer}
              description={cert.description}
            >
              <ul className="mt-6 flex flex-wrap gap-2">
                {cert.topics.map((t) => (
                  <li key={t} className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </CardShell>
          </Reveal>
          <Reveal>
            <CardShell
              index={2}
              badge="achievement"
              visual={
                <div className="flex items-end gap-6">
                  <Levels levels={award.levels} />
                  <TrophyIcon width={40} height={40} className="mb-8 text-accent" />
                </div>
              }
              category={award.category}
              title={award.title}
              subtitle={award.levels.join(' · ') + ' level'}
              description={award.description}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
