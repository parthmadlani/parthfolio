import { useState } from 'react';
import { profile } from '../content/site';
import { HostAnchor } from '../host/HostAnchor';
import { Reveal } from './Reveal';

export function Contact() {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied('ok');
    } catch {
      setCopied('fail');
    }
    window.setTimeout(() => setCopied('idle'), 2600);
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact-copy">
        <span className="label">Contact</span>
        <Reveal as="h2" className="display contact-title">
          <span id="contact-title">Say hello.</span>
        </Reveal>
        <p className="lede">
          If you’d like to talk about my work or ask how something was built, email is the best way to reach me.
        </p>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <div className="actions">
          <a className="button button--accent" href={`mailto:${profile.email}`}>
            Write an email <span aria-hidden="true">→</span>
          </a>
          <button type="button" className="button" onClick={copy}>
            {copied === 'ok' ? 'Copied ✓' : 'Copy email'}
          </button>
          <a className="button" href={profile.resume} download>
            Download resume <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className="copy-status" role="status" aria-live="polite">
          {copied === 'ok' ? 'Email address copied to clipboard.' : copied === 'fail' ? `Couldn’t copy automatically — the address is ${profile.email}.` : ''}
        </p>
        <ul className="contact-links">
          <li>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          </li>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </li>
          <li>{profile.location}</li>
        </ul>
      </div>
      <div className="contact-host">
        <HostAnchor id="contact" look="pointer" say="Thanks for looking around." />
      </div>
    </section>
  );
}
