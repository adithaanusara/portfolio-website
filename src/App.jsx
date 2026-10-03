import { useCallback, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import Intro from './components/Intro.jsx'
import Hero from './components/Hero.jsx'
import Ribbon from './components/Ribbon.jsx'
import About from './components/About.jsx'
import Journey from './components/Journey.jsx'
import Stack from './components/Stack.jsx'
import Projects from './components/Projects.jsx'
import Certifications from './components/Certifications.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { initSmoothScroll } from './lib/scroll.js'
import { ribbons } from './data/portfolio.js'

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const openPalette = useCallback(() => setPaletteOpen(true), [])

  useEffect(() => initSmoothScroll(), [])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#content"
        className="sr-only z-50 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        skip to content
      </a>
      <Navbar onOpenPalette={openPalette} />
      <main id="content">
        <Intro />
        <Hero />
        <Ribbon items={ribbons.intro} className="mt-24" />
        <About />
        <Ribbon items={ribbons.journey} tilt={2} reverse />
        <Journey />
        <Stack />
        <Ribbon items={ribbons.stack} tone="accent" tilt={-1.5} />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <Analytics />
    </MotionConfig>
  )
}
