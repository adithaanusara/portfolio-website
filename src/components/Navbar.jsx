import { useEffect, useState } from 'react'
import Container from './Container.jsx'
import { CloseIcon, MenuIcon } from './Icons.jsx'
import { navLinks, profile } from '../data/portfolio.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between">
        <a href="#top" className="text-sm font-semibold text-fg hover:text-accent">
          <span className="text-accent">~/</span>
          {profile.handle}
        </a>

        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="text-muted transition-colors hover:text-fg">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 rounded p-2 text-muted hover:text-fg sm:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border/60 sm:hidden">
          <Container>
            <ul className="flex flex-col py-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-muted hover:text-fg"
                  >
                    <span className="text-accent">$ </span>cd {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  )
}
