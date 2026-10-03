import Reveal from './Reveal.jsx'

export default function SectionHeader({ badge, Icon, title, meta, bgWord, align = 'center', tone = 'dark' }) {
  const centered = align === 'center'
  const onAccent = tone === 'accent'

  return (
    <div className={`relative ${centered ? 'text-center' : ''}`}>
      {bgWord && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[22vw] leading-none font-extrabold tracking-tighter whitespace-nowrap select-none md:text-[15rem] ${
            onAccent ? 'text-ink/[0.07]' : 'text-outline'
          }`}
        >
          {bgWord}
        </span>
      )}
      <Reveal>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-medium tracking-[0.25em] uppercase ${
            onAccent ? 'border-ink/25 text-ink' : 'border-border bg-surface/90 text-muted'
          }`}
        >
          {Icon && <Icon width={14} height={14} className={onAccent ? '' : 'text-accent'} />}
          {badge}
        </span>
        <h2
          className={`mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl ${
            onAccent ? 'text-ink' : 'text-gradient text-glow'
          }`}
        >
          {title}
        </h2>
        {meta && (
          <p
            className={`mt-5 text-[11px] tracking-[0.25em] uppercase ${onAccent ? 'text-ink/70' : 'text-subtle'} ${
              centered ? '' : 'max-w-xl'
            }`}
          >
            {meta}
          </p>
        )}
      </Reveal>
    </div>
  )
}
