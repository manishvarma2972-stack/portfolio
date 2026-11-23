"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { profile } from "@/content/profile";
import { navItems } from "@/content/nav";


export function Nav() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    // Active = the last nav section whose top has passed 40% of the viewport.
    // (Sections not in the nav, like Education, keep the previous item active.)
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const line = window.innerHeight * 0.4;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = "";
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
      setActive(atBottom ? sections[sections.length - 1]?.id ?? current : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-b border-rule bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Primary">
        <a href="#top" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-serif text-[1.35rem] leading-none tracking-tight">Manish Varma</span>
          <span className="hidden h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150 sm:block" />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={`relative px-3 py-2 text-sm transition-colors ${
                active === item.id ? "text-ink" : "text-ink-3 hover:text-ink"
              }`}
            >
              {item.label}
              {active === item.id && (
                // Motion shared layout: the indicator glides between items as sections change.
                <motion.span
                  layoutId="nav-indicator"
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-px bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
            </a>
          ))}
          <span className="mx-2 h-4 w-px bg-rule" aria-hidden />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center text-ink"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
                className="grid place-items-center"
              >
                {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="menu"
            className="h-[calc(100dvh-4rem)] overflow-hidden border-t border-rule bg-paper md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.87, 0, 0.13, 1] }}
          >
            <ul className="container-x flex flex-col pt-6">
              {navItems.map((item, i) => (
                <li key={item.id} className="overflow-hidden border-b border-rule">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-5"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.05, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <span className="font-serif text-4xl">{item.label}</span>
                    <span aria-hidden className="text-ink-3">&rarr;</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="container-x mt-8 flex gap-6 text-sm text-ink-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={`mailto:${profile.email}`}>Email</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </MotionConfig>
  );
}
