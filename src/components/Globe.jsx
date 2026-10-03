import { useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'

// Rotation (phi) that puts a longitude at the front of the globe.
const focusPhi = (lon) => Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2)

// WebGL dot globe that sways gently around `location`. Created on first view,
// paused off screen, static for reduced motion, hidden if WebGL fails.
export default function Globe({ location, className = '' }) {
  const canvasRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const base = focusPhi(location[1])
    let globe = null
    let frame = 0
    let visible = false
    let t = 0

    const loop = () => {
      if (!visible || !globe) {
        frame = 0
        return
      }
      t += 0.004
      globe.update({ phi: base + Math.sin(t) * 0.6 })
      frame = requestAnimationFrame(loop)
    }

    const create = () => {
      const size = canvas.offsetWidth
      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: dpr,
          width: size * dpr,
          height: size * dpr,
          phi: base,
          theta: 0.15,
          dark: 1,
          diffuse: 1.2,
          mapSamples: 16000,
          mapBrightness: 5,
          mapBaseBrightness: 0.02,
          baseColor: [0.09, 0.13, 0.11],
          markerColor: [0.29, 0.87, 0.5],
          glowColor: [0.12, 0.42, 0.28],
          markers: [{ location, size: 0.09 }],
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
      if (globe && !reduced && !frame) frame = requestAnimationFrame(loop)
    })
    io.observe(canvas)

    return () => {
      io.disconnect()
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
