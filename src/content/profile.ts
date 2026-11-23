/**
 * Every fact on the site lives here. Sources: LinkedIn profile and public GitHub
 * (see docs/RESEARCH.md). Edit this file to update the site — components only render it.
 */

export const profile = {
  name: "Pericherla Manish Varma",
  shortName: "Manish Varma",
  role: "Aspiring AI-Native Developer",
  location: "Hyderabad, India",
  email: "manishvarma2972@gmail.com",
  github: "https://github.com/manishvarma2972-stack",
  githubHandle: "manishvarma2972-stack",
  linkedin: "https://www.linkedin.com/in/percherlaphanivarma/",
  /** Allow an explicit canonical URL, then use the production domain assigned by Vercel. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  openTo: "Software engineering, applied AI and full-stack roles — Hyderabad, on-site or hybrid.",
};

export type ProjectStatus = "Live" | "In active development" | "Team project" | "Private";

export type Project = {
  id: "callmate" | "edumind" | "medguard" | "mediroutine";
  index: string;
  name: string;
  tagline: string;
  status: ProjectStatus[];
  problem: string;
  solution: string;
  features: string[];
  stack: string[];
  contribution: string;
  repo?: string;
  live?: string;
  note?: string;
};

export const projects: Project[] = [
  {
    id: "callmate",
    index: "01",
    name: "CallMate AI",
    tagline: "A bilingual voice receptionist that answers, listens and takes the message.",
    status: ["Live"],
    problem:
      "Voicemail and phone menus are rigid. They can't hold a conversation, screen a caller or capture what someone actually needs — least of all in the caller's own language.",
    solution:
      "A real-time voice agent that talks with callers in English and Telugu over Gemini Live, streams audio both ways through a WebSocket bridge, and calls a tool to record a structured message for the owner.",
    features: [
      "Transport-agnostic audio bridge: 16 kHz PCM in, 24 kHz PCM out, framed in 20 ms chunks",
      "Barge-in: when the caller speaks, queued speech is flushed immediately",
      "Single-use HMAC-SHA256 session tokens with expiry and replay protection",
      "take_message function call with atomic, permission-restricted file writes",
      "Hardened non-root Docker image, CI on GitHub Actions, Pytest suite",
    ],
    stack: ["Python 3.12", "FastAPI", "WebSockets", "Gemini Live API", "Pydantic v2", "Docker", "Pytest"],
    contribution:
      "Sole developer — architecture, voice engine, session security, tests, UI and deployment.",
    repo: "https://github.com/manishvarma2972-stack/CallMate-AI",
    live: "https://callermateai.vercel.app",
    note: "Phases 1–2 complete. Telephony integration (call forwarding / SIP) is the next phase.",
  },
  {
    id: "edumind",
    index: "02",
    name: "EduMind AI",
    tagline: "Science learning for Grades 6–10, built on reviewed, cited content first.",
    status: ["In active development", "Private"],
    problem:
      "AI tutors for school children can confidently state things that are wrong. For learners in Grades 6–10, an unreviewed answer is worse than no answer.",
    solution:
      "A curriculum-grounded platform where search only ever returns explanations an educator has approved and cited — combining keyword and semantic retrieval before any generation is added.",
    features: [
      "NCERT/CBSE curriculum registry with versioning, chapters, topics and concepts",
      "Knowledge graph of concept prerequisites that rejects cycles on approval",
      "Educator review workflow and review interface; unapproved content never surfaces",
      "RAG v1 PostgreSQL full-text search, RAG v2 hybrid search with pgvector",
      "Local embeddings via Ollama (bge-m3), merged with Reciprocal Rank Fusion",
    ],
    stack: ["FastAPI", "SQLAlchemy 2 (async)", "PostgreSQL", "pgvector", "Alembic", "Ollama", "Next.js", "TypeScript"],
    contribution:
      "Sole developer — schema, retrieval, review workflow and web app, shipped through pull requests with CI. The repository is private for now.",
    note: "Early phase: no AI tutor yet, not deployed, not yet for use with children.",
  },
  {
    id: "medguard",
    index: "03",
    name: "MedGuard AI",
    tagline: "A pharmacy operating system that dispenses the earliest-expiring batch first.",
    status: ["Team project"],
    problem:
      "Retail pharmacies lose stock to expiry, re-type medicine details by hand, and patients can't tell which nearby pharmacy actually has a medicine in stock.",
    solution:
      "A full-stack pharmacy system with FEFO (first-expired, first-out) batch dispensing, transactional checkout, AI-assisted packaging scans and a public, login-free medicine search ranked by distance.",
    features: [
      "FEFO batch recommendation; expired stock can't be dispensed",
      "ACID checkout that prevents overselling across concurrent sales",
      "Vision OCR endpoint that reads packaging and expiry server-side",
      "Public nearest-pharmacy search using Haversine distance",
      "PDF tax invoices, email delivery and an immutable stock-movement ledger",
    ],
    stack: ["React 18", "Vite", "Tailwind CSS", "FastAPI", "PostgreSQL / Neon", "SQLAlchemy", "Alembic"],
    contribution:
      "Built with a teammate. My work: fixing registration validation and CORS for deployment, SPA routing on Render, an authenticated account-deletion endpoint, and the UI redesign with location improvements.",
    repo: "https://github.com/manishvarma2972-stack/MedGuard",
    note: "The team's deployment was returning an error when this site was built, so no live link is shown.",
  },
  {
    id: "mediroutine",
    index: "04",
    name: "MediRoutine",
    tagline: "Medicine reminders that wait for the last dose before timing the next.",
    status: ["Private"],
    problem:
      "Reminder apps fire at fixed clock times. Regimens like “Dose B 30 minutes after Dose A” break the moment Dose A is taken late.",
    solution:
      "An offline-first Flutter app whose schedule is driven by confirmation: each dose is timed from when the previous one was actually taken.",
    features: [
      "Confirmation-driven sequential timing engine",
      "Drift (SQLite) persistence that survives device reboots",
      "Exact alarms on Android with guidance for aggressive battery savers",
      "English and Telugu localisation with scalable type",
    ],
    stack: ["Flutter", "Dart", "Drift SQLite", "Riverpod", "Android"],
    contribution: "Sole developer. The code is in a private repository.",
  },
];

export type SkillGroup = { label: string; items: { name: string; where: string }[] };

/** Every item names where it is actually used, so nothing is listed for show. */
export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "Python", where: "CallMate AI, EduMind AI, MedGuard" },
      { name: "TypeScript", where: "EduMind AI web" },
      { name: "JavaScript", where: "MedGuard, CallMate AI UI" },
      { name: "SQL", where: "PostgreSQL schemas & queries" },
      { name: "C", where: "C programming foundations" },
      { name: "Dart", where: "MediRoutine" },
    ],
  },
  {
    label: "Frontend & mobile",
    items: [
      { name: "Next.js", where: "EduMind AI" },
      { name: "React", where: "MedGuard, EduMind AI" },
      { name: "Tailwind CSS", where: "MedGuard" },
      { name: "Flutter", where: "MediRoutine" },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "FastAPI", where: "All three web projects" },
      { name: "WebSockets", where: "CallMate AI audio streaming" },
      { name: "Pydantic v2", where: "CallMate AI, MedGuard" },
      { name: "SQLAlchemy 2", where: "EduMind AI (async), MedGuard" },
      { name: "Alembic", where: "Database migrations" },
    ],
  },
  {
    label: "Data",
    items: [
      { name: "PostgreSQL", where: "EduMind AI, MedGuard" },
      { name: "pgvector", where: "EduMind AI semantic search" },
      { name: "SQLite / Drift", where: "MediRoutine" },
      { name: "Supabase / Neon", where: "MedGuard" },
    ],
  },
  {
    label: "AI",
    items: [
      { name: "Gemini Live API", where: "CallMate AI real-time voice" },
      { name: "Tool calling", where: "CallMate AI take_message" },
      { name: "RAG", where: "EduMind AI hybrid retrieval" },
      { name: "Embeddings · Ollama", where: "EduMind AI, local bge-m3" },
    ],
  },
  {
    label: "Tools & delivery",
    items: [
      { name: "Git & pull requests", where: "Feature-branch workflow" },
      { name: "GitHub Actions", where: "CI for CallMate AI, EduMind AI" },
      { name: "Pytest · Ruff · uv", where: "Python testing & linting" },
      { name: "Docker", where: "CallMate AI container" },
      { name: "Vercel · Render", where: "Deployments" },
      { name: "Claude Code", where: "AI-assisted development" },
    ],
  },
];

export type Milestone = { date: string; title: string; detail: string };

/** Verified from commit history and LinkedIn. No internships or certifications are listed there. */
export const milestones: Milestone[] = [
  {
    date: "Nov 2026",
    title: "EduMind AI — hybrid retrieval and educator review",
    detail:
      "Shipped RAG v2 (keyword + semantic search fused with RRF), a prerequisite knowledge graph and an educator review interface, each through its own pull request with CI.",
  },
  {
    date: "Nov 2026",
    title: "CallMate AI — real-time voice engine",
    detail:
      "Took a voice receptionist from backend foundation to a deployed bilingual Gemini Live engine with session security and an automated test suite.",
  },
  {
    date: "Nov 2026",
    title: "MedGuard AI — deployment and auth work on a team project",
    detail:
      "Fixed registration and CORS failures blocking cloud deployment, added account deletion and redesigned the interface.",
  },
  {
    date: "2022 — 2026",
    title: "Foundations in C, Python and algorithms",
    detail:
      "Worked through control flow, number theory and series problems in C and Python, and wrote the algorithms as step-by-step pseudocode first.",
  },
];

export const education = [
  {
    school: "R.M.K Engineering College",
    degree: "Bachelor of Engineering, Computer Science",
    period: "2022 — 2026",
    place: "Chennai, Tamil Nadu",
  },
  {
    school: "Sasi Educational Institutions",
    degree: "Schooling",
    period: "",
    place: "",
  },
];

export const exploring = [
  {
    title: "AI agents & tool calling",
    detail: "Letting a model act — CallMate AI's take_message tool is the first step; calendar and alerts are next.",
  },
  {
    title: "Retrieval-augmented generation",
    detail: "Grounding answers in reviewed sources: hybrid search, embeddings and rank fusion in EduMind AI.",
  },
  {
    title: "Real-time voice",
    detail: "Streaming audio, interruption handling and bringing CallMate AI onto real phone lines.",
  },
  {
    title: "C++",
    detail: "Going deeper on systems fundamentals alongside the Python and TypeScript work.",
  },
];
