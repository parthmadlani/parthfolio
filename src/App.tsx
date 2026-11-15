import { Component, useEffect, useState, type ReactNode } from 'react';
import { Route, Routes, useLocation, useNavigationType, type Location, type NavigationType } from 'react-router-dom';
import { LivingGrid } from './grid/LivingGrid';
import { Host } from './host/Host';
import { Header } from './nav/Header';
import { ScrollManager } from './nav/ScrollManager';
import { Footer } from './components/Footer';
import { motionState } from './motion/motion';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectPage } from './pages/ProjectPage';
import { NotFound } from './pages/NotFound';

/** How long the outgoing page takes to clear before the next one is mounted. Matches --t-leave in base.css. */
const LEAVE_MS = 220;

/** Optional effects must never take the content down with them. */
class Optional extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface Shown {
  location: Location;
  type: NavigationType;
}

export function App() {
  const location = useLocation();
  const type = useNavigationType();

  /**
   * Page transitions run on one beat:
   *   1. the current page clears (LEAVE_MS) while the host stays where it is,
   *   2. the new page is mounted, scroll is set while nothing is visible,
   *   3. the new page rises in and the host glides to its new place, both on the same curve.
   * `shown` is the location actually rendered; it trails the router by LEAVE_MS.
   */
  const [shown, setShown] = useState<Shown>({ location, type });
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (location.key === shown.location.key) return;
    const samePage = location.pathname === shown.location.pathname;
    if (samePage || motionState.reduced) {
      setLeaving(false);
      setShown({ location, type });
      return;
    }
    setLeaving(true);
    const t = window.setTimeout(() => {
      setShown({ location, type });
      setLeaving(false);
    }, LEAVE_MS);
    return () => window.clearTimeout(t);
    // `shown` is intentionally not a dependency: this reacts to router changes only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, type]);

  const path = shown.location.pathname;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Optional>
        <LivingGrid />
      </Optional>
      <Header />
      <ScrollManager location={shown.location} type={shown.type} />
      {/* Keyed by path so each page plays its entrance once. */}
      <div key={path} className={`page-wrap${leaving ? ' is-leaving' : ''}`} aria-busy={leaving}>
        <main id="main" className="page" tabIndex={-1}>
          <Routes location={shown.location}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Optional>
        <Host path={path} />
      </Optional>
    </>
  );
}
