import Section from './Section.jsx'
import { achievements, certifications } from '../data/portfolio.js'

function Item({ title, meta, description }) {
  return (
    <li className="rounded-lg border border-border bg-surface p-5">
      <h3 className="text-[15px] font-semibold text-fg">{title}</h3>
      {meta && <p className="mt-1 text-sm text-accent">{meta}</p>}
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </li>
  )
}

export default function Certifications() {
  return (
    <Section id="certifications" index={5} title="certifications & achievements">
      <ul className="grid gap-4 sm:grid-cols-2">
        {certifications.map((c) => (
          <Item key={c.title} title={c.title} meta={c.issuer} description={c.description} />
        ))}
        {achievements.map((a) => (
          <Item key={a.title} title={a.title} description={a.description} />
        ))}
      </ul>
    </Section>
  )
}
