import { profile } from '../data/portfolio.js'

const lines = [
  { key: 'name', value: `"${profile.name}"` },
  { key: 'role', value: '"Full Stack & Distributed Systems"' },
  { key: 'location', value: `"${profile.location}"` },
  { key: 'focus', value: '["microservices", "LLM apps", "mobile"]' },
  { key: 'studying', value: '"B.Sc. Computer Science @ UCSC"' },
  { key: 'certified', value: 'true' },
]

export default function TerminalCard() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-border bg-[#080b0a] text-[13px] shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-2 text-xs text-subtle">~/aditha — zsh</span>
      </div>
      <pre className="overflow-x-auto px-5 py-5 leading-relaxed">
        <code>
          <span className="text-accent">❯</span> <span className="text-fg">cat whoami.json</span>
          {'\n{\n'}
          {lines.map((l, i) => (
            <span key={l.key}>
              {'  '}
              <span className="text-sky-300">"{l.key}"</span>
              <span className="text-subtle">: </span>
              <span className={l.value === 'true' ? 'text-amber-300' : 'text-accent'}>{l.value}</span>
              {i < lines.length - 1 ? ',' : ''}
              {'\n'}
            </span>
          ))}
          {'}\n'}
          <span className="text-accent">❯</span> <span className="animate-blink text-fg">▍</span>
        </code>
      </pre>
    </div>
  )
}
