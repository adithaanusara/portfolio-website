import Section from './Section.jsx'
import ProjectCard from './ProjectCard.jsx'
import { ArrowUpRightIcon } from './Icons.jsx'
import { profile, projects } from '../data/portfolio.js'

export default function Projects() {
  return (
    <Section id="projects" index={3} title="projects">
      <div className="grid gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
      >
        more on github
        <ArrowUpRightIcon width={14} height={14} />
      </a>
    </Section>
  )
}
