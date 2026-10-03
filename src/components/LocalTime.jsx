import { useEffect, useState } from 'react'

export default function LocalTime({ timeZone, className = '' }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone }).format(now)

  return (
    <time className={className} dateTime={now.toISOString()}>
      {time}
      <span className="text-subtle"> GMT+5:30</span>
    </time>
  )
}
