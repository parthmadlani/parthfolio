import { projects } from '../content/projects';
import { HostAnchor } from '../host/HostAnchor';
import { useSeo } from '../nav/useSeo';
import { ProjectPanel } from '../components/ProjectPanel';
import { Contact } from '../components/Contact';

const count = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

export function Projects() {
  useSeo(
    'Projects — Parth Madlani',
    'Project gallery: Hemzo, a blood-stock forecasting platform, and Init, an AI-powered personalised learning platform. Both built independently by Parth Madlani.',
  );
  const n = projects.length;

  return (
    <>
      <section className="gallery-head" aria-labelledby="gallery-title">
        <div className="gallery-copy">
          <span className="label">Project gallery</span>
          <h1 id="gallery-title" className="display gallery-title">
            {count[n] ?? n} {n === 1 ? 'product' : 'products'}.
            <br />
            <em>Idea to deploy.</em>
          </h1>
          <p className="lede">
            Each of these started as a question I wanted answered and ended as something you can open. Pick one and I’ll walk you through
            how it works.
          </p>
        </div>
        <div className="gallery-host">
          <HostAnchor id="gallery" look="pointer" say="Pick one. I’ll show you around." />
        </div>
      </section>

      <section className="work work--gallery" aria-label="Projects">
        {projects.map((p, i) => (
          <ProjectPanel key={p.slug} project={p} index={i} flip={i % 2 === 1} headingLevel="h2" />
        ))}
      </section>

      <Contact />
    </>
  );
}
