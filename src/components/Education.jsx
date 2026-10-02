import Section from './Section.jsx'
import { education } from '../data/portfolio.js'

export default function Education() {
  return (
    <Section id="education" index={4} title="education">
      <ol className="relative space-y-8 border-l border-border pl-6">
        {education.map((item) => (
          <li key={item.degree} className="relative">
            <span
              className="absolute top-1.5 -left-[29px] h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="text-[15px] font-semibold text-fg">{item.degree}</h3>
              {item.period && <span className="shrink-0 text-xs text-subtle">{item.period}</span>}
            </div>
            <p className="mt-1 text-sm text-muted">{item.institution}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
