# Aditha Anusara — Portfolio

Personal developer portfolio built with React, Vite and Tailwind CSS. Dark, high-contrast, terminal-green design set entirely in JetBrains Mono, with scroll-driven animation throughout.

## Tech

- React 19 + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- [Motion](https://motion.dev) for scroll-driven and layout animation
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- [cobe](https://github.com/shuding/cobe) for the WebGL globe (lazy-loaded)
- Vercel Analytics

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Editing content

All text — profile, stack, projects, journey, certifications, ribbon text — lives in [`src/data/portfolio.js`](src/data/portfolio.js). Components read from it, so most updates don't need to touch JSX.

| To change… | Do this |
| --- | --- |
| Project screenshots | Add `src/assets/projects/<prefix>-1.webp`, `<prefix>-2.webp`, … and set `screenshots: '<prefix>'` on the project. They show as an auto-advancing gallery with a full-size viewer. Keep them around 1600px wide (WebP) so the page stays light. Without screenshots, the card shows a code-style preview built from `preview`. |
| Certificate image | Add `src/assets/certificates/<name>-card.webp` (~900px) and `<name>-full.webp` (~2200px) and set `image: '<name>'` on the certification. Export them from a flattened, cropped scan and never commit original phone photos — they carry EXIF/GPS data (originals in that folder are git-ignored). |
| Project links | Set `repo` (or `repos: [{ label, href }]` for several) and/or `demo` on the project. |
| Tech logos | SVGs live in `src/assets/tech/` (from [devicon](https://devicon.dev), MIT). Set `icon` on a skill to use one; items without an icon get a monogram tile. |

Theme colors, fonts and utilities (`text-gradient`, `bg-grid`, marquee) are defined in [`src/index.css`](src/index.css).

## Project structure

```
src/
├── assets/
│   ├── certificates/ # certificate images (WebP, metadata-free)
│   ├── projects/   # project screenshots (WebP)
│   └── tech/       # tech stack logos
├── components/     # Intro, Hero, About, Journey, Stack, Projects, Certifications, Contact, Footer, …
├── data/           # portfolio content
├── hooks/          # useActiveSection (nav highlighting)
├── lib/            # smooth scroll helpers, journey road geometry
├── App.jsx
├── index.css
└── main.jsx
```

## Accessibility & performance

- Respects `prefers-reduced-motion`: smooth scroll, marquees and animations switch off; all content stays visible.
- Canvas and WebGL animations stop completely when off screen or in a background tab.
- The globe is created at an idle moment after load (so its shader compile never lands mid-scroll), redraws at 30 fps and renders below screen resolution. Its cost depends only on canvas pixels × frames — dot count and the shader's rim glow are free — so resolution is the knob in `renderBudget()` in [`Globe.jsx`](src/components/Globe.jsx).
- Avoid `blur()` filters, `backdrop-filter` and masks on large areas, especially near anything animated: they were the main cost when scrolling the contact section. Glows and fades there are plain gradients instead.
- The journey timeline's winding road is an SVG path built from the nodes' measured positions, so it follows them at any screen size. Its scroll-driven fill updates the SVG directly (no React re-render per frame) and its layers are sized tightly around the road to keep the glow cheap.
- Keyboard: skip link, visible focus rings, ⌘K / Ctrl+K command palette, arrow keys in the project carousel.

## Deployment

Deploys to Vercel on every push to `main` (build command `npm run build`, output directory `dist`).
