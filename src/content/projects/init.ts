import type { Project } from '../types';

export const init: Project = {
  slug: 'init',
  title: 'Init',
  kind: 'AI-powered personalised learning platform',
  summary:
    'Turns a learner’s goal, skill level and daily time budget into a personalised, step-by-step video learning path.',
  category: 'Full-stack · Generative AI',
  tags: ['Learning', 'LLM integration', 'Adaptive quizzes'],
  role: 'Independent project — product, frontend, backend and AI integration',
  stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Zod', 'Gemini API', 'YouTube Data API'],
  featured: true,
  order: 2,
  links: {
    live: 'https://useinit.vercel.app/',
    repo: 'https://github.com/parthmadlani/Init',
  },
  // Captured from the public pages of the live site on 15 Nov 2026. Signed-in screens are not included.
  screenshots: [
    {
      src: '/projects/init/home.webp',
      width: 1600,
      height: 1000,
      address: 'useinit.vercel.app',
      alt: 'Init landing page with the headline “Less searching. More learning.” beside an illustrative path preview listing four Python topics.',
      caption: 'Landing page, with an illustrative path preview.',
    },
    {
      src: '/projects/init/overview.webp',
      width: 1600,
      height: 1533,
      address: 'useinit.vercel.app',
      alt: 'Full Init landing page: the hero and path preview followed by three steps titled Choose your starting point, Follow your path and Pick up where you left off.',
      caption: 'The three-step structure a learner follows.',
    },
    {
      src: '/projects/init/help.webp',
      width: 1600,
      height: 1000,
      address: 'useinit.vercel.app/help',
      alt: 'Init help page titled “How Init works”, with sections on building a learning path, daily sessions, progress, changing a plan and unavailable videos.',
      caption: 'Help page describing paths, daily sessions and progress.',
    },
  ],
  theme: { accent: '#1f4bff', accentInk: '#1a3fd6', tint: '#edf1ff', art: 'init' },
  concept: [
    { key: 'goal', title: 'Goal', caption: 'A goal, a skill level and a daily time budget.' },
    { key: 'path', title: 'Learning path', caption: 'Ranked videos arranged into ordered steps.' },
    { key: 'practice', title: 'Practice', caption: 'Adaptive quizzes that revisit weak topics.' },
  ],
  hostLine: 'And this one plans what to learn next.',
  highlights: [
    { value: '100+', label: 'authored quiz questions' },
    { value: '43', label: 'automated tests on the quiz engine' },
    { value: '2.5 Flash', label: 'Gemini model used for personalisation' },
  ],
  sections: [
    {
      kind: 'problem',
      label: '01 — Problem',
      heading: 'A goal is not a plan.',
      body: [
        'Knowing what you want to learn is different from knowing what to watch first, what to watch next and how much fits into the time you have. Init takes a learner’s goal, skill level and daily time budget and turns them into a structured path of videos.',
      ],
    },
    {
      kind: 'build',
      label: '02 — What I built',
      heading: 'Built and deployed independently.',
      body: [
        'Init is an independent project. I designed, built and deployed the whole platform: interface, database, API integrations and the AI layer.',
      ],
      points: [
        'A path generator with a custom ranking system over YouTube Data API search results.',
        'Gemini 2.5 Flash integration that personalises paths from learners’ notes and categorises videos.',
        'An adaptive quiz engine with 100+ authored questions.',
      ],
    },
    {
      kind: 'product',
      label: '03 — Product',
      heading: 'From a sentence to a sequence.',
      body: [
        'A learner describes a goal, picks a level and says how much time they have each day. Init returns a step-by-step video path. As they study, their notes feed back into personalisation, and quizzes re-prioritise topics based on their mistakes and how confident they were.',
      ],
      note: 'try it with your own goal →',
    },
    {
      kind: 'approach',
      label: '04 — Technical approach',
      heading: 'Typed end to end, validated at the AI boundary.',
      body: [
        'The app is built with Next.js and TypeScript on PostgreSQL through Prisma. Video candidates come from the YouTube Data API and pass through my own ranking before they are placed in a path.',
        'Gemini 2.5 Flash returns structured JSON, and every response is validated against a Zod schema before the application uses it.',
      ],
    },
    {
      kind: 'decisions',
      label: '05 — Decisions',
      heading: 'Assume the model will sometimes fail.',
      body: [
        'An LLM call can be slow, malformed or unavailable. Init is designed around that.',
      ],
      points: [
        'Schema validation with Zod, so malformed AI output is rejected instead of rendered.',
        'Request timeouts, so a slow response cannot hang the experience.',
        'Fallback handling for AI failures, so the learner still gets a path.',
        'Authored quiz questions rather than generated ones, covered by automated tests.',
      ],
    },
    {
      kind: 'results',
      label: '06 — Verification',
      heading: 'What is tested.',
      body: [
        'The adaptive quiz engine is covered by 43 automated tests. I have not published adoption or learning-outcome figures, so none are claimed here.',
      ],
      stats: [
        { value: '43', label: 'automated tests on the quiz engine' },
        { value: '100+', label: 'authored questions' },
      ],
    },
  ],
};
