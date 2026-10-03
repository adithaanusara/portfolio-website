import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Container from './Container.jsx'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import Lightbox from './Lightbox.jsx'
import { ShieldCheckIcon, TrophyIcon } from './Icons.jsx'
import { achievements, certifications } from '../data/portfolio.js'

const certFiles = import.meta.glob('../assets/certificates/*.webp', { eager: true, query: '?url', import: 'default' })
const certImage = (name, variant) => certFiles[`../assets/certificates/${name}-${variant}.webp`]

function ExpandIcon(props) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  )
}

// The certificate shown as a framed paper document: fixed height, natural
// aspect ratio, so any certificate image fits without distortion or cropping.
// Clicking opens the full-resolution image.
function CertificateFrame({ cert, onOpen }) {
  const src = certImage(cert.image, 'card')
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View the ${cert.short} certificate full size`}
      className="group/cert relative block cursor-zoom-in rounded-md outline-offset-[10px]"
    >
      <span
        aria-hidden="true"
        className="absolute -inset-8 rounded-full bg-accent/20 opacity-60 blur-3xl transition-opacity duration-500 group-hover/cert:opacity-100"
      />
      <span className="relative block -rotate-2 rounded-md bg-[#f3f0e6] p-1.5 shadow-[0_28px_50px_-14px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform duration-500 ease-out group-hover/cert:rotate-0 group-hover/cert:scale-[1.04] group-focus-visible/cert:rotate-0 motion-reduce:transition-none">
        <img
          src={src}
          alt={`${cert.title} certificate issued by ${cert.issuer}`}
          width="900"
          height="1240"
          loading="lazy"
          decoding="async"
          draggable="false"
          className="block h-56 w-auto rounded-[3px] sm:h-64"
        />
      </span>
      <span className="absolute -bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-accent/50 bg-ink/95 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] whitespace-nowrap text-accent uppercase shadow-lg shadow-black/50 transition-colors group-hover/cert:border-accent group-hover/cert:bg-ink">
        <ExpandIcon /> view certificate
      </span>
    </button>
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
      <div className="relative grid h-80 place-items-center overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.12),transparent_70%)] sm:h-96">
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
  const [viewing, setViewing] = useState(false)
  const close = useCallback(() => setViewing(false), [])

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
          meta="A Comprehensive Master Java Developer diploma from IJSE, and years of leading a team on the badminton court."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Reveal>
            <CardShell
              index={1}
              badge="certified"
              visual={<CertificateFrame cert={cert} onOpen={() => setViewing(true)} />}
              category={cert.category}
              title={cert.title}
              subtitle={cert.issuer}
              description={cert.description}
            >
              <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-white/10 py-4 text-xs">
                <div>
                  <dt className="text-[10px] tracking-[0.2em] text-subtle uppercase">issued</dt>
                  <dd className="mt-1 text-fg">{cert.issued}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[0.2em] text-subtle uppercase">credential id</dt>
                  <dd className="mt-1 text-fg">{cert.credentialId}</dd>
                </div>
              </dl>
              <ul className="mt-5 flex flex-wrap gap-2">
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

      <AnimatePresence>
        {viewing && (
          <Lightbox
            title={`${cert.short} certificate · ${cert.issuer}`}
            images={[certImage(cert.image, 'full')]}
            label={`${cert.title} certificate, full size`}
            alt={() => `${cert.title} certificate issued by ${cert.issuer}, ${cert.issued}`}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
