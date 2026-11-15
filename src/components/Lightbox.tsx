import { useEffect, useRef } from 'react';
import type { Screenshot } from '../content/types';

interface Props {
  shots: Screenshot[];
  index: number | null;
  onChange: (index: number | null) => void;
}

/** Full-size screenshot viewer. Native <dialog>: focus trap, Esc and focus return come for free. */
export function Lightbox({ shots, index, onChange }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const shot = open ? shots[index] : null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const step = (dir: number) => {
    if (index === null) return;
    onChange((index + dir + shots.length) % shots.length);
  };

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Screenshot viewer"
      onClose={() => onChange(null)}
      onClick={(e) => e.target === e.currentTarget && onChange(null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      }}
    >
      {shot && (
        <div className="lightbox-inner">
          <div className="lightbox-bar">
            <span className="label">
              {index! + 1} / {shots.length}
              {shot.address ? ` · ${shot.address}` : ''}
            </span>
            <div className="lightbox-tools">
              {shots.length > 1 && (
                <>
                  <button type="button" className="menu-close" onClick={() => step(-1)} aria-label="Previous screenshot">
                    ←
                  </button>
                  <button type="button" className="menu-close" onClick={() => step(1)} aria-label="Next screenshot">
                    →
                  </button>
                </>
              )}
              <button type="button" className="menu-close" onClick={() => onChange(null)} autoFocus>
                Close
              </button>
            </div>
          </div>
          <div className="lightbox-scroll">
            <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
          </div>
          {shot.caption && <p className="lightbox-caption">{shot.caption}</p>}
        </div>
      )}
    </dialog>
  );
}
