import { motionState } from '../motion/motion';

/**
 * Living graph-paper grid.
 *
 * A regular grid of outlined squares drawn on a 2D canvas. Every line is a
 * polyline whose points are displaced by:
 *   1. a low-amplitude ambient wave (the "flexible paper"),
 *   2. a local bulge around the pointer (desktop only),
 *   3. a brief bend from scroll velocity and `pulse()` calls (page / host transitions).
 * All of it is scaled by an `energy` value that decays, so the sheet settles
 * when input stops. The grid is attached to the page: it scrolls with content.
 */

export interface GridHandle {
  destroy(): void;
}

let pendingPulse = 0;
/** Ask the grid to bend briefly. Safe to call when no grid is mounted. */
export function pulseGrid(strength = 0.6) {
  pendingPulse = Math.max(pendingPulse, strength);
}

export function createGrid(canvas: HTMLCanvasElement): GridHandle {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy() {} };

  let w = 0;
  let h = 0;
  let dpr = 1;
  let cell = 48;
  let raf = 0;
  let running = false;
  let last = performance.now();
  let t = 0;

  let energy = 1.1; // opening: the sheet arrives with a bend, then settles
  let intro = 0; // 0 → 1 line fade-in
  let calm = 0;
  let calmTarget = 0;
  let calmCheck = 0;

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let px = -9999;
  let py = -9999;
  let sx = -9999;
  let sy = -9999;
  let pointerForce = 0;

  let scrollY = window.scrollY;
  let lastScrollY = scrollY;
  let scrollVel = 0;
  let frame = 0;
  let dirty = true;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, w < 800 ? 2 : 1.5);
    cell = w < 600 ? 34 : w < 1100 ? 42 : 50;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    dirty = true;
  }

  function displace(x: number, y: number, amp: number, out: [number, number]) {
    const Y = y + scrollY; // waves live on the paper, not the screen
    let dx = 0;
    let dy = 0;
    if (amp > 0.01) {
      dx = amp * (Math.sin(Y * 0.0061 + t * 0.55 + x * 0.0017) + 0.5 * Math.sin(Y * 0.0138 - t * 0.38 + 1.3));
      dy = amp * (Math.sin(x * 0.0067 + t * 0.47 + Y * 0.0021) + 0.5 * Math.sin(x * 0.0149 + t * 0.33 + 2.1));
      dy += scrollVel * 0.035 * Math.sin(x * 0.0042 + t * 0.9);
    }
    if (pointerForce > 0.01) {
      const rx = x - sx;
      const ry = y - sy;
      const d2 = rx * rx + ry * ry;
      if (d2 < 250000) {
        const g = Math.exp(-d2 / 42000) * pointerForce * 0.085;
        dx += rx * g;
        dy += ry * g;
      }
    }
    out[0] = x + dx;
    out[1] = y + dy;
  }

  const p: [number, number] = [0, 0];

  function draw() {
    const reduced = motionState.reduced;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, w, h);
    const amp = reduced ? 0 : cell * (0.06 + 0.3 * Math.min(energy, 1.4)) * (1 - 0.75 * calm) * (w < 760 ? 0.6 : 1);
    const alpha = (0.15 - 0.045 * calm) * (reduced ? 1 : intro);
    ctx!.strokeStyle = `rgba(22, 24, 34, ${alpha.toFixed(3)})`;
    ctx!.lineWidth = 1;
    // Straight lines need only their two end points; bent lines are sampled every half cell.
    const step = amp < 0.01 ? Math.max(w, h) + cell * 4 : cell / 2;
    const pad = cell * 2;
    const offY = -(((scrollY % cell) + cell) % cell);

    const spanY = h + pad * 2;
    const spanX = w + pad * 2;
    const nY = Math.ceil(spanY / step);
    const nX = Math.ceil(spanX / step);

    ctx!.beginPath();
    for (let x = -pad + ((w / 2) % cell); x <= w + pad; x += cell) {
      for (let i = 0; i <= nY; i++) {
        displace(x, -pad + Math.min(i * step, spanY), amp, p);
        if (i === 0) ctx!.moveTo(p[0], p[1]);
        else ctx!.lineTo(p[0], p[1]);
      }
    }
    for (let y = offY - pad; y <= h + pad; y += cell) {
      for (let i = 0; i <= nX; i++) {
        displace(-pad + Math.min(i * step, spanX), y, amp, p);
        if (i === 0) ctx!.moveTo(p[0], p[1]);
        else ctx!.lineTo(p[0], p[1]);
      }
    }
    ctx!.stroke();
  }

  function checkCalm() {
    const mid = h / 2;
    calmTarget = 0;
    const els = document.querySelectorAll<HTMLElement>('[data-grid-calm]');
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < mid && r.bottom > mid) {
        calmTarget = 1;
        break;
      }
    }
  }

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    frame++;

    scrollY = window.scrollY;
    const dy = scrollY - lastScrollY;
    lastScrollY = scrollY;

    if (motionState.reduced) {
      if (dy !== 0 || dirty) {
        dirty = false;
        draw();
      }
      return;
    }

    if (pendingPulse > 0) {
      energy = Math.min(1.5, energy + pendingPulse);
      pendingPulse = 0;
    }
    const k = 1 - Math.exp(-dt * 8);
    scrollVel += (Math.max(-60, Math.min(60, dy)) - scrollVel) * k;
    energy = Math.min(1.5, energy + Math.min(Math.abs(dy), 80) * 0.0016);
    energy *= Math.exp(-dt * 1.35);
    intro = Math.min(1, intro + dt * 1.6);

    if (fine) {
      sx += (px - sx) * (1 - Math.exp(-dt * 10));
      sy += (py - sy) * (1 - Math.exp(-dt * 10));
      pointerForce *= Math.exp(-dt * 2.2);
    }

    if (now - calmCheck > 300) {
      calmCheck = now;
      checkCalm();
    }
    calm += (calmTarget - calm) * (1 - Math.exp(-dt * 3));

    t += dt * (0.35 + Math.min(energy, 1) * 1.6);

    // At rest the sheet drifts very slowly: half the frames are enough.
    const resting = energy < 0.02 && pointerForce < 0.02 && Math.abs(scrollVel) < 0.2 && dy === 0;
    if (resting && frame % 2 === 1 && !dirty) return;
    dirty = false;
    draw();
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (px < -9000) {
      sx = e.clientX;
      sy = e.clientY;
    }
    const moved = Math.hypot(e.clientX - px, e.clientY - py);
    px = e.clientX;
    py = e.clientY;
    pointerForce = Math.min(1, pointerForce + Math.min(moved, 60) * 0.012);
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  const onMotion = () => {
    dirty = true;
  };

  resize();
  window.addEventListener('resize', resize);
  if (fine) window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pm:motion', onMotion);
  start();

  return {
    destroy() {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pm:motion', onMotion);
    },
  };
}
