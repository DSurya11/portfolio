// Draws the lanyard ID card (both faces) and its strap from the real photo, so the text stays
// in code instead of a baked image. Reads like a real badge: photo, name, program and batch on
// the front; "if found, return to" contact on the back. The card is drawn ~3x larger than it
// appears on screen, so every line is set big (>= 30px here) to stay sharp once scaled down.
const W = 720;
const H = 1012;
const BG = '#0e1014';
const TEXT = '#f3f5f8';
const MUTED = '#9aa3b1';
const FAINT = 'rgba(255,255,255,0.1)';
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

// Sets `text` at the largest size up to `max` that fits in `width`.
function fitText(ctx: Ctx, text: string, x: number, y: number, width: number, max: number, weight: number, family = SANS) {
  let size = max;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    size -= 2;
  } while (ctx.measureText(text).width > width && size > 20);
  ctx.fillText(text, x, y);
}

// The mark and institute shared by both faces, either side of the clip's slot.
function masthead(ctx: Ctx, onPhoto: boolean) {
  ctx.textBaseline = 'alphabetic';
  ctx.font = `800 54px ${SANS}`;
  ctx.fillStyle = CYAN;
  ctx.fillText('D', PAD, 112);
  ctx.fillStyle = TEXT;
  ctx.fillText('S', PAD + ctx.measureText('D').width, 112);
  ctx.font = `700 28px ${MONO}`;
  ctx.fillStyle = onPhoto ? 'rgba(255,255,255,0.92)' : MUTED;
  ctx.textAlign = 'right';
  ctx.fillText('IIITDM JBP', W - PAD, 104);
  ctx.textAlign = 'left';
}

export async function makeBadgeFaces() {
  const img = await loadImage('/surya-id.webp');
  const inner = W - PAD * 2;

  // ── Front ──
  const [front, f] = canvas(W, H);
  f.fillStyle = BG;
  f.fillRect(0, 0, W, H);
  const photoH = 640;
  if (img) cover(f, img, 0, 0, W, photoH, 0.18);
  const top = f.createLinearGradient(0, 0, 0, 200);
  top.addColorStop(0, 'rgba(8,10,14,0.6)');
  top.addColorStop(1, 'rgba(8,10,14,0)');
  f.fillStyle = top;
  f.fillRect(0, 0, W, 200);
  const fade = f.createLinearGradient(0, photoH - 240, 0, photoH);
  fade.addColorStop(0, 'rgba(14,16,20,0)');
  fade.addColorStop(1, BG);
  f.fillStyle = fade;
  f.fillRect(0, photoH - 240, W, 240);
  masthead(f, true);

  f.fillStyle = CYAN;
  f.beginPath();
  f.arc(PAD + 9, 646, 9, 0, Math.PI * 2);
  f.fill();
  f.font = `700 30px ${MONO}`;
  f.fillText('OPEN TO WORK', PAD + 32, 657);
  f.fillStyle = TEXT;
  fitText(f, 'Surya Dantuluri', PAD - 2, 752, inner, 82, 800);
  f.fillStyle = MUTED;
  fitText(f, 'B.Tech CSE · IIITDM Jabalpur', PAD, 812, inner, 40, 500);
  f.fillStyle = FAINT;
  f.fillRect(PAD, 860, inner, 3);
  f.font = `700 30px ${MONO}`;
  f.fillStyle = MUTED;
  f.fillText('STUDENT', PAD, 930);
  f.textAlign = 'right';
  f.fillStyle = TEXT;
  f.fillText('2023 – 2027', W - PAD, 930);
  f.textAlign = 'left';

  // ── Back ──
  const [back, b] = canvas(W, H);
  b.fillStyle = BG;
  b.fillRect(0, 0, W, H);
  masthead(b, false);
  b.font = `700 30px ${MONO}`;
  b.fillStyle = CYAN;
  b.fillText('IF FOUND, RETURN TO', PAD, 290);
  b.fillStyle = TEXT;
  fitText(b, 'Surya Dantuluri', PAD - 2, 372, inner, 74, 800);
  const line = (y: number, label: string, value: string) => {
    b.fillStyle = FAINT;
    b.fillRect(PAD, y - 66, inner, 3);
    b.font = `700 26px ${MONO}`;
    b.fillStyle = MUTED;
    b.fillText(label, PAD, y - 18);
    b.fillStyle = TEXT;
    fitText(b, value, PAD, y + 26, inner, 38, 600);
  };
  line(520, 'EMAIL', 'suryadantuluri2005@gmail.com');
  line(660, 'GITHUB', 'github.com/DSurya11');
  line(800, 'LINKEDIN', 'in/surya-dantuluri-2a2b4a280');
  b.fillStyle = FAINT;
  b.fillRect(PAD, 874, inner, 3);
  b.font = `700 28px ${MONO}`;
  b.fillStyle = MUTED;
  b.fillText('BATCH 2023 – 2027', PAD, 936);

  // ── Strap: the name in widely spaced letters, repeating ──
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

  // toBlob encodes off the main thread (toDataURL blocks it for ~100 ms per face).
  const url = (c: HTMLCanvasElement) =>
    new Promise<string>((resolve) => c.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : c.toDataURL()), 'image/png'));
  const [frontUrl, backUrl, strapUrl] = await Promise.all([url(front), url(back), url(strap)]);
  return { front: frontUrl, back: backUrl, strap: strapUrl };
}
