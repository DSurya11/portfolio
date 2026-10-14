import { useEffect } from 'react';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ScrollTrigger } from './lib/motion';
import { markDone } from './lib/ready';

// Everything after the hero. It all mounts at once, behind the loading screen, so its setup
// (scroll animations, split headings) is finished before the page is shown.
export default function BelowFold() {
  useEffect(() => {
    // Pins and the scroll animations depend on the full page height, now that it exists.
    ScrollTrigger.refresh();
    markDone('sections');
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
