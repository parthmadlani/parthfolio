/**
 * Character renderer contract.
 *
 * The choreography (hostEngine.ts) decides WHERE the host is and where it is
 * looking; a renderer decides HOW the character is drawn. The shipped renderer
 * is image-based (see imageRenderer.ts). A future rigged GLB/glTF character
 * can implement this same interface with Three.js and be swapped in inside
 * Host.tsx without touching choreography, pages or content.
 */
export interface HostRenderer {
  /** Build the character inside `container` (a box with a 620:936 aspect ratio). */
  mount(container: HTMLElement): void;
  /**
   * Head orientation request.
   * yaw: -1 (fully toward the viewer's left) … 0 (facing the viewer) … 1 (viewer's right).
   * pitch: -1 (up) … 1 (down).
   * `still` asks for no continuous micro-movement (reduced motion).
   */
  setLook(yaw: number, pitch: number, still: boolean): void;
  destroy(): void;
}

/** Shared geometry of the host frame, as fractions of the box. */
export const HOST_ASPECT = 620 / 936;
