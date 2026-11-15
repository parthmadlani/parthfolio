import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { about, achievement, certifications, experience, leadership, profile, skills } from '../content/site';
import { featuredProjects } from '../content/projects';
import { HostAnchor } from '../host/HostAnchor';
import { motionState } from '../motion/motion';
import { whenReady } from '../boot';
import { useSeo } from '../nav/useSeo';
import { ProjectPanel } from '../components/ProjectPanel';
import { Reveal } from '../components/Reveal';
import { Contact } from '../components/Contact';

let introPlayed = false;

function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Short opening. All content is in the DOM from the start; any input skips it.
  useLayoutEffect(() => {
    if (introPlayed || motionState.reduced || window.scrollY > 40) return;
    let cancel = () => {};
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          introPlayed = true;
        },
      });
      tl.from('.hero-char', { yPercent: 115, duration: 1, stagger: 0.03 }, 0.15)
        .from('.hero-label', { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 }, 0.25)
        .from('.hero-fade', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 0.7);
      const skip = () => tl.progress(1);
      const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
      // Starts when the loading screen lifts, so the two read as one movement.
      const off = whenReady(() => {
        tl.play();
        events.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));
      });
      cancel = () => {
        off();
        events.forEach((e) => window.removeEventListener(e, skip));
      };
    }, ref);
    return () => {
      cancel();
      ctx.revert();
    };
  }, []);

  const line = (word: string) => (
    <span className="hero-line" aria-hidden="true">
      {word.split('').map((c, i) => (
        <span className="hero-char" key={i}>
          {c}
        </span>
      ))}
    </span>
  );

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero-labels">
        <span className="label hero-label">Portfolio — 2026</span>
        <span className="label hero-label">{profile.location}</span>
      </div>

      <h1 id="hero-title" className="hero-title">
        <span className="visually-hidden">{profile.name}</span>
        {line('PARTH')}
        {line('MADLANI')}
      </h1>

      <div className="hero-host">
        <HostAnchor id="hero" look="pointer" say={profile.greeting} />
      </div>

      <div className="hero-copy">
        <p className="hero-tagline hero-fade">{profile.tagline}</p>
        <p className="label hero-secondary hero-fade">{profile.secondary}</p>
        <p className="visually-hidden">“{profile.greeting}”</p>
        <div className="actions hero-fade">
          <Link className="button button--accent" to="/#work">
            Explore my work <span aria-hidden="true">↓</span>
          </Link>
          <Link className="button" to="/#contact">
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ index, label, title, hostId, id }: { index: string; label: string; title: string; hostId: string; id: string }) {
  return (
    <div className="section-side">
      <span className="label">
        {index} / {label}
      </span>
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      <HostAnchor id={hostId} className="host-slot--quiet" prominence={0.25} look="right" />
    </div>
  );
}

export function Home() {
  useSeo(
    'Parth Madlani — Full-stack developer building AI-powered products',
    'Portfolio of Parth Madlani, a CSE (AI/ML) undergraduate in Ahmedabad who builds full-stack, AI-powered products including Hemzo and Init.',
  );

  return (
    <>
      <Hero />

      {/* ABOUT */}
      <section id="about" className="about" aria-labelledby="about-title">
        <div className="about-host">
          <HostAnchor id="about" look="right" say="The short version of me." travel="scrub" />
          <p className="hand about-note" aria-hidden="true">
            that’s me, in illustrated form ↑
          </p>
        </div>
        <div className="about-copy" data-grid-calm>
          <span className="label">01 / About</span>
          <Reveal as="h2" className="display about-title">
            <span id="about-title">
              I build products <em>end to end</em>, from the first commit to the deploy.
            </span>
          </Reveal>
          {about.paragraphs.map((p, i) => (
            <Reveal as="p" className={i === 0 ? 'lede' : 'body'} key={i} delay={i * 60}>
              {p}
            </Reveal>
          ))}
          <Reveal className="edu">
            <span className="label">Education</span>
            <p className="edu-school">
              {about.education.school} <span>— {about.education.place}</span>
            </p>
            <p className="edu-degree">{about.education.degree}</p>
            <p className="label">
              {about.education.years} · {about.education.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section id="work" className="work" aria-labelledby="work-title">
        <header className="work-head">
          <span className="label">02 / Selected work</span>
          <Reveal as="h2" className="display work-title">
            <span id="work-title">Two products, built solo.</span>
          </Reveal>
        </header>
        {featuredProjects.map((p, i) => (
          <ProjectPanel key={p.slug} project={p} index={i} flip={i % 2 === 1} />
        ))}
        <p className="work-more">
          <Link className="text-link" to="/projects">
            See the project gallery <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section" aria-labelledby="experience-title" data-grid-calm>
        <SectionHead index="03" label="Experience" title="Internship" hostId="experience" id="experience-title" />
        <div className="section-main">
          <Reveal className="xp">
            <div className="xp-top">
              <h3 className="xp-role">{experience.role}</h3>
              <p className="label">{experience.dates}</p>
            </div>
            <p className="xp-org">{experience.org}</p>
            <p className="xp-project">
              <strong>{experience.project}</strong> — {experience.projectKind}{' '}
              <span className="tag">Team project</span>
            </p>
            <p className="body">{experience.teamNote}</p>
            <h4 className="label xp-sub">My contribution</h4>
            <ul className="list">
              {experience.contributions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="label xp-stack">{experience.stack.join(' · ')}</p>
          </Reveal>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section" aria-labelledby="skills-title" data-grid-calm>
        <SectionHead index="04" label="Skills" title="What I work with" hostId="skills" id="skills-title" />
        <div className="section-main">
          <div className="skills">
            {skills.map((g, i) => (
              <Reveal className="skill-group" key={g.group} delay={(i % 3) * 60}>
                <h3 className="label">{g.group}</h3>
                <ul>
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP, ACHIEVEMENT, CERTIFICATIONS */}
      <section id="more" className="section" aria-labelledby="more-title" data-grid-calm>
        <SectionHead index="05" label="Beyond code" title="Leading & learning" hostId="more" id="more-title" />
        <div className="section-main">
          <div className="duo">
            {leadership.map((l) => (
              <Reveal className="note-block" key={l.title}>
                <p className="label">Leadership · {l.meta}</p>
                <h3>{l.title}</h3>
                {l.path && (
                  <p className="path">
                    {l.path.map((step, i) => (
                      <span key={step}>
                        {i > 0 && <span aria-hidden="true"> → </span>}
                        {i > 0 && <span className="visually-hidden"> then </span>}
                        {step}
                      </span>
                    ))}
                  </p>
                )}
                <p className="body">{l.text}</p>
              </Reveal>
            ))}
            <Reveal className="note-block note-block--accent">
              <p className="label">Achievement · {achievement.meta}</p>
              <h3>{achievement.title}</h3>
              <p className="body">{achievement.text}</p>
            </Reveal>
          </div>

          <Reveal className="certs">
            <h3 className="label">Certifications</h3>
            <ul>
              {certifications.map((c) => (
                <li key={c.name}>
                  <span className="cert-name">
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noreferrer">
                        {c.name} <span aria-hidden="true">↗</span>
                        <span className="visually-hidden"> (credential, opens in a new tab)</span>
                      </a>
                    ) : (
                      c.name
                    )}
                  </span>
                  <span className="cert-issuer">{c.issuer}</span>
                  <span className="label">{c.date}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Contact />
    </>
  );
}
