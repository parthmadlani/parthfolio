import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * Motion preferences. `reduced` is true when the visitor's OS asks for reduced
 * motion or when they switch motion off with the header toggle. Non-React
 * engines (grid, host) read `motionState.reduced` directly.
 */
export const motionState = { reduced: false };

const KEY = 'pm-motion';
const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

function readStored(): boolean | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'reduced' ? true : v === 'full' ? false : null;
  } catch {
    return null;
  }
}

function apply(reduced: boolean) {
  motionState.reduced = reduced;
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  window.dispatchEvent(new CustomEvent('pm:motion'));
}

// Apply before first paint so entrance styles never flash.
if (typeof window !== 'undefined') apply(readStored() ?? !!mq?.matches);

interface MotionValue {
  reduced: boolean;
  toggle: () => void;
}

const Ctx = createContext<MotionValue>({ reduced: false, toggle: () => {} });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(motionState.reduced);

  useEffect(() => {
    if (!mq) return;
    const onChange = () => {
      if (readStored() === null) {
        apply(mq.matches);
        setReduced(mq.matches);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setReduced((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(KEY, next ? 'reduced' : 'full');
      } catch {
        /* storage unavailable: preference lasts for this visit */
      }
      apply(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ reduced, toggle }), [reduced, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useMotion = () => useContext(Ctx);
