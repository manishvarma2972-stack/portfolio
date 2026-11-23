# Pericherla Manish Varma — Portfolio

A single-page portfolio built with Next.js 15 (App Router), TypeScript and Tailwind CSS v4.
Every fact on the site comes from LinkedIn and GitHub. See [docs/RESEARCH.md](docs/RESEARCH.md)
for the sources and the design direction.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit content

All text, projects, skills, milestones and links are in `src/content/profile.ts`.
Components only render that data, so updating the site never means touching layout code.

- Add a project: add an entry to `projects` and a diagram case in `src/components/Diagrams.tsx`.
- Make EduMind AI's code public: add its `repo` URL back in `profile.ts`.
- MedGuard's live link was removed because the deployment returned HTTP 500. Add `live` back once it works.

## Checks

```bash
npm run lint
npm run build
```

## Deploy (Vercel)

1. Push this folder to a new GitHub repository.
2. On vercel.com, choose **Add New → Project**, import the repository and keep the default Next.js settings.
3. The canonical URL, Open Graph tags, `robots.txt` and `sitemap.xml` use Vercel's production domain.
   Set `NEXT_PUBLIC_SITE_URL` under **Environment Variables** if you need to specify a different canonical URL.
4. Deploy. Later pushes to `main` redeploy automatically.

## Structure

```
src/
  app/          layout (fonts, metadata, theme script, JSON-LD), page, robots, sitemap, globals.css (design tokens)
  components/   Nav, ThemeToggle, Hero, Waveform, Projects, Diagrams, Sections (About…Contact), Footer, motion/MotionRoot
  content/      profile.ts (all content), nav.ts
docs/RESEARCH.md, docs/ANIMATION.md
```

## Motion

Scroll and entrance animation is GSAP 3.13 (ScrollTrigger + SplitText); Lenis adds inertial scrolling on
desktop; Motion animates React-state UI (mobile menu, nav indicator, theme icon); the hero waveform runs on
`gsap.ticker` (`src/components/Waveform.tsx`) and the cursor ring is `src/components/motion/Cursor.tsx`. Scroll work is owned by
`src/components/motion/MotionRoot.tsx`. Markup opts in with data-attributes (`data-hero`, `data-section-head`,
`data-reveal`, `data-stagger`, `data-words`, `data-reel*`, `data-timeline`, `data-magnetic`, `data-tilt`…).
The shot list and engine decisions are in [docs/ANIMATION.md](docs/ANIMATION.md).

- First visit per browser session: a short intro curtain (skipped afterwards).
- Desktop (≥1024px wide and ≥680px tall): smooth scrolling, hero/contact depth transitions, pinned horizontal project reel with focus depth, parallax, scroll-linked reading, cursor ring, magnetic buttons.
- Smaller screens: reveals only, projects scroll vertically.
- Reduced motion: no animations are created; all content is static and visible.
