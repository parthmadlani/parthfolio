import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../content/types';
import { HostAnchor } from '../host/HostAnchor';
import { ConceptSequence } from './ConceptArt';
import { BrowserShot } from './BrowserShot';
import { Reveal } from './Reveal';

export function themeVars(p: Project): CSSProperties {
  return { '--accent': p.theme.accent, '--accent-ink': p.theme.accentInk, '--tint': p.theme.tint } as CSSProperties;
}

interface Props {
  project: Project;
  index: number;
  /** Mirror the panel (visual first) so consecutive panels alternate. */
  flip?: boolean;
  headingLevel?: 'h2' | 'h3';
}

/**
 * A large editorial project panel with a place for the host beside it.
 * The host always stands in the right-hand column, so it moves straight down
 * from one project to the next instead of crossing the panels.
 */
export function ProjectPanel({ project, index, flip = false, headingLevel: H = 'h3' }: Props) {
  const shot = project.screenshots?.[0];
  return (
    <div className="work-row" style={themeVars(project)}>
      <div className="work-host">
        <HostAnchor
          id={`work-${project.slug}`}
          look="left"
          say={project.hostLine}
          accent={project.theme.accent}
          bubble="top"
        />
      </div>
      <Reveal as="article" className={`panel${flip ? ' panel--flip' : ''}`}>
        <header className="panel-head">
          <span className="label">
            {String(index + 1).padStart(2, '0')} / {project.category}
          </span>
          <span className="label">{project.role.split(' — ')[0]}</span>
        </header>

        <div className="panel-body">
          <div className="panel-copy">
            <H className="panel-title">{project.title}</H>
            <p className="panel-kind">{project.kind}</p>
            <p className="panel-summary">{project.summary}</p>
            <dl className="panel-meta">
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{project.stack.join(' · ')}</dd>
              </div>
            </dl>
            <Link className="button button--accent panel-cta" to={`/projects/${project.slug}`}>
              Explore project <span aria-hidden="true">→</span>
              <span className="visually-hidden">: {project.title}</span>
            </Link>
          </div>

          <div className="panel-visual">
            {shot ? (
              <BrowserShot shot={shot} showCaption={false} />
            ) : (
              <ConceptSequence project={project} />
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
