const copy = {
  'pt-BR': {
    kicker:'ROD · guia do portfólio',title:'Explore a RDP Studio por conexões.',
    lead:'O ROD relaciona projetos, tecnologias e trajetória usando a base local deste site. Escolha um caminho ou faça uma pergunta.',
    queryLabel:'Consulta atual',responseLabel:'Resposta do núcleo',send:'Enviar',
    pathsKicker:'Caminhos rápidos',pathsTitle:'Comece pelo assunto, não por um menu.',
    disclosureTitle:'Como o ROD funciona',
    disclosure:'As respostas são montadas no seu navegador a partir do conteúdo publicado no portfólio. A conversa não é enviada para um servidor e o ROD informa quando não encontra contexto suficiente.',
    ready:'Pronto para conectar',thinking:'Relacionando informações',answered:'Contexto encontrado',
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
    disclosure:'Answers are assembled in your browser from published portfolio content. The conversation is not sent to a server, and ROD states when there is not enough context.',
    ready:'Ready to connect',thinking:'Connecting information',answered:'Context found',
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
const lang = () => document.documentElement.dataset.lang === 'en' ? 'en' : 'pt-BR'

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
  if(/marcelo|who/.test(normalized)) return 'Marcelo Rodrigues works across infrastructure, support, automation and web tools. He holds a technology degree in Information Technology Management and is pursuing postgraduate studies in Digital Forensics and Security.'
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
  await new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion:reduce)').matches?0:260))
  const answer=engine.answer(question,{...context});context=answer.context||context
  elements.title.textContent=responseTitle(answer,question)
  elements.text.textContent=lang()==='en'?englishAnswer(answer,question):answer.text
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
