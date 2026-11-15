import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Location, NavigationType } from 'react-router-dom';
import { motionState } from '../motion/motion';
import { pulseGrid } from '../grid/gridEngine';

const positions = new Map<string, number>();

/**
 * Native scrolling with predictable navigation:
 * Receives the location that is actually rendered (see App.tsx), so scroll
 * changes happen at the moment the pages swap, while nothing is visible.
 * - new page → top (or the #hash target),
 * - back / forward → the position you left,
 * - same-page hash links → smooth scroll to the section.
 */
export function ScrollManager({ location, type }: { location: Location; type: NavigationType }) {
  const keyRef = useRef(location.key);
  const pathRef = useRef(location.pathname);
  const first = useRef(true);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const onScroll = () => positions.set(keyRef.current, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    const samePage = pathRef.current === location.pathname;
    keyRef.current = location.key;
    pathRef.current = location.pathname;
    const isFirst = first.current;
    first.current = false;
    if (!samePage) pulseGrid(0.8);

    const saved = positions.get(location.key);
    if (type === 'POP' && saved !== undefined && !isFirst) {
      window.scrollTo(0, saved);
      return;
    }
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) {
        el.scrollIntoView({ behavior: samePage && !isFirst && !motionState.reduced ? 'smooth' : 'auto', block: 'start' });
        return;
      }
    }
    if (!isFirst) window.scrollTo({ top: 0, behavior: samePage && !motionState.reduced ? 'smooth' : 'auto' });
  }, [location, type]);

  return null;
}
