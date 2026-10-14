// Draws the lanyard ID card (both faces) and its printed strap from the real photo and the
// About details, so the card text stays in code instead of a baked image. Styled like a real
// issued badge: white card, dark header band, photo on a plain backdrop, one cyan stripe.
const W = 720;
const H = 1012;
const INK = '#0b0b12';
const MUTED = '#5b6575';
const CYAN = '#0891b2';
const PAPER = '#f5f6f8';
const SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
}

function card(ctx: CanvasRenderingContext2D, right: string, sub: string) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  // Header band, with room in the middle for the slot punched by the clip.
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, 156);
  ctx.textBaseline = 'alphabetic';
  ctx.font = `800 46px ${SANS}`;
  ctx.fillStyle = '#00d4ff';
  ctx.fillText('D', 56, 118);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('S', 56 + ctx.measureText('D').width, 118);
  ctx.textAlign = 'right';
  ctx.font = `700 22px ${MONO}`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(right, W - 56, 104);
  ctx.font = `600 18px ${MONO}`;
  ctx.fillStyle = '#00d4ff';
  ctx.fillText(sub, W - 56, 132);
  ctx.textAlign = 'left';
  // Accent stripe along the bottom edge.
  ctx.fillStyle = '#00c2e8';
  ctx.fillRect(0, H - 22, W, 22);
}

function barcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  let cx = x;
  let seed = 1948;
  ctx.fillStyle = INK;
  while (cx < x + w) {
    seed = (seed * 9301 + 49297) % 233280;
    const bar = 2 + (seed % 4);
    if (seed % 3) ctx.fillRect(cx, y, bar, h);
    cx += bar + 2 + (seed % 3);
  }
}

function row(ctx: CanvasRenderingContext2D, y: number, label: string, value: string, accent = false) {
  ctx.font = `500 25px ${SANS}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(label, 56, y);
  ctx.font = `700 ${accent ? 32 : 27}px ${SANS}`;
  ctx.fillStyle = accent ? CYAN : INK;
  ctx.textAlign = 'right';
  ctx.fillText(value, W - 56, y);
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(11,11,18,0.1)';
  ctx.fillRect(56, y + 22, W - 112, 2);
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function makeBadgeFaces() {
  const photo = await loadImage('/surya-cutout.webp');

  const [front, f] = canvas(W, H);
  card(f, 'IIIT JABALPUR', 'STUDENT');
  const px = 56;
  const py = 196;
  const pw = W - 112;
  const ph = 500;
  f.save();
  f.beginPath();
  f.roundRect(px, py, pw, ph, 22);
  f.clip();
  const backdrop = f.createLinearGradient(0, py, 0, py + ph);
  backdrop.addColorStop(0, '#e3e9f0');
  backdrop.addColorStop(1, '#c7d1dc');
  f.fillStyle = backdrop;
  f.fillRect(px, py, pw, ph);
  if (photo) {
    // Head and shoulders: scale the cut-out so the shoulders fill the frame's width.
    const scale = (pw * 1.18) / photo.width;
    const dw = photo.width * scale;
    const dh = photo.height * scale;
    f.drawImage(photo, px + (pw - dw) / 2, py + 34, dw, dh);
  }
  f.restore();

  f.font = `800 84px ${SANS}`;
  f.fillStyle = INK;
  f.fillText('SURYA', 56, 790);
  f.font = `500 26px ${SANS}`;
  f.fillStyle = MUTED;
  f.fillText('Dantuluri Surya Narayana Raju', 56, 832);
  f.font = `700 23px ${MONO}`;
  f.fillStyle = CYAN;
  f.fillText('B.TECH CSE  ·  2023 – 2027', 56, 876);
  barcode(f, 56, 912, 330, 50);
  f.font = `700 24px ${MONO}`;
  f.fillStyle = INK;
  f.textAlign = 'right';
  f.fillText('CPI 8.1', W - 56, 954);
  f.textAlign = 'left';

  const [back, b] = canvas(W, H);
  card(b, 'STUDENT ID', '2023 – 2027');
  b.font = `700 22px ${MONO}`;
  b.fillStyle = CYAN;
  b.fillText('EDUCATION', 56, 232);
  b.font = `800 34px ${SANS}`;
  b.fillStyle = INK;
  b.fillText('Indian Institute of', 56, 288);
  b.fillText('Information Technology', 56, 332);
  b.fillText('Jabalpur', 56, 376);
  row(b, 464, 'Degree', 'B.Tech – CSE');
  row(b, 532, 'CPI', '8.1 / 10', true);
  row(b, 600, 'Duration', 'Aug 2023 – May 2027');
  row(b, 668, 'Based in', 'Jabalpur, MP, India');
  b.font = `700 22px ${MONO}`;
  b.fillStyle = CYAN;
  b.fillText('OPEN TO INTERNSHIPS', 56, 772);
  b.fillText('& FULL-TIME ROLES', 56, 806);
  b.font = `600 24px ${MONO}`;
  b.fillStyle = INK;
  b.fillText('github.com/DSurya11', 56, 870);
  barcode(b, 56, 912, W - 112, 40);

  // The strap: a dark band with the name printed along it; one run of text per tile so it repeats seamlessly.
  const parts = [
    ['SURYA', '#ffffff'],
    ['•', '#00d4ff'],
    ['IIIT JABALPUR', '#9aa4b2'],
    ['•', '#00d4ff'],
  ] as const;
  const font = `800 64px ${SANS}`;
  const gap = 34;
  const [, measure] = canvas(1, 1);
  measure.font = font;
  const tile = Math.ceil(parts.reduce((w, [t]) => w + measure.measureText(t).width + gap, 0));
  const [strap, s] = canvas(tile, 192);
  s.fillStyle = '#10141c';
  s.fillRect(0, 0, tile, 192);
  s.font = font;
  s.textBaseline = 'middle';
  let x = gap / 2;
  for (const [text, color] of parts) {
    s.fillStyle = color;
    s.fillText(text, x, 100);
    x += s.measureText(text).width + gap;
  }

  return { front: front.toDataURL('image/png'), back: back.toDataURL('image/png'), strap: strap.toDataURL('image/png') };
}
