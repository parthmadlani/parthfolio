export type SectionKind = 'problem' | 'build' | 'product' | 'approach' | 'decisions' | 'results';

export interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Address shown in the browser frame, e.g. "hemzo.vercel.app/live-map". */
  address?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface CaseSection {
  kind: SectionKind;
  /** Small technical label shown above the heading. */
  label: string;
  heading: string;
  body: string[];
  points?: string[];
  stats?: Stat[];
  /** Short handwritten margin note. */
  note?: string;
}

export interface ConceptStep {
  key: string;
  title: string;
  caption: string;
}

export interface ProjectTheme {
  /** Accent colour used for the project's panels, host disc and links. */
  accent: string;
  /** Darker accent for text on white (must pass contrast). */
  accentInk: string;
  /** Very light tint for panel washes. */
  tint: string;
  /** Which conceptual illustration set to draw (see components/ConceptArt). */
  art: 'hemzo' | 'init' | 'generic';
}

export interface Project {
  slug: string;
  title: string;
  /** Short descriptor, e.g. "Blood-stock forecasting platform". */
  kind: string;
  /** One-sentence purpose. */
  summary: string;
  category: string;
  tags: string[];
  role: string;
  stack: string[];
  featured: boolean;
  order: number;
  /** Drafts never appear in the gallery, routes or prev/next navigation. */
  draft?: boolean;
  dates?: string;
  screenshots?: Screenshot[];
  links?: { live?: string; repo?: string };
  theme: ProjectTheme;
  /** Three-step conceptual sequence shown as labelled illustrations. */
  concept: ConceptStep[];
  /** What the host says beside this project (decorative; never the only source of a fact). */
  hostLine: string;
  highlights: Stat[];
  sections: CaseSection[];
}
