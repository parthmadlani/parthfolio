import type { Project } from '../types';
import { hemzo } from './hemzo';
import { init } from './init';

/**
 * The project collection. To add a project: create `./<slug>.ts`, import it
 * and add it to this array. The gallery, case-study route, home previews and
 * previous/next navigation are all generated from it. See README.
 */
const all: Project[] = [hemzo, init];

export const projects: Project[] = all
  .filter((p) => !p.draft)
  .sort((a, b) => a.order - b.order);

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNeighbours(slug: string): { prev: Project; next: Project } | null {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0 || projects.length < 2) return null;
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
