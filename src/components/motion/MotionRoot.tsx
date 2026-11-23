"use client";

/**
 * The single owner of every scroll/entrance animation on the page (see docs/ANIMATION.md).
 * Markup opts in with data-attributes; this component wires them to GSAP inside one
 * gsap.matchMedia() so a single revert() tears down every tween, ScrollTrigger, SplitText
 * and listener. With prefers-reduced-motion nothing is created and content stays static.
 */
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = "expo.out";
const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/** Masked line reveal; re-splits itself on resize. */
function linesReveal(el: HTMLElement, trigger?: ScrollTrigger.Vars, delay = 0) {
  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.1,
        ease: EASE,
        stagger: 0.08,
        delay,
        scrollTrigger: trigger,
      }),
  });
}

/** Motion language (docs/ANIMATION.md): reveal / wipe / settle / touch. */
const WIPE = "expo.inOut";

/**
 * Hero entrance. With a curtain (first visit this session): a flat accent line draws across the
 * screen, one pulse travels along it, then the curtain splits open onto the hero.
 */
function heroIntro() {
  const root = document.documentElement;
  const name = document.querySelector<HTMLElement>("[data-hero='name']");
  const statement = document.querySelector<HTMLElement>("[data-hero='statement']");
  const curtain = document.querySelector<HTMLElement>("[data-curtain]");
  const withCurtain = !!curtain && root.classList.contains("intro");
  const tl = gsap.timeline({ defaults: { ease: EASE } });

  gsap.set("[data-hero]", { autoAlpha: 1 });
  root.classList.add("motion-started");

  let t = 0;
  if (withCurtain && curtain) {
    tl.fromTo("[data-curtain-line]", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: WIPE }, 0.1)
      .fromTo("[data-curtain-pulse]", { left: "0%", autoAlpha: 0 }, { left: "100%", autoAlpha: 1, duration: 0.7, ease: "power2.inOut" }, 0.55)
      .to("[data-curtain-line]", { scaleX: 0, transformOrigin: "100% 50%", duration: 0.5, ease: "power3.in" }, 1.05)
      .to("[data-curtain-half='top']", { yPercent: -100, duration: 1.1, ease: WIPE }, 1.25)
      .to("[data-curtain-half='bottom']", { yPercent: 100, duration: 1.1, ease: WIPE }, 1.25)
      .set(curtain, { display: "none" })
      .call(() => root.classList.remove("intro"));
    t = 1.55;
  } else if (curtain) {
    gsap.set(curtain, { display: "none" });
  }

  // Atmosphere: glow fades up, grid lines draw down one after another.
  tl.from("[data-hero='glow']", { autoAlpha: 0, duration: 2.6, ease: "power2.out" }, t - 0.2)
    .from("[data-grid-line]", { scaleY: 0, transformOrigin: "50% 0%", duration: 1.6, ease: WIPE, stagger: 0.08 }, t);

  tl.from("[data-hero='eyebrow']", { y: 14, autoAlpha: 0, duration: 1 }, t + 0.15);

  if (name) {
    // Lines are masked (never single chars) so the italic V is never clipped; text is restored
    // afterwards so native kerning returns. Chars rise with a slight forward tilt; *Varma* arrives
    // last, sweeping in from the right.
    const split = SplitText.create(name, { type: "lines,words,chars", mask: "lines", linesClass: "hero-name__line" });
    const italic = new Set(name.querySelectorAll("em *"));
    const plain = split.chars.filter((c) => !italic.has(c));
    const accent = split.chars.filter((c) => italic.has(c));
    gsap.set(name, { perspective: 900 });
    tl.from(plain, { yPercent: 118, rotateX: -55, transformOrigin: "50% 100%", duration: 1.35, stagger: 0.028 }, t + 0.2)
      .from(accent, { yPercent: 118, xPercent: 40, rotate: 6, duration: 1.4, stagger: 0.045, ease: "expo.out" }, t + 0.62)
      .call(() => split.revert(), undefined, t + 2.2);
  }
  if (statement) {
    const split = SplitText.create(statement, { type: "lines", mask: "lines" });
    tl.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.08 }, t + 0.85);
  }
  tl.from("[data-hero='cta'] > div:first-child > a, [data-hero='cta'] > div:last-child", { y: 22, autoAlpha: 0, duration: 1, stagger: 0.07 }, t + 1.05)
    .call(() => {
      window.dispatchEvent(new Event("hero:wave"));
    }, undefined, t + 1.0)
    .from("[data-hero='wave'] figcaption > *", { y: 10, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, t + 1.5);

  return tl;
}

/** The main glow lazily follows the cursor (wrapper element, so the CSS drift keeps running). */
function heroAtmosphere() {
  const follower = document.querySelector<HTMLElement>("[data-glow-follow]");
  const hero = document.getElementById("top");
  if (!follower || !hero) return;
  const x = gsap.quickTo(follower, "x", { duration: 2.2, ease: "power3.out" });
  const y = gsap.quickTo(follower, "y", { duration: 2.2, ease: "power3.out" });
  const move = (e: PointerEvent) => {
    const r = hero.getBoundingClientRect();
    x((e.clientX / r.width - 0.5) * 260);
    y(((e.clientY - r.top) / r.height - 0.5) * 180);
  };
  window.addEventListener("pointermove", move, { passive: true });
  return () => window.removeEventListener("pointermove", move);
}

/**
 * Depth between sections: the hero holds while About slides over it and the hero recedes
 * (camera pulling back); the section before Contact recedes as Contact rises over it.
 */
function depth(desktop: boolean) {
  const hero = document.getElementById("top");
  const heroInner = document.querySelector<HTMLElement>("[data-hero-inner]");
  if (hero && heroInner) {
    const fits = hero.offsetHeight <= window.innerHeight + 2;
    if (desktop && fits) {
      ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom top", pin: true, pinSpacing: false });
    }
    gsap.to(heroInner, {
      scale: desktop ? 0.9 : 0.96,
      autoAlpha: 0.15,
      yPercent: desktop ? 4 : -6,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
    });
    const nameEl = document.querySelector("[data-hero='name']");
    if (desktop && nameEl)
      gsap.to(nameEl, { letterSpacing: "0.02em", ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } });
  }

  const contact = document.getElementById("contact");
  const before = contact?.previousElementSibling as HTMLElement | null;
  const beforeInner = before?.querySelector<HTMLElement>(":scope > .container-x");
  if (contact && beforeInner)
    gsap.to(beforeInner, {
      scale: 0.94,
      autoAlpha: 0.2,
      transformOrigin: "50% 100%",
      ease: "none",
      scrollTrigger: { trigger: contact, start: "top bottom", end: "top 15%", scrub: 0.6 },
    });
}

/** Diagram draws itself: nodes pop in sequence, connector paths draw along their length. */
function drawDiagram(svg: SVGSVGElement | null, tl: gsap.core.Timeline, at: number) {
  if (!svg) return;
  const nodes = svg.querySelectorAll(":scope > g, :scope > circle");
  const labels = svg.querySelectorAll(":scope > text");
  const paths = Array.from(svg.querySelectorAll<SVGPathElement | SVGLineElement>(":scope > path:not(.flow), :scope > line"));
  const flows = svg.querySelectorAll(".flow");
  paths.forEach((p) => {
    const len = "getTotalLength" in p ? p.getTotalLength() : 400;
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
  });
  tl.from(nodes, { scale: 0.7, autoAlpha: 0, transformOrigin: "50% 50%", svgOrigin: undefined, duration: 0.8, stagger: 0.09, ease: "back.out(1.6)" }, at)
    .to(paths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.06, ease: "power2.inOut" }, at + 0.25)
    .from(flows, { autoAlpha: 0, duration: 0.6, stagger: 0.04 }, at + 0.8)
    .from(labels, { autoAlpha: 0, y: 6, duration: 0.6, stagger: 0.05 }, at + 0.7);
}

function sectionHeads() {
  q("[data-section-head]").forEach((head) => {
    const st = { trigger: head, start: "top 82%" };
    const rule = head.querySelector("[data-rule]");
    if (rule) gsap.from(rule, { scaleX: 0, transformOrigin: "0 50%", duration: 1.4, ease: "expo.inOut", scrollTrigger: st });
    gsap.from(head.querySelectorAll("[data-eyebrow]"), { autoAlpha: 0, x: -12, duration: 0.9, ease: EASE, delay: 0.2, scrollTrigger: st });
    const title = head.querySelector<HTMLElement>("h2");
    if (title) linesReveal(title, st, 0.15);
    const intro = head.querySelector("[data-intro]");
    if (intro) gsap.from(intro, { y: 20, autoAlpha: 0, duration: 1, ease: EASE, delay: 0.45, scrollTrigger: st });
  });
}

function genericReveals() {
  q("[data-reveal]").forEach((el) =>
    gsap.from(el, { y: 28, autoAlpha: 0, duration: 1, ease: EASE, scrollTrigger: { trigger: el, start: "top 88%" } }),
  );
  q("[data-stagger]").forEach((group) =>
    gsap.from(group.children, {
      y: 32,
      autoAlpha: 0,
      duration: 1,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: group, start: "top 85%" },
    }),
  );
  q("[data-lines]").forEach((el) => linesReveal(el, { trigger: el, start: "top 85%" }));
}

/** About: words brighten as they cross the reading line (desktop). */
function readingWords() {
  q("[data-words]").forEach((p) => {
    const split = SplitText.create(p, { type: "words" });
    gsap.fromTo(
      split.words,
      { opacity: 0.18 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: { trigger: p, start: "top 78%", end: "bottom 52%", scrub: 0.6 },
      },
    );
  });
}

function parallax() {
  q<HTMLElement>("[data-parallax]").forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || "0.15");
    gsap.to(el, {
      yPercent: -amount * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") ?? el,
        start: el.closest("#top") ? "top top" : "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

function skills() {
  q("[data-skill-group]").forEach((group, i) => {
    const st = { trigger: group, start: "top 86%" };
    const tl = gsap.timeline({ scrollTrigger: st, delay: (i % 3) * 0.08, defaults: { ease: EASE } });
    tl.from(group.querySelector("[data-skill-icon]"), { rotate: -90, scale: 0.4, autoAlpha: 0, duration: 0.9 }, 0)
      .from(group.querySelector("[data-skill-rule]"), { scaleX: 0, transformOrigin: "0 50%", duration: 1.1, ease: "expo.inOut" }, 0)
      .from(group.querySelector("[data-skill-title]"), { y: 16, autoAlpha: 0, duration: 0.8 }, 0.15)
      .from(group.querySelectorAll("li"), { y: 14, autoAlpha: 0, duration: 0.7, stagger: 0.045 }, 0.3);
  });
}

function timeline() {
  q("[data-timeline]").forEach((tlEl) => {
    const line = tlEl.querySelector("[data-timeline-line]");
    if (line)
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "50% 0%",
          ease: "none",
          scrollTrigger: { trigger: tlEl, start: "top 70%", end: "bottom 60%", scrub: 0.5 },
        },
      );
    q("[data-milestone]", tlEl).forEach((m) => {
      const st = { trigger: m, start: "top 70%" };
      const dot = m.querySelector("[data-dot]");
      const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: EASE } });
      if (dot) tl.from(dot, { scale: 0, duration: 0.6, ease: "back.out(2)" }, 0).to(dot, { backgroundColor: "var(--accent)", borderColor: "var(--accent)", duration: 0.4 }, 0.1);
      tl.from(m.querySelectorAll("[data-m]"), { y: 22, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.05);
    });
  });
}

/** Desktop: pin the projects reel and move the panels horizontally. */
function projectsReel(desktop: boolean) {
  const reel = document.querySelector<HTMLElement>("[data-reel]");
  const track = document.querySelector<HTMLElement>("[data-reel-track]");
  if (!reel || !track) return;
  const panels = q<HTMLElement>("[data-reel-panel]", track);

  const panelIn = (panel: HTMLElement, st: ScrollTrigger.Vars) => {
    const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: EASE } });
    const clip = panel.querySelector("[data-clip]");
    const inner = panel.querySelector("[data-clip-inner]");
    if (clip) tl.fromTo(clip, { clipPath: "inset(12% 12% 12% 12% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.4, ease: "expo.inOut" }, 0);
    if (inner) tl.fromTo(inner, { scale: 1.14 }, { scale: 1, duration: 1.6 }, 0);
    tl.from(panel.querySelectorAll("[data-panel-text] > *"), { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 0.25);
    tl.from(panel.querySelectorAll("[data-tags] li"), { y: 10, autoAlpha: 0, duration: 0.5, stagger: 0.035 }, 0.6);
    drawDiagram(panel.querySelector<SVGSVGElement>("[data-clip-inner] svg"), tl, 0.55);
    return tl;
  };

  if (!desktop) {
    panels.forEach((p) => panelIn(p, { trigger: p, start: "top 78%" }));
    return;
  }

  document.documentElement.classList.add("motion-desktop");
  const distance = () => track.scrollWidth - reel.clientWidth;
  const scroll = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: reel,
      start: "top top",
      end: () => "+=" + distance(),
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });
  const progress = reel.querySelector("[data-reel-progress]");
  if (progress)
    gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none", transformOrigin: "0 50%", scrollTrigger: { trigger: reel, start: "top top", end: () => "+=" + distance(), scrub: true } });

  panels.forEach((p, i) => {
    panelIn(p, i === 0 ? { trigger: reel, start: "top 60%" } : { trigger: p, containerAnimation: scroll, start: "left 75%" });
    // Focus: the panel nearest the centre is sharp; neighbours recede.
    const focusTarget = p.firstElementChild as HTMLElement;
    if (i > 0)
      gsap.fromTo(focusTarget, { scale: 0.9, autoAlpha: 0.35 }, {
        scale: 1, autoAlpha: 1, ease: "none", immediateRender: false,
        scrollTrigger: { trigger: p, containerAnimation: scroll, start: "left right", end: "center 55%", scrub: true },
      });
    if (i < panels.length - 1)
      gsap.to(focusTarget, {
        scale: 0.9, autoAlpha: 0.35, ease: "none", immediateRender: false,
        scrollTrigger: { trigger: p, containerAnimation: scroll, start: "center 45%", end: "right left", scrub: true },
      });
  });
  return () => document.documentElement.classList.remove("motion-desktop");
}

function tilt() {
  const cleanups: (() => void)[] = [];
  q<HTMLElement>("[data-tilt]").forEach((card) => {
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
    gsap.set(card, { transformPerspective: 900 });
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 6);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    });
  });
  return () => cleanups.forEach((c) => c());
}

function magnetic() {
  const cleanups: (() => void)[] = [];
  q<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || "0.35");
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });
  return () => cleanups.forEach((c) => c());
}

function contact() {
  const title = document.querySelector<HTMLElement>("[data-contact-title]");
  if (title) {
    SplitText.create(title, {
      type: "chars,words,lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 120,
          duration: 1.2,
          ease: EASE,
          stagger: 0.018,
          scrollTrigger: { trigger: title, start: "top 80%" },
        }),
    });
  }
  const footer = document.querySelector("[data-footer]");
  if (footer)
    gsap.from(footer.children, { y: 24, autoAlpha: 0, duration: 0.9, ease: EASE, stagger: 0.08, scrollTrigger: { trigger: footer, start: "top 95%" } });
}

function progressBar() {
  gsap.to(".scroll-progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });
}

/** In-page anchors: smooth scroll that respects reduced motion (CSS smooth-scroll fights ScrollTrigger). */
function anchors(smooth: boolean, lenis?: Lenis) {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element).closest?.("a[href^='#']") as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute("href")!.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.6 });
    else target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    history.replaceState(null, "", `#${id}`);
    if (target.tabIndex < 0) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

export function MotionRoot() {
  useEffect(() => {
    let mm: gsap.MatchMedia | null = null;
    let cancelled = false;

    const init = () => {
      if (cancelled) return;
      mm = gsap.matchMedia();
      mm.add(
        {
          // gsap only runs the callback when at least one condition matches, so "all" guarantees
          // it runs on every device (e.g. a touch phone matches none of the others).
          all: "all",
          reduce: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)",
          finePointer: "(pointer: fine)",
        },
        (ctx) => {
          const { reduce, desktop, finePointer } = ctx.conditions as Record<string, boolean>;
          if (reduce) {
            document.documentElement.classList.remove("js-motion");
            return anchors(false);
          }
          // Inertial smooth scrolling on desktop mice/trackpads only; one frame loop with GSAP.
          let lenis: Lenis | undefined;
          let lenisRaf: ((time: number) => void) | undefined;
          if (desktop && finePointer) {
            lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            lenis.on("scroll", ScrollTrigger.update);
            lenisRaf = (time) => lenis!.raf(time * 1000);
            gsap.ticker.add(lenisRaf);
            gsap.ticker.lagSmoothing(0);
          }
          heroIntro();
          depth(desktop);
          sectionHeads();
          genericReveals();
          skills();
          timeline();
          contact();
          progressBar();
          const undoReel = projectsReel(desktop);
          const cleanups: ((() => void) | undefined)[] = [anchors(true, lenis)];
          if (desktop) {
            readingWords();
            parallax();
            if (finePointer) cleanups.push(magnetic(), tilt(), heroAtmosphere());
          }
          cleanups.push(() => {
            if (lenisRaf) gsap.ticker.remove(lenisRaf);
            gsap.ticker.lagSmoothing(500, 33);
            lenis?.destroy();
          });
          ScrollTrigger.refresh();
          return () => {
            cleanups.forEach((c) => c?.());
            undoReel?.();
          };
        },
      );
    };

    // Split text only after fonts load, so line breaks match what the reader sees.
    if (document.fonts?.status === "loaded") init();
    else document.fonts.ready.then(init);

    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);

  return <div className="scroll-progress" aria-hidden />;
}
