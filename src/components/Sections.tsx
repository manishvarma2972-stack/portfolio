import { ArrowUpRight, BrainCircuit, Code2, Database, LayoutTemplate, Mail, Server, Wrench, type LucideIcon } from "lucide-react";
import { education, exploring, milestones, profile, skills } from "@/content/profile";
import { Section } from "./Section";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";

export function About() {
  return (
    <Section
      id="about"
      className="sheet"
      index="01"
      label="About"
      title={
        <>
          From pseudocode on paper to <em>agents that talk back</em>.
        </>
      }
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="space-y-6 text-lg leading-relaxed text-ink md:col-span-6 md:col-start-4 lg:text-xl lg:leading-relaxed">
          <p data-words data-reveal>
            I&rsquo;m a Computer Science engineering student at R.M.K Engineering College, based in Hyderabad. I started
            where most people do &mdash; C programs, Python exercises, and writing each algorithm out step by step as
            pseudocode before touching a keyboard. That habit stuck: I still think in steps before I build.
          </p>
          <p data-words data-reveal>
            What changed is what I build. I now use AI two ways &mdash; inside my products, and in how I make them. My
            projects put Gemini Live, retrieval and tool calling to work on concrete problems, and I develop with AI
            coding tools at my side, while keeping the engineering honest: tests, CI, typed APIs and secrets that never
            touch Git.
          </p>
          <p data-words data-reveal>
            I like problems close to home. Two of my projects speak Telugu as well as English, because the people
            I&rsquo;d build for first &mdash; a parent managing medicines, a caller who isn&rsquo;t comfortable in English
            &mdash; deserve software in their language.
          </p>
        </div>
        <aside className="md:col-span-3" data-parallax="0.08">
          <dl className="divide-y divide-rule border-y border-rule text-sm" data-stagger>
            {[
              ["Studying", "B.E. Computer Science"],
              ["Based in", "Hyderabad, India"],
              ["Building", "Voice agents · RAG · full-stack"],
              ["Open to", "Roles in Hyderabad, on-site or hybrid"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 py-4">
                <dt className="eyebrow">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <ol className="mt-20 grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-3" data-stagger>
        {[
          ["Ship in phases", "Every project is split into phases, and the README says plainly which are done and which are next."],
          ["Prove it with tests", "Pytest suites, linting and CI on pull requests, so the code can be checked, not just trusted."],
          ["Ground the AI", "AI acts through narrow tools and reviewed sources, never as an unchecked source of truth."],
        ].map(([t, d], i) => (
          <li key={t} className="group relative bg-paper p-6 transition-colors duration-500 hover:bg-card sm:p-8">
            <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
            <span className="font-mono text-xs text-accent">0{i + 1}</span>
            <h3 className="mt-4 font-serif text-2xl">{t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">{d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const skillIcons: Record<string, LucideIcon> = {
  Languages: Code2,
  "Frontend & mobile": LayoutTemplate,
  Backend: Server,
  Data: Database,
  AI: BrainCircuit,
  "Tools & delivery": Wrench,
};

export function Skills() {
  return (
    <Section
      id="skills"
      index="03"
      label="Skills"
      title={
        <>
          Tools I&rsquo;ve <em>actually shipped</em> with.
        </>
      }
      intro="No percentages. Each technology is listed next to the project where I used it — so it can be checked."
    >
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => {
          const Icon = skillIcons[group.label] ?? Code2;
          return (
            <div key={group.label} data-skill-group>
              <h3 className="relative flex items-center gap-3 pb-3">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-rule text-accent"
                  data-skill-icon
                  aria-hidden
                >
                  <Icon size={17} strokeWidth={1.5} />
                </span>
                <span className="font-serif text-2xl" data-skill-title>{group.label}</span>
                <span className="ml-auto font-mono text-xs text-ink-3">{String(group.items.length).padStart(2, "0")}</span>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-ink" data-skill-rule />
              </h3>
              <ul>
                {group.items.map((s) => (
                  <li
                    key={s.name}
                    className="group/skill relative flex items-baseline justify-between gap-4 border-b border-rule py-3"
                  >
                    <span aria-hidden className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover/skill:scale-x-100" />
                    <span className="flex items-baseline gap-2 font-medium transition-transform duration-300 ease-out group-hover/skill:translate-x-1.5">
                      <span aria-hidden className="h-1 w-1 translate-y-[-0.2em] rounded-full bg-accent opacity-0 transition-opacity duration-300 group-hover/skill:opacity-100" />
                      {s.name}
                    </span>
                    <span className="text-right font-mono text-[0.7rem] leading-snug text-ink-3 transition-colors duration-300 group-hover/skill:text-ink-2">
                      {s.where}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Timeline({ items }: { items: { key: string; date: string; title: string; detail: string }[] }) {
  return (
    <ol className="relative" data-timeline>
      <span aria-hidden className="absolute bottom-0 left-[5px] top-0 w-px bg-rule md:left-[calc(25%-1px)]" />
      <span aria-hidden className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-accent md:left-[calc(25%-1px)]" data-timeline-line />
      {items.map((m) => (
        <li key={m.key} className="relative grid gap-3 py-8 pl-10 md:grid-cols-12 md:gap-8 md:pl-0" data-milestone>
          <span
            aria-hidden
            data-dot
            className="absolute left-0 top-[2.35rem] h-[11px] w-[11px] rounded-full border border-ink-3 bg-paper md:left-[calc(25%-6px)]"
          />
          <p className="font-mono text-sm text-ink-3 md:col-span-3 md:pr-8 md:text-right" data-m>
            {m.date}
          </p>
          <h3 className="font-serif text-2xl leading-tight sm:text-3xl md:col-span-4 md:pl-8" data-m>
            {m.title}
          </h3>
          <p className="leading-relaxed text-ink-2 md:col-span-5" data-m>
            {m.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function Journey() {
  return (
    <Section
      id="journey"
      index="04"
      label="Journey"
      title={
        <>
          What I&rsquo;ve built <em>so far</em>.
        </>
      }
      intro="Milestones taken from my commit history. I'm at the start of my career, so this is a record of projects rather than job titles."
    >
      <Timeline items={milestones.map((m) => ({ key: m.title, ...m }))} />
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" index="05" label="Education" title="Education">
      <Timeline
        items={education.map((e) => ({
          key: e.school,
          date: e.period || "Schooling",
          title: e.school,
          detail: [e.degree, e.place].filter(Boolean).join(" · "),
        }))}
      />
    </Section>
  );
}

export function Exploring() {
  return (
    <Section
      id="exploring"
      index="06"
      label="Currently exploring"
      title={
        <>
          What I&rsquo;m <em>learning next</em>.
        </>
      }
    >
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
        {exploring.map((x) => (
          <li key={x.title} className="group relative pt-5">
            <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-ink" />
            <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
            <h3 className="text-lg font-medium">{x.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{x.detail}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Contact() {
  const links = [
    { href: profile.linkedin, label: "LinkedIn", sub: "/in/percherlaphanivarma", Icon: LinkedInIcon },
    { href: profile.github, label: "GitHub", sub: `@${profile.githubHandle}`, Icon: GitHubIcon },
  ];
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="sheet relative isolate z-10 mt-8 overflow-clip bg-inv py-24 text-inv-fg sm:mt-16 sm:py-36"
    >
      <div aria-hidden className="hero-glow hero-glow--b !-bottom-40 !left-auto !right-[-10rem] -z-10" />
      <div className="container-x">
        <p className="eyebrow !text-inv-fg/60" data-reveal>
          <span className="text-inv-accent">07</span>
          <span className="mx-2">/</span>Contact
        </p>
        <h2
          id="contact-title"
          className="mt-8 max-w-[16ch] text-balance font-serif text-[3.25rem] leading-[0.95] sm:text-8xl lg:text-[9.5rem]"
          data-contact-title
        >
          Have a problem worth <em className="text-inv-accent">building for</em>?
        </h2>
        <p className="mt-10 max-w-[46ch] text-lg leading-relaxed text-inv-fg/70" data-reveal>
          {profile.openTo}
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="group mt-14 flex flex-wrap items-center justify-between gap-6 border-y border-inv-fg/20 py-8 transition-colors duration-500 hover:border-inv-accent"
          data-reveal
        >
          <span className="flex min-w-0 items-center gap-4">
            <Mail size={22} strokeWidth={1.5} className="shrink-0 text-inv-accent" aria-hidden />
            <span className="break-all font-serif text-2xl transition-transform duration-500 ease-out group-hover:translate-x-2 sm:text-4xl">
              {profile.email}
            </span>
          </span>
          <span
            data-magnetic="0.4"
            className="btn-fill btn-fill--contact inline-flex items-center gap-2 rounded-full bg-inv-accent px-7 py-3.5 text-sm font-medium text-inv"
          >
            Send an email
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </a>

        <ul className="grid sm:grid-cols-2" data-stagger>
          {links.map(({ href, label, sub, Icon }) => (
            <li key={label} className="border-b border-inv-fg/20 sm:odd:border-r sm:odd:pr-8 sm:even:pl-8">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-6"
                aria-label={`${label} (opens in a new tab)`}
              >
                <span className="flex items-center gap-4">
                  <Icon className="h-5 w-5 text-inv-fg/70 transition-colors group-hover:text-inv-accent" />
                  <span>
                    <span className="block text-lg">{label}</span>
                    <span className="block font-mono text-xs text-inv-fg/65">{sub}</span>
                  </span>
                </span>
                <span
                  data-magnetic="0.5"
                  className="grid h-11 w-11 place-items-center rounded-full border border-inv-fg/20 transition-colors duration-300 group-hover:border-inv-accent group-hover:bg-inv-accent group-hover:text-inv"
                >
                  <ArrowUpRight size={18} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
