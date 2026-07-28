const { chromium } = require('playwright')
const base = process.env.RDP_PREVIEW_URL || 'http://127.0.0.1:4180'
const pages = [
  ['home','/hub/index.html'],['projects','/hub/projetos.html'],
  ['about','/hub/sobre.html'],['rod','/hub/rod.html']
]
const projects = [
  'controle-acesso-visao','igreja-casa','scanner-game-free','validador-firewall',
  'abertura-chamados-glpi','assistente-vendas-ia','relatorio-interativo'
]

;(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'})
  const results=[]
  for(const viewport of [{name:'mobile',width:390,height:844},{name:'small',width:320,height:640},{name:'desktop',width:1440,height:900}]){
    for(const [name,path] of pages){
      const page=await browser.newPage({viewport})
      const errors=[];page.on('pageerror',error=>errors.push(error.message))
      const response=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:15000})
      await page.waitForTimeout(500)
      const state=await page.evaluate(()=>({
        overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        launcher:document.querySelectorAll('.rod-launcher').length,
        oldPanel:Boolean(document.querySelector('.rod-panel,.rod-shell')),
        navRod:document.querySelectorAll('[data-nav-rod]').length,
        headerHeight:document.querySelector('.site-header')?.getBoundingClientRect().height,
        touch:[...document.querySelectorAll('button,.theme-picker summary')].filter(el=>{const r=el.getBoundingClientRect();return r.width&&r.height&&(r.width<40||r.height<40)}).slice(0,8).map(el=>({text:el.textContent.trim().slice(0,24),w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height}))
      }))
      if(name==='rod'){
        await page.locator('[data-rod-input]').fill(viewport.name==='desktop'?'Como usar o Validador de MACs?':'Quem é Marcelo Rodrigues?')
        await page.locator('[data-rod-form]').evaluate(form=>form.requestSubmit())
        await page.waitForTimeout(500)
        state.rod=await page.evaluate(()=>({
          state:document.querySelector('[data-rod-core-state]')?.dataset.rodCoreState,
          response:document.querySelector('[data-rod-response-text]')?.textContent.trim().slice(0,90),
          query:document.querySelector('[data-rod-current-query]')?.textContent.trim(),
          suggestions:document.querySelectorAll('[data-rod-suggestions] button').length,
          canvas:Boolean(document.querySelector('.rod-core-canvas'))
        }))
        await page.locator('[data-lang-option="en"]').click()
        await page.locator('[data-rod-input]').fill('Who is Marcelo?')
        await page.locator('[data-rod-form]').evaluate(form=>form.requestSubmit())
        await page.waitForTimeout(400)
        state.english=await page.locator('[data-rod-response-text]').textContent()
      }
      if(viewport.name==='mobile')await page.screenshot({path:`validation-${name}-mobile-v2.png`,fullPage:true})
      results.push({viewport:viewport.name,name,status:response?.status(),errors,...state})
      await page.close()
    }
  }
  for(const slug of projects){
    const page=await browser.newPage({viewport:{width:390,height:844}})
    const errors=[],failed=[];page.on('pageerror',error=>errors.push(error.message));page.on('requestfailed',request=>failed.push({url:request.url(),error:request.failure()?.errorText}))
    const response=await page.goto(`${base}/projects/${slug}/index.html`,{waitUntil:'domcontentloaded',timeout:15000})
    await page.waitForTimeout(500)
    results.push({viewport:'mobile',name:slug,status:response?.status(),errors,failed:failed.slice(0,8),project:await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      shellHeight:document.querySelector('.rdp-global-bar')?.getBoundingClientRect().height,
      rodLinks:[...document.querySelectorAll('a[href*="hub/rod.html"]')].map(a=>a.getAttribute('href')),
      oldPanel:Boolean(document.querySelector('.rod-panel,.rod-shell'))
    }))})
    await page.close()
  }
  await browser.close()
  console.log(JSON.stringify(results,null,2))
})().catch(error=>{console.error(error);process.exitCode=1})
