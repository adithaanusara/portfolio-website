import Tag from './Tag.jsx'
import { ArrowUpRightIcon, GitHubIcon } from './Icons.jsx'

export default function ProjectCard({ project, index }) {
  const links = [
    project.repo && { href: project.repo, label: `${project.name} source code on GitHub`, Icon: GitHubIcon },
    project.demo && { href: project.demo, label: `${project.name} live demo`, Icon: ArrowUpRightIcon },
  ].filter(Boolean)

  return (
    <article className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/50 sm:p-6">
      <header className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-fg transition-colors group-hover:text-accent">
          {project.name}
        </h3>
        {links.length > 0 ? (
          <ul className="-my-1.5 -mr-1.5 flex shrink-0 items-center gap-1">
            {links.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="block rounded p-1.5 text-muted transition-colors hover:text-accent"
                >
                  <Icon width={16} height={16} />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <span className="shrink-0 text-xs text-subtle">{String(index + 1).padStart(2, '0')}</span>
        )}
      </header>
      <p className="mt-1 text-sm text-muted">{project.title}</p>
      <p className="mt-4 text-sm leading-6 text-muted">{project.description}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
        {project.stack.map((tech) => (
          <li key={tech}>
            <Tag>{tech}</Tag>
          </li>
        ))}
      </ul>
    </article>
  )
}
