export default function Footer() {
  return (
    <footer className="relative z-10 py-8 border-t border-[#ffffff18] bg-[#0a0a0f]/80 backdrop-blur-sm">
      <div className="page-x flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-500 text-sm">
          Built by <span className="text-[#00d4ff] font-medium">Dantuluri Surya Narayana Raju</span>
        </p>
        <p className="text-slate-600 text-xs font-mono">React + TypeScript + three.js + GSAP + anime.js</p>
      </div>
    </footer>
  );
}
