import Section from './Section.jsx'
import { GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon } from './Icons.jsx'
import { profile } from '../data/portfolio.js'

const channels = [
  { label: 'email', value: profile.email, href: `mailto:${profile.email}`, Icon: MailIcon },
  { label: 'phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}`, Icon: PhoneIcon },
  { label: 'github', value: 'github.com/adithaanusara', href: profile.github, Icon: GitHubIcon },
  { label: 'linkedin', value: 'in/aditha-anusara', href: profile.linkedin, Icon: LinkedInIcon },
]

export default function Contact() {
  return (
    <Section id="contact" index={6} title="contact">
      <p className="max-w-xl text-[15px] leading-7 text-muted">
        Open to internships, collaborations and interesting problems. The fastest way to reach me
        is by email.
      </p>
      <a
        href={`mailto:${profile.email}`}
        className="mt-6 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-dim"
      >
        say hello
      </a>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {channels.map(({ label, value, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-accent/50"
            >
              <Icon className="shrink-0 text-accent" />
              <span className="min-w-0">
                <span className="block text-xs text-subtle">{label}</span>
                <span className="block truncate text-sm text-fg">{value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
