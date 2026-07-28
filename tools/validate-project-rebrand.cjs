const { chromium } = require('playwright')

const base = process.env.RDP_PREVIEW_URL || 'http://127.0.0.1:4180'
const cases = [
  ['vision', '/projects/controle-acesso-visao/', 1440, 900],
  ['church', '/projects/igreja-casa/', 1440, 900],
  ['insider', '/projects/scanner-game-free/', 1440, 900],
  ['validator', '/projects/validador-firewall/', 1440, 900],
  ['glpi', '/projects/abertura-chamados-glpi/', 1440, 900],
  ['sales', '/projects/assistente-vendas-ia/', 1440, 900],
  ['report', '/projects/relatorio-interativo/', 1440, 900],
  ['vision-mobile', '/projects/controle-acesso-visao/', 390, 844],
  ['insider-mobile', '/projects/scanner-game-free/', 390, 844],
  ['validator-mobile', '/projects/validador-firewall/', 390, 844],
  ['report-mobile', '/projects/relatorio-interativo/', 390, 844],
  ['vision-small', '/projects/controle-acesso-visao/', 320, 640],
  ['church-tablet', '/projects/igreja-casa/', 768, 1024],
  ['glpi-medium', '/projects/abertura-chamados-glpi/', 980, 900],
  ['sales-laptop', '/projects/assistente-vendas-ia/', 1280, 720],
]
const selectedCases = process.env.RDP_CASE
  ? cases.filter(([name]) => name === process.env.RDP_CASE)
  : cases

;(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  })
  const results = []
  for (const [name, route, width, height] of selectedCases) {
    const page = await browser.newPage({ viewport: { width, height } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    if (process.env.RDP_BLOCK_EXTERNAL === '1') {
      await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort())
    }
    const response = await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(1400)

    if (name === 'validator') {
      await page.locator('#dataInput').fill('SW-01;AA:BB:CC:11:22:33\nSW-02;AA-BB-CC-44-55-66')
      await page.locator('#processButton').click()
      await page.waitForTimeout(200)
    }
    if (name === 'insider') {
      const hardwareFilter = page.getByRole('button', { name: /hardware/i })
      if (await hardwareFilter.count()) {
        await hardwareFilter.click()
        await page.waitForTimeout(100)
      }
    }

    await page.locator('.rdp-theme-picker summary').click()
    await page.locator('[data-rdp-theme-option="dark"]').click()
    await page.locator('[data-rdp-lang-option="en"]').click()

    const state = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      theme: document.documentElement.dataset.theme,
      language: document.documentElement.lang,
      shell: Boolean(document.querySelector('.rdp-global-bar')),
      projectClass: [...document.body.classList].find(name => name.startsWith('rdp-project--')),
      validatorObjects: document.querySelector('#badgeObjects')?.textContent?.trim() || null,
      insiderCards: document.querySelectorAll('article').length,
      offenders: [...document.querySelectorAll('body *')]
        .filter(element => {
          const rect = element.getBoundingClientRect()
          return rect.right > window.innerWidth + 1 || rect.left < -1
        })
        .slice(0, 8)
        .map(element => ({
          tag: element.tagName,
          id: element.id,
          className: typeof element.className === 'string' ? element.className.slice(0, 140) : '',
          rect: element.getBoundingClientRect().toJSON(),
        })),
    }))
    results.push({
      name,
      status: response?.status(),
      errors,
      overflow: state.scrollWidth > state.width,
      ...state,
    })
    await page.close()
  }
  await browser.close()
  console.log(JSON.stringify(results, null, 2))
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
