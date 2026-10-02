import Tag from './Tag.jsx'

export default function ProjectCard({ project, index }) {
  return (
    <article className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/50 sm:p-6">
      <header className="flex items-baseline justify-between gap-4">
        <h3 className="text-base font-semibold text-fg transition-colors group-hover:text-accent">
          {project.name}
        </h3>
        <span className="shrink-0 text-xs text-subtle">{String(index + 1).padStart(2, '0')}</span>
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
