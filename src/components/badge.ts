// Draws the lanyard ID card (both faces) and its strap from the real photo and the About
// details, so the text stays in code instead of a baked image. One quiet design: a full-bleed
// photo fading into a near-black card, name and three facts on the front; numbers and contact
// on the back. No barcode or fake ID furniture.
const W = 720;
const H = 1012;
const BG = '#0e1014';
const TEXT = '#f3f5f8';
const MUTED = '#8b93a1';
const FAINT = 'rgba(255,255,255,0.09)';
const CYAN = '#22d3ee';
const SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const PAD = 52;

type Ctx = CanvasRenderingContext2D;

export const BADGE_COLOR = BG;

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

// Fills the frame like CSS object-fit: cover; `focusY` 0 keeps the top of the photo.
function cover(ctx: Ctx, img: HTMLImageElement, x: number, y: number, w: number, h: number, focusY: number) {
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

// The small mark and institute name shared by both faces, either side of the clip's slot.
function masthead(ctx: Ctx, onPhoto: boolean) {
  ctx.textBaseline = 'alphabetic';
  ctx.font = `800 40px ${SANS}`;
  ctx.fillStyle = CYAN;
  ctx.fillText('D', PAD, 104);
  ctx.fillStyle = TEXT;
  ctx.fillText('S', PAD + ctx.measureText('D').width, 104);
  ctx.font = `600 17px ${MONO}`;
  ctx.fillStyle = onPhoto ? 'rgba(255,255,255,0.85)' : MUTED;
  ctx.textAlign = 'right';
  ctx.fillText('IIIT JABALPUR', W - PAD, 98);
  ctx.textAlign = 'left';
}

function fact(ctx: Ctx, x: number, y: number, label: string, value: string, valueSize = 30) {
  ctx.font = `600 15px ${MONO}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(label, x, y);
  ctx.font = `700 ${valueSize}px ${SANS}`;
  ctx.fillStyle = TEXT;
  ctx.fillText(value, x, y + valueSize + 10);
}

function wrap(ctx: Ctx, text: string, x: number, y: number, maxW: number, lineH: number) {
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxW && line) {
      ctx.fillText(line, x, y);
      y += lineH;
      line = word;
    } else line = next;
  }
  ctx.fillText(line, x, y);
  return y;
}

export async function makeBadgeFaces() {
  const img = await loadImage('/surya-id.webp');

  // ── Front ──
  const [front, f] = canvas(W, H);
  f.fillStyle = BG;
  f.fillRect(0, 0, W, H);
  const photoH = 650;
  if (img) cover(f, img, 0, 0, W, photoH, 0.18);
  // Darken the top a touch for the masthead, and fade the photo into the card at the bottom.
  const top = f.createLinearGradient(0, 0, 0, 190);
  top.addColorStop(0, 'rgba(8,10,14,0.55)');
  top.addColorStop(1, 'rgba(8,10,14,0)');
  f.fillStyle = top;
  f.fillRect(0, 0, W, 190);
  const fade = f.createLinearGradient(0, photoH - 230, 0, photoH);
  fade.addColorStop(0, 'rgba(14,16,20,0)');
  fade.addColorStop(1, BG);
  f.fillStyle = fade;
  f.fillRect(0, photoH - 230, W, 230);
  masthead(f, true);

  f.font = `600 18px ${MONO}`;
  f.fillStyle = CYAN;
  f.beginPath();
  f.arc(PAD + 6, 652, 6, 0, Math.PI * 2);
  f.fill();
  f.fillText('OPEN TO INTERNSHIPS', PAD + 24, 658);
  f.font = `800 66px ${SANS}`;
  f.fillStyle = TEXT;
  f.fillText('Surya Dantuluri', PAD - 2, 740);
  f.font = `500 25px ${SANS}`;
  f.fillStyle = MUTED;
  f.fillText('B.Tech Computer Science · IIIT Jabalpur', PAD, 786);
  f.fillStyle = FAINT;
  f.fillRect(PAD, 836, W - PAD * 2, 2);
  const col = (W - PAD * 2) / 3;
  fact(f, PAD, 884, 'CLASS OF', '2027');
  fact(f, PAD + col, 884, 'CPI', '8.1');
  fact(f, PAD + col * 2, 884, 'LEETCODE', '1948');

  // ── Back ──
  const [back, b] = canvas(W, H);
  b.fillStyle = BG;
  b.fillRect(0, 0, W, H);
  masthead(b, false);
  b.font = `600 18px ${MONO}`;
  b.fillStyle = CYAN;
  b.fillText('WHAT I BUILD', PAD, 228);
  b.font = `650 38px ${SANS}`;
  b.fillStyle = TEXT;
  wrap(b, 'AI systems, real-time ML pipelines and full-stack applications.', PAD, 286, W - PAD * 2, 50);

  const gridTop = 430;
  const cellW = (W - PAD * 2) / 2;
  const cellH = 150;
  b.fillStyle = FAINT;
  b.fillRect(PAD, gridTop, W - PAD * 2, 2);
  b.fillRect(PAD, gridTop + cellH, W - PAD * 2, 2);
  b.fillRect(PAD, gridTop + cellH * 2, W - PAD * 2, 2);
  b.fillRect(PAD + cellW, gridTop, 2, cellH * 2);
  const cells: [string, string][] = [
    ['CPI', '8.1'],
    ['LEETCODE RATING', '1948'],
    ['PROBLEMS SOLVED', '789'],
    ['PROJECTS SHIPPED', '7'],
  ];
  cells.forEach(([label, value], i) => {
    const x = PAD + (i % 2) * cellW + (i % 2 ? 28 : 0);
    const y = gridTop + Math.floor(i / 2) * cellH + 50;
    fact(b, x, y, label, value, 52);
  });

  b.font = `600 15px ${MONO}`;
  b.fillStyle = MUTED;
  b.fillText('FIND ME', PAD, 820);
  b.font = `500 25px ${MONO}`;
  b.fillStyle = TEXT;
  b.fillText('github.com/DSurya11', PAD, 864);
  b.fillText('suryadantuluri2005@gmail.com', PAD, 906);

  // ── Strap: the name in small, widely spaced letters, repeating ──
  const font = `600 46px ${SANS}`;
  const label = 'SURYA DANTULURI';
  const gap = 90;
  const [, m] = canvas(1, 1);
  m.font = font;
  (m as Ctx & { letterSpacing: string }).letterSpacing = '10px';
  const tile = Math.ceil(m.measureText(label).width + gap);
  const [strap, s] = canvas(tile, 192);
  s.fillStyle = '#111318';
  s.fillRect(0, 0, tile, 192);
  s.font = font;
  (s as Ctx & { letterSpacing: string }).letterSpacing = '10px';
  s.textBaseline = 'middle';
  s.fillStyle = '#7b8494';
  s.fillText(label, gap / 2, 98);
  s.fillStyle = CYAN;
  s.beginPath();
  s.arc(tile - 4, 96, 5, 0, Math.PI * 2);
  s.fill();

  return { front: front.toDataURL('image/png'), back: back.toDataURL('image/png'), strap: strap.toDataURL('image/png') };
}
