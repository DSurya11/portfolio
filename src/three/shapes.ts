// Point-cloud generators for the "Signal" particle field. Every shape returns the same number of
// points so the shader can morph any particle from one shape to the next.

export type Masks = { face: ImageData | null; land: ImageData | null };

export type ShapeSet = {
  count: number;
  positions: Float32Array[]; // one xyz array per shape, in SIGNAL_SECTIONS order
  info: Float32Array; // rand, face brightness, network edge t (-1 = node), ring accent
  info2: Float32Array; // globe kind (0 ocean, 1 land, 2 beacon), beacon height, stream strand, spare
};

const TAU = Math.PI * 2;

export const JABALPUR = { lat: 23.18, lon: 79.95 };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(TAU * r());
}

function randomOnSphere(r: () => number): [number, number, number] {
  const u = r() * 2 - 1;
  const a = r() * TAU;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(a), u, s * Math.sin(a)];
}

function fromLatLon(lat: number, lon: number): [number, number, number] {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}

// Your portrait: particles land on pixels in proportion to their brightness, and depth comes
// from a head-shaped bulge plus a little relief from the brightness itself.
function face(n: number, r: () => number, mask: ImageData | null, out: Float32Array, info: Float32Array) {
  if (!mask) {
    for (let i = 0; i < n; i++) {
      const [x, y, z] = randomOnSphere(r);
      out.set([x * 0.8, y * 0.8, z * 0.8], i * 3);
      info[i * 4 + 1] = 0.6;
    }
    return;
  }
  const { width: w, height: h, data } = mask;
  const cdf = new Float32Array(w * h);
  let total = 0;
  for (let p = 0; p < w * h; p++) {
    const v = data[p * 4] / 255;
    total += v > 0.05 ? Math.pow(v, 1.15) : 0;
    cdf[p] = total;
  }
  for (let i = 0; i < n; i++) {
    const target = r() * total;
    let lo = 0;
    let hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const px = lo % w;
    const py = (lo / w) | 0;
    const lum = data[lo * 4] / 255;
    const x = ((px + r()) / w) * 2 - 1;
    const y = -(((py + r()) / h) * 2 - 1);
    const d2 = (x / 0.62) ** 2 + ((y - 0.18) / 0.85) ** 2;
    const z = 0.42 * Math.sqrt(Math.max(0, 1 - d2)) + lum * 0.14 - 0.12;
    out.set([x, y, z], i * 3);
    info[i * 4 + 1] = lum;
  }
}

// A small feed-forward network in 3D: layers of nodes joined by every edge between neighbours.
function network(n: number, r: () => number, out: Float32Array, info: Float32Array) {
  const sizes = [5, 8, 11, 8, 5];
  const layers = sizes.map((size, li) => {
    const x = -1.6 + li * 0.8;
    const radius = 0.22 + size * 0.06;
    return Array.from({ length: size }, (_, k) => {
      const a = (k / size) * TAU + li * 0.4;
      return [x, Math.cos(a) * radius, Math.sin(a) * radius * 0.7] as const;
    });
  });
  const nodes = layers.flat();
  const edges: [readonly number[], readonly number[]][] = [];
  for (let li = 0; li < layers.length - 1; li++)
    for (const a of layers[li]) for (const b of layers[li + 1]) edges.push([a, b]);

  for (let i = 0; i < n; i++) {
    if (r() < 0.24) {
      const node = nodes[(r() * nodes.length) | 0];
      out.set([node[0] + gauss(r) * 0.03, node[1] + gauss(r) * 0.03, node[2] + gauss(r) * 0.03], i * 3);
      info[i * 4 + 2] = -1;
    } else {
      const [a, b] = edges[(r() * edges.length) | 0];
      const t = r();
      out.set(
        [
          a[0] + (b[0] - a[0]) * t + gauss(r) * 0.006,
          a[1] + (b[1] - a[1]) * t + gauss(r) * 0.006,
          a[2] + (b[2] - a[2]) * t + gauss(r) * 0.006,
        ],
        i * 3,
      );
      info[i * 4 + 2] = t;
    }
  }
}

// A shell with three tilted orbit rings around it.
function sphere(n: number, r: () => number, out: Float32Array) {
  const shell = Math.floor(n * 0.8);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    if (i < shell) {
      const y = 1 - (i / (shell - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const a = i * golden;
      const k = 1 + (r() - 0.5) * 0.025;
      out.set([Math.cos(a) * rad * k, y * k, Math.sin(a) * rad * k], i * 3);
    } else {
      const ring = i % 3;
      const a = r() * TAU;
      const R = 1.32 + ring * 0.1 + gauss(r) * 0.008;
      const tilt = [0.35, -0.6, 1.2][ring];
      const x = Math.cos(a) * R;
      const z0 = Math.sin(a) * R;
      out.set([x, z0 * Math.sin(tilt), z0 * Math.cos(tilt)], i * 3);
    }
  }
}

// Stored as (x, angle, radius); the shader turns it into a twisting stream that flows along x.
function stream(n: number, r: () => number, out: Float32Array, info2: Float32Array) {
  const strands = 7;
  for (let i = 0; i < n; i++) {
    const x = (r() * 2 - 1) * 3.6;
    if (r() < 0.82) {
      const s = i % strands;
      out.set([x, (s / strands) * TAU + gauss(r) * 0.07, 0.5 + gauss(r) * 0.035], i * 3);
      info2[i * 4 + 2] = s;
    } else {
      out.set([x, r() * TAU, 0.15 + r() * 1.05], i * 3);
      info2[i * 4 + 2] = -1;
    }
  }
}

// A wireframe landscape whose ridge climbs from left to right and peaks near the right edge.
function ridgeHeight(x: number, z: number) {
  const climb = 1 / (1 + Math.exp(-1.7 * (x - 0.1)));
  const fall = 1 - 0.3 * Math.max(0, x - 1.9);
  const wobble = 0.08 * Math.sin(4.3 * x + 1.2) + 0.05 * Math.sin(9.1 * x);
  const ridge = (0.12 + 0.95 * climb * fall + wobble) * Math.exp(-(z * z) / 0.32);
  return ridge + 0.04 * Math.sin(3 * x + 5 * z);
}

function terrain(n: number, r: () => number, out: Float32Array) {
  const rows = 15;
  const cols = 44;
  for (let i = 0; i < n; i++) {
    let x: number;
    let z: number;
    if (r() < 0.55) {
      z = -1 + (2 * ((r() * rows) | 0)) / (rows - 1);
      x = (r() * 2 - 1) * 2.6;
    } else {
      x = -2.6 + (5.2 * ((r() * cols) | 0)) / (cols - 1);
      z = r() * 2 - 1;
    }
    out.set([x, ridgeHeight(x, z) * 0.95, z], i * 3);
  }
}

// A torus with five brighter knots, one for each certificate on the ring carousel.
function ring(n: number, r: () => number, out: Float32Array, info: Float32Array) {
  for (let i = 0; i < n; i++) {
    const knot = r() < 0.18;
    const a = knot ? (((r() * 5) | 0) / 5) * TAU + gauss(r) * 0.05 : r() * TAU;
    const tube = knot ? 0.07 : 0.1;
    const b = r() * TAU;
    const rr = Math.abs(gauss(r)) * tube;
    const R = 1.35 + Math.cos(b) * rr;
    out.set([Math.cos(a) * R, Math.sin(b) * rr, Math.sin(a) * R], i * 3);
    info[i * 4 + 3] = knot ? 1 : 0;
  }
}

// Land dots sampled from a small world map, a faint ocean, and a beam rising from Jabalpur.
function globe(n: number, r: () => number, land: ImageData | null, out: Float32Array, info2: Float32Array) {
  const isLand = (lat: number, lon: number) => {
    if (!land) return r() < 0.3;
    const u = Math.min(land.width - 1, Math.floor(((lon + 180) / 360) * land.width));
    const v = Math.min(land.height - 1, Math.floor(((90 - lat) / 180) * land.height));
    return land.data[(v * land.width + u) * 4] < 110;
  };
  const beacon = fromLatLon(JABALPUR.lat, JABALPUR.lon);
  for (let i = 0; i < n; i++) {
    const roll = r();
    if (roll < 0.06) {
      const t = Math.pow(r(), 1.6);
      const h = 1 + t * 0.55;
      out.set(
        [beacon[0] * h + gauss(r) * 0.008, beacon[1] * h + gauss(r) * 0.008, beacon[2] * h + gauss(r) * 0.008],
        i * 3,
      );
      info2[i * 4] = 2;
      info2[i * 4 + 1] = t;
      continue;
    }
    const wantLand = roll < 0.8;
    let p = randomOnSphere(r);
    for (let tries = 0; tries < 40; tries++) {
      const lat = (Math.asin(p[1]) * 180) / Math.PI;
      const lon = (Math.atan2(p[0], p[2]) * 180) / Math.PI;
      if (isLand(lat, lon) === wantLand) break;
      p = randomOnSphere(r);
    }
    out.set(p, i * 3);
    info2[i * 4] = wantLand ? 1 : 0;
  }
}

export function buildShapes(count: number, masks: Masks): ShapeSet {
  const r = mulberry32(1948);
  const positions = Array.from({ length: 7 }, () => new Float32Array(count * 3));
  const info = new Float32Array(count * 4);
  const info2 = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) info[i * 4] = r();

  face(count, mulberry32(11), masks.face, positions[0], info);
  network(count, mulberry32(22), positions[1], info);
  sphere(count, mulberry32(33), positions[2]);
  stream(count, mulberry32(44), positions[3], info2);
  terrain(count, mulberry32(55), positions[4]);
  ring(count, mulberry32(66), positions[5], info);
  globe(count, mulberry32(77), masks.land, positions[6], info2);

  return { count, positions, info, info2 };
}

export function loadMask(url: string, size?: number): Promise<ImageData | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = size ?? img.naturalWidth;
      const h = size ? Math.round((img.naturalHeight / img.naturalWidth) * size) : img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(ctx.getImageData(0, 0, w, h));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
