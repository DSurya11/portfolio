// Draws the lanyard ID card (both faces) and its printed strap from the real photo and the
// About details, so the card text stays in code instead of a baked image.
// Three designs; pick one with ?card=terminal | pass | editorial while choosing.
export type BadgeDesign = 'terminal' | 'pass' | 'editorial';

const W = 720;
const H = 1012;
const SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const SERIF = 'Georgia, "Times New Roman", serif';

type Ctx = CanvasRenderingContext2D;

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function barcode(ctx: Ctx, x: number, y: number, w: number, h: number, ink: string) {
  let cx = x;
  let seed = 1948;
  ctx.fillStyle = ink;
  while (cx < x + w) {
    seed = (seed * 9301 + 49297) % 233280;
    const bar = 2 + (seed % 4);
    if (seed % 3) ctx.fillRect(cx, y, bar, h);
    cx += bar + 2 + (seed % 3);
  }
}

// Fills the frame with the photo (like CSS object-fit: cover). `focusY` picks which part of
// the photo's height stays in view when it is cropped: 0 = top, 0.5 = middle.
function photo(ctx: Ctx, img: HTMLImageElement | null, x: number, y: number, w: number, h: number, focusY = 0.3) {
  if (!img) return;
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) * focusY, dw, dh);
  ctx.restore();
}

function strapTile(parts: readonly (readonly [string, string])[], bg: string) {
  const font = `800 64px ${SANS}`;
  const gap = 34;
  const [, m] = canvas(1, 1);
  m.font = font;
  const tile = Math.ceil(parts.reduce((w, [t]) => w + m.measureText(t).width + gap, 0));
  const [c, s] = canvas(tile, 192);
  s.fillStyle = bg;
  s.fillRect(0, 0, tile, 192);
  s.font = font;
  s.textBaseline = 'middle';
  let x = gap / 2;
  for (const [text, color] of parts) {
    s.fillStyle = color;
    s.fillText(text, x, 100);
    x += s.measureText(text).width + gap;
  }
  return c.toDataURL('image/png');
}

// ── Terminal: the card is a dark code editor ─────────────────────────────────────────────
function terminal(img: HTMLImageElement | null) {
  const BG = '#0d1117';
  const C = { kw: '#ff7b72', name: '#d2a8ff', key: '#79c0ff', str: '#a5d6ff', num: '#f2cc60', punc: '#c9d1d9', dim: '#6e7681', ok: '#3fb950' };

  const frame = (ctx: Ctx, title: string) => {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#161b22';
    ctx.fillRect(0, 0, W, 150);
    ctx.fillStyle = '#30363d';
    ctx.fillRect(0, 150, W, 2);
    [['#ff5f57', 0], ['#febc2e', 1], ['#28c840', 2]].forEach(([c, i]) => {
      ctx.fillStyle = c as string;
      ctx.beginPath();
      ctx.arc(64 + (i as number) * 34, 112, 11, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = `500 22px ${MONO}`;
    ctx.fillStyle = '#8b949e';
    ctx.textAlign = 'right';
    ctx.fillText(title, W - 48, 120);
    ctx.textAlign = 'left';
    // Status bar along the bottom, like an editor.
    ctx.fillStyle = '#00b4d8';
    ctx.fillRect(0, H - 56, W, 56);
    ctx.font = `600 20px ${MONO}`;
    ctx.fillStyle = '#04232b';
    ctx.fillText('⎇ main  ✓', 32, H - 20);
    ctx.textAlign = 'right';
    ctx.fillText('TypeScript  UTF-8', W - 32, H - 20);
    ctx.textAlign = 'left';
  };

  const code = (ctx: Ctx, y0: number, lines: [string, string][][]) => {
    ctx.font = `500 25px ${MONO}`;
    lines.forEach((tokens, i) => {
      const y = y0 + i * 42;
      ctx.fillStyle = C.dim;
      ctx.textAlign = 'right';
      ctx.fillText(String(i + 1), 76, y);
      ctx.textAlign = 'left';
      let x = 100;
      for (const [text, color] of tokens) {
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width;
      }
    });
  };

  const [front, f] = canvas(W, H);
  frame(f, 'surya.ts');
  // Round avatar with a thin cyan ring.
  f.save();
  f.beginPath();
  f.arc(150, 300, 100, 0, Math.PI * 2);
  f.clip();
  const g = f.createLinearGradient(0, 200, 0, 400);
  g.addColorStop(0, '#22303f');
  g.addColorStop(1, '#141c26');
  f.fillStyle = g;
  f.fillRect(50, 200, 200, 200);
  photo(f, img, 50, 200, 200, 200, 0.25);
  f.restore();
  f.strokeStyle = '#00d4ff';
  f.lineWidth = 4;
  f.beginPath();
  f.arc(150, 300, 103, 0, Math.PI * 2);
  f.stroke();
  f.font = `800 66px ${SANS}`;
  f.fillStyle = '#f0f6fc';
  f.fillText('Surya', 284, 290);
  f.font = `500 22px ${SANS}`;
  f.fillStyle = '#8b949e';
  f.fillText('Dantuluri Surya Narayana Raju', 286, 330);
  f.font = `600 21px ${MONO}`;
  f.fillStyle = C.ok;
  f.fillText('● open to work', 286, 370);
  code(f, 480, [
    [['const ', C.kw], ['surya', C.name], [' = {', C.punc]],
    [['  role', C.key], [': ', C.punc], ['"CSE @ IIIT Jabalpur"', C.str], [',', C.punc]],
    [['  cpi', C.key], [': ', C.punc], ['8.1', C.num], [',', C.punc]],
    [['  batch', C.key], [': ', C.punc], ['"2023–2027"', C.str], [',', C.punc]],
    [['  builds', C.key], [': [', C.punc], ['"AI"', C.str], [', ', C.punc], ['"ML"', C.str], [', ', C.punc], ['"web"', C.str], ['],', C.punc]],
    [['  leetcode', C.key], [': ', C.punc], ['"Knight · 1948"', C.str], [',', C.punc]],
    [['};', C.punc]],
  ]);

  const [back, b] = canvas(W, H);
  frame(b, 'zsh — ~/surya');
  const prompt = (y: number, cmd: string) => {
    b.font = `600 25px ${MONO}`;
    b.fillStyle = C.ok;
    b.fillText('❯', 48, y);
    b.fillStyle = '#f0f6fc';
    b.fillText(cmd, 82, y);
  };
  const out = (y: number, k: string, v: string, color = C.str) => {
    b.font = `500 24px ${MONO}`;
    b.fillStyle = C.dim;
    b.fillText(k.padEnd(10, ' '), 82, y);
    b.fillStyle = color;
    b.fillText(v, 82 + b.measureText(k.padEnd(10, ' ')).width, y);
  };
  prompt(222, 'whoami --education');
  out(268, 'college', 'IIIT Jabalpur');
  out(308, 'degree', 'B.Tech – CSE');
  out(348, 'cpi', '8.1 / 10', C.num);
  out(388, 'years', 'Aug 2023 – May 2027');
  prompt(470, 'cat ratings.txt');
  out(516, 'leetcode', 'Knight · 1948', C.num);
  out(556, 'codeforces', 'Pupil · 1262', C.num);
  out(596, 'codechef', '3★ · 1613', C.num);
  prompt(678, 'open --links');
  out(724, 'github', 'DSurya11', C.key);
  out(764, 'based in', 'Jabalpur, India');
  b.font = `600 25px ${MONO}`;
  b.fillStyle = C.ok;
  b.fillText('❯', 48, 846);
  b.fillStyle = '#00d4ff';
  b.fillRect(82, 826, 14, 26);

  return { front, back, strap: strapTile([['SURYA', '#ffffff'], ['</>', '#00d4ff'], ['IIIT JABALPUR', '#8b949e'], ['</>', '#00d4ff']], '#0d1117') };
}

// ── Pass: photo on a bright backdrop over a black name panel, like an event pass ─────────
function pass(img: HTMLImageElement | null) {
  const [front, f] = canvas(W, H);
  const split = 640;
  const g = f.createLinearGradient(0, 0, 0, split);
  g.addColorStop(0, '#2fdcfb');
  g.addColorStop(1, '#00a6cf');
  f.fillStyle = g;
  f.fillRect(0, 0, W, split);
  // Big faint initials behind the photo.
  photo(f, img, 0, 0, W, split, 0.2);
  // A soft fade at the top keeps the corner labels readable over the sky.
  const shade = f.createLinearGradient(0, 0, 0, 170);
  shade.addColorStop(0, 'rgba(255,255,255,0.55)');
  shade.addColorStop(1, 'rgba(255,255,255,0)');
  f.fillStyle = shade;
  f.fillRect(0, 0, W, 170);
  f.fillStyle = '#0b0b12';
  f.fillRect(0, split, W, H - split);
  // Labels sit in the top corners, either side of the clip's slot, clear of the photo.
  f.font = `700 20px ${MONO}`;
  f.fillStyle = '#04232b';
  f.fillText('STUDENT PASS', 40, 100);
  f.textAlign = 'right';
  f.fillText('IIIT JABALPUR', W - 40, 100);
  f.textAlign = 'left';
  f.font = `900 118px ${SANS}`;
  f.fillStyle = '#ffffff';
  f.fillText('SURYA', 44, split + 128);
  f.font = `500 25px ${SANS}`;
  f.fillStyle = '#94a3b8';
  f.fillText('Dantuluri Surya Narayana Raju', 48, split + 176);
  f.font = `700 22px ${MONO}`;
  f.fillStyle = '#00d4ff';
  f.fillText('B.TECH CSE  ·  2023–27  ·  CPI 8.1', 48, split + 222);
  barcode(f, 48, split + 262, W - 96, 56, '#ffffff');

  const [back, b] = canvas(W, H);
  b.fillStyle = '#0b0b12';
  b.fillRect(0, 0, W, H);
  b.fillStyle = '#00c2e8';
  b.fillRect(0, 0, W, 210);
  b.font = `700 20px ${MONO}`;
  b.fillStyle = '#04232b';
  b.fillText('ACCESS', 48, 196);
  b.textAlign = 'right';
  b.fillText('ALL AREAS', W - 48, 196);
  b.textAlign = 'left';
  const rows: [string, string][] = [
    ['College', 'IIIT Jabalpur'],
    ['Degree', 'B.Tech – CSE'],
    ['CPI', '8.1 / 10'],
    ['Batch', '2023 – 2027'],
    ['LeetCode', 'Knight · 1948'],
    ['Based in', 'Jabalpur, India'],
  ];
  rows.forEach(([k, v], i) => {
    const y = 300 + i * 82;
    b.font = `500 24px ${SANS}`;
    b.fillStyle = '#64748b';
    b.fillText(k.toUpperCase(), 48, y);
    b.font = `700 32px ${SANS}`;
    b.fillStyle = k === 'CPI' ? '#00d4ff' : '#ffffff';
    b.fillText(v, 48, y + 38);
  });
  b.font = `600 24px ${MONO}`;
  b.fillStyle = '#94a3b8';
  b.fillText('github.com/DSurya11', 48, 840);
  barcode(b, 48, 880, W - 96, 48, '#ffffff');

  return { front, back, strap: strapTile([['SURYA', '#0b0b12'], ['✦', '#ffffff'], ['STUDENT PASS', '#04232b'], ['✦', '#ffffff']], '#00c2e8') };
}

// ── Editorial: warm paper, the name printed down the edge ─────────────────────────────
function editorial(img: HTMLImageElement | null) {
  const PAPER = '#efebe4';
  const INK = '#151412';
  const [front, f] = canvas(W, H);
  f.fillStyle = PAPER;
  f.fillRect(0, 0, W, H);
  f.font = `600 20px ${MONO}`;
  f.fillStyle = INK;
  f.fillText('Nº 2027 — STUDENT', 48, 196);
  f.fillStyle = '#00a6cf';
  f.fillRect(W - 72, 178, 24, 24);
  // Photo panel on the left, a strip on the right for the vertical name.
  const px = 48;
  const py = 236;
  const pw = 500;
  const ph = 560;
  f.fillStyle = '#d8d1c4';
  f.fillRect(px, py, pw, ph);
  photo(f, img, px, py, pw, ph, 0.25);
  f.save();
  f.translate(W - 50, py + ph);
  f.rotate(-Math.PI / 2);
  f.font = `900 132px ${SANS}`;
  f.fillStyle = INK;
  f.fillText('SURYA', 0, 0);
  f.restore();
  f.font = `italic 400 34px ${SERIF}`;
  f.fillStyle = INK;
  f.fillText('Dantuluri Surya Narayana Raju', 48, 860);
  f.font = `600 20px ${MONO}`;
  f.fillStyle = '#5b5750';
  f.fillText('B.TECH CSE · IIIT JABALPUR · 2023–2027', 48, 906);
  f.fillStyle = INK;
  f.fillRect(48, 940, W - 96, 2);

  const [back, b] = canvas(W, H);
  b.fillStyle = PAPER;
  b.fillRect(0, 0, W, H);
  b.font = `600 20px ${MONO}`;
  b.fillStyle = INK;
  b.fillText('Nº 2027 — PARTICULARS', 48, 196);
  b.font = `italic 400 52px ${SERIF}`;
  b.fillText('Indian Institute of', 48, 290);
  b.fillText('Information Technology,', 48, 350);
  b.fillText('Jabalpur', 48, 410);
  const rows: [string, string][] = [
    ['Degree', 'B.Tech – CSE'],
    ['CPI', '8.1 / 10'],
    ['Duration', 'Aug 2023 – May 2027'],
    ['Seeking', 'Internships & full-time'],
  ];
  rows.forEach(([k, v], i) => {
    const y = 500 + i * 70;
    b.fillStyle = 'rgba(21,20,18,0.25)';
    b.fillRect(48, y - 44, W - 96, 1.5);
    b.font = `600 20px ${MONO}`;
    b.fillStyle = '#5b5750';
    b.fillText(k.toUpperCase(), 48, y);
    b.font = `600 28px ${SANS}`;
    b.fillStyle = k === 'CPI' ? '#00809f' : INK;
    b.textAlign = 'right';
    b.fillText(v, W - 48, y);
    b.textAlign = 'left';
  });
  b.font = `italic 400 30px ${SERIF}`;
  b.fillStyle = INK;
  b.fillText('github.com/DSurya11', 48, 860);
  barcode(b, 48, 900, 300, 44, INK);

  return { front, back, strap: strapTile([['SURYA', '#efebe4'], ['—', '#00a6cf'], ['IIIT JABALPUR', '#a8a296'], ['—', '#00a6cf']], '#151412') };
}

export const BADGE_COLORS: Record<BadgeDesign, string> = { terminal: '#0d1117', pass: '#0b0b12', editorial: '#efebe4' };

export async function makeBadgeFaces(design: BadgeDesign) {
  const img = await loadImage('/surya-id.webp');
  const made = design === 'terminal' ? terminal(img) : design === 'editorial' ? editorial(img) : pass(img);
  return { front: made.front.toDataURL('image/png'), back: made.back.toDataURL('image/png'), strap: made.strap };
}
