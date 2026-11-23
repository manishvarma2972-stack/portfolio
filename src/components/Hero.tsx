import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { Waveform } from "./Waveform";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";

/** Hero. Entrance choreography lives in motion/MotionRoot.tsx (heroIntro). */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-clip pt-28 sm:pt-32"
      aria-labelledby="hero-title"
    >
      {/* Atmosphere */}
      <div aria-hidden className="absolute inset-0 -z-10" data-hero="glow">
        <div className="hero-grid">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} data-grid-line style={{ left: `${(n / 6) * 100}%` }} />
          ))}
        </div>
        <div className="absolute inset-0" data-glow-follow>
          <div className="hero-glow hero-glow--a" />
        </div>
        <div className="hero-glow hero-glow--b" />
      </div>

      <div className="flex flex-1 flex-col justify-between" data-hero-inner>
      <div className="container-x" data-parallax="0.12">
        <p className="eyebrow flex items-center gap-3" data-hero="eyebrow">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {profile.role} · {profile.location}
        </p>

        <h1
          id="hero-title"
          className="hero-name mt-8 font-serif leading-[0.92] tracking-[-0.02em]"
          data-hero="name"
        >
          {/* No <br>: on phones the name wraps naturally after "Pericherla" because the
              second half is kept together; from 640px up the whole name stays on one line. */}
          Pericherla{" "}
          <span className="whitespace-nowrap">
            Manish <em className="hero-name__italic text-accent">Varma</em>
          </span>
        </h1>

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-8">
          <p
            className="max-w-[34ch] text-xl leading-snug text-ink sm:text-2xl md:col-span-7"
            data-hero="statement"
          >
            I don&rsquo;t just learn technologies &mdash; I use them to build products. A voice agent that answers calls in
            English and Telugu. A science search engine that only answers from reviewed sources.
          </p>
          <div className="flex flex-col justify-end gap-6 md:col-span-5 md:items-end" data-hero="cta">
            <div className="flex flex-wrap gap-3">
              <a
                href="#work"
                data-magnetic="0.3"
                className="btn-fill btn-fill--solid group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper"
              >
                View projects
                <ArrowDownRight size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
              <a
                href="#contact"
                data-magnetic="0.3"
                className="btn-fill btn-fill--ghost group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium transition-colors duration-300 hover:border-ink"
              >
                Contact me
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
            <div className="flex items-center gap-5 text-sm text-ink-2">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-ink">
                <GitHubIcon className="h-4 w-4" /> GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-ink">
                <LinkedInIcon className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x pb-10 pt-16 sm:pb-12" data-hero="wave">
        <Waveform />
      </div>
      </div>
    </section>
  );
}
