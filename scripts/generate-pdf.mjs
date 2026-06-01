import { copyFileSync, mkdirSync } from "node:fs";
import { preview } from "astro";
import { chromium } from "playwright";

const PORT = Number(process.env.PREVIEW_PORT ?? 4321);

const RESUMES = [
  { path: "/resume", out: "dist/michael_becker_cv.pdf", label: "Michael Becker — Resume" },
  { path: "/resume-pt-br", out: "dist/michael_becker_cv_pt_br.pdf", label: "Michael Becker — Currículo" },
];

const version = (() => {
  const d = new Date();
  return `v${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
})();

async function main() {
  console.log(`Starting astro preview on port ${PORT}…`);
  const server = await preview({
    root: process.cwd(),
    server: { port: PORT },
    logLevel: "warn",
  });

  try {
    const browser = await chromium.launch();

    for (const resume of RESUMES) {
      const url = `http://localhost:${PORT}${resume.path}`;
      console.log(`Rendering ${url} → ${resume.out}…`);

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      await page.pdf({
        path: resume.out,
        format: "A4",
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: `<div style="font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 8px; color: #94a3b8; width: 100%; padding: 0 20mm; display: flex; justify-content: space-between;"><span>${resume.label}</span><span>${version}</span></div>`,
      });

      await page.close();

      const pub = resume.out.replace(/^dist\//, "public/");
      mkdirSync("public", { recursive: true });
      copyFileSync(resume.out, pub);
      console.log(`Wrote ${resume.out} (${version})`);
    }

    await browser.close();
  } finally {
    await server.stop();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
