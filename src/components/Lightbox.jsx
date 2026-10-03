import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from './Icons.jsx'
import { lockScroll } from '../lib/scroll.js'

// Full-size screenshot viewer. Arrow keys / buttons to browse, Esc or
// clicking the backdrop to close. Portalled to <body> so it sits above the
// navbar regardless of the section's stacking context.
export default function Lightbox({ title, images, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex)
  const closeRef = useRef(null)
  const count = images.length
  const go = (delta) => setIndex((i) => (i + delta + count) % count)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    lockScroll(true)
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count)
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [count, onClose])

  const navButton =
    'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-surface/90 text-muted backdrop-blur transition-colors hover:border-accent/60 hover:text-accent'

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <p className="text-sm text-fg">
          {title}{' '}
          <span className="text-subtle">
            · {index + 1} / {count}
          </span>
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={navButton}>
          <CloseIcon width={16} height={16} />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center gap-3 px-3 pb-6 sm:gap-6 sm:px-8"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        {count > 1 && (
          <button type="button" onClick={() => go(-1)} aria-label="Previous screenshot" className={navButton}>
            <ArrowLeftIcon width={16} height={16} />
          </button>
        )}
        <div className="relative flex h-full min-w-0 flex-1 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={images[index]}
              src={images[index]}
              alt={`${title} screenshot ${index + 1} of ${count}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="max-h-full max-w-full rounded-xl border border-white/10 object-contain shadow-2xl"
            />
          </AnimatePresence>
        </div>
        {count > 1 && (
          <button type="button" onClick={() => go(1)} aria-label="Next screenshot" className={navButton}>
            <ArrowRightIcon width={16} height={16} />
          </button>
        )}
      </div>
    </motion.div>,
    document.body,
  )
}
