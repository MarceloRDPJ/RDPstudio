const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
  })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    permissions: ['camera'],
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:4180/projects/controle-acesso-visao/demo.html#demo', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  })
  await page.click('#startCameraBtn')
  await page.waitForFunction(() => {
    const status = document.querySelector('#cameraStatus')?.textContent
    return status === 'Executando' || status === 'Falha'
  }, { timeout: 45000 })
  const result = await page.evaluate(() => ({
    status: document.querySelector('#cameraStatus')?.textContent,
    model: document.querySelector('#modelBadge')?.textContent.trim(),
    startDisabled: document.querySelector('#startCameraBtn')?.disabled,
    stopDisabled: document.querySelector('#stopCameraBtn')?.disabled,
    videoReady: document.querySelector('#cameraVideo')?.readyState,
    log: document.querySelector('#eventLog')?.textContent.trim().slice(0, 300),
  }))
  console.log(JSON.stringify({ ...result, errors }, null, 2))
  if (errors.length || !['Executando', 'Falha'].includes(result.status)) process.exitCode = 1
  await browser.close()
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
