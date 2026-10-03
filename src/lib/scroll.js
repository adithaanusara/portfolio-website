import Lenis from 'lenis'

// Sections reserve room for the floating navbar with `scroll-mt-24`, which
// both Lenis and native scrollIntoView respect — so no extra offset here.

let lenis = null

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 })
  return () => {
    lenis?.destroy()
    lenis = null
  }
}

export function lockScroll(locked) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}

export function scrollToId(id) {
  const el = id === 'top' ? 0 : document.getElementById(id)
  if (el === null) return
  if (lenis) {
    lenis.scrollTo(el)
  } else if (el === 0) {
    window.scrollTo({ top: 0 })
  } else {
    el.scrollIntoView()
  }
  history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`)
}
