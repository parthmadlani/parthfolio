import { Link } from 'react-router-dom';
import { profile } from '../content/site';
import { motionState } from '../motion/motion';

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} {profile.name}. Designed and built by me.
      </p>
      <p className="footer-links">
        <Link to="/projects">Projects</Link>
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <button type="button" className="link-button" onClick={() => window.scrollTo({ top: 0, behavior: motionState.reduced ? 'auto' : 'smooth' })}>
          Back to top ↑
        </button>
      </p>
    </footer>
  );
}
