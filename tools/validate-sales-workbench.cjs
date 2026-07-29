const { chromium } = require('playwright');
const path = require('path');

const base = 'http://127.0.0.1:4180/projects/assistente-vendas-ia/';
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const review = path.resolve(__dirname, '..', 'review');

async function run(viewport, name) {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const page = await browser.newPage({
    viewport,
    colorScheme: name === 'desktop' ? 'dark' : 'light'
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('[data-scenario="stock"]').click();
  await page.waitForTimeout(900);
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.waitForTimeout(500);
  await page.locator('#confirm-order').click();
  await page.getByRole('button', { name: 'Ver outro produto' }).click();
  await page.waitForTimeout(500);
  await page.locator('#sales-input').fill('Quero um batom');
  await page.locator('#sales-form').evaluate(form => form.requestSubmit());
  await page.waitForTimeout(700);

  const metrics = await page.evaluate(() => {
    const workbench = document.querySelector('.sales-workbench');
    const conversation = document.querySelector('.sales-conversation');
    const messages = document.querySelector('#sales-messages');
    const form = document.querySelector('#sales-form');
    const trace = document.querySelector('.sales-trace');
    const rect = element => {
      const value = element.getBoundingClientRect();
      return { top: value.top, bottom: value.bottom, height: value.height };
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      bodyWidth: document.body.scrollWidth,
      workbench: rect(workbench),
      conversation: rect(conversation),
      form: rect(form),
      messages: {
        ...rect(messages),
        scrollHeight: messages.scrollHeight,
        clientHeight: messages.clientHeight,
        overflowY: getComputedStyle(messages).overflowY
      },
      trace: {
        ...rect(trace),
        scrollHeight: trace.scrollHeight,
        clientHeight: trace.clientHeight,
        overflowY: getComputedStyle(trace).overflowY
      },
      formInsideConversation: form.getBoundingClientRect().bottom <= conversation.getBoundingClientRect().bottom + 1,
      noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
      lastAssistant: [...document.querySelectorAll('.sales-message--assistant')].at(-1)?.childNodes[0]?.textContent
    };
  });

  await page.locator('.sales-lab').screenshot({
    path: path.join(review, `sales-workbench-${name}.png`)
  });
  await browser.close();
  return { name, errors, metrics };
}

(async () => {
  const results = [];
  results.push(await run({ width: 1440, height: 900 }, 'desktop'));
  results.push(await run({ width: 390, height: 844 }, 'mobile'));
  const failures = results.filter(result =>
    result.errors.length ||
    !result.metrics.formInsideConversation ||
    !result.metrics.noHorizontalOverflow ||
    !result.metrics.lastAssistant?.includes('Batom Matte Vermelho')
  );
  console.log(JSON.stringify({ failures, results }, null, 2));
  process.exitCode = failures.length ? 1 : 0;
})();
