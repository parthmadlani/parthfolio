# Parth's Living Canvas

Portfolio of Parth Madlani: an illustrated host on a living sheet of graph paper.
React + TypeScript + Vite, React Router, GSAP (hero opening only) and a 2D canvas grid. No backend, keys or paid services.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

Requires Node 20.19+ or 22.12+ (Vite 8).

## Routes

| Route | Page |
| --- | --- |
| `/` | Home: hero, about, selected work, experience, skills, leadership, certifications, contact |
| `/projects` | Project gallery |
| `/projects/:slug` | Case study (`hemzo`, `init`) |
| anything else | Not-found page |

### Deploying

This is a single-page app, so the host must serve `index.html` for every path, otherwise opening `/projects/hemzo` directly returns a 404.

- **Vercel**: `vercel.json` already contains the rewrite. Build command `npm run build`, output `dist`.
- **Netlify / Cloudflare Pages**: `public/_redirects` already contains `/* /index.html 200`.
- **Nginx**: `try_files $uri /index.html;`
- **GitHub Pages**: has no rewrite support; copy `dist/index.html` to `dist/404.html` after building, and set Vite's `base` if the site is not served from the domain root.

After you have a real domain, add `<link rel="canonical">` and `og:url` to `index.html` and make `og:image` an absolute URL. None are set now because no domain was supplied.

## How it is organised

```
src/
  content/            what the site says
    site.ts           profile, about, experience, skills, leadership, certifications
    types.ts          Project type
    projects/         one file per project + index.ts (the collection)
  grid/               living graph-paper canvas (gridEngine.ts)
  host/               the character
    renderer.ts       HostRenderer interface (the swap point for a 3D model)
    imageRenderer.ts  shipped image-based renderer
    hostEngine.ts     choreography: where the host is, where it looks, what it says
    HostAnchor.tsx    a reserved place for the host in a page layout
    Host.tsx          the single persistent host, mounted once in App.tsx
  motion/             reduced-motion preference + header toggle
  nav/                header, menu dialog, scroll restoration, per-route metadata
  pages/              Home, Projects, ProjectPage, NotFound
  components/         ProjectPanel, ConceptArt, Contact, Reveal, Footer
  styles/             base.css (tokens, type), layout.css (pages), host.css
public/
  host/               five avatar views (WebP, transparent)
  resume/             Parth-Madlani-Resume.pdf
```

### The host

There is exactly one host element, mounted outside the routes so it persists between pages. Pages place `<HostAnchor id="…" />` boxes in their layout; each reserves real space. For each pair of neighbouring anchors the engine picks one of three behaviours:

- **scrub**: anchors close together and in the same column (or marked `travel="scrub"`, as hero → about is). The host travels with the scroll and reverses when you scroll back.
- **hop**: anchors close together but in different columns, and every move on small screens. The host makes one short timed hop at the half-way point, so it can never be left parked on top of text.
- **stay**: anchors more than a screen apart. The host stays with its section and is waiting at the next one.

Route changes are bridged with a glide from wherever the host was.

The pointer never positions the host. On anchors with `look="pointer"` (hero, gallery header, contact) it only steers which way the host faces.

Anchor options: `look` (`front | left | right | pointer`), `say` (speech bubble text), `accent` (disc colour), `prominence` (0–1, fades the disc in reading sections), `bubble` (`auto | top`), `travel` (`auto | scrub`).

Speech bubbles are decorative and hidden from assistive tech. Never put a fact only in `say`.

### The character asset: what is shipped and what is not

The supplied images are flat illustrations, not a rigged model, and no 3D tooling was available, so the host is **image-based**:

- Five views cut from the supplied sheet and portrait: front, two three-quarter views and two profiles. Cut out locally with macOS Vision; nothing was uploaded anywhere.
- The host **switches** between those drawn directions (front and three-quarter views when resting, profiles only during fast glides) and adds a tilt of under two degrees. It does not rotate continuously, and the face is never stretched.
- There is no waving, walking or talking animation because no such frames exist.
- The three-quarter and profile views come from 340 px-wide sheet panels, so they are softer than the front view on high-density screens.

**To get full head rotation and gestures**, supply a rigged `GLB`/`glTF` of the character with at least: a head (or neck) bone that can yaw ±180° and pitch about ±20°, a bust that reads well in a 620:936 frame, and optional named clips such as `wave` and `point`. Then:

1. `npm i three`
2. Write `src/host/gltfRenderer.ts` implementing `HostRenderer` from `renderer.ts` (`mount`, `setLook(yaw, pitch, still)`, `destroy`). Map `yaw` (−1…1) to head-bone rotation.
3. Return it from `createRenderer()` in `Host.tsx`.

Choreography, pages and content do not change. Higher-resolution renders of the side views (about 1000 px wide each) would also sharpen the current image-based host; replace the files in `public/host/` keeping the same 620×936 framing.

### The grid

`grid/gridEngine.ts` draws outlined squares as displaced polylines: a slow ambient wave, a local bulge around the mouse (desktop), and a bend from scroll speed and from `pulseGrid()` calls made by route changes and host moves. An energy value decays so the sheet settles. Sections marked `data-grid-calm` flatten and fade it behind dense text. Device pixel ratio is capped, rendering pauses when the tab is hidden, and with motion off it is a static straight grid.

### Page transitions

`App.tsx` renders a location that trails the router by 220 ms. In that time the current page clears; then the new page mounts, scroll is set while nothing is visible, and the new page rises in (700 ms) while the host glides to its new place (760 ms) on the same ease-out curve. Timings live in `--t-leave` / `--t-enter` in `base.css` and `LEAVE_MS` in `App.tsx`; keep them equal.

### Loading screen

Markup and styles are inline in `index.html` so it paints before any script. `src/boot.ts` drives it from real work: the app script, three font families and the host's front view (the "n / 5" count). Nothing is simulated. It shows for at least 0.9 s so it does not flash, at most 4.5 s, and an inline fallback removes it after 9 s if the app never starts. When it lifts, `<html>` gets `pm-ready`; the hero opening, the host's entrance and the first speech bubble wait for that.

### Motion

`prefers-reduced-motion` is respected, and the header's **Motion on/off** button overrides it (saved in `localStorage`). With motion off: static grid, no opening animation, no reveals, instant page changes, and the host sits on its anchors without travelling or tilting. All content and routes stay available.

## Adding a project

1. Copy `src/content/projects/init.ts` to `src/content/projects/<slug>.ts` and edit it. Fields: `slug`, `title`, `kind`, `summary`, `category`, `tags`, `role`, `stack`, `featured`, `order`, optional `dates`, optional `screenshots` (with `alt`, `width`, `height`), optional `links.live` / `links.repo`, `theme` (accent colours), `concept` (three steps), `hostLine`, `highlights`, `sections`.
2. Import it in `src/content/projects/index.ts` and add it to the `all` array.

That is all. The gallery panel, `/projects/<slug>` page, previous/next links and (if `featured: true`) the home preview are generated from the collection. The gallery heading counts projects automatically.

- **Drafts**: set `draft: true`. The project is excluded from the gallery, routes and navigation.
- **Accent**: `theme.accent` is used for shadows and the host disc; `theme.accentInk` is used for text and filled buttons and must have at least 4.5:1 contrast with white.
- **Screenshots**: put files in `public/projects/<slug>/` and list them in `screenshots` with `alt`, `width`, `height`, and optionally `caption` and `address` (shown in the browser frame). The first one is the gallery panel image and the lead image of the case study; the rest appear in the product section. All open in a full-size viewer.
- **Concept illustration**: `theme.art` selects a drawing set in `components/ConceptArt.tsx`. Use `'generic'` to show none, or add a new set there. Illustrations are always captioned as illustrations.
- **Case-study sections**: include only the `sections` you can support. Omitted sections simply do not render.

## Content notes and gaps

Content follows `Parthmadlani_resume.pdf` (the file you pointed to), plus the brief where the two do not conflict.

Differences between the brief and that resume:

- Project descriptors use the resume's wording: "Blood-Stock Forecasting & Shortage-Risk Platform", "AI-Powered Personalised Learning Platform", "Independent project".
- Only in the brief, kept and worded as resume-time figures: the 170+ snapshot count, "~80% observed coverage" of the prediction intervals, and the Google Stitch line in the internship.
- "Solo" appears in one heading ("Two products, built solo."); elsewhere the resume's "independent" is used.

Links were read from the resume PDF's embedded hyperlinks: both live demos, both repositories and three credential links. The two Credly links were opened once to match each to the right AWS badge. "Prompt Design in Vertex AI" has no link in the resume, so none is shown.

Still missing:

- **Signed-in Init screens.** The screenshots are real captures of both live sites taken on 15 Nov 2026 with headless Chrome at 1440×900. Init's app is behind a login, so only its public pages (landing, help) are shown. Add captures of a real path, a session and a quiz to `public/projects/init/` to show the product itself.
- **Hemzo screenshots are cropped by 40 px at the top** to leave out the site's temporary "running late" pipeline-status strip. The Hemzo home page is not included because its hero is an animation that does not capture as a still.
- **Init's real brand colour is magenta**, while this site themes Init in blue as the brief asked. Change `theme` in `src/content/projects/init.ts` if you want them to match.
- **Case-study narrative** that the resume does not support: development history, challenges, tradeoffs you weighed, and lessons. Those sections are omitted rather than invented.
- **A domain**, for canonical and absolute social-image URLs.
- **A proper social share image** (1200×630). The current `og:image` is the small avatar icon.
- **Phone number**: not shown anywhere on the site, but the packaged resume PDF contains it. Swap in a version without it at `public/resume/Parth-Madlani-Resume.pdf` if you do not want it downloadable.

## Fonts

Bricolage Grotesque, IBM Plex Mono and Caveat, all SIL Open Font License, self-hosted through Fontsource.
