# michaelrbk.github.io

A centralized place for my professional presence — a personal webpage that doubles as my CV. One source of truth for resume content, served as a website and exported as a PDF.

Live at **[michaelrbk.github.io](https://michaelrbk.github.io/)**.

Built collaboratively with [Claude Code](https://claude.com/claude-code) (Opus 4.7).

## Pages

- `/` — landing
- `/resume` — full resume (also the source for the PDF)
- `/experience` — role-by-role narrative with logos
- `/cv.pdf` — generated from `/resume` at build time

## Stack

- [Astro 6](https://astro.build/) — static site generator
- [Tailwind CSS 4](https://tailwindcss.com/) — styling via `@tailwindcss/vite`
- [Playwright](https://playwright.dev/) — headless Chromium for PDF generation
- Node.js 22
- GitHub Pages + GitHub Actions for hosting and CI

## Run locally

```sh
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # production build to ./dist/
npm run preview   # serve the built site locally
```

## Generate the PDF locally

The PDF is rendered by booting `astro preview`, navigating headless Chromium to `/resume`, and printing it to `dist/cv.pdf`.

```sh
npm run build
npx playwright install chromium   # first time only
npm run pdf
```

The output lands at `dist/cv.pdf` and is shipped as `/cv.pdf` on the live site.

## How deploy works

`.github/workflows/deploy.yml` runs on every push to `main` (and via manual `workflow_dispatch`):

1. **build** — checks out the repo, installs Node 22 + dependencies, installs Playwright Chromium, runs `npm run build`, then `npm run pdf` to drop `cv.pdf` into `dist/`, and uploads `dist/` as a Pages artifact.
2. **deploy** — publishes the artifact to the `github-pages` environment.

Concurrency is grouped on `pages` so overlapping pushes don't trample each other.
