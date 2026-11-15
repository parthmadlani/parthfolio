import type { Project } from '../content/types';

/**
 * Conceptual illustrations. These are deliberately sketch-like diagrams of an
 * idea (never product screenshots, real charts or live data) and are always
 * captioned as illustrations where they are used.
 */
const ink = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const acc = { ...ink, stroke: 'var(--accent)' } as const;

function Drop({ x, y, s = 1, filled = false }: { x: number; y: number; s?: number; filled?: boolean }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -11 C 5 -4, 8 0, 8 4 A 8 8 0 0 1 -8 4 C -8 0, -5 -4, 0 -11 Z"
      {...(filled ? { fill: 'var(--accent)', stroke: 'var(--accent)', strokeWidth: 2, strokeLinejoin: 'round' as const } : ink)}
    />
  );
}

const art: Record<string, Record<string, React.ReactNode>> = {
  hemzo: {
    observe: (
      <>
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <Drop key={`${r}${c}`} x={38 + c * 38} y={36 + r * 34} s={0.85} filled={(r * 4 + c) % 5 === 1 || (r === 2 && c === 3)} />
          )),
        )}
        <path d="M22 122 H178" {...ink} strokeDasharray="1 7" />
        <path d="M30 116 v12 M70 116 v12 M110 116 v12 M150 116 v12" {...ink} />
      </>
    ),
    forecast: (
      <>
        <path d="M108 30 C 132 40, 160 34, 184 22 L184 96 C 160 92, 132 84, 108 62 Z" fill="var(--accent)" opacity="0.14" stroke="none" />
        <path d="M16 72 C 30 58, 40 86, 54 70 S 78 40, 92 52 S 102 50, 108 46" {...ink} />
        <path d="M108 46 C 130 56, 156 60, 184 58" {...acc} strokeDasharray="6 6" />
        <path d="M108 18 V118" {...ink} strokeDasharray="2 5" />
        <circle cx="108" cy="46" r="4.5" fill="var(--accent)" />
        <path d="M16 122 H184" {...ink} />
      </>
    ),
    risk: (
      <>
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <Drop x={30} y={34 + r * 36} s={0.8} filled={r === 1} />
            <path d={`M52 ${36 + r * 36} H164`} {...ink} opacity="0.28" />
            <path d={`M52 ${36 + r * 36} H${[92, 150, 76][r]}`} {...(r === 1 ? acc : ink)} strokeWidth={r === 1 ? 5 : 3.5} />
          </g>
        ))}
        <path d="M176 60 v14 M176 82 v1" {...acc} strokeWidth="3.5" />
      </>
    ),
  },
  init: {
    goal: (
      <>
        <path d="M54 118 V28" {...ink} />
        <path d="M54 30 C 70 22, 84 40, 104 30 V64 C 84 74, 70 56, 54 64 Z" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M34 118 H76" {...ink} />
        <circle cx="146" cy="50" r="20" {...ink} />
        <path d="M146 38 V50 L155 56" {...acc} />
        <path d="M124 116 v-10 M140 116 v-20 M156 116 v-30" {...ink} strokeWidth="6" opacity="0.3" />
        <path d="M124 116 v-10 M140 116 v-20" {...ink} strokeWidth="6" />
      </>
    ),
    path: (
      <>
        <path d="M26 112 C 60 112, 44 76, 82 76 S 104 40, 140 40 S 160 22, 178 22" {...ink} strokeDasharray="3 7" />
        {[
          [26, 112],
          [82, 76],
          [140, 40],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 17} y={y - 13} width="34" height="26" rx="4" {...(i === 1 ? acc : ink)} fill="var(--paper)" />
            <path d={`M${x - 4} ${y - 6} L${x + 6} ${y} L${x - 4} ${y + 6} Z`} fill={i === 1 ? 'var(--accent)' : 'currentColor'} stroke="none" />
          </g>
        ))}
        <path d="M170 14 l8 8 l-10 4" {...ink} />
      </>
    ),
    practice: (
      <>
        <rect x="24" y="30" width="64" height="80" rx="5" transform="rotate(-5 56 70)" {...ink} fill="var(--paper)" />
        <path d="M40 72 l10 10 l20 -24" {...ink} strokeWidth="3.5" />
        <rect x="100" y="28" width="64" height="80" rx="5" transform="rotate(4 132 68)" {...acc} fill="var(--paper)" />
        <path d="M118 54 l28 28 M146 54 l-28 28" {...acc} strokeWidth="3.5" />
        <path d="M150 122 C 120 136, 80 134, 58 122" {...ink} strokeDasharray="3 6" />
        <path d="M66 116 l-9 6 l8 7" {...ink} />
      </>
    ),
  },
  generic: {},
};

export function ConceptArt({ project, step }: { project: Project; step: string }) {
  const node = art[project.theme.art]?.[step];
  if (!node) return null;
  return (
    <svg className="concept-svg" viewBox="0 0 200 140" width="200" height="140" aria-hidden="true" focusable="false">
      {node}
    </svg>
  );
}

/** observation → forecast → risk, goal → path → practice, … */
export function ConceptSequence({ project, size = 'md' }: { project: Project; size?: 'md' | 'lg' }) {
  return (
    <figure className={`concept concept--${size}`}>
      <ol className="concept-steps">
        {project.concept.map((step, i) => (
          <li key={step.key} className="concept-step">
            <div className="concept-frame">
              <ConceptArt project={project} step={step.key} />
            </div>
            <p className="concept-title">
              <span className="concept-index">{String(i + 1).padStart(2, '0')}</span> {step.title}
            </p>
            {size === 'lg' && <p className="concept-caption">{step.caption}</p>}
          </li>
        ))}
      </ol>
      <figcaption className="concept-note">Concept illustration — not a product screenshot.</figcaption>
    </figure>
  );
}
