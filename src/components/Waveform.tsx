"use client";

/**
 * Hero visual: a live waveform. Irregular "voice" on the left resolves into an even, structured
 * rhythm on the right (accent) — sound in, structured action out.
 *
 * Motion (driven by gsap.ticker, attribute writes only, paused when off-screen):
 * - each noisy bar breathes on its own phase;
 * - a signal pulse travels left → right every few seconds; when it reaches the structured
 *   side, the accent bars lift together (the "action");
 * - the pointer adds energy around its x position, and pointer/scroll speed swell the whole wave.
 * Reduced motion: renders the static shape and never starts the ticker.
 */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const BARS = 72;
const W = 1000;
const H = 140;
const GAP = W / BARS;

function noise(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

type Bar = { x: number; base: number; settle: number; phase: number; speed: number };

const bars: Bar[] = Array.from({ length: BARS }, (_, i) => {
  const t = i / (BARS - 1);
  const settle = Math.min(1, Math.max(0, (t - 0.35) / 0.4));
  const envelope = Math.sin(Math.PI * Math.min(1, t / 0.55)) * 0.85 + 0.15;
  const noisy = (0.25 + noise(i) * 0.75) * envelope;
  return {
    x: i * GAP + GAP / 2,
    base: noisy * (1 - settle) + 0.22 * settle,
    settle,
    phase: noise(i + 3) * Math.PI * 2,
    speed: 1.6 + noise(i + 7) * 2.4,
  };
});

export function Waveform() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rects = Array.from(svg.querySelectorAll<SVGRectElement>("rect[data-bar]"));

    const state = { intro: 0, energy: 0, pointerX: -1, pointerAmp: 0 };
    let visible = true;
    let lastScroll = window.scrollY;
    let lastPointer = { x: 0, y: 0, t: 0 };
    const pulseStart = performance.now() / 1000 + 1.2;

    // Intro: the wave swells up from the centre line when the hero sequence asks for it.
    const startIntro = () => gsap.to(state, { intro: 1, duration: 1.6, ease: "expo.out", overwrite: true });
    window.addEventListener("hero:wave", startIntro);
    const fallback = window.setTimeout(startIntro, 2600); // if no hero timeline runs

    const onPointer = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastPointer.x, e.clientY - lastPointer.y);
      const dt = Math.max(16, now - lastPointer.t);
      lastPointer = { x: e.clientX, y: e.clientY, t: now };
      state.energy = Math.min(1, state.energy + (dist / dt) * 0.08);
      const inside = e.clientY > r.top - 260 && e.clientY < r.bottom + 80;
      state.pointerX = ((e.clientX - r.left) / r.width) * W;
      gsap.to(state, { pointerAmp: inside ? 1 : 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
    };
    const onScroll = () => {
      const v = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      state.energy = Math.min(1, state.energy + v * 0.004);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(svg);

    const tick = (time: number) => {
      if (!visible) return;
      state.energy *= 0.94; // decay
      // pulse travels across in 2.2 s, every 5 s
      const PERIOD = 5;
      const elapsed = (time - pulseStart) % PERIOD;
      const pulsePos = elapsed >= 0 && elapsed < 2.2 ? (elapsed / 2.2) * 1.15 : -1; // 0..1.15 across width
      const actionLift = pulsePos > 0.78 ? Math.max(0, 1 - Math.abs(pulsePos - 0.95) / 0.2) : 0;

      for (let i = 0; i < BARS; i++) {
        const b = bars[i];
        const t = i / (BARS - 1);
        const breathe = 0.6 + 0.4 * Math.sin(time * b.speed + b.phase);
        const pulse = pulsePos >= 0 ? Math.exp(-((t - pulsePos) ** 2) / 0.004) : 0;
        const near = state.pointerX >= 0 ? Math.exp(-((b.x - state.pointerX) ** 2) / 9000) * state.pointerAmp : 0;
        let amp: number;
        if (b.settle >= 1) {
          // structured side: steady, lifts together when the signal arrives
          amp = b.base * (1 + actionLift * 1.6 + near * 0.8 + state.energy * 0.6);
        } else {
          const noisyAmp = b.base * breathe * (1 + state.energy * 0.9 + near * 1.1) + pulse * 0.35 * (1 - b.settle);
          amp = noisyAmp * (1 - b.settle) + b.base * b.settle * (1 + pulse * 0.6);
        }
        const h = Math.max(3, Math.min(1, amp) * H * state.intro);
        const rect = rects[i];
        rect.setAttribute("height", h.toFixed(1));
        rect.setAttribute("y", ((H - h) / 2).toFixed(1));
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      gsap.killTweensOf(state);
      io.disconnect();
      window.clearTimeout(fallback);
      window.removeEventListener("hero:wave", startIntro);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <figure className="relative" aria-label="Illustration: a noisy voice waveform resolving into an even, structured signal">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="h-24 w-full sm:h-32" preserveAspectRatio="none" aria-hidden>
        <line x1="0" x2={W} y1={H / 2} y2={H / 2} stroke="var(--rule)" strokeWidth="1" />
        {bars.map((b, i) => {
          // Rounded so server and client markup match exactly (Math.sin can differ in the last digits).
          const h = Math.round(Math.max(4, b.base * H) * 10) / 10;
          return (
            <rect
              key={i}
              data-bar
              x={Math.round((b.x - 2) * 10) / 10}
              y={Math.round(((H - h) / 2) * 10) / 10}
              width="4"
              height={h}
              rx="2"
              fill={b.settle >= 1 ? "var(--accent)" : "var(--ink)"}
              opacity={b.settle >= 1 ? 1 : 0.85}
            />
          );
        })}
      </svg>
      <figcaption className="mt-3 flex justify-between eyebrow">
        <span>Voice · noise · questions</span>
        <span className="text-accent">Structured action</span>
      </figcaption>
    </figure>
  );
}
