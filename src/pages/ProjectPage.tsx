import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getNeighbours, getProject } from '../content/projects';
import { HostAnchor } from '../host/HostAnchor';
import { useSeo } from '../nav/useSeo';
import { ConceptSequence } from '../components/ConceptArt';
import { themeVars } from '../components/ProjectPanel';
import { Reveal } from '../components/Reveal';
import { BrowserShot } from '../components/BrowserShot';
import { Lightbox } from '../components/Lightbox';
import { NotFound } from './NotFound';

export function ProjectPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  const [zoom, setZoom] = useState<number | null>(null);
  useSeo(
    project ? `${project.title} — ${project.kind} · Parth Madlani` : 'Not found — Parth Madlani',
    project ? project.summary : 'This page does not exist.',
  );
  if (!project) return <NotFound />;

  const neighbours = getNeighbours(project.slug);
  const { live, repo } = project.links ?? {};
  const shots = project.screenshots ?? [];

  return (
    <article className="case" style={themeVars(project)}>
      <header className="case-hero">
        <div className="case-hero-copy">
          <Link className="text-link back-link" to="/projects">
            <span aria-hidden="true">←</span> All projects
          </Link>
          <span className="label case-cat">{project.category}</span>
          <h1 className="case-title">{project.title}</h1>
          <p className="case-kind">{project.kind}</p>
          <p className="lede">{project.summary}</p>
          {(live || repo) && (
            <div className="actions">
              {live && (
                <a className="button button--accent" href={live} target="_blank" rel="noreferrer">
                  Live demo <span aria-hidden="true">↗</span>
                </a>
              )}
              {repo && (
                <a className="button" href={repo} target="_blank" rel="noreferrer">
                  Repository <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}
        </div>
        <div className="case-hero-host">
          <HostAnchor id={`case-${project.slug}`} look="left" say={project.hostLine} accent={project.theme.accent} />
        </div>
      </header>

      <dl className="case-meta">
        <div>
          <dt className="label">Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt className="label">Stack</dt>
          <dd>{project.stack.join(' · ')}</dd>
        </div>
        <div>
          <dt className="label">Focus</dt>
          <dd>{project.tags.join(' · ')}</dd>
        </div>
      </dl>

      {shots[0] && (
        <Reveal className="case-lead">
          <BrowserShot shot={shots[0]} eager onOpen={() => setZoom(0)} />
        </Reveal>
      )}

      <Reveal className="case-highlights">
        {project.highlights.map((h) => (
          <div className="stat" key={h.label}>
            <span className="stat-value">{h.value}</span>
            <span className="stat-label">{h.label}</span>
          </div>
        ))}
        <p className="label case-highlights-note">Figures as reported on my resume — not live counters.</p>
      </Reveal>

      <Reveal className="case-concept">
        <span className="label">How it works, in three steps</span>
        <ConceptSequence project={project} size="lg" />
      </Reveal>

      <div className="case-sections">
        {project.sections.map((s, i) => (
          <section className="case-section" key={s.kind} aria-labelledby={`sec-${s.kind}`} data-grid-calm>
            <div className="case-section-side">
              <span className="label">{s.label}</span>
              {i === 3 && (
                <HostAnchor id={`case-${project.slug}-mid`} className="host-slot--quiet" prominence={0.25} look="right" accent={project.theme.accent} />
              )}
            </div>
            <div className="case-section-main">
              <Reveal as="h2" className="case-heading">
                <span id={`sec-${s.kind}`}>{s.heading}</span>
              </Reveal>
              {s.body.map((p, j) => (
                <Reveal as="p" className="body" key={j}>
                  {p}
                </Reveal>
              ))}
              {s.points && (
                <Reveal as="ul" className="list">
                  {s.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </Reveal>
              )}
              {s.stats && (
                <Reveal className="stats">
                  {s.stats.map((st) => (
                    <div className="stat" key={st.label}>
                      <span className="stat-value">{st.value}</span>
                      <span className="stat-label">{st.label}</span>
                    </div>
                  ))}
                </Reveal>
              )}
              {s.kind === 'product' && shots.length > 1 && (
                <div className="shots">
                  {shots.slice(1).map((shot, k) => (
                    <Reveal key={shot.src} delay={k * 70}>
                      <BrowserShot shot={shot} onOpen={() => setZoom(k + 1)} />
                    </Reveal>
                  ))}
                </div>
              )}
              {s.kind === 'product' && live && (
                <p className="case-inline-link">
                  {s.note && (
                    <span className="hand" aria-hidden="true">
                      {s.note}{' '}
                    </span>
                  )}
                  <a className="text-link" href={live} target="_blank" rel="noreferrer">
                    Open the live demo <span aria-hidden="true">↗</span>
                  </a>
                </p>
              )}
            </div>
          </section>
        ))}
      </div>

      <Lightbox shots={shots} index={zoom} onChange={setZoom} />

      <footer className="case-end">
        {neighbours && (
          <div className="next" style={themeVars(neighbours.next)}>
            <div className="next-host">
              <HostAnchor id="case-next" look="right" say={`Next up: ${neighbours.next.title}.`} accent={neighbours.next.theme.accent} />
            </div>
            <Link className="next-link" to={`/projects/${neighbours.next.slug}`}>
              <span className="label">Next project</span>
              <span className="next-title">
                {neighbours.next.title} <span aria-hidden="true">→</span>
              </span>
              <span className="next-kind">{neighbours.next.kind}</span>
            </Link>
          </div>
        )}
        <p className="case-back">
          <Link className="text-link" to="/projects">
            <span aria-hidden="true">←</span> Back to all projects
          </Link>
          <Link className="text-link" to="/#contact">
            Get in touch <span aria-hidden="true">→</span>
          </Link>
        </p>
      </footer>
    </article>
  );
}
