# Phase 1 — Verified professional profile

Sources checked on 23 Nov 2026: LinkedIn profile (signed in, read only) and the public GitHub account
`manishvarma2972-stack` (profile README, all 11 repositories, commit authorship, live URLs).

## Identity
- Name: Pericherla Manish Varma (LinkedIn slug `percherlaphanivarma`)
- LinkedIn headline: Engineering Student @ R.M.K Engineering College · Aspiring AI-Native Developer ·
  AI Agents & LLM Applications · Python · Flutter · Next.js · Supabase
- Location: Hyderabad, Telangana, India. LinkedIn "Open to work": Hyderabad, on-site / hybrid.
- Public email (from GitHub profile README): manishvarma2972@gmail.com

## Education (LinkedIn)
- R.M.K Engineering College — B.E. Computer Science, Jun 2022 – Jun 2026 (Chennai, Tamil Nadu)
- Sasi Educational Institutions — schooling (no dates listed)
- A grade (7.00) is listed; left off the site by choice — add it back in `src/content/profile.ts` if wanted.

## Not on LinkedIn (so not on the site)
No certifications, no honors/awards, no internships, no skills section entries, no About text.
The prompt's "Experience & Achievements" section is therefore built from verified project milestones
and engineering practice, not invented roles.

## Repositories — verified status
| Repo | Ownership | Status | Notes |
|---|---|---|---|
| CallMate-AI | Sole author (12/12 commits) | Phases 1–2 complete; telephony + cloud hardening upcoming | Live: callermateai.vercel.app (HTTP 200). Gemini Live, FastAPI, WebSockets, HMAC session tokens, VAD barge-in, Docker, CI, README states 58 tests |
| edumind-ai | Sole author (40 commits, PR-based workflow) | Active, early phase — **private repo** (public URL 404s), so no source link | FastAPI + async SQLAlchemy + PostgreSQL/pgvector; RAG v1 full-text, RAG v2 hybrid (local Ollama bge-m3 embeddings + Reciprocal Rank Fusion), knowledge graph with cycle rejection, educator review workflow, Next.js web. Not deployed. |
| MedGuard | Fork of `Bhuvanavenkatachandu/MedGuard`; 4 of 21 commits are Manish's | Team project | Manish's commits: registration 422 fix + name input + Render CORS, SPA `_redirects`, `DELETE /api/auth/me`, UI redesign + location improvements. Live URL med-guard-sooty.vercel.app returned HTTP 500 at check time → not labelled live. |
| MediRoutine | Private (described only in profile README) | No public code | Flutter, Drift SQLite, Riverpod, sequential dose timing, English/Telugu. Shown as private, no repo link. |
| C-Programs, python-programs, algorithms, manish | Sole author | Learning exercises | Foundations; summarised, not featured |
| gstack | Fork of another author's tool | — | Not featured |
| private-, team-learning | Practice | — | Omitted |

Not found anywhere public: **VoiceOps**, **Shape Builder** → omitted.
No repository contains screenshots → project visuals are drawn diagrams of each real architecture,
not fake app screenshots.

## Verified technologies (evidence)
- Languages: Python, TypeScript, JavaScript, C, SQL; Dart (MediRoutine, private)
- Frontend: Next.js, React, Tailwind CSS, Vite (MedGuard)
- Mobile: Flutter, Riverpod, Drift (private project)
- Backend: FastAPI, Uvicorn, Pydantic v2, WebSockets, SQLAlchemy 2 (async), Alembic
- Databases: PostgreSQL, pgvector, SQLite; Supabase / Neon (MedGuard, LinkedIn headline)
- AI: Google Gemini Live API, tool/function calling, RAG (full-text + embeddings + RRF), Ollama local embeddings, vision OCR (MedGuard team project)
- Tooling: Git & GitHub PR workflow, GitHub Actions, Pytest, Ruff, uv, Docker, Claude Code (AI-assisted dev, `.claude/` in repo)
- Deploy: Vercel, Render

# Phase 2 — Creative direction: "Signal"
A voice agent turns sound into structured action; a retrieval engine turns noise into an answer.
The site treats Manish's work as **signal from noise**: an editorial, paper-and-ink layout with a single
live waveform in the hero, and each project explained by a drawn diagram of how it actually works.

- Palette: warm paper `#F4F1EA` / ink `#16150F`, one accent — signal vermilion `#E4572E`
  (dark mode: `#121210` ground, `#F0ECE2` ink, accent `#FF6B3D`). Neutrals carry 95% of the page.
- Type: Instrument Serif (display, used sparingly, italic for emphasis) · Geist (UI/body) · Geist Mono
  (labels, metadata, index numbers).
- Layout: 12-column editorial grid, numbered sections (01–07), hairline rules instead of boxes,
  generous but measured spacing.
- Motion: one hero waveform (canvas-free SVG, paused under reduced-motion), fade/rise reveals on scroll,
  hover states that shift a hairline and an arrow. Nothing floats.
- No emoji, no fake terminals, no stats, no progress bars.
