import { useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'

// Rotation (phi) that puts a longitude at the front of the globe.
const focusPhi = (lon) => Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2)

// The globe is a full-canvas fragment shader, so its cost is pixels × frames.
// Pick a render budget per device class: phones and low-power devices get a
// lower pixel ratio and 30 fps (the slow sway looks the same), desktops get
// a sharper canvas at 60 fps.
function renderBudget() {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = window.innerWidth < 768
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4
  const screenDpr = window.devicePixelRatio || 1
  if (lowPower) return { dpr: 1, fps: 30, samples: 9000 }
  if (coarse || small) return { dpr: Math.min(screenDpr, 1.25), fps: 30, samples: 10000 }
  return { dpr: Math.min(screenDpr, 1.5), fps: 60, samples: 16000 }
}

// Radians per second for the sway; the angle is derived from elapsed time so
// speed is identical at 30, 60 or 120 Hz.
const SWAY_SPEED = 0.24
const SWAY_AMPLITUDE = 0.6

// WebGL dot globe that sways gently around `location`. Created on first view,
// paused off screen or in a background tab, static for reduced motion, hidden
// if WebGL fails.
export default function Globe({ location, className = '' }) {
  const canvasRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const budget = renderBudget()
    const frameInterval = 1000 / budget.fps
    const base = focusPhi(location[1])
    let globe = null
    let frame = 0
    let visible = false
    let size = 0
    let elapsed = 0 // ms of animation shown so far (pauses while hidden)
    let lastTick = 0
    let lastDraw = 0

    const running = () => visible && !document.hidden && !reduced && globe

    const loop = (now) => {
      if (!running()) {
        frame = 0
        return
      }
      frame = requestAnimationFrame(loop)
      if (lastTick) elapsed += Math.min(now - lastTick, 100) // ignore long gaps
      lastTick = now
      // Throttle to the budget's frame rate; small tolerance for timer jitter.
      if (now - lastDraw < frameInterval - 2) return
      lastDraw = now
      globe.update({ phi: base + Math.sin((elapsed / 1000) * SWAY_SPEED) * SWAY_AMPLITUDE })
    }

    const start = () => {
      if (frame || !running()) return
      lastTick = 0
      frame = requestAnimationFrame(loop)
    }

    const create = () => {
      size = canvas.offsetWidth
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
          mapBrightness: 5,
          mapBaseBrightness: 0.02,
          baseColor: [0.09, 0.13, 0.11],
          markerColor: [0.29, 0.87, 0.5],
          glowColor: [0.12, 0.42, 0.28],
          markers: [{ location, size: 0.09 }],
          // MSAA does nothing for a shader-drawn sphere but costs bandwidth.
          context: { antialias: false, powerPreference: 'low-power' },
        })
        canvas.style.opacity = '1'
      } catch {
        setFailed(true)
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) return
      if (!globe) create()
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
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(frame)
      globe?.destroy()
    }
  }, [location])

  if (failed) return null

  return (
    <canvas
      ref={canvasRef}
      className={`aspect-square w-full opacity-0 transition-opacity duration-1000 ${className}`}
      aria-hidden="true"
    />
  )
}
