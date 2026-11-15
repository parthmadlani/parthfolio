import type { Project } from '../types';

export const hemzo: Project = {
  slug: 'hemzo',
  title: 'Hemzo',
  kind: 'Blood-stock forecasting & shortage-risk platform',
  summary:
    'Forecasts blood-stock shortages across Gujarat from government eRaktKosh inventory data.',
  category: 'Machine learning',
  tags: ['Forecasting', 'Data pipeline', 'Public data'],
  role: 'Independent project — data pipeline, modelling, evaluation and dashboard',
  stack: ['Python', 'scikit-learn', 'pandas', 'NumPy', 'GitHub Actions', 'JavaScript', 'Leaflet'],
  featured: true,
  order: 1,
  links: {
    live: 'https://hemzo.vercel.app/',
    repo: 'https://github.com/parthmadlani/Hemzo',
  },
  // Captured from the live site on 15 Nov 2026. The site's temporary pipeline-status strip is cropped off.
  screenshots: [
    {
      src: '/projects/hemzo/map.webp',
      width: 1600,
      height: 956,
      address: 'hemzo.vercel.app/live-map',
      alt: 'Hemzo live map: a ranked grid of Gujarat districts beside a map with status markers, and a detail panel for the selected district with a stock chart and per-blood-group bars.',
      caption: 'Live map. Districts ranked by risk, with the selected district’s observed stock and forecast.',
    },
    {
      src: '/projects/hemzo/forecast.webp',
      width: 1600,
      height: 956,
      address: 'hemzo.vercel.app/forecast-detail',
      alt: 'Hemzo forecast page for one district and blood group: a line chart of observed units continuing into a shaded forecast band, with filters for component, blood group and district.',
      caption: 'Forecast detail. Fourteen days observed, seven forecast, with the 80% band.',
    },
    {
      src: '/projects/hemzo/alerts.webp',
      width: 1600,
      height: 956,
      address: 'hemzo.vercel.app/alerts',
      alt: 'Hemzo alerts page with the headline “Seventy-two hours before the shortage” and a risk feed listing districts and blood groups flagged as critical.',
      caption: 'Alerts. A feed of district and blood-group flags, rebuilt after each snapshot.',
    },
    {
      src: '/projects/hemzo/how.webp',
      width: 1600,
      height: 956,
      address: 'hemzo.vercel.app/how-it-works',
      alt: 'Hemzo “How it works” page with the headline “It’s a weather forecast — for blood supply” above three columns explaining the problem, the clue and what Hemzo does.',
      caption: 'How it works. The plain-language explanation of the method.',
    },
  ],
  theme: { accent: '#e5312b', accentInk: '#c2211c', tint: '#fdeeed', art: 'hemzo' },
  concept: [
    { key: 'observe', title: 'Observation', caption: 'Stock snapshots collected from blood banks every four hours.' },
    { key: 'forecast', title: 'Forecast', caption: 'Stock projected one to seven days ahead, with an interval.' },
    { key: 'risk', title: 'Risk', caption: 'A three-day shortage-risk signal per blood group.' },
  ],
  hostLine: 'This one watches blood stock across Gujarat.',
  highlights: [
    { value: '200+', label: 'blood banks collected from' },
    { value: '34', label: 'Gujarat districts' },
    { value: '0.79', label: 'ROC-AUC, 3-day shortage risk (baseline 0.72)' },
  ],
  sections: [
    {
      kind: 'problem',
      label: '01 — Problem',
      heading: 'Stock listings describe today. Shortages happen later.',
      body: [
        'India’s government eRaktKosh portal reports the blood stock that banks are holding. That is a picture of the present. Hemzo uses the same public data to ask a forward-looking question: which blood groups, in which places, are likely to run short over the next few days?',
      ],
    },
    {
      kind: 'build',
      label: '02 — What I built',
      heading: 'One person, from collection to dashboard.',
      body: [
        'Hemzo is an independent project. I built the data collection, the feature engineering, the models, the evaluation and the map dashboard that presents the forecasts.',
      ],
      points: [
        'An automated Python pipeline that runs on GitHub Actions.',
        'A pooled gradient-boosting model that forecasts stock one to seven days ahead.',
        'A three-day shortage-risk classifier.',
        'An interactive map dashboard built with JavaScript and Leaflet.',
      ],
    },
    {
      kind: 'product',
      label: '03 — Product',
      heading: 'Forecasts on a map, with the uncertainty shown.',
      body: [
        'The dashboard is an interactive map that displays stock forecasts alongside 80% prediction intervals, so predicted availability and its uncertainty are communicated together rather than as a single confident number.',
      ],
      note: 'the live demo has the real thing →',
    },
    {
      kind: 'approach',
      label: '04 — Technical approach',
      heading: 'Collect, engineer, train, compare, publish.',
      body: [
        'The pipeline collects eRaktKosh inventory data from 200+ blood banks across 34 Gujarat districts every four hours. When my resume was written the dataset held 170+ snapshots.',
        'From that history I engineered 17 features covering stock trends, rolling statistics and stock cover, then trained a pooled gradient-boosting model with scikit-learn on 65K+ records across 460+ blood-group series.',
      ],
      stats: [
        { value: '4 h', label: 'collection interval' },
        { value: '17', label: 'engineered features' },
        { value: '65K+', label: 'training records' },
        { value: '460+', label: 'blood-group series' },
      ],
    },
    {
      kind: 'decisions',
      label: '05 — Decisions',
      heading: 'The model has to earn its place.',
      body: [
        'Three choices shape how much the output can be trusted.',
      ],
      points: [
        'Time-based backtesting: the model is validated on periods that come after its training data, the way it is actually used.',
        'Model versus baseline: the pipeline compares the two and automatically deploys whichever performs better, so a weaker model is never published by default.',
        'Intervals, not just points: every forecast carries an 80% prediction interval.',
      ],
    },
    {
      kind: 'results',
      label: '06 — Reported evaluation',
      heading: 'What the backtests showed.',
      body: [
        'These are evaluation results reported at the time of my resume, not live counters. ROC-AUC measures how well the classifier ranks risky cases above safe ones; it is not an accuracy percentage. Hemzo is a forecasting project built on public data and has not been clinically validated.',
      ],
      stats: [
        { value: '0.79', label: 'ROC-AUC for three-day shortage risk' },
        { value: '0.72', label: 'ROC-AUC of the baseline' },
        { value: '~80%', label: 'observed coverage of the 80% intervals' },
      ],
    },
  ],
};
