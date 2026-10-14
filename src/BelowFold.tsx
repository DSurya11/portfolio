import { useEffect } from 'react';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ScrollTrigger } from './lib/motion';

// Everything after the hero ships as its own chunk, fetched right after the hero paints.
export default function BelowFold() {
  useEffect(() => {
    // Pins and the particle morph points depend on the full page height, now that it exists.
    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <main className="relative z-10">
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
