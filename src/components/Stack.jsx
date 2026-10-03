import Container from './Container.jsx'
import SectionHeader from './SectionHeader.jsx'
import Reveal from './Reveal.jsx'
import Tag from './Tag.jsx'
import { LayersIcon } from './Icons.jsx'
import { skills } from '../data/portfolio.js'

const logos = import.meta.glob('../assets/tech/*.svg', { eager: true, query: '?url', import: 'default' })
const logoUrl = (name) => logos[`../assets/tech/${name}.svg`]

const monogram = (name) =>
  name
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

// Flatten with category labels and drop duplicate logos (React / React Native).
const tiles = skills
  .flatMap((g) => g.items.map((item) => ({ ...item, category: g.category })))
  .filter((t, i, all) => !t.icon || all.findIndex((o) => o.icon === t.icon) === i)

const half = Math.ceil(tiles.length / 2)
const rows = [tiles.slice(0, half), tiles.slice(half)]

function Tile({ tile }) {
  const url = tile.icon && logoUrl(tile.icon)
  return (
    <div className="group relative flex h-32 w-32 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_10px_40px_-10px] hover:shadow-accent/40 sm:h-36 sm:w-36">
      <span className="absolute top-2.5 left-3 text-[8px] tracking-[0.2em] text-subtle uppercase">
        {tile.category.split(' ')[0]}
      </span>
      {url ? (
        <img
          src={url}
          alt=""
          loading="lazy"
          className={`h-10 w-10 transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11 ${tile.invert ? 'invert' : ''}`}
        />
      ) : (
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/30 bg-accent/10 text-xs font-bold text-accent sm:h-11 sm:w-11">
          {monogram(tile.name)}
        </span>
      )}
      <span className="px-2 text-center text-[10px] font-semibold tracking-[0.15em] text-fg uppercase">{tile.name}</span>
      <span className="absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}

function MarqueeRow({ items, reverse }) {
  return (
    <div className="mask-fade-x flex overflow-hidden py-3 [&:hover_.animate-marquee]:[animation-play-state:paused]" aria-hidden="true">
      <div
        className="flex w-max animate-marquee gap-4 pr-4"
        style={{ '--marquee-duration': '55s', animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {[...items, ...items].map((tile, i) => (
          <Tile key={i} tile={tile} />
        ))}
      </div>
    </div>
  )
}

export default function Stack() {
  return (
    <section id="stack" className="relative isolate scroll-mt-24 py-24 sm:py-32">
      <Container size="lg">
        <SectionHeader
          badge="tech stack"
          Icon={LayersIcon}
          title={
            <>
              The tools I <span className="rounded-lg bg-accent px-3 text-ink [text-shadow:none]">ship</span> with.
            </>
          }
          meta="frontend · backend · AI · data · devops — the stack behind every project"
          bgWord="STACK"
        />
      </Container>

      <div className="mt-16 space-y-2 sm:mt-20">
        <MarqueeRow items={rows[0]} />
        <MarqueeRow items={rows[1]} reverse />
      </div>

      <Container size="lg" className="mt-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <li key={group.category}>
              <Reveal>
                <div className="h-full rounded-2xl border border-border bg-surface/60 p-5">
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-fg uppercase">
                    <span className="text-accent">// </span>
                    {group.category}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <Tag>{item.name}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
