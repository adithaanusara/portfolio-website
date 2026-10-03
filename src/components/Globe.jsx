import { useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'

// Rotation (phi) that puts a longitude at the front of the globe.
const focusPhi = (lon) => Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2)

// The globe redraws at most this often on every device. Its sway is slow
// (about a pixel per frame), so 30 fps looks the same as 60 at half the work.
const FPS = 30
const FRAME_INTERVAL = 1000 / FPS

// Radians per second for the sway; the angle is derived from elapsed time so
// speed is identical whatever the screen's refresh rate.
const SWAY_SPEED = 0.24
const SWAY_AMPLITUDE = 0.6

// Redraws owed after creation. cobe uploads its map texture asynchronously and
// does not redraw when it arrives, so a globe drawn only once has no map.
const SETTLE_DRAWS = 20

// Measured with GPU timer queries: one draw costs the same at 1,000 dots as at
// 16,000, and the same with or without the rim glow — the shader finds the
// nearest dot in constant time. Only canvas pixels (and frames) cost anything,
// so resolution is the budget. Dot count is chosen for looks.
function renderBudget() {
  const touch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
  // deviceMemory is Chrome-only and Safari under-reports cores, so only treat
  // a device as low-end when the numbers are clearly small.
  const lowEnd = navigator.deviceMemory <= 2 || navigator.hardwareConcurrency <= 2
  const screenDpr = window.devicePixelRatio || 1
  if (lowEnd) return { dpr: Math.min(screenDpr, 0.8), samples: 6000 }
  if (touch) return { dpr: Math.min(screenDpr, 1), samples: 7000 }
  return { dpr: Math.min(screenDpr, 1.25), samples: 10000 }
}

// WebGL dot globe that sways gently around `location`.
//
// - Created at an idle moment after load, so the shader compile never lands
//   in the middle of a scroll.
// - Animates only while on screen and the tab is visible; otherwise the loop
//   is stopped completely (no frames are requested).
// - Static for reduced motion; removed if WebGL fails.
export default function Globe({ location, className = '' }) {
  const canvasRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const budget = renderBudget()
    const base = focusPhi(location[1])
    let globe = null
    let frame = 0
    let pending = null // cancels the scheduled idle-time creation
    let visible = false
    let size = 0
    let elapsed = 0 // ms of animation shown so far (pauses while hidden)
    let lastTick = 0
    let lastDraw = 0
    let settle = SETTLE_DRAWS

    // Reduced motion still needs a few identical redraws for the map to show.
    const running = () => visible && !document.hidden && globe && (!reduced || settle > 0)

    const loop = (now) => {
      if (!running()) {
        frame = 0
        return
      }
      frame = requestAnimationFrame(loop)
      if (lastTick && !reduced) elapsed += Math.min(now - lastTick, 100) // ignore long gaps
      lastTick = now
      // Throttle to FPS; small tolerance for timer jitter.
      if (now - lastDraw < FRAME_INTERVAL - 2) return
      lastDraw = now
      if (settle > 0) settle--
      globe.update({ phi: base + Math.sin((elapsed / 1000) * SWAY_SPEED) * SWAY_AMPLITUDE })
    }

    const start = () => {
      if (frame || !running()) return
      lastTick = 0
      frame = requestAnimationFrame(loop)
    }

    const create = () => {
      pending?.()
      pending = null
      if (globe) return
      size = canvas.offsetWidth
      if (!size) return
      const headBefore = new Set(document.head.children)
      try {
        globe = createGlobe(canvas, {
          // cobe multiplies width/height by devicePixelRatio itself, so pass
          // the CSS size here — not size × dpr.
          devicePixelRatio: budget.dpr,
          width: size,
          height: size,
          phi: base,
          theta: 0.15,
          dark: 1,
          diffuse: 1.2,
          mapSamples: budget.samples,
          mapBrightness: 6,
          mapBaseBrightness: 0.02,
          baseColor: [0.09, 0.13, 0.11],
          markerColor: [0.29, 0.87, 0.5],
          glowColor: [0.12, 0.42, 0.28],
          markers: [{ location, size: 0.09 }],
          // MSAA does nothing for a shader-drawn sphere but costs bandwidth.
          context: { antialias: false, powerPreference: 'low-power' },
        })
        // Without WebGL cobe returns a silent no-op instead of throwing.
        if (!(canvas.getContext('webgl2') || canvas.getContext('webgl'))) throw new Error('WebGL unavailable')
      } catch {
        globe = null
        io.disconnect()
        ro.disconnect()
        setFailed(true)
        return
      }
      // cobe adds a <style> to <head> and rewrites its text on every update()
      // (it carries CSS anchors for labelled markers, which we don't use).
      // Replacing a stylesheet makes the browser redo style work each frame,
      // so take it out of the document: cobe keeps writing to the detached
      // element, which no longer affects anything.
      for (const el of [...document.head.children]) {
        if (!headBefore.has(el) && el.tagName === 'STYLE') el.remove()
      }
      canvas.style.opacity = '1'
      start()
    }

    // Create ahead of time, once the page has settled and the main thread is
    // idle. Compiling the shaders blocks for tens of milliseconds; doing it
    // here keeps that out of the scroll into the contact section.
    const createWhenIdle = () => {
      const delay = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          const id = requestIdleCallback(create, { timeout: 3000 })
          pending = () => cancelIdleCallback(id)
        } else {
          create()
        }
      }, 3500)
      pending = () => clearTimeout(delay)
    }
    createWhenIdle()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) return // the loop notices and stops itself
      if (!globe) create() // reached before the idle slot came up
      start()
    })
    io.observe(canvas)

    // Keep the drawing buffer matched to the element if the layout changes.
    const ro = new ResizeObserver(() => {
      const next = canvas.offsetWidth
      if (!globe || !next || Math.abs(next - size) < 2) return
      size = next
      globe.update({ width: size, height: size })
    })
    ro.observe(canvas)

    const onVisibility = () => start()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      pending?.()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(frame)
      globe?.destroy()
    }
  }, [location])

  if (failed) return null

  // cobe moves the canvas into a wrapper element of its own. Keeping the
  // canvas inside this div means React still owns the node it will remove.
  return (
    <div className={`w-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="block aspect-square w-full opacity-0 transition-opacity duration-1000"
        aria-hidden="true"
      />
    </div>
  )
}
