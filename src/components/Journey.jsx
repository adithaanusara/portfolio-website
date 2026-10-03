import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import Container from './Container.jsx'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import { AwardIcon, CodeIcon, GraduationIcon, LayersIcon } from './Icons.jsx'
import { buildRoad, roadAt } from '../lib/road.js'
import { journey } from '../data/portfolio.js'

const kindIcon = {
  School: LayersIcon,
  University: GraduationIcon,
  Program: CodeIcon,
  Certification: AwardIcon,
}

const LEAD = 84 // px of road above the first node (fades in)
const TAIL = 96 // px of road after the last node (fades out — the journey continues)
const FADE = 44 // px over which each end of the road fades
// The fill's tip rides this line of the viewport (0 = top, 1 = bottom): a node
// lights up as it scrolls past it.
const FILL_LINE = 0.65

// Each node sits toward its own card, so the road has to swing across the
// gutter to reach the next one. Phones get a small swing in the left margin;
// it widens with the gutter on larger screens. The road itself is measured
// from wherever these classes put the nodes.
const nodeSide = {
  left: 'left-[10px] md:left-[calc(50%_-_1.75rem)] lg:left-[calc(50%_-_2.5rem)]',
  right: 'left-[34px] md:left-[calc(50%_+_1.75rem)] lg:left-[calc(50%_+_2.5rem)]',
}

const GLOW = 'drop-shadow(0 0 4px rgb(74 222 128 / 0.9)) drop-shadow(0 0 12px rgb(74 222 128 / 0.45))'
const GLOW_ROOM = 18 // px kept around the road for its glow — small enough to stay clear of the cards

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

// Measures the node centres relative to the timeline and builds the road
// through them, with a short lead-in above the first node and a tail after
// the last. Rebuilds whenever the timeline changes size (breakpoints, font
// loading, text wrapping).
function useRoad(hostRef, nodeRefs) {
  const [road, setRoad] = useState(null)

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return

    const measure = () => {
      const box = host.getBoundingClientRect()
      const nodes = nodeRefs.current.filter(Boolean).map((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }
      })
      if (nodes.length < 2 || !box.height) return

      const xs = nodes.map((n) => n.x)
      const midX = (Math.min(...xs) + Math.max(...xs)) / 2
      const last = nodes[nodes.length - 1]
      const tail = Math.min(TAIL, box.height - last.y)
      const hasTail = tail > FADE

      const points = [{ x: midX, y: nodes[0].y - LEAD }, ...nodes]
      if (hasTail) points.push({ x: midX, y: last.y + tail })

      const built = buildRoad(points)
      // A tight box around the road (plus room for the glow). The SVG layers
      // are sized to this rather than the whole timeline, so the browser only
      // re-blurs a thin strip while scrolling.
      const left = Math.min(...built.xs) - GLOW_ROOM
      const right = Math.max(...built.xs) + GLOW_ROOM
      const frame = {
        x: left,
        y: built.yStart - GLOW_ROOM,
        width: right - left,
        height: built.yEnd - built.yStart + GLOW_ROOM * 2,
      }

      const next = { ...built, nodeYs: nodes.map((n) => n.y), hasTail, frame }
      setRoad((prev) => (prev?.d === next.d ? prev : next))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(host)
    return () => observer.disconnect()
  }, [hostRef, nodeRefs])

  return road
}

// The road as two layers: a dotted "route ahead" track, and the neon fill
// with a bright spark at its tip. Both fade in at the top and out at the end.
// The fill amount and spark position are set from the scroll handler.
function Road({ road, id, fillRef, headRef }) {
  const span = road.yEnd - road.yStart
  const fadeIn = FADE / span
  const fadeOut = road.hasTail ? 1 - FADE / span : 1
  const vertical = { gradientUnits: 'userSpaceOnUse', x1: 0, y1: road.yStart, x2: 0, y2: road.yEnd }

  // Each layer covers only the road's frame; the viewBox keeps the path in
  // the timeline's own coordinates at 1:1 scale.
  const { frame } = road
  const position = { left: frame.x, top: frame.y, width: frame.width, height: frame.height }
  const layer = {
    'aria-hidden': true,
    className: 'pointer-events-none absolute overflow-visible',
    viewBox: `${frame.x} ${frame.y} ${frame.width} ${frame.height}`,
  }

  return (
    <>
      <svg {...layer} style={position}>
        <defs>
          <linearGradient id={`${id}-track`} {...vertical}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset={fadeIn} stopColor="#fff" stopOpacity="0.3" />
            <stop offset={fadeOut} stopColor="#fff" stopOpacity="0.3" />
            {road.hasTail && <stop offset="1" stopColor="#fff" stopOpacity="0" />}
          </linearGradient>
        </defs>
        <path
          d={road.d}
          fill="none"
          stroke={`url(#${id}-track)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0.1 9"
        />
      </svg>

      <svg {...layer} style={{ ...position, filter: GLOW }}>
        <defs>
          <linearGradient id={`${id}-fill`} {...vertical}>
            <stop offset="0" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0 }} />
            <stop offset={fadeIn} style={{ stopColor: 'var(--color-accent)' }} />
            <stop offset={fadeOut} style={{ stopColor: 'var(--color-accent-2)' }} />
            {road.hasTail && <stop offset="1" style={{ stopColor: 'var(--color-accent-2)', stopOpacity: 0 }} />}
          </linearGradient>
        </defs>
        {/* pathLength makes the dash maths use the same length as the lookup table */}
        <path
          ref={fillRef}
          d={road.d}
          pathLength={road.total}
          fill="none"
          stroke={`url(#${id}-fill)`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${road.total} ${road.total}`}
        />
        <circle ref={headRef} r="3.5" fill="#eafff2" opacity="0" />
      </svg>
    </>
  )
}

export default function Journey() {
  const hostRef = useRef(null)
  const rangeRef = useRef(null)
  const nodeRefs = useRef([])
  const roadRef = useRef(null)
  const fillRef = useRef(null)
  const headRef = useRef(null)
  // useId output can contain characters that aren't safe inside url(#…).
  const id = `road-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const reduced = useReducedMotion()

  const road = useRoad(hostRef, nodeRefs)
  // -1 = not measured yet: show every node lit rather than all dimmed.
  const [reached, setReached] = useState(-1)

  // `rangeRef` is an invisible element covering exactly the road's height, so
  // progress runs 0 → 1 as the road's top, then its end, cross FILL_LINE.
  const { scrollYProgress } = useScroll({
    target: rangeRef,
    offset: [`start ${FILL_LINE}`, `end ${FILL_LINE}`],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const progress = reduced ? scrollYProgress : smooth

  // Scroll progress → a height on the road → fill everything above it. Going
  // by height (not distance travelled) keeps the tip on FILL_LINE however
  // much the road curves.
  const apply = useCallback(() => {
    const r = roadRef.current
    if (!r) return
    const y = r.yStart + progress.get() * (r.yEnd - r.yStart)
    const at = roadAt(r, y)

    fillRef.current?.setAttribute('stroke-dashoffset', String(r.total - at.length))

    const head = headRef.current
    if (head) {
      head.setAttribute('cx', String(at.x))
      head.setAttribute('cy', String(at.y))
      const fadeEnd = r.hasTail ? (r.yEnd - y) / FADE : 1
      head.style.opacity = String(Math.max(0, Math.min(1, (y - r.yStart) / FADE, fadeEnd)))
    }

    const count = r.nodeYs.filter((nodeY) => nodeY <= y + 0.5).length
    setReached((prev) => (prev === count ? prev : count))
  }, [progress])

  useMotionValueEvent(progress, 'change', apply)

  // Runs before paint when the road is (re)built, so the fill is never shown
  // at the wrong length.
  useLayoutEffect(() => {
    roadRef.current = road
    apply()
  }, [road, apply])

  return (
    <section id="journey" className="relative isolate scroll-mt-24 overflow-x-clip py-24 sm:py-32">
      <div className="absolute inset-0 -z-20 bg-grid [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      <Container size="lg">
        <SectionHeader
          badge="my journey"
          Icon={GraduationIcon}
          title="Learn. Build. Repeat."
          meta={`${journey.length} milestones · education & growth`}
          bgWord="JOURNEY"
        />

        <div ref={hostRef} className="relative mt-20 sm:mt-28">
          <div
            ref={rangeRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 w-px"
            style={road ? { top: road.yStart, height: road.yEnd - road.yStart } : { top: 0, height: '100%' }}
          />
          {road && <Road road={road} id={id} fillRef={fillRef} headRef={headRef} />}

          <ol>
            {journey.map((item, i) => {
              const left = i % 2 === 0
              const lit = reached < 0 || i < reached
              return (
                <li
                  key={item.title}
                  className={`relative pb-10 pl-16 last:pb-0 md:grid md:grid-cols-2 md:gap-24 md:pb-0 md:pl-0 lg:gap-32 ${i > 0 ? 'md:-mt-20' : ''}`}
                >
                  <span
                    ref={(el) => {
                      nodeRefs.current[i] = el
                    }}
                    aria-hidden="true"
                    className={`absolute top-7 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full border bg-bg transition-colors duration-300 ${
                      nodeSide[left ? 'left' : 'right']
                    } ${lit ? 'border-accent' : 'border-white/20'}`}
                  >
                    {lit && (
                      <span className="absolute inset-0 animate-node-pulse rounded-full border border-accent motion-reduce:hidden" />
                    )}
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                        lit ? 'bg-accent shadow-[0_0_8px_2px] shadow-accent/70' : 'bg-white/25'
                      }`}
                    />
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
        </div>
      </Container>
    </section>
  )
}
