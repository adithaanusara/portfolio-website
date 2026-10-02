import Container from './Container.jsx'
import TerminalCard from './TerminalCard.jsx'
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, MapPinIcon } from './Icons.jsx'
import { profile } from '../data/portfolio.js'
import { resumeFileName, resumeUrl } from '../data/resume.js'

const socials = [
  { label: 'GitHub', href: profile.github, Icon: GitHubIcon },
  { label: 'LinkedIn', href: profile.linkedin, Icon: LinkedInIcon },
  { label: 'Email', href: `mailto:${profile.email}`, Icon: MailIcon },
]

export default function Hero() {
  return (
    <section id="top" className="pt-20 pb-16 sm:pt-28 sm:pb-20">
      <Container>
        <p className="mb-4 text-sm text-accent">Hi, my name is</p>
        <h1 className="text-4xl font-bold tracking-tight text-fg sm:text-6xl">{profile.name}</h1>
        <p className="mt-4 text-lg text-muted sm:text-xl">
          {profile.role}
          <span className="hidden text-subtle sm:inline"> | </span>
          <span className="block text-fg sm:inline">{profile.tagline}</span>
        </p>
        <p className="mt-4 flex items-center gap-2 text-sm text-subtle">
          <MapPinIcon width={15} height={15} />
          {profile.location}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-dim"
          >
            view projects
          </a>
          <a
            href="#contact"
            className="rounded-md border border-border px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
          >
            get in touch
          </a>
          {resumeUrl && (
            <a
              href={resumeUrl}
              download={resumeFileName}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
            >
              <DownloadIcon width={15} height={15} />
              résumé
            </a>
          )}
          <ul className="ml-1 flex items-center gap-1">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="block rounded p-2 text-muted transition-colors hover:text-accent"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <TerminalCard />
      </Container>
    </section>
  )
}
