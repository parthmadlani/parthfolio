import { Link } from 'react-router-dom';
import { HostAnchor } from '../host/HostAnchor';
import { useSeo } from '../nav/useSeo';

export function NotFound() {
  useSeo('Not found — Parth Madlani', 'This page does not exist.');
  return (
    <section className="notfound" aria-labelledby="nf-title">
      <div>
        <span className="label">404</span>
        <h1 id="nf-title" className="display">
          This page isn’t on the canvas.
        </h1>
        <div className="actions">
          <Link className="button button--accent" to="/">
            Go home
          </Link>
          <Link className="button" to="/projects">
            See projects
          </Link>
        </div>
      </div>
      <div className="notfound-host">
        <HostAnchor id="notfound" look="left" say="Nothing here, sorry." />
      </div>
    </section>
  );
}
