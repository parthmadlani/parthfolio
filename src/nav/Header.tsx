import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useMotion } from '../motion/motion';

const links = [
  { to: '/projects', label: 'Projects' },
  { to: '/#about', label: 'About' },
  { to: '/#experience', label: 'Experience' },
  { to: '/#contact', label: 'Contact' },
];

function MotionToggle() {
  const { reduced, toggle } = useMotion();
  return (
    <button type="button" className="motion-toggle" onClick={toggle} aria-pressed={!reduced} title="Turn animation on or off">
      <span className="motion-dot" aria-hidden="true" />
      Motion <span className="motion-state">{reduced ? 'off' : 'on'}</span>
    </button>
  );
}

export function Header() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const location = useLocation();

  // Close the menu after any navigation.
  useEffect(() => {
    dialogRef.current?.close();
  }, [location]);

  return (
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label="Parth Madlani — home">
        <span className="wordmark-mark" aria-hidden="true">P/M</span>
        <span className="wordmark-name">Parth Madlani</span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {links.map((l) =>
          l.to.includes('#') ? (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ) : (
            <NavLink key={l.to} to={l.to}>
              {l.label}
            </NavLink>
          ),
        )}
      </nav>

      <div className="header-tools">
        <MotionToggle />
        <button
          type="button"
          className="menu-button"
          aria-haspopup="dialog"
          onClick={() => dialogRef.current?.showModal()}
        >
          Menu
        </button>
      </div>

      {/* Native <dialog>: focus is trapped while open, Esc closes, focus returns to the button. */}
      <dialog
        ref={dialogRef}
        className="menu-dialog"
        aria-label="Menu"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        <div className="menu-sheet">
          <button type="button" className="menu-close" onClick={() => dialogRef.current?.close()}>
            Close
          </button>
          <nav aria-label="Menu">
            <Link to="/" onClick={() => dialogRef.current?.close()}>Home</Link>
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => dialogRef.current?.close()}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </dialog>
    </header>
  );
}
