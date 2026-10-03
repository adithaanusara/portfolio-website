import { useEffect, useRef } from 'react'
import photo from '../assets/profile/aditha.webp'
import { profile } from '../data/portfolio.js'

const DEG = Math.PI / 180

// Physics constants (angles in radians, time in seconds).
const SWING = { stiffness: 22, damping: 1.15 } // the lanyard as a pendulum: ~1.3 s period, settles in ~4 s
const HINGE = { stiffness: 70, damping: 7.5, coupling: 0.55 } // the card lags behind the strap at the clip
const TILT = { stiffness: 55, damping: 8 } // 3D tilt/twist of the card, slightly springy
const DRAG = { stiffness: 160, damping: 18 } // how firmly the badge follows the pointer while held
const MAX_ANGLE = 55 * DEG
const PUSH = 0.004 // swing speed gained per px the mouse travels across the card
const DROP_ANGLE = -0.45 // where it is released from the first time it comes into view
const STEP = 1 / 120

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// Runs the simulation and writes transforms straight to the DOM (no React
// re-render per frame). The loop only runs while something is moving and the
// badge is on screen; at rest it stops completely.
function useLanyardPhysics({ root, swing, card, sheen }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rootEl = root.current
    const swingEl = swing.current
    const cardEl = card.current
    const sheenEl = sheen.current

    const s = {
      theta: 0, omega: 0, // swing of the whole lanyard about the top
      beta: 0, betaV: 0, // extra rotation of the card at the clip
      rx: 0, rxV: 0, ry: 0, ryV: 0, // 3D tilt (x) and twist (y) of the card
      targetRx: 0, targetRy: 0,
      dragging: false, dragTarget: 0, dragOffset: 0,
    }
    let frame = 0
    let last = 0
    let visible = false
    let dropped = false
    let lastX = null
    let press = null

    const render = () => {
      swingEl.style.transform = `rotate(${s.theta.toFixed(4)}rad)`
      cardEl.style.transform = `perspective(46em) rotateZ(${s.beta.toFixed(4)}rad) rotateX(${s.rx.toFixed(4)}rad) rotateY(${s.ry.toFixed(4)}rad)`
      sheenEl.style.transform = `translateX(${(s.ry * 90 + s.theta * 60).toFixed(2)}%)`
    }

    const advance = (dt) => {
      const acc = s.dragging
        ? DRAG.stiffness * (s.dragTarget - s.theta) - DRAG.damping * s.omega
        : -SWING.stiffness * Math.sin(s.theta) - SWING.damping * s.omega
      s.omega += acc * dt
      s.theta += s.omega * dt

      s.betaV += (-HINGE.stiffness * s.beta - HINGE.damping * s.betaV - HINGE.coupling * acc) * dt
      s.beta += s.betaV * dt

      // A swinging badge also twists a little with its speed.
      const twist = s.targetRy + clamp(s.omega * 0.12, -0.35, 0.35)
      s.ryV += (TILT.stiffness * (twist - s.ry) - TILT.damping * s.ryV) * dt
      s.ry += s.ryV * dt
      s.rxV += (TILT.stiffness * (s.targetRx - s.rx) - TILT.damping * s.rxV) * dt
      s.rx += s.rxV * dt
    }

    const atRest = () =>
      !s.dragging &&
      Math.abs(s.theta) < 0.003 && Math.abs(s.omega) < 0.015 &&
      Math.abs(s.beta) < 0.003 && Math.abs(s.betaV) < 0.015 &&
      Math.abs(s.ry - s.targetRy) < 0.002 && Math.abs(s.ryV) < 0.01 &&
      Math.abs(s.rx - s.targetRx) < 0.002 && Math.abs(s.rxV) < 0.01

    const loop = (now) => {
      let dt = Math.min((now - last) / 1000, 1 / 20)
      last = now
      while (dt > 1e-6) {
        const h = Math.min(dt, STEP)
        advance(h)
        dt -= h
      }
      if (atRest()) {
        s.theta = s.omega = s.beta = s.betaV = s.ryV = s.rxV = 0
        s.ry = s.targetRy
        s.rx = s.targetRx
        render()
        frame = 0
        rootEl.dataset.lanyard = 'idle'
        return
      }
      render()
      frame = visible ? requestAnimationFrame(loop) : 0
      if (!frame) rootEl.dataset.lanyard = 'idle'
    }
    const wake = () => {
      if (frame || !visible) return
      last = performance.now()
      rootEl.dataset.lanyard = 'active'
      frame = requestAnimationFrame(loop)
    }

    // Angle of the pointer as seen from the pivot. CSS rotation is clockwise,
    // which moves a hanging object to the left, hence the minus sign.
    const pointerAngle = (e) => {
      const pivot = rootEl.getBoundingClientRect()
      return -Math.atan2(e.clientX - pivot.left, Math.max(e.clientY - pivot.top, 1))
    }

    const onMove = (e) => {
      if (s.dragging) {
        s.dragTarget = clamp(pointerAngle(e) + s.dragOffset, -MAX_ANGLE, MAX_ANGLE)
        wake()
        return
      }
      if (e.pointerType !== 'mouse') return
      const r = cardEl.getBoundingClientRect()
      s.targetRy = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5) * 2 * 14 * DEG
      s.targetRx = -clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5) * 2 * 9 * DEG
      // Brushing across the card pushes it.
      if (lastX !== null) s.omega = clamp(s.omega - (e.clientX - lastX) * PUSH, -4, 4)
      lastX = e.clientX
      wake()
    }
    const onLeave = () => {
      lastX = null
      s.targetRx = s.targetRy = 0
      wake()
    }
    const onDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      if (e.pointerType === 'mouse') e.preventDefault() // no text selection while dragging
      cardEl.setPointerCapture?.(e.pointerId)
      s.dragging = true
      s.dragOffset = s.theta - pointerAngle(e)
      s.dragTarget = s.theta
      s.targetRx = s.targetRy = 0
      press = { x: e.clientX, y: e.clientY }
      cardEl.style.cursor = 'grabbing'
      wake()
    }
    const onUp = (e) => {
      if (!s.dragging) return
      s.dragging = false
      cardEl.style.cursor = ''
      // A press without a drag flicks the card into a twist.
      if (e.type === 'pointerup' && press && Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6) {
        const r = cardEl.getBoundingClientRect()
        s.ryV += (e.clientX < r.left + r.width / 2 ? -1 : 1) * 6
      }
      press = null
      lastX = null
      wake()
    }

    cardEl.addEventListener('pointermove', onMove)
    cardEl.addEventListener('pointerleave', onLeave)
    cardEl.addEventListener('pointerdown', onDown)
    cardEl.addEventListener('pointerup', onUp)
    cardEl.addEventListener('pointercancel', onUp)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) return
      if (!dropped) {
        // First time on screen: let it drop in and settle.
        dropped = true
        s.theta = DROP_ANGLE
      }
      wake()
    })
    io.observe(cardEl)

    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      cardEl.removeEventListener('pointermove', onMove)
      cardEl.removeEventListener('pointerleave', onLeave)
      cardEl.removeEventListener('pointerdown', onDown)
      cardEl.removeEventListener('pointerup', onUp)
      cardEl.removeEventListener('pointercancel', onUp)
    }
  }, [root, swing, card, sheen])
}

const strapStyle = {
  background:
    'linear-gradient(90deg, rgb(74 222 128 / 0.75) 0 1px, transparent 1px calc(100% - 1px), rgb(74 222 128 / 0.75) calc(100% - 1px)), repeating-linear-gradient(135deg, rgb(74 222 128 / 0.2) 0 3px, transparent 3px 9px), #0b120e',
}

// An ID badge on a lanyard. Position it with `className` (left/right): the
// element itself is the zero-size pivot at the top of its positioned parent,
// and everything hangs from there. Size comes from two CSS variables on an
// ancestor: --strap (lanyard length) and --badge-w (card width); the card's
// contents scale with its width.
//
// Mouse: moving across the card pushes and tilts it. Any pointer: drag to
// pull it aside and let go, or press to flick it. Static for reduced motion.
export default function IdBadge({ className = '' }) {
  const root = useRef(null)
  const swing = useRef(null)
  const card = useRef(null)
  const sheen = useRef(null)
  useLanyardPhysics({ root, swing, card, sheen })
  const [first, ...rest] = profile.name.split(' ')

  return (
    <div ref={root} data-lanyard="idle" className={`pointer-events-none absolute top-0 h-0 w-0 ${className}`}>
      {/* where the lanyard is fixed to the top edge */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 z-10 h-2.5 w-9 -translate-x-1/2 rounded-b-md border border-t-0 border-white/15 bg-elevated"
      />
      <div
        ref={swing}
        className="absolute top-0 left-[calc(var(--badge-w)/-2)] w-[var(--badge-w)] origin-top will-change-transform"
      >
        <span aria-hidden="true" className="mx-auto block h-[var(--strap)] w-[1.05rem]" style={strapStyle} />
        {/* clip */}
        <span aria-hidden="true" className="relative z-10 mx-auto -mt-px block h-[1.4rem] w-[1.5rem]">
          <span className="absolute inset-x-0 top-0 h-[0.8rem] rounded-[3px] border border-white/20 bg-[linear-gradient(180deg,#6b7772,#2b3330)]" />
          <span className="absolute top-[0.55rem] left-1/2 h-[1.05rem] w-[0.8rem] -translate-x-1/2 rounded-full border-2 border-[#8c9994]" />
        </span>

        <div
          ref={card}
          className="pointer-events-auto relative -mt-[0.45rem] flex aspect-[1/1.64] w-full origin-top cursor-grab touch-pan-y flex-col overflow-hidden rounded-[1em] border border-accent/30 bg-[linear-gradient(160deg,#111c16,#070b09_62%)] p-[0.75em] text-[calc(var(--badge-w)/12.5)] shadow-[0_1.4em_2.6em_-0.9em_rgba(0,0,0,0.95),0_0_2.2em_-0.7em_rgba(74,222,128,0.5)] will-change-transform select-none"
        >
          <span aria-hidden="true" className="mx-auto block h-[0.45em] w-[2.4em] shrink-0 rounded-full bg-bg ring-1 ring-white/15" />

          <div aria-hidden="true" className="mt-[0.9em] flex items-center justify-between text-[0.56em] tracking-[0.18em] text-subtle uppercase">
            <span className="flex items-center gap-[0.6em]">
              <span className="h-[0.7em] w-[0.7em] rounded-full bg-accent shadow-[0_0_0.8em] shadow-accent" />
              ~/portfolio
            </span>
          </div>

          <div className="mt-[0.7em] grid grid-cols-[1fr_auto] items-stretch gap-[0.5em]">
            <img
              src={photo}
              alt={`Portrait of ${profile.name}`}
              width="512"
              height="512"
              decoding="async"
              draggable="false"
              className="aspect-square w-full rounded-[0.6em] border border-accent/35 bg-surface object-cover"
            />
            <span
              aria-hidden="true"
              className="rotate-180 text-center text-[0.6em] font-bold tracking-[0.42em] text-accent/80 uppercase [writing-mode:vertical-rl]"
            >
              {profile.name}
            </span>
          </div>

          <p aria-hidden="true" className="mt-[0.55em] text-[1.5em] leading-[0.98] font-extrabold tracking-tight text-fg">
            {first}
            <span className="text-gradient block">{rest.join(' ')}</span>
          </p>
          <p aria-hidden="true" className="mt-[0.75em] text-[0.5em] leading-[1.5] tracking-[0.16em] text-muted uppercase">
            {profile.tagline}
          </p>

          <div aria-hidden="true" className="mt-auto flex items-end justify-between border-t border-white/10 pt-[0.55em] text-[0.5em] tracking-[0.14em] text-subtle uppercase">
            <span className="normal-case">@{profile.handle}</span>
            <span className="flex items-end gap-[0.25em]">
              {[0.5, 0.8, 1.1, 0.7, 1.3].map((h, i) => (
                <span key={i} className="w-[0.3em] rounded-[1px] bg-accent/70" style={{ height: `${h}em` }} />
              ))}
            </span>
          </div>

          {/* light catching the card as it turns */}
          <span
            ref={sheen}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-[200%] bg-[linear-gradient(105deg,transparent_38%,rgb(134_239_172/0.14)_47%,rgb(45_212_191/0.1)_53%,transparent_62%)]"
          />
        </div>
      </div>
    </div>
  )
}
