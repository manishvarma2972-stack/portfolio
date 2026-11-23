import type { ReactNode } from "react";

type HeadProps = { id: string; index: string; label: string; title: ReactNode; intro?: ReactNode };

/** Numbered editorial header: hairline rule (draws in), mono index, serif title (line reveal). */
export function SectionHead({ id, index, label, title, intro }: HeadProps) {
  return (
    <div className="relative grid gap-y-6 pt-6 md:grid-cols-12 md:gap-x-8" data-section-head>
      <span aria-hidden data-rule className="absolute inset-x-0 top-0 h-px bg-rule" />
      <p className="eyebrow md:col-span-3" data-eyebrow>
        <span className="text-accent">{index}</span>
        <span className="mx-2">/</span>
        {label}
      </p>
      <div className="md:col-span-9">
        <h2
          id={`${id}-title`}
          className="max-w-[20ch] text-balance font-serif text-[2.5rem] leading-[1.02] tracking-[-0.01em] sm:text-6xl lg:text-7xl"
        >
          {title}
        </h2>
        {intro && (
          <div className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-2" data-intro>
            {intro}
          </div>
        )}
      </div>
    </div>
  );
}

type Props = HeadProps & { children: ReactNode; className?: string };

export function Section({ id, index, label, title, intro, children, className = "" }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative z-10 bg-paper py-16 sm:py-28 ${className}`}>
      <div className="container-x">
        <SectionHead id={id} index={index} label={label} title={title} intro={intro} />
        <div className="mt-16 sm:mt-20">{children}</div>
      </div>
    </section>
  );
}
