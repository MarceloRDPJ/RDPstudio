const { chromium } = require('playwright');
const fs = require('fs');
const base = 'http://127.0.0.1:4180';
const pages = [
  'controle-acesso-visao','igreja-casa','scanner-game-free','validador-firewall',
  'abertura-chamados-glpi','assistente-vendas-ia','relatorio-interativo'
];
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const results = [];
  for (const width of [390, 1440]) {
    for (const slug of pages) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`${base}/projects/${slug}/`, { waitUntil: 'networkidle', timeout: 30000 });
      const basics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        title: document.title,
        logo: document.querySelector('.rdp-global-brand img') ? getComputedStyle(document.querySelector('.rdp-global-brand img')).content : 'project-owned',
      }));
      results.push({ slug, width, status: response?.status(), errors, ...basics });
      if (width === 390 || ['igreja-casa','scanner-game-free','validador-firewall','abertura-chamados-glpi','assistente-vendas-ia'].includes(slug)) {
        await page.screenshot({ path: `review/suite-${slug}-${width}.png`, fullPage: true });
      }
      await page.close();
    }
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${base}/projects/igreja-casa/`, { waitUntil: 'networkidle' });
  await page.click('[data-tab="wifi"]');
  const churchTab = await page.locator('#panel-wifi').isVisible();
  await page.goto(`${base}/projects/scanner-game-free/`, { waitUntil: 'networkidle' });
  await page.click('[data-filter="Hardware"]');
  const insiderCount = await page.locator('.insider-story').count();
  const insiderDuplicateIds = await page.evaluate(() => {
    const hrefs=[...document.querySelectorAll('.insider-story')].map(x=>x.href);
    return hrefs.length-new Set(hrefs).size;
  });
  await page.goto(`${base}/projects/validador-firewall/`, { waitUntil: 'networkidle' });
  await page.fill('#dataInput','PC-01;AA-BB-CC-DD-EE-FF\nPC-02;00:11:22:33:44:55\nPC-03;INVALIDO');
  await page.click('#processButton');
  await page.waitForTimeout(750);
  const validator = await page.evaluate(() => ({
    objects: !document.querySelector('#cardObjects').classList.contains('hidden'),
    group: !document.querySelector('#cardGroup').classList.contains('hidden'),
    errors: !document.querySelector('#cardErrors').classList.contains('hidden'),
    summary: document.querySelector('#summary').innerText,
  }));
  await page.goto(`${base}/projects/assistente-vendas-ia/`, { waitUntil: 'networkidle' });
  await page.fill('#sales-input','tem baton vermelhu?');
  await page.click('#sales-form button');
  await page.waitForTimeout(500);
  const assistant = await page.locator('.sales-message').allTextContents();
  await page.goto(`${base}/projects/igreja-casa/`, { waitUntil: 'networkidle' });
  await page.click('[data-rdp-lang-option="en"]');
  const english = await page.locator('[data-i18n="lead"]').innerText();
  await page.click('.rdp-theme-picker summary');
  await page.click('[data-rdp-theme-option="light"]');
  const lightLogo = await page.locator('.rdp-global-brand img').evaluate(el => getComputedStyle(el).content);
  fs.writeFileSync('review/project-suite-results.json', JSON.stringify({ results, interactions:{ churchTab, insiderCount, insiderDuplicateIds, validator, assistant, english, lightLogo }},null,2));
  console.log(JSON.stringify({ failures: results.filter(x => x.status !== 200 || x.errors.length || x.overflow > 1), interactions:{ churchTab, insiderCount, insiderDuplicateIds, validator, assistant, english, lightLogo }},null,2));
  await browser.close();
  if (results.some(x => x.status !== 200 || x.errors.length || x.overflow > 1) || !churchTab || !validator.objects || !validator.group || !validator.errors || insiderDuplicateIds) process.exit(1);
})();
