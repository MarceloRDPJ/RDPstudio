const { chromium } = require('playwright')
const path = require('node:path')
const fs = require('node:fs')

const projects = [
  ['controle-acesso-vision', '/projects/controle-acesso-visao/'],
  ['igreja-casa-hub', '/projects/igreja-casa/'],
  ['rdp-insider', '/projects/scanner-game-free/'],
  ['validador-fortigate', '/projects/validador-firewall/'],
  ['glpi-automator', '/projects/abertura-chamados-glpi/'],
  ['assistente-vendas', '/projects/assistente-vendas-ia/'],
  ['relatorio-interativo', '/projects/relatorio-interativo/'],
]

;(async () => {
  const output = path.resolve('review/neural-rod/assets/real')
  fs.mkdirSync(output, { recursive: true })
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  })

  const results = []
  for (const [name, route] of projects) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const response = await page.goto(`http://127.0.0.1:4179${route}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })
    await page.waitForTimeout(1800)
    await page.screenshot({
      path: path.join(output, `${name}.png`),
      fullPage: false,
    })
    results.push({ name, status: response?.status(), errors })
    await page.close()
  }

  await browser.close()
  console.log(JSON.stringify(results, null, 2))
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
