export default function Footer() {
  return (
    <footer className="py-8 border-t border-[#ffffff18] bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-500 text-sm">
          Built by{' '}
          <span className="text-[#00d4ff] font-medium">Dantuluri Surya Narayana Raju</span>
        </p>
        <p className="text-slate-600 text-xs font-mono">
          React + TypeScript + Tailwind + Framer Motion
        </p>
      </div>
    </footer>
  );
}
