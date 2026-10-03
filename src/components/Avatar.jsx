import photo from '../assets/profile/aditha.webp'
import { profile } from '../data/portfolio.js'

// Circular portrait with a slowly rotating green→cyan neon ring and a soft
// glow. Size comes from `className` (set width and height there).
export default function Avatar({ className = '' }) {
  return (
    <span className={`relative inline-grid shrink-0 place-items-center rounded-full ${className}`}>
      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-accent/35 blur-xl" />
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-[spin_9s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,var(--color-accent),var(--color-accent-2),transparent_60%,var(--color-accent))] motion-reduce:animate-none"
      />
      <img
        src={photo}
        alt={`Portrait of ${profile.name}`}
        width="512"
        height="512"
        decoding="async"
        draggable="false"
        className="relative h-[calc(100%-6px)] w-[calc(100%-6px)] rounded-full border-2 border-surface bg-surface object-cover"
      />
    </span>
  )
}
