const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const base = process.env.RDP_PREVIEW_URL || 'http://127.0.0.1:4178';
const output = path.resolve(__dirname, '..', 'assets', 'images', 'projects');
const projects = [
  ['controle-acesso-visao', '/projects/controle-acesso-visao/index.html'],
  ['igreja-casa', '/projects/igreja-casa/index.html'],
  ['scanner-game-free', '/projects/scanner-game-free/index.html'],
  ['validador-firewall', '/projects/validador-firewall/index.html'],
  ['abertura-chamados-glpi', '/projects/abertura-chamados-glpi/index.html'],
  ['assistente-vendas-ia', '/projects/assistente-vendas-ia/index.html'],
  ['relatorio-interativo', '/projects/relatorio-interativo/index.html'],
];

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const report = [];
  for (const [slug, url] of projects) {
    const page = await browser.newPage({ viewport: { width: 1365, height: 860 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(`page: ${error.message}`));
    page.on('requestfailed', request => errors.push(`request: ${request.url()} (${request.failure()?.errorText || 'failed'})`));
    let status = null;
    try {
      const response = await page.goto(base + url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      status = response?.status() ?? null;
      await page.waitForTimeout(1800);
      await page.screenshot({
        path: path.join(output, `${slug}.png`),
        fullPage: false,
      });
    } catch (error) {
      errors.push(`navigation: ${error.message}`);
    }
    report.push({ slug, url, status, title: await page.title().catch(() => ''), errors });
    await page.close();
  }
  await browser.close();
  process.stdout.write(JSON.stringify(report, null, 2));
})().catch(error => {
  process.stderr.write(error.stack || String(error));
  process.exitCode = 1;
});
