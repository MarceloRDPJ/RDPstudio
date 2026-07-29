(()=>{
  const $=selector=>document.querySelector(selector);
  const catalog=[
    {id:'batom-matte',name:'Batom Matte Vermelho',price:29.9,stock:3,terms:['batom','baton','vermelho','vermelhu','matte','dia a dia']},
    {id:'mascara-cilios',name:'Máscara para cílios',price:34.9,stock:5,terms:['mascara','máscara','rimel','rímel','cilios','cílios']},
    {id:'gloss-neutro',name:'Gloss Neutro',price:24.9,stock:0,terms:['gloss','neutro','brilho']}
  ];
  const scenarios={
    discovery:{user:'Preciso de algo discreto para usar no dia a dia.',reply:'Para uma rotina mais discreta, eu começaria pelo Batom Matte Vermelho. Ele tem acabamento sem brilho e está disponível no catálogo local.',product:'batom-matte',suggestions:['Adicionar ao carrinho','Tem máscara para cílios?']},
    stock:{user:'Tem máscara para cílios?',reply:'Sim. O catálogo local informa 5 unidades da Máscara para cílios, por R$ 34,90. A consulta não reserva o item.',product:'mascara-cilios',suggestions:['Adicionar ao carrinho','Ver outro produto']},
    checkout:{user:'Quero duas unidades do batom.',reply:'Encontrei o Batom Matte Vermelho. Posso colocar 2 unidades no carrinho local. Você ainda poderá revisar antes de confirmar.',product:'batom-matte',quantity:2,suggestions:['Adicionar 2 ao carrinho','Cancelar']},
    boundary:{user:'Aprova meu comprovante Pix?',reply:'Não nesta demonstração. Uma imagem de comprovante não basta para confirmar pagamento. Essa ação precisaria consultar o provedor financeiro e manter registro de auditoria.',boundary:true,suggestions:['Como seria a validação?','Consultar estoque']}
  };
  const copy={
    kind:'Conversational commerce lab',title:'A conversation is only useful when the system knows what to do next.',lead:'This demo separates language, catalog and rules. The assistant understands the request; controlled functions check inventory and build the cart; sensitive actions still require confirmation.',try:'Try the flow',understand:'Understand the architecture',channel:'Designed channel',controller:'Orchestration',model:'Interpretation',data:'Planned data',demo:'Local demo',demoTitle:'See the conversation and actions side by side.',demoText:'Choose a scenario or write freely. Nothing leaves the browser and no real inventory is changed.',discover:'Discover product',discoverSub:'need → suggestion',stock:'Check inventory',stockSub:'product → availability',checkout:'Build order',checkoutSub:'item → confirmation',boundary:'Test boundary',boundarySub:'payment → review',local:'local sample catalog',reset:'Restart',message:'Message',send:'Send',trace:'Execution trace',traceTitle:'What happened behind the response',waiting:'Waiting',cart:'Local cart',clear:'Clear',total:'Total',confirm:'Review order',architecture:'Architecture',archTitle:'The model is not allowed to improvise a sale.',archText:'Natural language identifies an intent. The controller turns that intent into a known operation, validates parameters and only then reads or changes data.',layer1:'Channel',layer1Text:'Telegram receives text, images and user actions.',layer2:'Interpretation',layer2Text:'The model returns intent and structured fields.',layer3:'Controller',layer3Text:'Python authorizes functions and validates price, quantity and state.',layer4:'Data',layer4Text:'Supabase records catalog, inventory, orders and audit.',limits:'Demo boundaries',limitsTitle:'It works here. It does not pretend to be in production.',does:'What works',doesText:'Search tolerant of simple variations, local catalog lookup, suggestions, cart and explicit confirmation.',planned:'Planned architecture',plannedText:'Telegram, Gemini, Supabase, persistent orders and operational catalog.',absent:'What is not active',absentText:'Payments, receipt reading, real inventory reservation, external messages and human service.',back:'Back to projects'
  };
  const state={cart:[],scenario:'discovery'};
  const normalize=value=>value.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/\bbaton\b/g,'batom').replace(/\bvermelhu\b/g,'vermelho');
  const money=value=>value.toLocaleString(document.documentElement.dataset.lang==='en'?'en-US':'pt-BR',{style:'currency',currency:'BRL'});
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion:reduce)').matches?0:ms));
  function message(who,text,meta=''){
    const node=document.createElement('p');node.className=`sales-message sales-message--${who}`;node.textContent=text;
    if(meta){const small=document.createElement('small');small.textContent=meta;node.append(small)}
    $('#sales-messages').append(node);$('#sales-messages').scrollTop=$('#sales-messages').scrollHeight;
  }
  function productCard(product){
    const card=document.createElement('article');card.className='sales-product-card';card.innerHTML=`<div class="sales-product-swatch"></div><div><strong>${product.name}</strong><span>${money(product.price)} · ${product.stock?`${product.stock} no catálogo local`:'sem estoque no catálogo local'}</span></div>`;$('#sales-messages').append(card);
  }
  function trace(label,detail,status='OK'){
    const item=document.createElement('li');const number=String($('#trace-list').children.length+1).padStart(2,'0');item.innerHTML=`<b>${number}</b><div><strong>${label}</strong><small>${detail}</small></div><em>${status}</em>`;$('#trace-list').append(item);
  }
  function suggestions(items=[]){
    $('#sales-suggestions').replaceChildren(...items.map(text=>{const button=document.createElement('button');button.type='button';button.textContent=text;button.addEventListener('click',()=>handle(text));return button}));
  }
  function findProduct(text){const value=normalize(text);return catalog.find(product=>product.terms.some(term=>value.includes(normalize(term))))}
  function renderCart(){
    const box=$('#sales-cart');box.hidden=!state.cart.length;$('#cart-items').innerHTML=state.cart.map(item=>`<div class="sales-cart-item"><span>${item.quantity} × ${item.product.name}</span><strong>${money(item.quantity*item.product.price)}</strong></div>`).join('');$('#cart-total').textContent=money(state.cart.reduce((sum,item)=>sum+item.quantity*item.product.price,0));
  }
  function addToCart(product,quantity=1){
    if(!product.stock){message('assistant','Esse item não está disponível no catálogo local.');return}
    const safe=Math.min(quantity,product.stock),existing=state.cart.find(item=>item.product.id===product.id);
    if(existing)existing.quantity=Math.min(existing.quantity+safe,product.stock);else state.cart.push({product,quantity:safe});
    trace('update_cart',`${product.id} · quantidade ${safe}`);renderCart();message('assistant',`${safe} ${safe===1?'unidade adicionada':'unidades adicionadas'} ao carrinho local. Nenhuma reserva real foi feita.`);
  }
  async function runScenario(key){
    state.scenario=key;const scenario=scenarios[key];document.querySelectorAll('[data-scenario]').forEach(button=>button.classList.toggle('is-active',button.dataset.scenario===key));$('#sales-messages').replaceChildren();$('#trace-list').replaceChildren();suggestions([]);$('#trace-state').textContent='Executando';
    message('user',scenario.user);await delay(260);trace('parse_intent',scenario.boundary?'validate_payment':'search_catalog',scenario.boundary?'ação sensível':'intenção identificada');await delay(220);
    if(scenario.product){const product=catalog.find(item=>item.id===scenario.product);trace('get_product',`${product.id} · estoque ${product.stock}`);productCard(product)}
    if(scenario.boundary)trace('policy_check','confirmação financeira requer provedor externo','BLOQUEADO');
    await delay(250);message('assistant',scenario.reply,'catálogo demonstrativo');suggestions(scenario.suggestions);$('#trace-state').textContent=scenario.boundary?'Limite aplicado':'Concluído';
  }
  async function handle(raw){
    const text=raw.trim();if(!text)return;message('user',text);$('#sales-input').value='';suggestions([]);$('#trace-list').replaceChildren();$('#trace-state').textContent='Interpretando';await delay(200);
    const normalized=normalize(text),product=findProduct(text),quantity=/\b(2|duas|dois)\b/.test(normalized)?2:1;
    if(/adicionar|carrinho|quero/.test(normalized)&&product){trace('parse_intent','update_cart');trace('get_product',`${product.id} · estoque ${product.stock}`);addToCart(product,quantity);$('#trace-state').textContent='Concluído';return}
    if(/adicionar 2/.test(normalized)){const selected=findProduct(scenarios[state.scenario].user)||catalog.find(item=>item.id===scenarios[state.scenario].product);if(selected){addToCart(selected,2);$('#trace-state').textContent='Concluído';return}}
    if(/pix|comprovante|pagamento|aprova/.test(normalized)){trace('parse_intent','validate_payment');trace('policy_check','provedor financeiro ausente','BLOQUEADO');message('assistant','Não posso confirmar pagamento nesta demonstração. Uma implementação real precisaria consultar o provedor financeiro e registrar a decisão.');$('#trace-state').textContent='Limite aplicado';return}
    if(product){trace('parse_intent','search_catalog');trace('get_product',`${product.id} · estoque ${product.stock}`);productCard(product);message('assistant',product.stock?`${product.name}: ${product.stock} unidades no catálogo local, por ${money(product.price)}. A consulta não reserva estoque.`:`${product.name} aparece no catálogo, mas está sem estoque nesta demonstração.`);suggestions(product.stock?['Adicionar ao carrinho','Ver outro produto']:['Ver outro produto']);$('#trace-state').textContent='Concluído';return}
    if(/oi|ola|bom dia|boa tarde|boa noite/.test(normalized)){trace('parse_intent','greeting');message('assistant','Olá. Posso ajudar a encontrar um produto, consultar o estoque local ou montar um carrinho de demonstração.');suggestions(['Quero um batom','Consultar máscara para cílios']);$('#trace-state').textContent='Concluído';return}
    trace('parse_intent','unknown');message('assistant','Não encontrei esse item no catálogo local. Você pode tentar “batom matte”, “máscara para cílios” ou “gloss”.');suggestions(['Quero um batom','Tem máscara para cílios?']);$('#trace-state').textContent='Sem correspondência';
  }
  $('#sales-form').addEventListener('submit',event=>{event.preventDefault();handle($('#sales-input').value)});
  $('#reset-demo').addEventListener('click',()=>runScenario(state.scenario));
  $('#clear-cart').addEventListener('click',()=>{state.cart=[];renderCart();trace('clear_cart','carrinho local removido')});
  $('#confirm-order').addEventListener('click',()=>{trace('review_order',`${state.cart.length} item(ns) aguardando confirmação`);message('assistant','Revise itens e total. Em uma implementação real, a criação do pedido só aconteceria após sua confirmação explícita.');$('#trace-state').textContent='Aguardando confirmação'});
  document.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>runScenario(button.dataset.scenario)));
  function applyLanguage(){const english=document.documentElement.dataset.lang==='en';document.querySelectorAll('[data-i18n]').forEach(node=>{node.dataset.pt??=node.textContent;node.textContent=english?(copy[node.dataset.i18n]||node.dataset.pt):node.dataset.pt});$('#sales-input').placeholder=english?'E.g. I need an everyday lipstick':'Ex.: preciso de um batom para o dia a dia';renderCart()}
  new MutationObserver(applyLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});applyLanguage();runScenario('discovery');
})();
