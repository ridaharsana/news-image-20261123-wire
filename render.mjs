// Render page.html to assets/entry.png at exactly 1024x1024 and assert that
// no checked text block overflows its box (scroll vs client size).
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const exe = '/home/hatch/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
await page.goto('file://' + join(root, 'page.html'));
await page.evaluate(() => document.fonts.ready);

const report = await page.evaluate(() => {
  const bad = [];
  document.querySelectorAll('.chk').forEach((el, i) => {
    if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
      bad.push({ i, cls: el.className, text: (el.textContent || '').trim().slice(0, 60),
                 sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight });
    }
  });
  const body = document.body;
  return { bad, bodyScrollH: body.scrollHeight, bodyClientH: body.clientHeight };
});
console.log('OVERFLOW:', JSON.stringify(report, null, 1));

await page.screenshot({ path: join(root, 'assets', 'entry.png') });
await browser.close();
console.log('WROTE assets/entry.png');
