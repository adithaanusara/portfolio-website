import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const LINE_1 = 'Code. Build. Ship.'
const LINE_2 = 'Systems that scale'

const START_DELAY = 650 // ms — let the `$ ./aditha --portfolio` prompt land first
// 15 chars/s: exactly 4 frames at 60 Hz and 8 at 120 Hz, so every keystroke
// lands on an even frame boundary and the rhythm stays perfectly steady.
const CHAR_INTERVAL = 1000 / 15
const LINE_PAUSE = 320 // ms — the "Enter" between the two lines

// Time (ms from mount) at which each character appears, and when the caret
// drops to the second line.
const LINE_2_START = START_DELAY + LINE_1.length * CHAR_INTERVAL + LINE_PAUSE
const SCHEDULE = [
  ...Array.from(LINE_1, (_, i) => START_DELAY + i * CHAR_INTERVAL),
  ...Array.from(LINE_2, (_, i) => LINE_2_START + (i + 1) * CHAR_INTERVAL),
]
const TOTAL = SCHEDULE.length

const FONT_WAIT_LIMIT = 1500 // ms — never hold the intro longer than this

// Wait for the display font so the text never swaps typeface (and shifts)
// mid-typing; give up after FONT_WAIT_LIMIT on slow connections.
function fontsReady() {
  if (!document.fonts?.load) return Promise.resolve()
  return Promise.race([
    document.fonts.load('800 1em "JetBrains Mono"'),
    new Promise((resolve) => setTimeout(resolve, FONT_WAIT_LIMIT)),
  ]).catch(() => {})
}

// Drives the typing from elapsed time (not a counter), so a slow frame never
// slows or bunches the text — it always catches up to the exact position.
function useTypewriter() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [state, setState] = useState(() => (reduced ? { count: TOTAL, line2: true } : { count: 0, line2: false }))

  useEffect(() => {
    if (reduced) return
    let frame = 0
    let start = 0
    let cancelled = false
    const tick = (now) => {
      const elapsed = now - start
      let count = 0
      while (count < TOTAL && SCHEDULE[count] <= elapsed) count++
      const line2 = elapsed >= LINE_2_START
      setState((s) => (s.count === count && s.line2 === line2 ? s : { count, line2 }))
      if (count < TOTAL) frame = requestAnimationFrame(tick)
    }
    fontsReady().then(() => {
      if (cancelled) return
      start = performance.now()
      frame = requestAnimationFrame(tick)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [reduced])

  return { ...state, done: state.count === TOTAL }
}

// Renders the full line from the start, hiding the not-yet-typed part, so the
// centred layout and the gradient never move while typing. An empty marker
// span marks the caret position; being empty it has no width and adds no
// line-break opportunity, so it can't change how the line wraps.
function TypedLine({ text, typed, markerRef, reserveCaret, className }) {
  return (
    <span className={className}>
      {text.slice(0, typed)}
      {markerRef && <span ref={markerRef} />}
      <span className="invisible">
        {text.slice(typed)}
        {reserveCaret && '_'}
      </span>
    </span>
  )
}

// Neon caret drawn as an overlay at the marker's position, outside the text
// flow. Measured relative to the overlay host (the marker's own offsetParent
// can be a filtered line, not the host); dividing by the host's on-screen
// scale undoes the scroll-driven zoom so positions stay in layout pixels.
function useCaretPosition(markerRef, hostRef, deps) {
  const [pos, setPos] = useState(null)
  useLayoutEffect(() => {
    const measure = () => {
      const m = markerRef.current
      const host = hostRef.current
      if (!m || !host) return
      const h = host.getBoundingClientRect()
      const r = m.getBoundingClientRect()
      const k = host.offsetWidth / (h.width || 1)
      const next = {
        left: Math.round((r.left - h.left) * k * 10) / 10,
        top: Math.round((r.top - h.top) * k * 10) / 10,
        height: Math.round(r.height * k * 10) / 10,
      }
      setPos((p) => (p && p.left === next.left && p.top === next.top && p.height === next.height ? p : next))
    }
    measure()
    if (!hostRef.current) return
    const ro = new ResizeObserver(measure)
    ro.observe(hostRef.current)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return pos
}

export default function Intro() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 0.7], ['blur(0px)', 'blur(12px)'])
  const { count, line2, done } = useTypewriter()

  const typed1 = Math.min(count, LINE_1.length)
  const typed2 = Math.max(count - LINE_1.length, 0)
  const markerRef = useRef(null)
  const hostRef = useRef(null)
  const caret = useCaretPosition(markerRef, hostRef, [count, line2])

  return (
    <section ref={ref} id="top" className="relative isolate h-svh min-h-[560px] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[120px]" />

      <motion.div
        style={{ scale, opacity, filter: blur }}
        className="flex h-full flex-col items-center justify-center px-5 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-[11px] tracking-[0.35em] text-subtle uppercase"
        >
          <span className="text-accent">$</span> ./aditha --portfolio
        </motion.p>
        <p className="text-[clamp(2.5rem,9vw,7.5rem)] leading-[0.95] font-extrabold tracking-tighter">
          <span className="sr-only">
            {LINE_1} {LINE_2}
          </span>
          <span ref={hostRef} aria-hidden="true" className="relative block">
            <TypedLine
              text={LINE_1}
              typed={typed1}
              markerRef={line2 ? null : markerRef}
              className="block bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            />
            <TypedLine
              text={LINE_2}
              typed={typed2}
              markerRef={line2 ? markerRef : null}
              reserveCaret
              className="text-gradient text-glow block"
            />
            {caret && (
              <span
                className={`pointer-events-none absolute tracking-normal text-accent [text-shadow:0_0_18px_rgba(74,222,128,0.75)] ${
                  done ? 'animate-blink' : ''
                }`}
                style={{ left: caret.left, top: caret.top, height: caret.height, lineHeight: `${caret.height}px` }}
              >
                _
              </span>
            )}
          </span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ delay: done ? 0.4 : 0, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] tracking-[0.35em] text-subtle uppercase"
        aria-hidden="true"
      >
        scroll
        <span className="relative h-10 w-px overflow-hidden bg-border">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
