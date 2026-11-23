"use client";

/**
 * A trailing ring that supplements (never replaces) the native cursor.
 * Grows over links and buttons; over elements with data-cursor="Label" it fills with the
 * accent and shows the label. Desktop fine pointers only; nothing runs under reduced motion.
 */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el || !label) return;
    const mq = window.matchMedia("(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.classList.add("is-active");
    };
    const over = (e: PointerEvent) => {
      const target = e.target as Element;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      const interactive = target.closest("a, button, [role='button'], input, textarea, select");
      el.classList.toggle("is-label", !!labelled);
      el.classList.toggle("is-link", !labelled && !!interactive);
      if (labelled) label.textContent = labelled.dataset.cursor ?? "";
    };
    const leave = () => el.classList.remove("is-active");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden>
      <span ref={labelRef} className="cursor__label" />
    </div>
  );
}
