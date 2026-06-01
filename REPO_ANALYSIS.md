# Repo Analysis — michaelrbk.github.io

## Overview

Personal website / CV for **Michael Becker** — a Senior Software Engineer / Tech Lead specializing in .NET and Backend Systems. The site serves as a single source of truth for resume content: a live website (Astro) + auto-generated PDF. Built collaboratively with Claude Code.

**Live at:** https://michaelrbk.github.io/

---

## Tech Stack

| Layer | Technology |
|---|---|
| SSG | [Astro 6](https://astro.build/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/vite` |
| PDF | [Playwright](https://playwright.dev/) (headless Chromium) |
| Runtime | Node.js >= 22.12 |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Directory Structure

```
.
├── .github/workflows/deploy.yml   # CI/CD pipeline
├── astro.config.mjs                # Astro configuration
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript (strict)
├── public/                         # Static assets
│   ├── avatar.jpg                  # Profile photo
│   ├── favicon.ico / .png          # Favicons
│   ├── site.webmanifest            # PWA manifest
│   └── logos/                      # Company logos for experience page
├── scripts/
│   └── generate-pdf.mjs            # PDF generation via Playwright
└── src/
    ├── data/
    │   └── resume.json             # Single source of truth — JSON Resume format
    ├── layouts/
    │   └── Layout.astro            # Base HTML layout (fonts, meta, dark mode)
    ├── pages/
    │   ├── index.astro             # Landing page
    │   ├── resume.astro            # Full resume view (PDF source)
    │   ├── experience.astro        # Role-by-role narrative
    │   └── interests.astro         # Personal interests
    └── styles/
        └── global.css              # Tailwind imports, theme, base font
```

---

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `index.astro` | Landing — avatar, summary, nav cards, social links |
| `/resume` | `resume.astro` | Full structured resume; serves as the PDF print source |
| `/experience` | `experience.astro` | Deep-dive per role: details, projects, tech stacks |
| `/interests` | `interests.astro` | Running, reading, gaming, chess, fantasy console coding |
| `/michael_becker_cv.pdf` | generated | Auto-generated PDF at build time |

---

## Data Model (`src/data/resume.json`)

Follows the [JSON Resume](https://jsonresume.org/) schema v1.0.0.

| Field | Description |
|---|---|
| `basics` | Name, label, email, URL, summary, location, profiles (GitHub, LinkedIn, Strava) |
| `available` | Boolean — shows "Open to opportunities" badge on landing |
| `work` | Array of 10 roles (2003–present) with name, URL, logo, position, dates, summary, highlights, details, projects, stack |
| `education` | 3 entries: Postgrad (Mobile Dev), BSc (CS), Vocational (Comp. Tech) |
| `skills` | 7 categories: Architecture, Cloud & DevOps, AI Tooling, Languages, Databases, Practices, Leadership |
| `languages` | Portuguese (Native), English (Fluent), Spanish (Conversational), French (Basic) |
| `publications` | Bachelor's thesis repo, GitHub portfolio |

---

## Design & Theme

- **Font:** JetBrains Mono (monospace throughout — gives a "coder" look)
- **Colors:** Slate-based with a custom accent blue (`#1f4e78` / `#93c5fd` light)
- **Dark mode:** Supported via `dark:` Tailwind variants
- **Base font size:** 15px (site), 13px (resume/PDF)
- **Responsive:** Mobile-first with `sm:` breakpoints

---

## CI/CD Pipeline (`.github/workflows/deploy.yml`)

On every push to `main` (or `workflow_dispatch`):

1. **Build job:**
   - Checkout + Node 22 + `npm ci`
   - Install Playwright Chromium
   - `astro build`
   - `npm run pdf` — boots astro preview, renders `/resume` via headless Chromium → `dist/michael_becker_cv.pdf`
   - Uploads `dist/` as Pages artifact
2. **Deploy job:**
   - Publishes artifact to `github-pages` environment

Concurrency is grouped on `pages` to prevent overlapping deploys.

---

## Notable Patterns

- **Single source of truth:** `resume.json` drives all pages — the JSON Resume schema makes it portable/standardized
- **PDF generation:** Uses `astro preview` + Playwright rather than a DOM-to-PDF library; prints the real rendered page
- **`available` toggle:** A top-level boolean in JSON controls a "Open to opportunities" badge on the landing page
- **Company logos:** Logos live in `public/logos/` and get overlaid with a monogram fallback on error
- **No client-side JS:** Pure static site — Astro islands/scripts are not used
