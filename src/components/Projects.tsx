import { ArrowUpRight, Lock } from "lucide-react";
import { projects, type Project, type ProjectStatus } from "@/content/profile";
import { SectionHead } from "./Section";
import { ProjectDiagram } from "./Diagrams";
import { GitHubIcon } from "./BrandIcons";

function StatusTag({ status }: { status: ProjectStatus }) {
  const live = status === "Live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.06em] ${
        live ? "border-accent/40 text-accent" : "border-rule text-ink-2"
      }`}
    >
      {live && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
      {status === "Private" && <Lock size={10} aria-hidden />}
      {status}
    </span>
  );
}

function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
      {p.live && (
        <a
          href={p.live}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-medium text-ink"
          aria-label={`${p.name} live demo (opens in a new tab)`}
        >
          <span className="link-underline">Live demo</span>
          <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      )}
      {p.repo && (
        <a
          href={p.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-medium text-ink"
          aria-label={`${p.name} source code on GitHub (opens in a new tab)`}
        >
          <GitHubIcon className="h-3.5 w-3.5" />
          <span className="link-underline">Source</span>
          <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      )}
      {!p.repo && <span className="text-ink-3">Code is private</span>}
    </div>
  );
}

function ReelPanel({ p }: { p: Project }) {
  return (
    <article
      className="reel-panel border-t border-rule py-14 first:border-t-0 first:pt-0 lg:border-t-0 lg:py-0"
      aria-labelledby={`p-${p.id}`}
      data-reel-panel
    >
      <div className="container-x grid items-center gap-10 lg:max-w-none lg:grid-cols-12 lg:gap-12 lg:px-0">
        <div className="flex flex-col lg:col-span-5" data-panel-text>
          <p className="eyebrow">
            <span className="text-accent">{p.index}</span> <span className="mx-1">/</span> 04
          </p>
          <h3 id={`p-${p.id}`} className="mt-3 font-serif text-5xl leading-none tracking-[-0.01em] sm:text-6xl xl:text-7xl">
            {p.name}
          </h3>
          <p className="mt-5 max-w-[34ch] text-lg leading-snug text-ink-2">{p.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.status.map((s) => (
              <StatusTag key={s} status={s} />
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-1.5" data-tags aria-label={`${p.name} technology stack`}>
            {p.stack.map((s) => (
              <li
                key={s}
                className="rounded-md border border-rule bg-paper-2 px-2 py-1 font-mono text-xs text-ink-2 transition-colors duration-300 hover:border-accent/50 hover:text-ink"
              >
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ProjectLinks p={p} />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div
            className="overflow-hidden rounded-[14px] border border-rule bg-card will-change-transform"
            data-clip
            data-tilt
            data-cursor="Explore"
          >
            <div className="aspect-[420/270] w-full p-4 sm:p-6" data-clip-inner>
              <ProjectDiagram id={p.id} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CaseNotes({ p }: { p: Project }) {
  return (
    <article className="grid gap-8 border-t border-rule py-12 lg:grid-cols-12 lg:gap-12" aria-labelledby={`n-${p.id}`} data-stagger>
      <div className="lg:col-span-3">
        <p className="font-mono text-xs text-accent">{p.index}</p>
        <h3 id={`n-${p.id}`} className="mt-2 font-serif text-3xl">{p.name}</h3>
        {p.note && <p className="mt-4 border-l-2 border-accent/60 pl-4 text-sm leading-relaxed text-ink-3">{p.note}</p>}
      </div>
      <div className="lg:col-span-4">
        <h4 className="eyebrow">Problem</h4>
        <p className="mt-3 leading-relaxed text-ink-2">{p.problem}</p>
        <h4 className="eyebrow mt-8">Solution</h4>
        <p className="mt-3 leading-relaxed text-ink-2">{p.solution}</p>
      </div>
      <div className="lg:col-span-5">
        <h4 className="eyebrow">Key features</h4>
        <ul className="mt-3 space-y-2.5">
          {p.features.map((f) => (
            <li key={f} className="flex gap-3 leading-relaxed text-ink-2">
              <span className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
        <h4 className="eyebrow mt-8">My role</h4>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">{p.contribution}</p>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative z-10 bg-paper py-16 sm:py-28">
      <div className="container-x">
        <SectionHead
          id="work"
          index="02"
          label="Selected work"
          title={
            <>
              Four products, each built to solve <em>one real problem</em>.
            </>
          }
          intro="Picked from my GitHub by depth, not count. Each diagram shows how the project actually works — and each one says plainly whether it is live, in progress, shared or private."
        />
      </div>

      {/* Desktop: pinned horizontal reel. Mobile/tablet/reduced motion: a vertical list. */}
      <div className="reel mt-16 overflow-clip sm:mt-20" data-reel>
        <div className="reel-hud container-x hidden items-center gap-6 pb-10">
          <span className="eyebrow">Scroll to explore</span>
          <span className="relative h-px flex-1 bg-rule">
            <span className="absolute inset-0 origin-left scale-x-0 bg-accent" data-reel-progress />
          </span>
          <span className="eyebrow">04 projects</span>
        </div>
        <div className="reel-track" data-reel-track>
          {projects.map((p) => (
            <ReelPanel key={p.id} p={p} />
          ))}
        </div>
      </div>

      <div className="container-x mt-20 sm:mt-28">
        <h3 className="eyebrow mb-2" data-reveal>Case notes</h3>
        {projects.map((p) => (
          <CaseNotes key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
