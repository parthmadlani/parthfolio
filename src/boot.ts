import { pulseGrid } from './grid/gridEngine';

/**
 * Loading screen.
 *
 * The markup and styles live inline in index.html so they paint before
 * anything else. Progress here is real: it counts the things the first screen
 * actually needs (the app itself, three font families and the host's front
 * view). Nothing is simulated. The screen stays for a short minimum so it does
 * not flash on fast connections, and never longer than MAX_MS.
 *
 * When it lifts, `pm-ready` is added to <html> and a `pm:ready` event fires.
 * The hero opening, the host's entrance and its first speech bubble wait for that.
 */
const MIN_MS = 900;
const MAX_MS = 4500;

let ready = false;
export const isReady = () => ready;

/** Run `fn` once the loading screen has lifted (immediately if it already has). */
export function whenReady(fn: () => void): () => void {
  if (ready) {
    fn();
    return () => {};
  }
  window.addEventListener('pm:ready', fn, { once: true });
  return () => window.removeEventListener('pm:ready', fn);
}

function finish(loader: HTMLElement | null) {
  if (ready) return;
  ready = true;
  clearTimeout((window as Window & { __pmLoaderFallback?: number }).__pmLoaderFallback);
  document.documentElement.classList.add('pm-ready');
  pulseGrid(0.9);
  window.dispatchEvent(new Event('pm:ready'));
  if (!loader) return;
  loader.classList.add('is-done');
  window.setTimeout(() => loader.remove(), 1100);
}

export function boot() {
  const loader = document.getElementById('loader');
  const rect = document.getElementById('loader-rect');
  const count = document.getElementById('loader-count');
  const text = loader?.querySelector('.loader-text');

  const fonts: Promise<unknown>[] = document.fonts
    ? [
        document.fonts.load('800 1em "Bricolage Grotesque Variable"'),
        document.fonts.load('500 1em "IBM Plex Mono"'),
        document.fonts.load('600 1em "Caveat Variable"'),
      ]
    : [];
  const avatar = new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = '/host/host-front.webp';
  });
  // The first item is this script having loaded and run.
  const tasks: Promise<unknown>[] = [Promise.resolve(), ...fonts, avatar];

  let done = 0;
  const total = tasks.length;
  const paint = () => {
    if (count) count.textContent = `${done} / ${total}`;
    if (rect) rect.style.strokeDashoffset = String(384 * (1 - done / total));
  };
  paint();
  tasks.forEach((t) =>
    t
      .catch(() => {})
      .then(() => {
        done++;
        paint();
      }),
  );

  const started = performance.now();
  const cap = new Promise((r) => window.setTimeout(r, MAX_MS));
  Promise.race([Promise.allSettled(tasks), cap]).then(() => {
    if (text) text.textContent = 'Ready';
    const wait = Math.max(0, MIN_MS - (performance.now() - started)) + 180;
    window.setTimeout(() => finish(loader), wait);
  });
}
