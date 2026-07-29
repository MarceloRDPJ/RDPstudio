const { chromium } = require('playwright')
const path = require('node:path')

const base = 'http://127.0.0.1:4180/projects/controle-acesso-visao'

;(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  })
  const results = []

  for (const width of [390, 1440]) {
    for (const pageName of ['index.html', 'demo.html']) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      const errors = []
      const requests = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('request', request => requests.push(request.url()))
      const response = await page.goto(`${base}/${pageName}`, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(700)
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        title: document.title,
        shell: document.querySelectorAll('[data-rdp-shell]').length,
        launcher: document.querySelectorAll('.rdp-rod-launcher').length,
        startButton: Boolean(document.querySelector('#startCameraBtn')),
        projectLink: document.querySelector('a[href="demo.html#demo"],a[href="index.html"]')?.getAttribute('href') || null,
      }))
      await page.evaluate(() => document.querySelector('[data-rdp-lang-option="en"]')?.click())
      await page.waitForTimeout(80)
      const language = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        title: document.title,
        heading: (document.querySelector('#demo h2') || document.querySelector('h1'))?.textContent.trim(),
        projectsLabel: document.querySelector('[data-rdp-label="projects"]')?.textContent.trim(),
        themeLabels: [...document.querySelectorAll('[data-rdp-theme-option]')].map(node => node.textContent.trim()),
        untranslated: document.body.innerText.match(/\b(Voltar|Demonstração|Confiança|Câmera|Nenhum|Projeto|artigo|sistema|código|página|objetos|Leitura|Notas|processamento)\b/gi) || [],
      }))
      const themes = []
      for (const mode of ['light', 'dark', 'contrast']) {
        await page.evaluate(value => document.querySelector(`[data-rdp-theme-option="${value}"]`)?.click(), mode)
        await page.waitForTimeout(40)
        themes.push(await page.evaluate(() => {
          const brand = document.querySelector('.rdp-global-brand img')
          const rod = document.querySelector('.rdp-rod-launcher img')
          return {
            mode: document.documentElement.dataset.theme,
            body: getComputedStyle(document.body).backgroundColor,
            brandContent: getComputedStyle(brand).content,
            rodContent: getComputedStyle(rod).content,
            current: document.querySelector('[data-rdp-theme-current]')?.textContent.trim(),
          }
        }))
      }
      const eagerModelRequests = requests.filter(url => /tensorflow|coco-ssd/.test(url))
      const name = `${pageName.replace('.html', '')}-${width}`
      await page.screenshot({ path: path.resolve(`review/controle-vision-${name}.png`), fullPage: false })
      results.push({ name, status: response?.status(), errors, eagerModelRequests, language, themes, ...state })
      await page.close()
    }
  }

  await browser.close()
  console.log(JSON.stringify(results, null, 2))
  const failed = results.filter(result =>
    result.status !== 200 ||
    result.errors.length ||
    result.eagerModelRequests.length ||
    result.overflow !== 0 ||
    result.shell !== 1 ||
    result.launcher !== 1 ||
    result.language.lang !== 'en' ||
    result.language.projectsLabel !== 'Projects' ||
    result.language.untranslated.length ||
    ['Um protótipo físico de acesso facial, explicado sem esconder o que se perdeu.','Detecção local de objetos pela câmera.'].includes(result.language.heading) ||
    !result.language.themeLabels.includes('Pistachio') ||
    new Set(result.themes.map(theme => theme.body)).size !== 3 ||
    !result.themes.find(theme => theme.mode === 'light')?.brandContent.includes('logo-black.png') ||
    !result.themes.find(theme => theme.mode === 'light')?.rodContent.includes('logo-black.png') ||
    (result.name.startsWith('demo') && !result.startButton)
  )
  if (failed.length) process.exitCode = 1
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
