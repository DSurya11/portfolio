import * as THREE from 'three';
import { buildShapes, loadMask, JABALPUR, type ShapeSet } from './shapes';
import { signalBus, SIGNAL_SECTIONS } from '../lib/signalBus';
import { ScrollTrigger, reducedMotion } from '../lib/motion';

const SHAPES = 7;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uIntro;
uniform float uSize;
uniform float uScaleFactor;
uniform float uMouseStrength;
uniform float uGlobal;
uniform vec2 uMouse;
uniform vec3 uCenter[7];
uniform float uScale[7];
uniform float uRotY[7];
uniform float uTiltX[7];
uniform float uAlpha[7];
uniform float uPt[7];
uniform vec3 uColA[7];
uniform vec3 uColB[7];

attribute vec3 aP1;
attribute vec3 aP2;
attribute vec3 aP3;
attribute vec3 aP4;
attribute vec3 aP5;
attribute vec3 aP6;
attribute vec4 aInfo;
attribute vec4 aInfo2;

varying vec3 vColor;
varying float vAlpha;

const float STREAM_LEN = 7.2;

vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c); }
vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c); }

float streamX() { return mod(aP3.x + uTime * 0.45 + STREAM_LEN * 0.5, STREAM_LEN) - STREAM_LEN * 0.5; }

vec3 rawShape(int i) {
  if (i == 0) return position;
  if (i == 1) return aP1;
  if (i == 2) return aP2;
  if (i == 3) {
    float x = streamX();
    float a = aP3.y + x * 0.9 + uTime * 0.12;
    return vec3(x, cos(a) * aP3.z, sin(a) * aP3.z);
  }
  if (i == 4) return aP4;
  if (i == 5) return aP5;
  return aP6;
}

vec3 placed(int i) {
  vec3 p = rawShape(i) * uScale[i];
  p = rotY(p, uRotY[i]);
  p = rotX(p, uTiltX[i]);
  return p + uCenter[i];
}

// Colour (rgb) and brightness (a) of this particle while it belongs to shape i.
vec4 look(int i) {
  float r = aInfo.x;
  vec3 col = mix(uColA[i], uColB[i], r * r);
  float a = 0.85;
  if (i == 0) {
    float l = aInfo.y;
    col = mix(uColA[0] * 0.6, uColB[0], smoothstep(0.12, 0.95, l));
    a = 0.3 + l * 1.05;
  } else if (i == 1) {
    float wave = -1.9 + fract(uTime * 0.2) * 3.8;
    float pulse = smoothstep(0.22, 0.0, abs(aP1.x - wave));
    if (aInfo.z < 0.0) { col = uColB[1]; a = 1.1 + pulse; }
    else { a = 0.45 + pulse * 1.4; }
    col = mix(col, vec3(1.0), pulse * 0.55);
  } else if (i == 3) {
    float x = streamX();
    float ends = smoothstep(STREAM_LEN * 0.5, STREAM_LEN * 0.5 - 1.0, abs(x));
    a = (aInfo2.z < 0.0 ? 0.35 : 1.0) * ends;
  } else if (i == 4) {
    float h = clamp(aP4.y, 0.0, 1.0);
    col = mix(uColA[4], uColB[4], h);
    float scan = -2.8 + fract(uTime * 0.12) * 5.6;
    a = 0.45 + h * 0.6 + smoothstep(0.25, 0.0, abs(aP4.x - scan)) * 0.9;
  } else if (i == 5) {
    a = aInfo.w > 0.5 ? 1.35 : 0.5;
    if (aInfo.w > 0.5) col = uColB[5];
  } else if (i == 6) {
    float kind = aInfo2.x;
    if (kind > 1.5) {
      float pulse = smoothstep(0.18, 0.0, abs(fract(uTime * 0.5) - aInfo2.y));
      col = mix(uColB[6], vec3(1.0), pulse);
      a = 1.2 + pulse * 1.5;
    } else if (kind > 0.5) { col = uColA[6]; a = 1.0; }
    else { col = uColB[6] * 0.7; a = 0.18; }
  }
  return vec4(col, a);
}

void main() {
  float m = clamp(uMorph, 0.0, 6.0);
  int i0 = int(floor(m));
  int i1 = i0 < 6 ? i0 + 1 : 6;
  float f = m - float(i0);
  float r = aInfo.x;
  // Particles leave at slightly different moments, so a morph reads as a flock, not a tween.
  float k = smoothstep(0.0, 1.0, clamp((f - r * 0.3) / 0.7, 0.0, 1.0));

  vec3 p = mix(placed(i0), placed(i1), k);
  float flight = sin(k * 3.14159);
  vec3 swirl = vec3(sin(r * 91.0 + uTime * 0.7), cos(r * 57.0 + uTime * 0.5), sin(r * 23.0 - uTime * 0.6));
  p += swirl * flight * 0.5;

  if (uIntro < 1.0) {
    float e = smoothstep(0.0, 1.0, clamp((uIntro - r * 0.45) / 0.55, 0.0, 1.0));
    vec3 from = aP2 * 5.5 + vec3(0.0, 0.0, -3.0);
    p = mix(from, p, e);
  }

  p += vec3(sin(uTime * 0.55 + r * 40.0), cos(uTime * 0.43 + r * 31.0), sin(uTime * 0.37 + r * 17.0)) * 0.012;

  vec2 d = p.xy - uMouse;
  float force = smoothstep(0.6, 0.0, length(d)) * uMouseStrength;
  p.xy += normalize(d + 0.0001) * force * 0.3;
  p.z += force * 0.3;

  vec4 l = mix(look(i0), look(i1), k);
  vColor = l.rgb + force * 0.3;
  vAlpha = l.a * mix(uAlpha[i0], uAlpha[i1], k) * uGlobal;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.55 + r * 0.9) * mix(uPt[i0], uPt[i1], k) * uScaleFactor / -mv.z;
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = pow(1.0 - d * 2.0, 1.7);
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;

const col = (hex: string) => new THREE.Color(hex);
// Per-shape colour pairs: cyan identity, with a second tone per section.
const COL_A = ['#00d4ff', '#00d4ff', '#00d4ff', '#00d4ff', '#7c3aed', '#00d4ff', '#00d4ff'].map(col);
const COL_B = ['#e8fbff', '#ffffff', '#7c3aed', '#a855f7', '#00d4ff', '#f59e0b', '#7c3aed'].map(col);
const POINT = [1.0, 1.05, 0.9, 0.95, 0.9, 0.95, 0.95];

// Shapes come from a worker; if workers or OffscreenCanvas are missing, build them here instead.
function shapesFor(count: number): Promise<ShapeSet> {
  const local = async () => {
    const [face, land] = await Promise.all([loadMask('/portrait-mask.png'), loadMask('/land-mask.png')]);
    return buildShapes(count, { face, land });
  };
  if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') return local();
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./shapes.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<ShapeSet>) => {
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = () => {
      worker.terminate();
      resolve(local());
    };
    worker.postMessage({ count, base: window.location.origin });
  });
}

export async function createSignal(canvas: HTMLCanvasElement) {
  const reduce = reducedMotion();
  const mobile = window.innerWidth < 768;
  const count = mobile ? 11000 : 24000;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const shapes = await shapesFor(count);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(shapes.positions[0], 3));
  for (let i = 1; i < SHAPES; i++) geometry.setAttribute(`aP${i}`, new THREE.BufferAttribute(shapes.positions[i], 3));
  geometry.setAttribute('aInfo', new THREE.BufferAttribute(shapes.info, 4));
  geometry.setAttribute('aInfo2', new THREE.BufferAttribute(shapes.info2, 4));

  const uniforms = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uIntro: { value: reduce ? 1 : 0 },
    uSize: { value: mobile ? 0.03 : 0.026 },
    uScaleFactor: { value: 1 },
    uMouseStrength: { value: 0 },
    uGlobal: { value: 1 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uCenter: { value: Array.from({ length: SHAPES }, () => new THREE.Vector3()) },
    uScale: { value: new Array(SHAPES).fill(1) },
    uRotY: { value: new Array(SHAPES).fill(0) },
    uTiltX: { value: new Array(SHAPES).fill(0) },
    uAlpha: { value: new Array(SHAPES).fill(1) },
    uPt: { value: POINT },
    uColA: { value: COL_A },
    uColB: { value: COL_B },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  const scene = new THREE.Scene();
  scene.add(points);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 10;

  // ── Layout: where each shape sits on screen, in world units at the z = 0 plane. ──
  let vw = 0;
  let vh = 0;
  let halfH = 0;
  let halfW = 0;
  let faceDoc = { x: 0, y: 0, h: 0 };
  let anchors: number[] = [];

  const measure = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    halfW = halfH * camera.aspect;
    uniforms.uScaleFactor.value = renderer.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));

    const anchor = document.getElementById('signal-face-anchor');
    if (anchor) {
      const r = anchor.getBoundingClientRect();
      faceDoc = { x: r.left + r.width / 2, y: r.top + window.scrollY + r.height / 2, h: r.height };
    }

    const maxCenter = document.documentElement.scrollHeight - vh / 2;
    let last = -Infinity;
    anchors = SIGNAL_SECTIONS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return last;
      const r = el.getBoundingClientRect();
      const c = Math.min(r.top + window.scrollY + r.height / 2, maxCenter - 1);
      last = Math.max(c, last + 1);
      return last;
    });
    anchors[0] = Math.min(anchors[0], vh / 2 + 1);
    layout();
  };

  const wide = () => vw >= 1024;

  const layout = () => {
    const u = uniforms;
    const s = Math.min(halfH, halfW * 1.1);
    const set = (i: number, x: number, y: number, z: number, scale: number, alpha: number) => {
      u.uCenter.value[i].set(x, y, z);
      u.uScale.value[i] = scale;
      u.uAlpha.value[i] = alpha;
    };
    set(0, 0, 0, 0, ((faceDoc.h / vh) * halfH) * 1.18, 1);
    set(1, wide() ? halfW * 0.32 : 0, wide() ? 0 : -halfH * 0.2, -1.2, s * (wide() ? 0.55 : 0.5), wide() ? 0.42 : 0.16);
    set(2, wide() ? -halfW * 0.42 : 0, 0, -1, s * (wide() ? 0.58 : 0.6), wide() ? 0.55 : 0.35);
    set(3, 0, wide() ? -halfH * 0.05 : 0, -1.5, Math.max(halfW / 3, 1.1), 0.55);
    set(4, 0, -halfH * 0.72, -0.5, halfW / 2.3, 0.7);
    set(5, 0, 0, -1, s * 0.85, 0.6);
    set(6, wide() ? halfW * 0.5 : 0, wide() ? -halfH * 0.16 : -halfH * 0.6, 0, s * (wide() ? 0.55 : 0.55), wide() ? 1 : 0.5);
  };

  // ── Input ──
  const mouse = { x: 0, y: 0, active: false, touchUntil: 0 };
  const fine = window.matchMedia('(pointer: fine)').matches;
  const onPointer = (e: PointerEvent) => {
    mouse.x = (e.clientX / vw) * 2 - 1;
    mouse.y = -((e.clientY / vh) * 2 - 1);
    mouse.active = true;
    if (e.pointerType !== 'mouse') mouse.touchUntil = performance.now() + 900;
  };
  const onLeave = () => {
    mouse.active = false;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);

  const onResize = () => measure();
  window.addEventListener('resize', onResize);
  ScrollTrigger.addEventListener('refresh', measure);
  window.addEventListener('load', measure);
  measure();
  // Fonts and lazy sections settle the page height a moment after first paint.
  const late = window.setTimeout(measure, 1200);

  // ── Frame loop ──
  let last = performance.now();
  let time = 0;
  let morph = 0;
  let introStart = -1;
  let raf = 0;
  const cam = { x: 0, y: 0 };

  const targetMorph = () => {
    const c = window.scrollY + vh / 2;
    if (c <= anchors[0]) return 0;
    for (let i = 0; i < anchors.length - 1; i++) {
      if (c < anchors[i + 1]) {
        const f = (c - anchors[i]) / (anchors[i + 1] - anchors[i]);
        // Hold each shape while its section is centred; morph in between.
        const t = Math.min(1, Math.max(0, (f - 0.18) / 0.64));
        return i + t;
      }
    }
    return anchors.length - 1;
  };

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += reduce ? 0 : dt;
    const u = uniforms;
    u.uTime.value = time;

    if (introStart < 0) introStart = time;
    if (!reduce) u.uIntro.value = Math.min(1, (time - introStart) / 2.4);

    const tm = targetMorph();
    morph = reduce ? tm : morph + (tm - morph) * Math.min(1, dt * 5);
    u.uMorph.value = morph;

    // The face scrolls with the hero, so it feels part of the page until it dissolves.
    const faceY = -(((faceDoc.y - window.scrollY) / vh) * 2 - 1) * halfH;
    u.uCenter.value[0].set(((faceDoc.x / vw) * 2 - 1) * halfW, faceY, 0);

    const touchLive = performance.now() < mouse.touchUntil;
    const wantForce = mouse.active && (touchLive || fine) ? 1 : 0;
    u.uMouseStrength.value += (wantForce - u.uMouseStrength.value) * Math.min(1, dt * 4);
    u.uMouse.value.set(mouse.x * halfW, mouse.y * halfH);
    u.uGlobal.value += ((signalBus.dim ? 0.18 : 1) - u.uGlobal.value) * Math.min(1, dt * 5);

    const mx = mouse.active ? mouse.x : 0;
    const my = mouse.active ? mouse.y : 0;
    u.uRotY.value[0] = mx * 0.3;
    u.uTiltX.value[0] = -my * 0.15;
    u.uRotY.value[1] = Math.sin(time * 0.2) * 0.45 + mx * 0.2;
    u.uTiltX.value[1] = 0.12;
    u.uRotY.value[2] = time * 0.12;
    u.uTiltX.value[2] = 0.3;
    u.uRotY.value[3] = -0.22;
    u.uTiltX.value[3] = 0.1;
    u.uRotY.value[4] = -0.18 + mx * 0.08;
    u.uTiltX.value[4] = 0.45;
    u.uRotY.value[5] = time * 0.1;
    u.uTiltX.value[5] = 0.32;
    u.uRotY.value[6] = THREE.MathUtils.degToRad(-JABALPUR.lon) + Math.sin(time * 0.15) * 0.5 + signalBus.globeSpin;
    u.uTiltX.value[6] = 0.4;

    cam.x += (mx * 0.35 - cam.x) * Math.min(1, dt * 2);
    cam.y += (my * 0.22 - cam.y) * Math.min(1, dt * 2);
    camera.position.set(cam.x, cam.y, 10);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };
  frame();

  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(late);
    window.removeEventListener('pointermove', onPointer);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('load', measure);
    ScrollTrigger.removeEventListener('refresh', measure);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
