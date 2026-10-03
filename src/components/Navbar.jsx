import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { CloseIcon, MenuIcon } from './Icons.jsx'
import { shortcutLabel } from './CommandPalette.jsx'
import useActiveSection from '../hooks/useActiveSection.js'
import { scrollToId } from '../lib/scroll.js'
import { navLinks } from '../data/portfolio.js'

const sectionIds = [...navLinks.map((link) => link.id), 'contact']

function ProgressLogo() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault()
        scrollToId('top')
      }}
      aria-label="Back to top"
      className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-elevated"
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-border)" strokeWidth="2" />
        <motion.circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />
      </svg>
      <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_2px] shadow-accent/60" />
    </a>
  )
}

export default function Navbar({ onOpenPalette }) {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4">
      <div className="mx-auto w-full md:w-fit">
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 rounded-full border border-border/80 bg-surface/75 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <ProgressLogo />

          <ul className="hidden items-center md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`relative block rounded-full px-3.5 py-2 text-[13px] transition-colors ${
                    active === link.id ? 'text-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-elevated"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette"
            className="hidden rounded-full px-3 py-2 text-[11px] text-subtle transition-colors hover:text-fg md:block"
          >
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono">{shortcutLabel}</kbd>
          </button>

          <span className="mx-1 hidden h-5 w-px bg-border md:block" aria-hidden="true" />

          <a
            href="#contact"
            onClick={go('contact')}
            className="ml-auto rounded-full bg-accent px-4 py-2 text-[12px] font-bold tracking-[0.15em] text-ink uppercase shadow-[0_0_24px_-4px] shadow-accent/70 transition-transform hover:scale-[1.03] md:ml-0"
          >
            contact
          </a>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-fg md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>

        {open && (
          <motion.ul
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-2xl border border-border bg-surface/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  className={`block rounded-xl px-4 py-3 text-sm ${
                    active === link.id ? 'bg-elevated text-fg' : 'text-muted'
                  }`}
                >
                  <span className="text-accent">$ </span>cd {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onOpenPalette()
                }}
                className="block w-full rounded-xl px-4 py-3 text-left text-sm text-muted"
              >
                <span className="text-accent">$ </span>open command palette
              </button>
            </li>
          </motion.ul>
        )}
      </div>
    </header>
  )
}
