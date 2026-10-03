import { useEffect, useMemo, useState } from 'react'

const levelClass = [
  'bg-white/[0.06]',
  'bg-accent/30',
  'bg-accent/55',
  'bg-accent/80',
  'bg-accent shadow-[0_0_8px] shadow-accent/70',
]

const monthFmt = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' })

// Live GitHub contribution calendar via a public, CORS-enabled proxy of the
// GitHub profile graph. Hides itself if the request fails.
export default function ContributionGraph({ username, weeks = 26 }) {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setData)
      .catch((e) => e?.name !== 'AbortError' && setFailed(true))
    return () => ctrl.abort()
  }, [username])

  const columns = useMemo(() => {
    if (!data) return null
    const days = data.contributions
    // Start the grid on a Sunday so each column is one calendar week.
    let start = Math.max(days.length - weeks * 7, 0)
    while (start > 0 && new Date(days[start].date + 'T00:00:00Z').getUTCDay() !== 0) start--
    const cols = []
    for (let i = start; i < days.length; i += 7) cols.push(days.slice(i, i + 7))
    return cols.slice(-weeks)
  }, [data, weeks])

  if (failed) return null

  return (
    <figure className="w-fit">
      <div className="flex gap-[3px]" aria-hidden="true">
        {(columns ?? Array.from({ length: weeks }, () => Array(7).fill(null))).map((week, i) => {
          const first = week[0]
          const showMonth = first && new Date(first.date + 'T00:00:00Z').getUTCDate() <= 7
          return (
            <div key={i} className="flex flex-col gap-[3px]">
              <span className="h-3 text-[9px] leading-3 text-subtle">
                {showMonth ? monthFmt.format(new Date(first.date + 'T00:00:00Z')) : ''}
              </span>
              {week.map((day, j) => (
                <span
                  key={j}
                  title={day ? `${day.count} contributions on ${day.date}` : undefined}
                  className={`h-2.5 w-2.5 rounded-[2px] sm:h-3 sm:w-3 ${
                    day ? levelClass[day.level] : 'animate-pulse bg-white/[0.04]'
                  }`}
                />
              ))}
            </div>
          )
        })}
      </div>
      <figcaption className="mt-2 text-right text-[10px] tracking-wider text-subtle">
        {data ? (
          <>
            <span className="text-accent">{data.total.lastYear.toLocaleString()}</span> contributions in the last year
          </>
        ) : (
          'loading contributions…'
        )}
      </figcaption>
    </figure>
  )
}
