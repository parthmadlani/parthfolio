import type { HostRenderer } from './renderer';

/**
 * Image-based host renderer.
 *
 * Uses five pre-rendered illustration views (front, two three-quarter views,
 * two profiles) cut from Parth's avatar sheet. It does NOT rotate continuously:
 * it switches between the available drawn directions and adds a very small
 * whole-figure tilt. The face is never stretched or skewed.
 */
type View = 'front' | 'left' | 'right' | 'profile-left' | 'profile-right';

const SRC: Record<View, string> = {
  front: '/host/host-front.webp',
  left: '/host/host-left.webp',
  right: '/host/host-right.webp',
  'profile-left': '/host/host-profile-left.webp',
  'profile-right': '/host/host-profile-right.webp',
};

export class ImageHostRenderer implements HostRenderer {
  private figure: HTMLDivElement | null = null;
  private imgs = new Map<View, HTMLImageElement>();
  private view: View = 'front';
  private idle = 0;

  mount(container: HTMLElement) {
    const figure = document.createElement('div');
    figure.className = 'host-figure';
    const disc = document.createElement('div');
    disc.className = 'host-disc';
    figure.appendChild(disc);

    (Object.keys(SRC) as View[]).forEach((view) => {
      const img = document.createElement('img');
      img.className = 'host-view' + (view === 'front' ? ' is-on' : '');
      img.alt = '';
      img.decoding = 'async';
      img.draggable = false;
      img.width = 620;
      img.height = 936;
      if (view === 'front') img.src = SRC[view];
      figure.appendChild(img);
      this.imgs.set(view, img);
    });

    container.appendChild(figure);
    this.figure = figure;

    // Secondary views are fetched once the page is idle.
    const load = () => this.imgs.forEach((img, view) => !img.src && (img.src = SRC[view]));
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) this.idle = w.requestIdleCallback(load, { timeout: 1500 });
    else this.idle = window.setTimeout(load, 600);
  }

  setLook(yaw: number, pitch: number, still: boolean) {
    if (!this.figure) return;
    // Hysteresis: it takes a slightly larger turn to leave a view than to stay in it.
    const a = Math.abs(yaw);
    const cur = this.view;
    const inQuarter = cur === 'left' || cur === 'right';
    const inProfile = cur.startsWith('profile');
    let level: 0 | 1 | 2;
    if (inProfile) level = a > 0.78 ? 2 : a > 0.24 ? 1 : 0;
    else if (inQuarter) level = a > 0.9 ? 2 : a > 0.24 ? 1 : 0;
    else level = a > 0.9 ? 2 : a > 0.36 ? 1 : 0;
    const side = yaw < 0 ? 'left' : 'right';
    const next: View = level === 0 ? 'front' : level === 1 ? side : (`profile-${side}` as View);

    if (next !== cur) {
      const img = this.imgs.get(next)!;
      // Only switch to a view that has finished loading; otherwise keep the current one.
      if (img.complete && img.naturalWidth > 0) {
        this.imgs.get(cur)!.classList.remove('is-on');
        img.classList.add('is-on');
        this.view = next;
      }
    }

    if (still) {
      this.figure.style.transform = '';
    } else {
      // Residual tilt within the current view: a few pixels and under two degrees.
      const centre = this.view === 'front' ? 0 : (yaw < 0 ? -0.6 : 0.6) * (this.view.startsWith('profile') ? 1.6 : 1);
      const r = Math.max(-1, Math.min(1, (yaw - centre) * 2));
      this.figure.style.transform = `translate3d(${(r * 4).toFixed(2)}px, ${(pitch * 3).toFixed(2)}px, 0) rotate(${(r * 1.6).toFixed(2)}deg)`;
    }
  }

  destroy() {
    const w = window as Window & { cancelIdleCallback?: (id: number) => void };
    if (w.cancelIdleCallback) w.cancelIdleCallback(this.idle);
    clearTimeout(this.idle);
    this.figure?.remove();
    this.figure = null;
    this.imgs.clear();
  }
}
