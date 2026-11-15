import type { CSSProperties } from 'react';

interface Props {
  id: string;
  /** Where the host looks while resting here. "pointer" lets the cursor steer its gaze. */
  look?: 'front' | 'left' | 'right' | 'pointer';
  /** Short decorative line for the speech bubble. Never the only place a fact appears. */
  say?: string;
  /** Disc colour while resting here (defaults to the site accent). */
  accent?: string;
  /** 0–1. Lower values fade the coloured disc so the host recedes. */
  prominence?: number;
  /** Where the speech bubble sits. "auto" picks the roomier side of the head. */
  bubble?: 'auto' | 'top';
  /** "scrub" forces scroll-linked travel into this anchor even across columns (used for hero → about). */
  travel?: 'auto' | 'scrub';
  className?: string;
  style?: CSSProperties;
}

/**
 * Reserves a place for the host in a page layout. Renders an empty box with
 * the host's aspect ratio; the engine moves the one real host onto it.
 */
export function HostAnchor({ id, look = 'front', say, accent, prominence = 1, bubble = 'auto', travel = 'auto', className = '', style }: Props) {
  return (
    <div
      className={`host-slot ${className}`}
      style={style}
      data-host-anchor={id}
      data-look={look}
      data-say={say}
      data-accent={accent}
      data-prominence={prominence}
      data-bubble={bubble}
      data-travel={travel}
      aria-hidden="true"
    />
  );
}
