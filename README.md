# Aditha Anusara — Portfolio

Personal developer portfolio built with React, Vite and Tailwind CSS. Dark, high-contrast, monospace (JetBrains Mono / Fira Code) design.

## Tech

- React 19 + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- No UI libraries — inline SVG icons, IntersectionObserver for scroll effects

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Editing content

All text — profile, tech stack, projects, education, certifications — lives in [`src/data/portfolio.js`](src/data/portfolio.js). Components read from it, so most updates don't need to touch JSX.

Theme colors and fonts are defined as tokens in the `@theme` block of [`src/index.css`](src/index.css).

## Project structure

```
src/
├── components/   # Navbar, Hero, About, Skills, Projects, Education, Certifications, Contact, Footer
├── data/         # portfolio content
├── hooks/        # useActiveSection (nav highlighting)
├── App.jsx
├── index.css
└── main.jsx
```

## Deployment

Deploys to Vercel with zero config — import the repository and Vercel detects Vite automatically (build command `npm run build`, output directory `dist`).
