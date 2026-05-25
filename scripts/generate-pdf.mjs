import { preview } from "astro";
import { chromium } from "playwright";

const PORT = Number(process.env.PREVIEW_PORT ?? 4321);
const RESUME_PATH = "/resume";
const OUT_PATH = "dist/cv.pdf";

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

  const url = `http://localhost:${PORT}${RESUME_PATH}`;
  console.log(`Preview ready. Rendering ${url} → ${OUT_PATH}…`);

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    await page.pdf({
      path: OUT_PATH,
      format: "A4",
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `<div style="font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 8px; color: #94a3b8; width: 100%; padding: 0 20mm; display: flex; justify-content: space-between;"><span>Michael Becker — Resume</span><span>${version}</span></div>`,
    });

    await browser.close();
    console.log(`Wrote ${OUT_PATH} (${version})`);
  } finally {
    await server.stop();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
