const { chromium } = require('playwright');

const base = process.env.RDP_PREVIEW_URL || 'http://127.0.0.1:4178';
const cases = [
  ['home-desktop', '/hub/index.html', 1440, 900],
  ['home-mobile', '/hub/index.html', 390, 844],
  ['projects-desktop', '/hub/projetos.html', 1440, 900],
  ['projects-mobile', '/hub/projetos.html', 390, 844],
  ['vision-desktop', '/projects/controle-acesso-visao/index.html', 1440, 900],
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const results = [];
  for (const [name, url, width, height] of cases) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    let rod = null;
    if (url.includes('/hub/')) {
      await page.locator('.rod-toggle').click();
      await page.waitForTimeout(80);
      rod = await page.evaluate(() => {
        const toggle = document.querySelector('.rod-toggle');
        const panel = document.querySelector('.rod-panel');
        const logo = document.querySelector('.rod-brand-logo');
        return {
          open: panel?.classList.contains('is-open') || false,
          expanded: toggle?.getAttribute('aria-expanded'),
          hasLogo: Boolean(logo),
          logoSource: logo?.currentSrc || logo?.src || '',
          logoContent: logo ? getComputedStyle(logo).content : '',
          localDisclosure: document.querySelector('.rod-footer-note')?.textContent.includes('não envia') || false,
        };
      });
    }
    if (url.includes('/hub/')) {
      await page.screenshot({ path: `validation-${name}.png`, fullPage: true });
    }
    const state = await page.evaluate(() => ({
      title: document.title,
      viewport: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      theme: document.documentElement.dataset.theme,
      language: document.documentElement.dataset.lang,
      projectRows: document.querySelectorAll('.project-row').length,
      themeOptions: document.querySelectorAll('[data-theme-option]').length,
    }));
    results.push({ name, status: response?.status(), errors, rod, ...state });
    await page.close();
  }
  await browser.close();
  process.stdout.write(JSON.stringify(results, null, 2));
})().catch(error => {
  process.stderr.write(error.stack || String(error));
  process.exitCode = 1;
});
