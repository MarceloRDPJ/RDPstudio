const { chromium } = require('playwright');

const base = process.env.RDP_PREVIEW_URL || 'http://127.0.0.1:4178';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const results = [];

  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(`${base}/hub/projetos.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForSelector('.project-row', { timeout: 10000 });
    await page.locator('.project-row').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `validation-projects-editorial-${viewport.name}.png`, fullPage: true });

    const initial = await page.evaluate(() => ({
      status: document.readyState,
      rows: document.querySelectorAll('.project-row').length,
      images: [...document.querySelectorAll('.project-row-image img')].map((image) => ({
        loaded: image.complete && image.naturalWidth > 0,
        alt: image.alt
      })),
      links: [...document.querySelectorAll('.project-row .row-action')].map((link) => link.getAttribute('href')),
      filters: document.querySelectorAll('[data-family]').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rodOpen: document.querySelector('.rod-panel')?.classList.contains('is-open') || false,
      dashboardPresent: Boolean(document.querySelector('.dashboard-section, .metrics-grid, .distribution-panel'))
    }));

    await page.locator('[data-family="tools"]').click();
    const toolRows = await page.locator('.project-row').count();
    await page.locator('[data-lang-option="en"]').click();
    const english = await page.locator('[data-family="all"]').textContent();
    await page.locator('.theme-picker summary').click();
    await page.locator('[data-theme-option="light"]').click();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);

    results.push({
      viewport: viewport.name,
      httpStatus: response?.status(),
      errors,
      initial,
      toolRows,
      english,
      theme
    });
    await page.close();
  }

  await browser.close();
  process.stdout.write(JSON.stringify(results, null, 2));
})().catch((error) => {
  process.stderr.write(error.stack || String(error));
  process.exitCode = 1;
});
