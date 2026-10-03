import { useEffect, useRef } from 'react'

// A slowly drifting graph of nodes and links — a nod to distributed systems.
// Pauses when off screen and renders a single still frame for reduced motion.
export default function NetworkCanvas({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const pointer = { x: -9999, y: -9999 }
    let nodes = []
    let width = 0
    let height = 0
    let frame = 0
    let visible = true

    const seed = () => {
      const count = Math.min(Math.round((width * height) / 15000), 110)
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
        hub: Math.random() < 0.08,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      draw()
    }

    const link = 130
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < link) {
            ctx.strokeStyle = `rgba(74, 222, 128, ${(1 - d / link) * 0.22})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y)
        if (pd < 180) {
          ctx.strokeStyle = `rgba(45, 212, 191, ${(1 - pd / 180) * 0.5})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.stroke()
        }
      }
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.hub ? n.r + 1.6 : n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.hub ? 'rgba(134, 239, 172, 0.95)' : 'rgba(74, 222, 128, 0.55)'
        if (n.hub) {
          ctx.shadowColor = 'rgba(74, 222, 128, 0.9)'
          ctx.shadowBlur = 12
        }
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    const step = () => {
      frame = 0
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }
      draw()
      if (visible) frame = requestAnimationFrame(step)
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      if (reduced) draw()
    }
    const onLeave = () => {
      pointer.x = pointer.y = -9999
      if (reduced) draw()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !reduced && !frame) frame = requestAnimationFrame(step)
    })
    io.observe(canvas)
    const host = canvas.parentElement
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />
}
