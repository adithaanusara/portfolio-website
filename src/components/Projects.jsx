import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Container from './Container.jsx'
import SectionHeader from './SectionHeader.jsx'
import ProjectPreview from './ProjectPreview.jsx'
import Lightbox from './Lightbox.jsx'
import Tag from './Tag.jsx'
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, CodeIcon, GitHubIcon } from './Icons.jsx'
import { profile, projects } from '../data/portfolio.js'

const hues = ['#4ade80', '#2dd4bf', '#a3e635', '#38bdf8', '#34d399']

// Screenshots named <prefix>-<n>.<ext>, ordered by n.
const files = import.meta.glob('../assets/projects/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' })
const screenshotsFor = (prefix) =>
  prefix
    ? Object.entries(files)
        .map(([path, url]) => [path.match(new RegExp(`/projects/${prefix}-(\\d+)\\.\\w+$`))?.[1], url])
        .filter(([n]) => n)
        .sort((a, b) => a[0] - b[0])
        .map(([, url]) => url)
    : []

const sourceLinks = (p) => p.repos ?? (p.repo ? [{ label: 'source', href: p.repo }] : [])
const urlLabel = (p) =>
  (p.demo ?? sourceLinks(p)[0]?.href ?? `~/${p.name.toLowerCase().split(' ')[0]}`).replace(/^https?:\/\//, '')

function ExpandIcon(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  )
}

function Gallery({ name, images, active, index, setIndex }) {
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!active || paused || reduced || images.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 3800)
    return () => clearInterval(id)
  }, [active, paused, reduced, images.length, setIndex])

  return (
    <div
      className="relative h-full w-full bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`${name} screenshot ${index + 1} of ${images.length}`}
          draggable={false}
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </AnimatePresence>
      {active && images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-2 backdrop-blur">
          {images.map((_, j) => (
            <button
              key={j}
              type="button"
              onClick={() => setIndex(j)}
              aria-label={`Show ${name} screenshot ${j + 1}`}
              aria-current={j === index ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${j === index ? 'w-5 bg-accent' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BrowserFrame({ project, index, active, onExpand }) {
  const images = screenshotsFor(project.screenshots)
  const [shot, setShot] = useState(0)

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0e0d] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:rounded-2xl">
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#0e1211] px-3 py-2.5 sm:px-4">
        <div className="flex w-14 gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto max-w-[60%] truncate rounded-md bg-white/5 px-3 py-1 text-center text-[10px] text-subtle sm:text-[11px]">
          {urlLabel(project)}
        </div>
        <div className="flex w-14 justify-end">
          {active && images.length > 0 && (
            <button
              type="button"
              onClick={() => onExpand(images, shot)}
              aria-label={`View ${project.name} screenshots full size`}
              className="grid h-6 w-6 place-items-center rounded-md text-subtle transition-colors hover:bg-white/10 hover:text-accent"
            >
              <ExpandIcon />
            </button>
          )}
        </div>
      </div>
      <div className="aspect-[16/10]">
        {images.length > 0 ? (
          <Gallery name={project.name} images={images} active={active} index={shot} setIndex={setShot} />
        ) : project.preview ? (
          <ProjectPreview project={project} hue={hues[index % hues.length]} active={active} />
        ) : null}
      </div>
    </div>
  )
}

export default function Projects() {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const count = projects.length
  const project = projects[active]

  const go = useCallback(
    (delta) => setActive((i) => (i + delta + count) % count),
    [count],
  )

  return (
    <section id="projects" className="relative isolate scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <Container size="lg">
        <SectionHeader
          badge="selected work"
          Icon={CodeIcon}
          title="Things I've built."
          meta={`${count} projects · drag, swipe or use the arrows`}
          bgWord="WORK"
        />
      </Container>

      {/* stage */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1)
          if (e.key === 'ArrowLeft') go(-1)
        }}
        className="relative mt-14 rounded-3xl outline-offset-8 sm:mt-20"
        style={{ height: 'calc(min(86vw, 920px) * 0.625 + 42px)' }}
      >
        <div className="absolute top-1/2 left-1/2 -z-10 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] transition-colors duration-700" style={{ backgroundColor: `${hues[active % hues.length]}26` }} />
        {projects.map((p, i) => {
          let offset = i - active
          if (offset > count / 2) offset -= count
          if (offset < -count / 2) offset += count
          const isActive = offset === 0
          const hidden = Math.abs(offset) > 1
          return (
            <motion.div
              key={p.name}
              className="absolute top-0 left-1/2 w-[min(86vw,920px)]"
              initial={false}
              animate={{
                x: `${-50 + offset * 78}%`,
                scale: isActive ? 1 : 0.78,
                opacity: hidden ? 0 : isActive ? 1 : 0.35,
                filter: isActive ? 'blur(0px)' : 'blur(3px)',
                zIndex: isActive ? 2 : 1,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 32 }}
              style={{ pointerEvents: hidden ? 'none' : 'auto' }}
              aria-hidden={!isActive}
              {...(isActive
                ? {
                    drag: 'x',
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.25,
                    onDragEnd: (_, info) => {
                      if (info.offset.x < -60) go(1)
                      else if (info.offset.x > 60) go(-1)
                    },
                  }
                : { onClick: () => go(offset) })}
            >
              <div className={isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}>
                <BrowserFrame
                  project={p}
                  index={i}
                  active={isActive}
                  onExpand={(images, startIndex) => setLightbox({ title: p.name, images, startIndex })}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* controls */}
      <Container size="lg" className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent/60 hover:text-accent"
        >
          <ArrowLeftIcon width={16} height={16} />
        </button>
        <div className="flex items-center gap-2">
          {projects.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${p.name}`}
              aria-current={i === active ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-accent' : 'w-1.5 bg-border hover:bg-subtle'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent/60 hover:text-accent"
        >
          <ArrowRightIcon width={16} height={16} />
        </button>
      </Container>

      {/* details */}
      <Container size="lg" className="mt-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-10 lg:grid-cols-[13rem_1fr_15rem] lg:gap-12"
            aria-live="polite"
          >
            <div className="order-2 space-y-3 lg:order-1">
              <div className="flex flex-wrap gap-2">
                <span className="inline-block rounded-full border border-accent/40 px-3 py-1 text-[10px] font-semibold tracking-[0.25em] text-accent uppercase">
                  {project.category}
                </span>
                {project.status && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-amber-300 uppercase">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
                    {project.status}
                  </span>
                )}
              </div>
              <dl className="space-y-2">
                {project.highlights.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5">
                    <dt className="text-[10px] tracking-[0.2em] text-subtle uppercase">{label}</dt>
                    <dd className="text-xs text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="order-1 text-center lg:order-2">
              <p className="text-xs text-subtle">
                {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{project.name}</h3>
              <p className="mt-1 text-sm text-accent">{project.title}</p>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-muted">{project.description}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {sourceLinks(project).map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-fg uppercase transition-colors hover:border-accent/60"
                  >
                    <GitHubIcon width={15} height={15} /> {label} <ArrowUpRightIcon width={13} height={13} />
                  </a>
                ))}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold tracking-[0.15em] text-ink uppercase shadow-[0_0_24px_-6px] shadow-accent/70"
                  >
                    live demo <ArrowUpRightIcon width={13} height={13} />
                  </a>
                )}
                {sourceLinks(project).length === 0 && !project.demo && (
                  <span className="rounded-full border border-dashed border-border px-5 py-2.5 text-xs text-subtle">
                    private repository
                  </span>
                )}
              </div>
            </div>

            <div className="order-3">
              <p className="mb-3 text-[10px] font-semibold tracking-[0.25em] text-accent uppercase lg:text-right">stack</p>
              <ul className="flex flex-wrap gap-2 lg:justify-end">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Tag>{tech}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="mt-14 text-center">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            more on github <ArrowUpRightIcon width={14} height={14} />
          </a>
        </p>
      </Container>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            title={lightbox.title}
            images={lightbox.images}
            startIndex={lightbox.startIndex}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
