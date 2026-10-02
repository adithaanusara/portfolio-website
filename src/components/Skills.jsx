import Section from './Section.jsx'
import Tag from './Tag.jsx'
import { skills } from '../data/portfolio.js'

export default function Skills() {
  return (
    <Section id="skills" index={2} title="tech stack">
      <dl className="grid gap-6 sm:grid-cols-[11rem_1fr] sm:gap-x-8">
        {skills.map((group) => (
          <div key={group.category} className="contents">
            <dt className="text-sm text-fg sm:pt-1">
              <span className="text-accent">// </span>
              {group.category}
            </dt>
            <dd className="-mt-3 flex flex-wrap gap-2 sm:mt-0">
              {group.items.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
