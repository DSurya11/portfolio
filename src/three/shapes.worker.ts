// Builds the particle shapes off the main thread so the page stays responsive while they form.
import { buildShapes } from './shapes';

async function mask(url: string) {
  try {
    const bitmap = await createImageBitmap(await (await fetch(url)).blob());
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);
    return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  } catch {
    return null;
  }
}

self.onmessage = async (e: MessageEvent<{ count: number; base: string }>) => {
  const { count, base } = e.data;
  const [face, land] = await Promise.all([mask(new URL('/portrait-mask.png', base).href), mask(new URL('/land-mask.png', base).href)]);
  const shapes = buildShapes(count, { face, land });
  (self as unknown as Worker).postMessage(shapes, [...shapes.positions.map((p) => p.buffer), shapes.info.buffer, shapes.info2.buffer]);
};
