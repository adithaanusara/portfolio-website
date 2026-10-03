import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from './Icons.jsx'
import { lockScroll } from '../lib/scroll.js'

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
const SWIPE_DISTANCE = 48 // px a finger must travel sideways to change image

// Downloads and decodes an image ahead of time. Resolves either way, so a
// failed image still falls through to the <img> and its alt text.
function loadImage(src) {
  const img = new Image()
  img.src = src
  const ready = img.decode
    ? img.decode()
    : new Promise((resolve) => {
        img.onload = resolve
        img.onerror = resolve
      })
  return ready.catch(() => {})
}

// Start fetching images before the viewer opens (on hover, focus or press).
export function preloadImages(urls) {
  urls.forEach(loadImage)
}

// Full-size image viewer and gallery, portalled to <body> so it sits above
// the navbar regardless of the section's stacking context.
//
// - Browse with the arrow buttons, ← → keys, a swipe, or the thumbnail strip
//   (when `thumbs` are given). Esc or a click on the backdrop closes it.
// - A new image is shown only once it has loaded — the previous one stays up
//   until then — and its neighbours are fetched in advance, so stepping
//   through never shows a blank frame.
// - `label` names the dialog, `alt(i, n)` describes each image, `noun` is what
//   one image is called in button labels, `captions[i]` is shown under image i.
export default function Lightbox({
  title,
  images,
  startIndex = 0,
  onClose,
  label = `${title} screenshots`,
  alt = (i, n) => `${title} screenshot ${i + 1} of ${n}`,
  noun = 'screenshot',
  captions,
  thumbs,
}) {
  const count = images.length
  const [index, setIndex] = useState(Math.min(Math.max(startIndex, 0), count - 1)) // the image asked for
  const [shown, setShown] = useState(null) // the image on screen
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const touchRef = useRef(null)
  const go = (delta) => setIndex((i) => (i + delta + count) % count)

  const current = images[index]
  const next = images[(index + 1) % count]
  const previous = images[(index - 1 + count) % count]
  useEffect(() => {
    let stale = false
    loadImage(current).then(() => {
      if (!stale) setShown(index)
    })
    if (count > 1) preloadImages([next, previous])
    return () => {
      stale = true
    }
  }, [index, count, current, next, previous])

  useEffect(() => {
    const previouslyFocused = document.activeElement
    lockScroll(true)
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count)
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count)
      else if (e.key === 'Tab') {
        // Keep keyboard focus inside the viewer while it is open.
        const dialog = dialogRef.current
        const items = dialog ? [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null) : []
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (!dialog.contains(active)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [count, onClose])

  // One-finger sideways swipe changes image. Ignored while the page is
  // pinch-zoomed, where a swipe means "pan".
  const onTouchStart = (e) => {
    const t = e.touches[0]
    touchRef.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null
  }
  const onTouchEnd = (e) => {
    const from = touchRef.current
    touchRef.current = null
    if (!from || count < 2 || (window.visualViewport?.scale ?? 1) > 1.01) return
    const t = e.changedTouches[0]
    const dx = t.clientX - from.x
    const dy = t.clientY - from.y
    if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
  }

  const multiple = count > 1
  const caption = captions?.[index]
  const strip = multiple && thumbs?.length === count
  const closeOnBackdrop = (e) => e.target === e.currentTarget && onClose()

  const navButton =
    'h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent/60 hover:text-accent'
  // Arrows sit beside the image on wide screens and under it on phones, where
  // the image needs the full width.
  const arrow = (delta, display) => (
    <button
      type="button"
      onClick={() => go(delta)}
      aria-label={`${delta < 0 ? 'Previous' : 'Next'} ${noun}`}
      className={`${navButton} ${display}`}
    >
      {delta < 0 ? <ArrowLeftIcon width={16} height={16} /> : <ArrowRightIcon width={16} height={16} />}
    </button>
  )

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#030504]/[0.97]"
      onMouseDown={closeOnBackdrop}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <p className="min-w-0 truncate text-sm text-fg">
          {title}
          {multiple && (
            <span className="text-subtle">
              {' '}
              · {index + 1} / {count}
            </span>
          )}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={`${navButton} grid`}>
          <CloseIcon width={16} height={16} />
        </button>
      </div>

      <div
        className={`relative flex min-h-0 flex-1 items-center justify-center gap-3 px-3 sm:gap-6 sm:px-8 ${
          caption || strip ? 'pb-4' : multiple ? 'pb-4 sm:pb-6' : 'pb-6'
        }`}
        onMouseDown={closeOnBackdrop}
      >
        {multiple && arrow(-1, 'hidden sm:grid')}
        <div
          className="relative h-full min-w-0 flex-1"
          onMouseDown={closeOnBackdrop}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Images are stacked and centred, so the old and new one cross-fade in place. */}
          <AnimatePresence initial={false}>
            {shown !== null && (
              <motion.img
                key={images[shown]}
                src={images[shown]}
                alt={alt(shown, count)}
                draggable={false}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 m-auto max-h-full max-w-full rounded-xl border border-white/10 shadow-2xl"
              />
            )}
          </AnimatePresence>
          {shown !== index && (
            <motion.span
              role="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.2 }}
              className="pointer-events-none absolute inset-0 grid place-items-center"
            >
              <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-accent motion-reduce:animate-none" />
              <span className="sr-only">Loading image</span>
            </motion.span>
          )}
        </div>
        {multiple && arrow(1, 'hidden sm:grid')}
      </div>

      {(multiple || caption) && (
        <div
          className={`flex flex-col items-center gap-3 px-4 pb-5 sm:px-8 sm:pb-6 ${caption || strip ? '' : 'sm:hidden'}`}
          onMouseDown={closeOnBackdrop}
        >
          {caption && (
            <p aria-live="polite" className="max-w-2xl text-center text-xs leading-5 text-muted sm:text-sm">
              {caption}
            </p>
          )}
          {multiple && (
            <div className="flex items-center gap-3">
              {arrow(-1, 'grid sm:hidden')}
              {strip && (
                <ul className="flex items-center gap-2.5 sm:gap-3">
                  {thumbs.map((src, i) => (
                    <li key={src}>
                      <button
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show ${noun} ${i + 1} of ${count}`}
                        aria-current={i === index ? 'true' : undefined}
                        className={`block overflow-hidden rounded-md ring-2 ring-offset-2 ring-offset-black transition-all duration-200 ${
                          i === index ? 'opacity-100 ring-accent' : 'opacity-50 ring-transparent hover:opacity-90'
                        }`}
                      >
                        <img src={src} alt="" draggable={false} className="block h-12 w-auto sm:h-16" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {arrow(1, 'grid sm:hidden')}
            </div>
          )}
        </div>
      )}
    </motion.div>,
    document.body,
  )
}
