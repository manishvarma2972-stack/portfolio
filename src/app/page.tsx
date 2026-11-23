import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About, Contact, Education, Exploring, Journey, Skills } from "@/components/Sections";
import { Footer } from "@/components/Footer";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { Cursor } from "@/components/motion/Cursor";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Journey />
        <Education />
        <Exploring />
        <Contact />
      </main>
      <Footer />
      <MotionRoot />
      <Cursor />
      <div className="curtain" data-curtain aria-hidden>
        <div className="curtain__half curtain__half--top" data-curtain-half="top" />
        <div className="curtain__half curtain__half--bottom" data-curtain-half="bottom" />
        <div className="curtain__track">
          <div className="curtain__line" data-curtain-line />
          <div className="curtain__pulse" data-curtain-pulse />
        </div>
      </div>
      <div className="grain" aria-hidden />
    </>
  );
}
