import { motionState } from '../motion/motion';
import { pulseGrid } from '../grid/gridEngine';
import { HOST_ASPECT, type HostRenderer } from './renderer';

/**
 * Host choreography.
 *
 * Pages place invisible "anchors" (<HostAnchor/>) in their layout. Each anchor
 * reserves real space, so the host never sits on top of content. Every frame
 * the engine finds the anchors just above and below the middle of the viewport
 * and places the single host element between them according to scroll
 * position: it rests on an anchor while that section is being read and travels
 * to the next one in the gap between sections. Because the position is a pure
 * function of scroll, reversing direction simply plays the journey backwards.
 *
 * Route changes (and any other sudden change of target) are bridged with a
 * short "glide" from wherever the host currently is, so it never teleports and
 * there is only ever one host on screen.
 *
 * The host is never positioned by the pointer. The pointer only influences
 * where it looks, and only at anchors that opt in with look="pointer".
 */

interface Box {
  x: number;
  y: number;
  w: number;
}

interface Anchor {
  el: HTMLElement;
  look: string;
  say: string;
  accent: string;
  prominence: number;
  bubble: string;
  travel: string;
}

export interface HostEngine {
  /** Bridge the next change of target with a glide (used on route changes). */
  glide(durationMs?: number): void;
  refresh(): void;
  destroy(): void;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10); // smootherstep
// Glide curve: no snap at the start, most of the distance covered early, long soft landing.
// It lands on the same beat as the page entrance (--ease-out in base.css).
const easeGlide = (t: number) => {
  const s = t * t * (3 - 2 * t);
  return 1 - (1 - s) * (1 - s);
};

export function createHostEngine(root: HTMLElement, bubble: HTMLElement, renderer: HostRenderer): HostEngine {
  const bubbleText = bubble.querySelector<HTMLElement>('[data-bubble-text]')!;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let anchors: Anchor[] = [];
  let anchorsDirty = true;
  let lastRefresh = 0;

  let raf = 0;
  let running = false;
  let last = performance.now();
  let readyAt = 0;

  let shown: Box | null = null; // what is on screen now
  let glide: { from: Box; start: number; dur: number } | null = null;
  let forceGlide = 0;
  let lastScrollY = window.scrollY;
  let pairKey = '';
  let eSmooth = 0;
  let hopE = 0;
  let lastTarget: Box | null = null;

  let px = window.innerWidth / 2;
  let py = window.innerHeight / 2;
  let hasPointer = false;
  let yaw = 0;
  let pitch = 0;
  let vx = 0;

  let saying = '';
  let sayShown = '';
  let sayAt = 0;
  let accent = '';
  let prominence = -1;
  let visible = false;
  let lastAnchorEl: HTMLElement | null = null;

  function readAnchors() {
    anchorsDirty = false;
    anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-host-anchor]')).map((el) => ({
      el,
      look: el.dataset.look || 'front',
      say: el.dataset.say || '',
      accent: el.dataset.accent || '',
      prominence: el.dataset.prominence ? Number(el.dataset.prominence) : 1,
      bubble: el.dataset.bubble || 'auto',
      travel: el.dataset.travel || 'auto',
    }));
  }

  function boxOf(r: DOMRect, vh: number): Box {
    const h = r.width / HOST_ASPECT;
    // Anchors far outside the viewport are treated as "just off screen".
    return { x: r.left, y: clamp(r.top, -h * 1.15, vh + h * 0.15), w: r.width };
  }

  function setVisible(v: boolean) {
    if (v === visible) return;
    visible = v;
    root.classList.toggle('is-visible', v);
    if (!v) bubble.classList.remove('is-on');
  }

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const reduced = motionState.reduced;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (anchorsDirty || now - lastRefresh > 600) {
      lastRefresh = now;
      readAnchors();
    }

    // Measure anchors that are actually laid out.
    const live: { a: Anchor; r: DOMRect; cy: number }[] = [];
    for (const a of anchors) {
      if (!a.el.isConnected) {
        anchorsDirty = true;
        continue;
      }
      const r = a.el.getBoundingClientRect();
      if (r.width < 2) continue;
      live.push({ a, r, cy: r.top + r.width / HOST_ASPECT / 2 });
    }
    if (!live.length) {
      setVisible(false);
      return;
    }
    live.sort((m, n) => m.cy - n.cy);

    const mid = vh * 0.5;
    let ia = -1;
    for (let i = 0; i < live.length; i++) if (live[i].cy <= mid) ia = i;
    const A = live[Math.max(ia, 0)];
    const B = ia < 0 ? live[0] : live[Math.min(ia + 1, live.length - 1)];

    // Three regimes, chosen per pair of neighbouring anchors:
    //  - stay:  anchors more than a screen apart. The host stays with its
    //           section, leaves with it and is waiting at the next one.
    //  - scrub: anchors close and roughly in the same column (or explicitly
    //           marked travel="scrub"). The host travels with the scroll, and
    //           the journey reverses when the scroll does.
    //  - hop:   anchors close but in different columns, and everything on
    //           small screens. Scrubbing would park the host on top of text
    //           if the visitor stopped mid-way, so it makes one short,
    //           time-based hop at the half-way point instead.
    const hA = A.r.width / HOST_ASPECT;
    const hB = B.r.width / HOST_ASPECT;
    const gap = B.cy - A.cy;
    const far = A !== B && gap > vh + (hA + hB) / 2 + 40;
    const dxc = Math.abs(B.r.left + B.r.width / 2 - (A.r.left + A.r.width / 2));
    const scrub = A !== B && !far && !reduced && vw > 760 && (dxc < vw * 0.3 || B.a.travel === 'scrub');
    const key = `${live.indexOf(A)}:${live.indexOf(B)}:${live.length}`;
    const samePair = key === pairKey;
    let e = 0;
    let hopFlip = false;
    if (far) {
      e = A.r.top + hA > -20 ? 0 : 1;
    } else if (scrub) {
      const hold = Math.min(gap * 0.2, vh * 0.26);
      const raw = clamp((mid - A.cy - hold) / Math.max(gap - hold * 2, 1), 0, 1);
      e = smooth(raw);
    } else if (A !== B) {
      // 40px of hysteresis so the host does not flip back and forth at the half-way line.
      const d = mid - A.cy;
      const prev = samePair ? hopE : d > gap / 2 ? 1 : 0;
      e = d > gap / 2 + 40 ? 1 : d < gap / 2 - 40 ? 0 : prev;
      hopFlip = samePair && e !== hopE;
      hopE = e;
    }
    if (!samePair || !scrub) {
      pairKey = key;
      eSmooth = e;
    } else {
      eSmooth += (e - eSmooth) * (1 - Math.exp(-dt * 9));
    }

    const ba = far ? { x: A.r.left, y: A.r.top, w: A.r.width } : boxOf(A.r, vh);
    const bb = far ? { x: B.r.left, y: B.r.top, w: B.r.width } : boxOf(B.r, vh);
    const target: Box = {
      x: lerp(ba.x, bb.x, eSmooth),
      y: lerp(ba.y, bb.y, eSmooth),
      w: lerp(ba.w, bb.w, eSmooth),
    };
    const near = eSmooth < 0.5 ? A : B;
    const settled = A === B || eSmooth < 0.04 || eSmooth > 0.96;

    // Glide when the target changed for a reason other than scrolling.
    const scrollY = window.scrollY;
    const dScroll = Math.abs(scrollY - lastScrollY);
    lastScrollY = scrollY;
    if (shown && !reduced) {
      const off = (b: Box) => b.y + b.w / HOST_ASPECT < 30 || b.y > vh - 30;
      const jump = Math.hypot(target.x - shown.x, target.y - shown.y);
      // "Sudden" = the destination itself moved by more than scrolling explains.
      // Measured on the target, so it also re-aims a glide that is already under way.
      const ref = lastTarget ?? shown;
      const targetJump = Math.hypot(target.x - ref.x, target.y - ref.y);
      const sudden = targetJump - dScroll > Math.max(180, vh * 0.3) && !(off(shown) && off(target));
      if (forceGlide || sudden || hopFlip) {
        const h = shown.w / HOST_ASPECT;
        const from = { ...shown, y: clamp(shown.y, -h * 1.1, vh + h * 0.1) };
        glide = { from, start: now, dur: forceGlide || clamp(jump * 0.9, 500, 900) };
        pulseGrid(0.5);
      }
    }
    forceGlide = 0;
    lastTarget = target;

    let next = target;
    let gliding = false;
    if (glide && !reduced) {
      const p = clamp((now - glide.start) / glide.dur, 0, 1);
      const g = p >= 1 ? 1 : easeGlide(p);
      const dist = Math.hypot(target.x - glide.from.x, target.y - glide.from.y);
      next = {
        x: lerp(glide.from.x, target.x, g),
        y: lerp(glide.from.y, target.y, g) - Math.sin(Math.PI * p) * Math.min(28, dist * 0.05),
        w: lerp(glide.from.w, target.w, g),
      };
      gliding = p < 1;
      if (!gliding) glide = null;
    } else {
      glide = null;
    }

    const moveX = shown ? next.x + next.w / 2 - (shown.x + shown.w / 2) : 0;
    vx += (moveX - vx) * (1 - Math.exp(-dt * 10));
    shown = next;

    root.style.transform = `translate3d(${next.x.toFixed(1)}px, ${next.y.toFixed(1)}px, 0)`;
    root.style.width = `${next.w.toFixed(1)}px`;
    setVisible(true);

    // A new resting place bends the paper a little.
    if (settled && !gliding && near.a.el !== lastAnchorEl) {
      if (lastAnchorEl) pulseGrid(0.35);
      lastAnchorEl = near.a.el;
    }

    // Prominence and accent follow the nearest anchor.
    const prom = A === B ? A.a.prominence : lerp(A.a.prominence, B.a.prominence, eSmooth);
    if (Math.abs(prom - prominence) > 0.005) {
      prominence = prom;
      root.style.setProperty('--host-p', prom.toFixed(3));
    }
    if (near.a.accent !== accent) {
      accent = near.a.accent;
      if (accent) root.style.setProperty('--host-accent', accent);
      else root.style.removeProperty('--host-accent');
    }

    // Where to look.
    let yawTarget = 0;
    let pitchTarget = 0;
    const travelling = !settled || gliding;
    if (travelling && Math.abs(vx) > 1.4) {
      yawTarget = Math.sign(vx) * (gliding && Math.abs(vx) > 9 ? 1 : 0.6);
    } else if (!travelling) {
      const look = near.a.look;
      if (look === 'left') yawTarget = -0.6;
      else if (look === 'right') yawTarget = 0.6;
      else if (look === 'pointer' && fine && hasPointer && !reduced) {
        const cx = next.x + next.w / 2;
        const cy = next.y + (next.w / HOST_ASPECT) * 0.3;
        yawTarget = clamp((px - cx) / (vw * 0.42), -0.72, 0.72);
        pitchTarget = clamp((py - cy) / (vh * 0.6), -1, 1);
      }
    }
    if (reduced) {
      yaw = yawTarget;
      pitch = 0;
    } else {
      yaw += (yawTarget - yaw) * (1 - Math.exp(-dt * 7));
      pitch += (pitchTarget - pitch) * (1 - Math.exp(-dt * 7));
    }
    renderer.setLook(yaw, pitch, reduced);

    // Speech bubble: only while resting on an anchor that has something to say.
    if (!readyAt && document.documentElement.classList.contains('pm-ready')) readyAt = now;
    const want = !travelling && readyAt && now - readyAt > 1300 ? near.a.say : '';
    if (want !== saying) {
      saying = want;
      sayAt = now;
      bubble.classList.remove('is-on');
    }
    if (saying !== sayShown && now - sayAt > 200) {
      sayShown = saying;
      bubbleText.textContent = saying;
    }
    if (saying && saying === sayShown) {
      const h = next.w / HOST_ASPECT;
      const need = (bubbleText.offsetWidth || 200) + 12;
      const headY = next.y + h * 0.2;
      let side: 'left' | 'right' | 'top' = near.a.bubble === 'top' && vw > 760 && next.y > 170 ? 'top' : next.x + next.w / 2 > vw / 2 ? 'left' : 'right';
      if (side === 'top') {
        /* requested by the anchor */
      } else if (side === 'left' && next.x + next.w * 0.1 < need) side = vw - (next.x + next.w * 0.9) > need ? 'right' : 'top';
      else if (side === 'right' && vw - (next.x + next.w * 0.9) < need) side = next.x + next.w * 0.1 > need ? 'left' : 'top';
      let bx: number;
      let by = headY;
      if (side === 'left') bx = next.x + next.w * 0.1;
      else if (side === 'right') bx = next.x + next.w * 0.9;
      else {
        bx = clamp(next.x + next.w / 2, need / 2 + 8, vw - need / 2 - 8);
        by = next.y - 4;
      }
      bubble.dataset.side = side;
      bubble.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0)`;
      bubble.classList.add('is-on');
    }
  }

  const onMove = (ev: PointerEvent) => {
    if (ev.pointerType !== 'mouse') return;
    px = ev.clientX;
    py = ev.clientY;
    hasPointer = true;
  };
  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  const onDirty = () => {
    anchorsDirty = true;
  };

  if (fine) window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('resize', onDirty);
  document.addEventListener('visibilitychange', onVisibility);
  start();

  return {
    glide(durationMs = 760) {
      anchorsDirty = true;
      forceGlide = durationMs;
    },
    refresh: onDirty,
    destroy() {
      stop();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onDirty);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
