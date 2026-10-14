// Draws the two faces of the lanyard ID card from the real photo and the About details,
// so the card text stays in code instead of a baked image.
const W = 720;
const H = 1012;
const CYAN = '#00d4ff';
const SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

function base(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#0b0b12';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(0,212,255,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  const glow = ctx.createRadialGradient(W * 0.8, 0, 0, W * 0.8, 0, W);
  glow.addColorStop(0, 'rgba(0,212,255,0.22)');
  glow.addColorStop(1, 'rgba(0,212,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = CYAN;
  ctx.fillRect(0, 0, 10, H);
}

function header(ctx: CanvasRenderingContext2D, right: string) {
  ctx.textBaseline = 'alphabetic';
  ctx.font = `800 44px ${SANS}`;
  ctx.fillStyle = CYAN;
  ctx.fillText('D', 56, 96);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('S', 56 + ctx.measureText('D').width, 96);
  ctx.font = `600 22px ${MONO}`;
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'right';
  ctx.fillText(right, W - 56, 92);
  ctx.textAlign = 'left';
}

function barcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  let cx = x;
  let seed = 1948;
  while (cx < x + w) {
    seed = (seed * 9301 + 49297) % 233280;
    const bar = 2 + (seed % 5);
    ctx.fillStyle = seed % 3 ? '#e2e8f0' : 'transparent';
    ctx.fillRect(cx, y, bar, h);
    cx += bar + 2 + (seed % 3);
  }
}

function row(ctx: CanvasRenderingContext2D, y: number, label: string, value: string, accent = false) {
  ctx.font = `500 26px ${SANS}`;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(label, 56, y);
  ctx.font = `700 ${accent ? 34 : 28}px ${SANS}`;
  ctx.fillStyle = accent ? CYAN : '#f1f5f9';
  ctx.textAlign = 'right';
  ctx.fillText(value, W - 56, y);
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(56, y + 24, W - 112, 2);
}

function loadPhoto(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = '/avatar.jpg';
  });
}

export async function makeBadgeFaces() {
  const photo = await loadPhoto();
  const make = () => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    return [c, c.getContext('2d')!] as const;
  };

  const [front, f] = make();
  base(f);
  header(f, 'IIIT JABALPUR');
  const px = 56;
  const py = 140;
  const ps = W - 112;
  f.save();
  f.beginPath();
  f.roundRect(px, py, ps, ps * 0.92, 28);
  f.clip();
  if (photo) f.drawImage(photo, 225, 140, 600, 552, px, py, ps, ps * 0.92);
  const fade = f.createLinearGradient(0, py + ps * 0.55, 0, py + ps * 0.92);
  fade.addColorStop(0, 'rgba(11,11,18,0)');
  fade.addColorStop(1, 'rgba(11,11,18,0.85)');
  f.fillStyle = fade;
  f.fillRect(px, py, ps, ps * 0.92);
  f.restore();
  f.strokeStyle = 'rgba(0,212,255,0.6)';
  f.lineWidth = 3;
  f.beginPath();
  f.roundRect(px, py, ps, ps * 0.92, 28);
  f.stroke();

  f.font = `800 86px ${SANS}`;
  f.fillStyle = '#ffffff';
  f.fillText('SURYA', 56, 790);
  f.font = `500 26px ${SANS}`;
  f.fillStyle = '#cbd5e1';
  f.fillText('Dantuluri Surya Narayana Raju', 56, 836);
  f.font = `600 24px ${MONO}`;
  f.fillStyle = CYAN;
  f.fillText('B.TECH CSE  ·  2023 – 2027', 56, 884);
  barcode(f, 56, 920, 360, 52);
  f.font = `700 24px ${MONO}`;
  f.fillStyle = '#94a3b8';
  f.textAlign = 'right';
  f.fillText('CPI 8.1', W - 56, 958);
  f.textAlign = 'left';

  const [back, b] = make();
  base(b);
  header(b, 'STUDENT ID');
  b.font = `600 24px ${MONO}`;
  b.fillStyle = CYAN;
  b.fillText('EDUCATION', 56, 196);
  b.font = `700 34px ${SANS}`;
  b.fillStyle = '#ffffff';
  b.fillText('Indian Institute of', 56, 252);
  b.fillText('Information Technology', 56, 296);
  b.fillText('Jabalpur', 56, 340);
  row(b, 430, 'Degree', 'B.Tech – CSE');
  row(b, 500, 'CPI', '8.1 / 10', true);
  row(b, 570, 'Duration', 'Aug 2023 – May 2027');
  row(b, 640, 'Based in', 'Jabalpur, MP, India');
  b.font = `600 24px ${MONO}`;
  b.fillStyle = CYAN;
  b.fillText('OPEN TO INTERNSHIPS', 56, 770);
  b.fillText('& FULL-TIME ROLES', 56, 806);
  b.font = `500 26px ${MONO}`;
  b.fillStyle = '#cbd5e1';
  b.fillText('github.com/DSurya11', 56, 880);
  barcode(b, 56, 920, W - 112, 40);

  return { front: front.toDataURL('image/png'), back: back.toDataURL('image/png') };
}
