const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const icon = (paths) =>
  function Icon(props) {
    return (
      <svg {...base} {...props}>
        {paths}
      </svg>
    )
  }

export const GitHubIcon = icon(
  <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
)

export const LinkedInIcon = icon(
  <>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </>,
)

export const MailIcon = icon(
  <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </>,
)

export const PhoneIcon = icon(
  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
)

export const MapPinIcon = icon(
  <>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </>,
)

export const ArrowUpRightIcon = icon(<path d="M7 17 17 7M7 7h10v10" />)
export const ArrowRightIcon = icon(<path d="M5 12h14M13 5l7 7-7 7" />)
export const ArrowLeftIcon = icon(<path d="M19 12H5M11 19l-7-7 7-7" />)
export const ArrowUpIcon = icon(<path d="M12 19V5M5 12l7-7 7 7" />)
export const DownloadIcon = icon(<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />)
export const MenuIcon = icon(<path d="M4 6h16M4 12h16M4 18h16" />)
export const CloseIcon = icon(<path d="M18 6 6 18M6 6l12 12" />)
export const SendIcon = icon(<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />)
export const CopyIcon = icon(
  <>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>,
)
export const CheckIcon = icon(<path d="M20 6 9 17l-5-5" />)
export const ClockIcon = icon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>,
)
export const TerminalIcon = icon(<path d="m4 17 6-6-6-6M12 19h8" />)
export const GraduationIcon = icon(
  <>
    <path d="M22 10 12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </>,
)
export const AwardIcon = icon(
  <>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
  </>,
)
export const TrophyIcon = icon(
  <>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.9 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.1.6 2 2 2 3.8" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </>,
)
export const CodeIcon = icon(<path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />)
export const LayersIcon = icon(
  <>
    <path d="m12 2 10 5-10 5L2 7l10-5z" />
    <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
  </>,
)
export const ShieldCheckIcon = icon(
  <>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </>,
)
export const SparkIcon = icon(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />)
