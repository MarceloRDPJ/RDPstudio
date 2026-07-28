const { chromium } = require('playwright')

const base = process.env.RDP_PREVIEW_URL || 'http://127.0.0.1:4180'
const projects = [
  'controle-acesso-visao',
  'igreja-casa',
  'scanner-game-free',
  'validador-firewall',
  'abertura-chamados-glpi',
  'assistente-vendas-ia',
  'relatorio-interativo'
]

;(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  })
  const results = []

  for (const width of [390, 1440]) {
    for (const slug of projects) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      const errors = []
      const requests = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('request', request => requests.push(request.url()))
      await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort())

      const started = Date.now()
      const response = await page.goto(`${base}/projects/${slug}/index.html`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      })
      await page.waitForTimeout(600)

      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        shell: document.querySelectorAll('[data-rdp-shell]').length,
        launcher: document.querySelectorAll('.rdp-rod-launcher').length,
        legacyRod: Boolean(document.querySelector('.rod-panel,.rod-shell,.rod-launcher')),
        projectBase: [...document.styleSheets].filter(sheet => sheet.href?.endsWith('/project-base.css')).length,
        rootText: document.querySelector('#root')?.textContent.trim().slice(0, 40) || ''
      }))

      const forbidden = requests.filter(url =>
        /cdn\.tailwindcss|babel|unpkg\.com\/react|rod-tour|rod-assistant/.test(url) ||
        (slug === 'controle-acesso-visao' && /tensorflow|coco-ssd/.test(url)) ||
        (slug === 'relatorio-interativo' && /papaparse|xlsx|chart\.js|html2canvas|jspdf/.test(url))
      )

      results.push({
        slug,
        width,
        status: response?.status(),
        elapsedMs: Date.now() - started,
        errors,
        forbidden,
        ...state
      })
      await page.close()
    }
  }

  await browser.close()
  console.log(JSON.stringify(results, null, 2))

  const failed = results.filter(result =>
    result.status !== 200 ||
    result.elapsedMs > 5000 ||
    result.errors.length ||
    result.forbidden.length ||
    result.overflow !== 0 ||
    result.shell !== 1 ||
    result.launcher !== 1 ||
    result.legacyRod ||
    result.projectBase !== 1 ||
    (result.slug === 'scanner-game-free' && !result.rootText.includes('RDP INSIDER'))
  )
  if (failed.length) process.exitCode = 1
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
