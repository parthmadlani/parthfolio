import { useEffect, useRef } from 'react';
import { createGrid } from './gridEngine';

/** Fixed, decorative canvas behind every page. */
export function LivingGrid() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    try {
      const grid = createGrid(ref.current);
      return () => grid.destroy();
    } catch {
      // A plain CSS grid takes over if the canvas cannot be used.
      document.documentElement.classList.add('grid-fallback');
      ref.current.style.display = 'none';
    }
  }, []);
  return <canvas ref={ref} className="living-grid" aria-hidden="true" />;
}
