import type { Screenshot } from '../content/types';

interface Props {
  shot: Screenshot;
  /** Load immediately (use for the first image on a page). */
  eager?: boolean;
  showCaption?: boolean;
  /** When given, the image becomes a button that opens a larger view. */
  onOpen?: () => void;
}

/** A real product screenshot in a simple browser frame. */
export function BrowserShot({ shot, eager = false, showCaption = true, onOpen }: Props) {
  const img = (
    <img
      src={shot.src}
      alt={shot.alt}
      width={shot.width}
      height={shot.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
  return (
    <figure className="bshot">
      <div className="bshot-frame">
        <div className="bshot-bar" aria-hidden="true">
          <span className="bshot-dots">
            <i />
            <i />
            <i />
          </span>
          {shot.address && <span className="bshot-url">{shot.address}</span>}
        </div>
        {onOpen ? (
          <button type="button" className="bshot-open" onClick={onOpen}>
            {img}
            <span className="bshot-zoom" aria-hidden="true">
              Enlarge ⤢
            </span>
            <span className="visually-hidden">Enlarge screenshot</span>
          </button>
        ) : (
          <div className="bshot-view">{img}</div>
        )}
      </div>
      {showCaption && shot.caption && <figcaption>{shot.caption}</figcaption>}
    </figure>
  );
}
