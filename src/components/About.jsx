import Section from './Section.jsx'
import { profile } from '../data/portfolio.js'

export default function About() {
  return (
    <Section id="about" index={1} title="about">
      <div className="space-y-4 text-[15px] leading-7 text-muted">
        {profile.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </Section>
  )
}
