import { useEffect, useLayoutEffect, useRef } from 'react';
import { createHostEngine, type HostEngine } from './hostEngine';
import { ImageHostRenderer } from './imageRenderer';
import type { HostRenderer } from './renderer';

/**
 * To use a rigged 3D character later, implement HostRenderer (see renderer.ts)
 * and return it here. Nothing else needs to change.
 */
function createRenderer(): HostRenderer {
  return new ImageHostRenderer();
}

/**
 * The single, persistent host. Mounted once in the app shell so it survives
 * route changes; pages only supply anchors. Decorative: everything it "says"
 * also exists as normal page content.
 */
export function Host({ path }: { path: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HostEngine | null>(null);
  const first = useRef(true);

  useEffect(() => {
    const root = rootRef.current!;
    const renderer = createRenderer();
    renderer.mount(root);
    const engine = createHostEngine(root, bubbleRef.current!, renderer);
    engineRef.current = engine;
    return () => {
      engine.destroy();
      renderer.destroy();
      engineRef.current = null;
    };
  }, []);

  // New route: new anchors. Glide from wherever the host is now.
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    engineRef.current?.glide();
  }, [path]);

  return (
    <div aria-hidden="true">
      <div ref={rootRef} className="host host--intro" />
      <div ref={bubbleRef} className="host-bubble">
        <span data-bubble-text />
      </div>
    </div>
  );
}
