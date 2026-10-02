import Container from './Container.jsx'
import { navLinks, profile } from '../data/portfolio.js'

export default function Navbar() {
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
      </Container>
    </header>
  )
}
