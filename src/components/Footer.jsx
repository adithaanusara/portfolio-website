import Container from './Container.jsx'
import { profile } from '../data/portfolio.js'

export default function Footer() {
  return (
    <footer className="border-t border-border/60 py-8">
      <Container className="flex flex-col gap-2 text-xs text-subtle sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>
          built with <span className="text-muted">React</span> + <span className="text-muted">Vite</span> +{' '}
          <span className="text-muted">Tailwind CSS</span>
        </p>
      </Container>
    </footer>
  )
}
