const copy = {
  'pt-BR': {
    kicker:'ROD · guia do portfólio',title:'Explore a RDP Studio por conexões.',
    lead:'O ROD relaciona projetos, tecnologias e trajetória usando a base local deste site. Escolha um caminho ou faça uma pergunta.',
    queryLabel:'Consulta atual',responseLabel:'Resposta do núcleo',send:'Enviar',
    pathsKicker:'Caminhos rápidos',pathsTitle:'Comece pelo assunto, não por um menu.',
    disclosureTitle:'Como o ROD funciona',
    disclosure:'As respostas e a visão são processadas no navegador. O reconhecimento de voz depende do serviço disponível no navegador e pode usar processamento do fornecedor. O ROD informa quando não encontra contexto suficiente.',
    ready:'Pronto para conectar',thinking:'Procurando relações',organizing:'Organizando o contexto',typing:'Formando a resposta',answered:'Resposta pronta',
    startTitle:'Por onde você quer começar?',
    startText:'Posso apresentar os sete projetos, explicar a trajetória de Marcelo, comparar tecnologias ou indicar a experiência mais adequada para uma necessidade.',
    placeholder:'Pergunte ao ROD'
  },
  en: {
    kicker:'ROD · portfolio guide',title:'Explore RDP Studio through connections.',
    lead:'ROD connects projects, technologies and professional experience using this site’s local knowledge base. Choose a path or ask a question.',
    queryLabel:'Current query',responseLabel:'Core response',send:'Send',
    pathsKicker:'Quick paths',pathsTitle:'Start with a subject, not a menu.',
    disclosureTitle:'How ROD works',
    disclosure:'Answers and vision run in the browser. Speech recognition depends on the browser service and may use provider processing. ROD states when there is not enough context.',
    ready:'Ready to connect',thinking:'Finding connections',organizing:'Organizing context',typing:'Forming the answer',answered:'Answer ready',
    startTitle:'Where would you like to start?',
    startText:'I can introduce the seven projects, explain Marcelo’s path, compare technologies or point you to the right experience for a specific need.',
    placeholder:'Ask ROD'
  }
}
const starter = {
  'pt-BR':['Compare os sete projetos','Quem é Marcelo Rodrigues?','Qual projeto mostra mais automação?','Como usar o Validador de MACs?','Explique o Controle de Acesso Vision','Quais projetos possuem backend?'],
  en:['Compare the seven projects','Who is Marcelo Rodrigues?','Which project shows the most automation?','How do I use the MAC Validator?','Explain Access Control Vision','Which projects have a backend?']
}
const elements = {
  form:document.querySelector('[data-rod-form]'),input:document.querySelector('[data-rod-input]'),
  core:document.querySelector('[data-rod-core-state]'),canvas:document.querySelector('.rod-core-canvas'),
  status:document.querySelector('[data-rod-status]'),queryCard:document.querySelector('[data-rod-query-card]'),
  response:document.querySelector('[data-rod-response]'),
  query:document.querySelector('[data-rod-current-query]'),title:document.querySelector('[data-rod-response-title]'),
  text:document.querySelector('[data-rod-response-text]'),actions:document.querySelector('[data-rod-actions]'),
  suggestions:document.querySelector('[data-rod-suggestions]')
}
let knowledge
let engine
let context = { lastProjectSlug:new URLSearchParams(location.search).get('project'), lastRecommendationSlugs:[] }
let personality=localStorage.getItem('rdp-rod-personality')||'natural'
let visionStream=null
let visionFrame=0
let visionStarting=false
const lang = () => document.documentElement.dataset.lang === 'en' ? 'en' : 'pt-BR'

const personalities={
  natural:{label:'Natural',description:'Conversa clara e equilibrada.'},
  direct:{label:'Direto',description:'Respostas curtas e objetivas.'},
  teacher:{label:'Didático',description:'Explica contexto e próximos passos.'},
  curious:{label:'Explorador',description:'Relaciona assuntos e sugere caminhos.'}
}

function detectClimate(question){
  const value=question.toLowerCase()
  if(/n[aã]o funciona|travou|erro|ruim|confuso|irritad|frustrad|n[aã]o entendi/.test(value))return'frustrated'
  if(/amei|legal|ótimo|otimo|bom demais|gostei|parab[eé]ns/.test(value))return'positive'
  if(/\?|como|por que|porque|qual|curios/.test(value))return'curious'
  return'neutral'
}
function shapeAnswer(text,climate){
  let result=text
  if(personality==='direct')result=result.split('\n\n').slice(0,2).join('\n\n')
  if(personality==='teacher'&&!/^(Vamos por partes|Primeiro,)/.test(result))result=`Vamos por partes. ${result}`
  if(personality==='curious'&&!/^(Há uma conexão|Vale observar)/.test(result))result=`Há uma conexão interessante aqui. ${result}`
  if(climate==='frustrated')result=`Entendi. Vou direto ao ponto. ${result}`
  if(climate==='positive')result=`Que bom saber disso. ${result}`
  return result
}
async function typeResponse(text,reduced){
  elements.text.textContent=''
  if(reduced){elements.text.textContent=text;return}
  const lengthScale=text.length>650?.34:text.length>360?.52:text.length>180?.72:1
  let index=0
  while(index<text.length){
    const chunk=text.slice(index,index+(Math.random()>.72?2:1))
    elements.text.textContent+=chunk
    index+=chunk.length
    const last=chunk.at(-1)
    const pause=/[.!?]/.test(last)?105:/[,;:]/.test(last)?58:last===' '?14:22
    const delay=Math.max(7,pause*lengthScale*(personality==='direct'?.72:1))
    await new Promise(resolve=>setTimeout(resolve,delay))
  }
}

function loadScript(src,test){
  if(test())return Promise.resolve()
  return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=()=>test()?resolve():reject(new Error('Recurso indisponível'));script.onerror=reject;document.head.appendChild(script)})
}
function initCapabilitiesUI(){
  const intro=document.querySelector('.rod-intro>p')
  const controls=document.createElement('div')
  controls.className='rod-capability-bar'
  controls.innerHTML=`<label><span>Personalidade</span><select data-rod-personality>${Object.entries(personalities).map(([value,item])=>`<option value="${value}" ${value===personality?'selected':''}>${item.label}</option>`).join('')}</select><small data-rod-personality-help>${personalities[personality].description}</small></label><div class="rod-mode-actions"><button type="button" data-rod-listen>Usar voz</button><button type="button" data-rod-speak>Ler resposta</button><button type="button" data-rod-vision>Visão</button></div>`
  intro?.insertAdjacentElement('afterend',controls)
  const caseSection=document.createElement('section')
  caseSection.className='rod-case shell'
  caseSection.innerHTML=`<div class="rod-case-head"><span class="section-kicker">ROD como case</span><h2>Quatro técnicas trabalhando juntas.</h2><p>O ROD não esconde o mecanismo: cada modo mostra uma técnica diferente e seus limites.</p></div><div class="rod-techniques"><article><strong>01</strong><div><h3>Linguagem e erros</h3><p>Normalização, distância de edição e busca aproximada reconhecem variações e pequenos erros de digitação.</p></div></article><article><strong>02</strong><div><h3>Contexto e clima</h3><p>Uma classificação local identifica intenção, curiosidade, frustração ou retorno positivo para ajustar o ritmo da resposta.</p></div></article><article><strong>03</strong><div><h3>Voz</h3><p>Reconhecimento e síntese usam os recursos de fala disponíveis no navegador e no sistema operacional.</p></div></article><article><strong>04</strong><div><h3>Visão computacional</h3><p>TensorFlow.js e COCO-SSD detectam objetos na câmera sem armazenar imagens.</p></div></article></div>`
  document.querySelector('.rod-paths')?.before(caseSection)
  controls.querySelector('[data-rod-personality]').addEventListener('change',event=>{personality=event.target.value;localStorage.setItem('rdp-rod-personality',personality);controls.querySelector('[data-rod-personality-help]').textContent=personalities[personality].description})
  initSpeech(controls)
  controls.querySelector('[data-rod-vision]').addEventListener('click',openVision)
}
function initSpeech(controls){
  const listen=controls.querySelector('[data-rod-listen]')
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition
  if(!Recognition){listen.disabled=true;listen.title='Reconhecimento de voz não disponível neste navegador'}else{
    const recognition=new Recognition();recognition.lang='pt-BR';recognition.interimResults=true
    listen.addEventListener('click',()=>{recognition.start();listen.dataset.active='true';elements.status.textContent='Ouvindo'})
    recognition.onresult=event=>{elements.input.value=Array.from(event.results).map(result=>result[0].transcript).join('')}
    recognition.onend=()=>{listen.dataset.active='false';elements.status.textContent=copy[lang()].ready;if(elements.input.value.trim())ask(elements.input.value)}
    recognition.onerror=()=>{listen.dataset.active='false';elements.status.textContent='Não consegui ouvir'}
  }
  controls.querySelector('[data-rod-speak]').addEventListener('click',()=>{speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(elements.text.textContent);utterance.lang=lang()==='en'?'en-US':'pt-BR';speechSynthesis.speak(utterance)})
}
async function openVision(){
  if(visionStarting||visionStream)return
  visionStarting=true
  const visionButton=document.querySelector('[data-rod-vision]')
  if(visionButton){visionButton.disabled=true;visionButton.textContent='Solicitando câmera…'}
  let panel=document.querySelector('[data-rod-vision-panel]')
  if(!panel){
    panel=document.createElement('section');panel.className='rod-vision shell';panel.dataset.rodVisionPanel=''
    panel.innerHTML=`<div class="rod-vision-copy"><span class="section-kicker">Laboratório de visão</span><h2>O que o ROD consegue reconhecer?</h2><p>A câmera é processada no navegador com COCO-SSD. Nenhuma imagem é enviada ou armazenada. A detecção é genérica e pode errar.</p><button type="button" data-rod-vision-close>Encerrar câmera</button></div><div class="rod-vision-feed"><video data-rod-video playsinline muted></video><canvas data-rod-vision-canvas></canvas><p data-rod-vision-result role="status" aria-live="polite">Aguardando permissão da câmera…</p></div>`
    document.querySelector('.rod-paths').before(panel);panel.querySelector('[data-rod-vision-close]').addEventListener('click',closeVision)
  }
  panel.hidden=false;panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'})
  const result=panel.querySelector('[data-rod-vision-result]')
  try{
    if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)throw Object.assign(new Error('Câmera indisponível'),{name:'UnsupportedError'})
    result.textContent='Autorize o uso da câmera no navegador.'
    visionStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false})
    const video=panel.querySelector('[data-rod-video]');video.srcObject=visionStream
    await video.play()
    result.textContent='Câmera ativa. Carregando o reconhecimento de objetos…'
    if(visionButton)visionButton.textContent='Visão ativa'
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js',()=>Boolean(window.tf))
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd',()=>Boolean(window.cocoSsd))
    result.textContent='Carregando o modelo COCO-SSD…'
    const model=await window.cocoSsd.load()
    if(!visionStream)return
    const canvas=panel.querySelector('[data-rod-vision-canvas]'),ctx=canvas.getContext('2d')
    const detect=async()=>{if(!visionStream)return;canvas.width=video.videoWidth;canvas.height=video.videoHeight;ctx.clearRect(0,0,canvas.width,canvas.height);const predictions=await model.detect(video);predictions.slice(0,6).forEach(item=>{ctx.strokeStyle='#b2d98b';ctx.lineWidth=3;ctx.strokeRect(...item.bbox);ctx.fillStyle='#b2d98b';ctx.font='16px sans-serif';ctx.fillText(`${item.class} ${Math.round(item.score*100)}%`,item.bbox[0],Math.max(18,item.bbox[1]-6))});result.textContent=predictions.length?`Reconhecido agora: ${predictions.slice(0,4).map(item=>`${item.class} (${Math.round(item.score*100)}%)`).join(', ')}`:'Observando a cena…';visionFrame=requestAnimationFrame(detect)}
    detect()
  }catch(error){
    visionStream?.getTracks().forEach(track=>track.stop());visionStream=null
    const messages={NotAllowedError:'A câmera foi bloqueada. Libere a permissão para rdpstudio.com.br nas configurações do navegador e tente novamente.',NotFoundError:'Nenhuma câmera foi encontrada neste dispositivo.',NotReadableError:'A câmera está sendo usada por outro aplicativo ou não pôde ser iniciada.',OverconstrainedError:'A câmera disponível não atende à configuração solicitada.',UnsupportedError:'Este navegador ou contexto não permite acesso à câmera.'}
    result.textContent=messages[error.name]||'Não foi possível iniciar a câmera. Verifique a permissão e tente novamente.'
    if(visionButton){visionButton.disabled=false;visionButton.textContent='Tentar visão novamente'}
  }finally{
    visionStarting=false
  }
}
function closeVision(){cancelAnimationFrame(visionFrame);visionStream?.getTracks().forEach(track=>track.stop());visionStream=null;visionStarting=false;const panel=document.querySelector('[data-rod-vision-panel]');if(panel)panel.hidden=true;const button=document.querySelector('[data-rod-vision]');if(button){button.disabled=false;button.textContent='Visão'}}

function renderStatic(){
  const dictionary=copy[lang()]
  document.querySelectorAll('[data-rod-copy]').forEach(node=>{const value=dictionary[node.dataset.rodCopy];if(value)node.textContent=value})
  elements.input.placeholder=dictionary.placeholder
  renderSuggestions(starter[lang()])
}
function renderSuggestions(items){
  elements.suggestions.innerHTML=''
  items.slice(0,6).forEach(item=>{
    const button=document.createElement('button');button.type='button';button.textContent=item
    button.addEventListener('click',()=>ask(item));elements.suggestions.appendChild(button)
  })
}
function renderActions(actions=[]){
  elements.actions.innerHTML=''
  actions.forEach(action=>{const link=document.createElement('a');link.href=action.href;link.textContent=action.label;elements.actions.appendChild(link)})
}
function englishAnswer(answer,question){
  const normalized=question.toLowerCase()
  if(/marcelo|who/.test(normalized)) return 'Marcelo Rodrigues is a Full Stack Developer working across frontend, backend, integrations, automation and data. He holds a technology degree in Information Technology Management and is pursuing postgraduate studies in Digital Forensics and Security.'
  if(/studio|rdp/.test(normalized)) return 'RDP Studio is the identity Marcelo uses to bring together operational tools, platforms, documented automations and case studies. Each project is presented according to its actual format and current state.'
  if(/backend|server|api/.test(normalized)) return 'The portfolio combines client-side tools with projects that have operational or documented backends. RDP Insider uses a Python data pipeline, Igreja Casa uses Supabase, while GLPI Automator and the Sales Assistant document private backend flows.'
  if(/contact|email|whatsapp|linkedin/.test(normalized)) return 'You can contact RDP Studio by WhatsApp, email or Marcelo’s LinkedIn. The contact links are available on the home page.'
  const project=answer.project&&window.RDP_PROJECTS?.find(item=>item.slug===answer.project.slug)
  if(project?.en){
    return `${project.en.summary}\n\nProblem: ${project.en.problem}\nSolution: ${project.en.solution}`
  }
  return 'I can connect you to seven projects across platforms, tools, automations and case studies. Mention a project name or tell me what kind of problem you want to explore.'
}
function responseTitle(answer,question){
  if(lang()!=='en')return answer.project?.name||copy[lang()].responseLabel
  const normalized=question.toLowerCase()
  if(/marcelo|who/.test(normalized))return 'Marcelo Rodrigues'
  if(/studio|rdp/.test(normalized))return 'RDP Studio'
  if(/backend|server|api/.test(normalized))return 'Project architecture'
  if(/contact|email|whatsapp|linkedin/.test(normalized))return 'Contact'
  return answer.project?.name||copy[lang()].responseLabel
}
async function ask(question){
  if(!engine||!question.trim())return
  const dictionary=copy[lang()]
  elements.queryCard.hidden=false;elements.query.textContent=question;elements.response.setAttribute('aria-busy','true')
  elements.core.dataset.rodCoreState='thinking';elements.status.textContent=dictionary.thinking
  elements.input.value='';elements.input.disabled=true
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches
  elements.title.textContent=''
  elements.text.textContent=''
  renderActions([])
  await new Promise(resolve=>setTimeout(resolve,reduced?0:280))
  elements.status.textContent=dictionary.organizing
  await new Promise(resolve=>setTimeout(resolve,reduced?0:240))
  const answer=engine.answer(question,{...context});context=answer.context||context
  elements.title.textContent=responseTitle(answer,question)
  const responseText=shapeAnswer(lang()==='en'?englishAnswer(answer,question):answer.text,detectClimate(question))
  elements.core.dataset.rodCoreState='typing';elements.status.textContent=dictionary.typing
  await typeResponse(responseText,reduced)
  renderActions(answer.actions);renderSuggestions(lang()==='en'?starter.en:(answer.suggestions.length?answer.suggestions:starter['pt-BR']))
  elements.core.dataset.rodCoreState='answer';elements.status.textContent=dictionary.answered;elements.response.setAttribute('aria-busy','false')
  elements.input.disabled=false;elements.input.focus()
  setTimeout(()=>{elements.core.dataset.rodCoreState='idle';elements.status.textContent=dictionary.ready},900)
}
function initCanvas(){
  const canvas=elements.canvas,ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion:reduce)').matches
  const nodes=Array.from({length:54},(_,index)=>({angle:index/54*Math.PI*2,radius:150+(index%7)*16,speed:(index%2?1:-1)*(.00008+(index%5)*.000018),phase:(index%9)*.19}))
  function colors(){const style=getComputedStyle(document.documentElement);return{accent:style.getPropertyValue('--accent').trim()||'#b2d98b',muted:style.getPropertyValue('--subtle').trim()||'#78baa2'}}
  function draw(time=0){
    const {accent,muted}=colors();ctx.clearRect(0,0,720,720)
    const pulse=elements.core.dataset.rodCoreState==='thinking'?1.1:elements.core.dataset.rodCoreState==='answer'?1.04:1
    const points=nodes.map(node=>{const angle=node.angle+(reduced?0:time*node.speed);return{x:360+Math.cos(angle)*node.radius*pulse,y:360+Math.sin(angle+node.phase)*node.radius*.78*pulse}})
    ctx.lineWidth=1
    points.forEach((point,index)=>points.slice(index+1).forEach(other=>{const distance=Math.hypot(point.x-other.x,point.y-other.y);if(distance>82)return;ctx.globalAlpha=(1-distance/82)*.42;ctx.strokeStyle=muted;ctx.beginPath();ctx.moveTo(point.x,point.y);ctx.lineTo(other.x,other.y);ctx.stroke()}))
    ctx.globalAlpha=1;points.forEach((point,index)=>{ctx.fillStyle=index%5?accent:muted;ctx.beginPath();ctx.arc(point.x,point.y,index%5?2.2:3.5,0,Math.PI*2);ctx.fill()})
    ;[118,174,232].forEach((radius,index)=>{ctx.globalAlpha=.12+index*.035;ctx.strokeStyle=accent;ctx.beginPath();ctx.arc(360,360,radius*pulse,0,Math.PI*2);ctx.stroke()})
    ctx.globalAlpha=1;if(!reduced)requestAnimationFrame(draw)
  }
  draw()
}
async function init(){
  renderStatic()
  initCapabilitiesUI()
  const response=await fetch('../assets/data/rod-knowledge.json',{cache:'no-store'})
  if(!response.ok)throw new Error('Base do ROD indisponível')
  knowledge=await response.json();engine=new window.RodKnowledgeEngine(knowledge)
  initCanvas()
  const initial=context.lastProjectSlug&&knowledge.projects.find(project=>project.slug===context.lastProjectSlug)
  if(initial)ask(`Me explique ${initial.name}`)
}
elements.form.addEventListener('submit',event=>{event.preventDefault();ask(elements.input.value)})
document.addEventListener('rdp:language',()=>{renderStatic();elements.title.textContent=copy[lang()].startTitle;elements.text.textContent=copy[lang()].startText})
init().catch(error=>{elements.status.textContent='ROD indisponível';elements.text.textContent='Não foi possível carregar a base local. Atualize a página para tentar novamente.';console.error(error)})
