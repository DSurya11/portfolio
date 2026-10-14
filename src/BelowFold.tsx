import { useEffect, useState } from 'react';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ScrollTrigger } from './lib/motion';

const sections = [About, Skills, Projects, Achievements, Certifications, Contact];

// Everything after the hero ships as its own chunk. Sections mount one per idle moment, so
// their setup (scroll animations, split headings) is a series of small tasks instead of one
// long freeze; the space below is reserved so the page can already be scrolled.
export default function BelowFold() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count >= sections.length) {
      // Pins and the scroll animations depend on the full page height, now that it exists.
      ScrollTrigger.refresh();
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return;
    }
    const ric = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 16));
    const handle = ric(() => setCount((c) => c + 1), { timeout: 120 }) as number;
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(handle);
  }, [count]);

  return (
    <>
      <main className="relative z-10">
        {sections.slice(0, count).map((Section, i) => (
          <Section key={i} />
        ))}
        {count < sections.length && <div style={{ height: `${(sections.length - count) * 100}vh` }} />}
      </main>
      {count >= sections.length && <Footer />}
    </>
  );
}
