function Track({ items, hidden }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center">
          <span className="px-6 whitespace-nowrap sm:px-8">{item}</span>
          <span className="opacity-60" aria-hidden="true">
            ◆
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function Ribbon({ items, tone = 'dark', tilt = -2, reverse = false, duration = 40, className = '' }) {
  const styles =
    tone === 'accent'
      ? 'bg-accent text-ink border-accent'
      : 'bg-[#0a0d0c] text-muted border-border [&_li>span:last-child]:text-accent'

  // Repeat the items so one track is always wider than the viewport, then
  // render the track twice and slide by -50% for a seamless loop.
  const repeated = Array.from({ length: 3 }, () => items).flat()

  // The outer wrapper clips the tilted band at the viewport edges so it never
  // widens the page; overflow-y stays visible for the tilt and shadow.
  return (
    <div className={`relative z-10 overflow-x-clip py-6 ${className}`}>
      <div style={{ transform: `rotate(${tilt}deg)` }}>
        <div
          className={`-mx-8 overflow-hidden border-y py-3.5 text-[11px] font-semibold tracking-[0.3em] uppercase shadow-2xl shadow-black/60 sm:text-xs ${styles}`}
        >
          <div
            className="flex w-max animate-marquee"
            style={{ '--marquee-duration': `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
          >
            <Track items={repeated} />
            <Track items={repeated} hidden />
          </div>
        </div>
      </div>
    </div>
  )
}
