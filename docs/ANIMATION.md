# Animation storyboard v2 — "Signal": cinematic dark editorial

The site's one idea: **a signal resolving out of noise**. Every motion is a variation of it —
things arrive from a mask (a line becoming legible), a single accent line travels and connects,
and sound (the waveform) is the heartbeat that responds to the visitor.

## Motion language (use only these)
| Token | Value | Used for |
|---|---|---|
| `reveal` | 1.2 s · `expo.out` | anything arriving from a mask (chars, lines, panels) |
| `wipe` | 1.4 s · `expo.inOut` | rules, curtains, clip-path openings |
| `settle` | 1.6 s · `power3.out` | scale 1.12 → 1 inside a clip (camera settling) |
| `touch` | 0.5 s · `power3.out` / release `elastic.out(1, .4)` | cursor, magnetic, tilt |
| Stagger | chars 0.028 · words 0.04 · lines 0.08 · items 0.06 | — |
| Scrub | 0.6–1 (smoothing) | all scroll-linked motion |

Colour in motion: only the accent ever *travels* (progress bar, rules, timeline, waveform tail, cursor ring on hover).

## Engines — each owns its own elements, so nothing fights
- **GSAP + ScrollTrigger + SplitText** → every timeline, scroll-linked and entrance animation (`motion/MotionRoot.tsx`).
- **Lenis** → inertial smooth scrolling, **desktop with fine pointer only**, driven by `gsap.ticker` so ScrollTrigger and
  Lenis share one frame loop. Touch devices keep native scrolling. Off under reduced motion.
- **Motion (motion/react)** → React-state UI: mobile menu open/close and the theme-toggle icon swap
  (`AnimatePresence`). It never touches an element GSAP animates.
- **gsap.ticker** → the live waveform (72 SVG bars, attribute writes only, paused off-screen).

## Sequence
1. **Curtain (first visit per session, ~1.5 s)** — ink screen; a single accent line draws across the centre like a flat
   signal, one pulse travels along it, then the curtain splits open (clip-path) onto the hero. Returning visits skip it.
2. **Name** — characters rise from the line mask with a slight forward tilt (rotateX) and stagger; *Varma* arrives last,
   sweeping in from the right, then text is restored for native kerning.
3. **Statement, CTAs** — lines, then buttons; the waveform swells up from the centre line and starts breathing.
4. **Atmosphere** — glow orbs drift; the main glow lazily follows the cursor; grid lines draw down on load.
5. **Hero → About (depth)** — the hero stays put while About slides over it; the hero recedes
   (scale .92, dims, name tracking opens slightly) — a camera pulling back.
6. **Section heads** — rule wipes, index slides, title lines rise. Body copy: words brighten as they're read (desktop).
7. **Projects reel (desktop)** — pinned horizontal travel. The panel nearest centre is in focus (scale 1, full
   opacity); neighbours recede (scale .9, dim). Each diagram opens through a clip, settles from 1.12, then
   **draws itself**: nodes pop in sequence, connections draw along their path.
8. **Skills / Timeline** — as before; timeline line grows with scroll, dots ignite.
9. **Contact (depth)** — contact rises over the previous section; headline chars rise; footer is revealed underneath.

## Interaction
- **Cursor** (desktop, fine pointer): native cursor stays; a small ring trails it, grows over links/buttons, and over
  project diagrams expands with a label ("Explore"). Hidden on touch and under reduced motion.
- **Magnetic** CTAs, social buttons; buttons get a fill that wipes up from the bottom on hover.
- **Waveform** reacts: amplitude follows the cursor's distance and speed, and scroll velocity sends a pulse through it.

## Guarantees
- Content is server-rendered and visible without JS; reduced motion creates no GSAP/Lenis/ticker work and the
  waveform is static.
- Everything lives inside one `gsap.matchMedia()` → one `revert()` cleans tweens, triggers, splits, listeners, Lenis.
- Mobile: no Lenis, no pinning, no cursor, cheaper glows; reveals and the waveform remain.
