export const profile = {
  name: 'Parth Madlani',
  location: 'Ahmedabad, India',
  email: 'parthmadlani9825@gmail.com',
  github: 'https://github.com/parthmadlani',
  linkedin: 'https://www.linkedin.com/in/parthmadlani',
  resume: '/resume/Parth-Madlani-Resume.pdf',
  tagline: 'Full-stack developer building AI-powered products.',
  secondary: 'CSE (AI/ML) undergraduate · Ex-Adani Foundation Intern',
  greeting: 'Hi, I’m Parth. Let me show you what I’ve been building.',
};

export const about = {
  paragraphs: [
    'I’m a Computer Science Engineering undergraduate specialising in AI/ML, and I like taking a product from an empty folder to something people can open.',
    'So far I’ve built and launched two products on my own: Hemzo, which forecasts blood-stock shortages, and Init, which plans what to learn next. Between them I’ve worked across frontend interfaces, backend systems, AI integration and applied machine learning.',
    'On the ML side that means the whole loop: collecting data, engineering features, training models, backtesting them over time and deploying the result. AI development tools, including Claude Code, are part of how I work.',
  ],
  education: {
    school: 'Adani University',
    place: 'Ahmedabad, Gujarat',
    degree: 'B.Tech, Computer Science Engineering (AI/ML)',
    years: '2023–2027',
    note: 'Expected graduation 2027',
  },
};

export const experience = {
  org: 'Adani Foundation',
  role: 'UI/UX Engineer & Frontend Developer Intern',
  dates: 'May 2026 – Aug 2026',
  project: 'SitePulse',
  projectKind: 'Construction & CSR project monitoring platform',
  teamNote:
    'SitePulse is a team-built platform that replaces Excel-based tracking of infrastructure and CSR projects. The points below are my part of it.',
  contributions: [
    'Designed wireframes and Figma prototypes for the platform’s screens.',
    'Implemented responsive interfaces in React and Tailwind CSS.',
    'Developed role-specific screens for project managers, administrators and site personnel.',
    'Used Google Stitch and AI prompting to speed up design-to-code work.',
  ],
  stack: ['React', 'Tailwind CSS', 'Figma', 'Google Stitch'],
};

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript'] },
  {
    group: 'Frontend & design',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Responsive interfaces', 'Figma', 'Wireframing & prototyping'],
  },
  {
    group: 'Backend & data',
    items: ['PostgreSQL', 'Prisma', 'REST APIs', 'Automated data pipelines', 'Web data collection'],
  },
  {
    group: 'Machine learning',
    items: ['scikit-learn', 'pandas', 'NumPy', 'Gradient boosting', 'Time-series forecasting', 'Feature engineering', 'ROC-AUC · MAE', 'Time-based backtesting'],
  },
  {
    group: 'Generative AI',
    items: ['Gemini API', 'Mistral AI API', 'Prompt engineering', 'Structured JSON outputs', 'Zod', 'Claude Code'],
  },
  { group: 'Tools & deployment', items: ['Git', 'GitHub', 'GitHub Actions', 'CI/CD', 'Vercel'] },
];

export const leadership = [
  {
    title: 'Media Club',
    meta: '2023–2025',
    path: ['Team Member', 'Vice President', 'President'],
    text: 'Led a ten-member team on content planning, design and coverage for 15+ university events.',
  },
  {
    title: 'University Induction',
    meta: 'Lead Organizer',
    text: 'Ran an eight-day induction programme for 250+ incoming students with 30 volunteers.',
  },
];

export const achievement = {
  title: 'DAIICT Hackathon',
  meta: 'Top 10 of 80+ teams',
  text: 'Part of a four-member team that placed in the Top 10 among 80+ teams. I helped debug, test and prepare a working prototype within 48 hours.',
};

export const certifications: { name: string; issuer: string; date: string; url?: string }[] = [
  {
    name: 'AWS Academy Graduate — Machine Learning Foundations',
    issuer: 'Amazon Web Services',
    date: 'Nov 2025',
    url: 'https://www.credly.com/go/hvdL89ml',
  },
  { name: 'Prompt Design in Vertex AI', issuer: 'Google Cloud Skills Boost', date: 'Apr 2025' },
  {
    name: 'AWS Academy Graduate — Cloud Architecting',
    issuer: 'Amazon Web Services',
    date: 'Apr 2026',
    url: 'https://www.credly.com/go/vIp1HydW',
  },
  {
    name: 'Complete 2024 Web Development Bootcamp',
    issuer: 'London App Brewery',
    date: 'Jun 2024',
    url: 'https://www.udemy.com/certificate/UC-e6e85d1f-a4e1-45c7-9d42-560b7f62c702/',
  },
];
