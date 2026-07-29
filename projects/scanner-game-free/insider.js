(() => {
  const state={data:null,filter:'All',query:'',limit:9};
  const copies={title:'What is free now. What is worth following next.',lead:'A Python crawler organizes Epic Games offers and hardware news into a fast, searchable static collection.',update:'Last collection',available:'Available for free',until:'Deadline',source:'Source',claim:'Open on Epic Games',next:'Upcoming offers',nextText:'Dates collected from the source and shown without a simulated countdown.',collection:'Monitored collection',feed:'Games and hardware',search:'Search collection',all:'All',news:'News',dates:'Dates',free:'Free',more:'Show more',how:'How it works',method:'Python collects. JSON publishes. The browser filters.',step1:'The crawler reads Epic Games and RSS feeds.',step2:'Entries are normalized, deduplicated and written to JSON.',step3:'The interface reads the local file; no server is needed for search.'};
  const $=s=>document.querySelector(s);
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const unique=list=>[...new Map((list||[]).map(item=>[item.id||item.url||`${item.title}-${item.start_date}`,item])).values()];
  const date=value=>value?new Intl.DateTimeFormat(document.documentElement.lang==='en'?'en-US':'pt-BR',{dateStyle:'medium'}).format(new Date(value)):'—';
  const image=(url,title)=>`<img src="${escape(url||'')}" alt="${escape(title||'')}" loading="lazy" decoding="async" onerror="this.remove()">`;
  function renderFeature(){
    const epic=state.data.epic_data||{},game=unique(epic.current_games)[0];
    if(!game){$('#current-game-description').textContent=document.documentElement.lang==='en'?'No current offer was found in the latest collection.':'Nenhuma oferta atual foi encontrada na última coleta.';return}
    $('#current-game-media').innerHTML=image(game.image,game.title);$('#epic-title').textContent=game.title;$('#current-game-description').textContent=game.description||'';$('#current-game-deadline').textContent=date(game.end_date);$('#current-game-link').href=game.url||'https://store.epicgames.com/free-games';
    $('#upcoming-games').innerHTML=unique(epic.upcoming_games).map(game=>`<article class="insider-game">${image(game.image,game.title)}<div><h3>${escape(game.title)}</h3><time datetime="${escape(game.start_date)}">${date(game.start_date)}</time></div></article>`).join('');
  }
  function filtered(){
    const query=state.query.toLocaleLowerCase('pt-BR');
    return unique(state.data.items).filter(item=>(state.filter==='All'||item.category===state.filter)&&(!query||`${item.title} ${item.summary} ${(item.sources||[]).join(' ')}`.toLocaleLowerCase('pt-BR').includes(query)));
  }
  function renderFeed(){
    const list=filtered(),shown=list.slice(0,state.limit);
    $('#result-count').textContent=document.documentElement.lang==='en'?`${list.length} entries found`:`${list.length} itens encontrados`;
    $('#news-feed').innerHTML=shown.map(item=>`<a class="insider-story" href="${escape(item.url)}" target="_blank" rel="noopener">${image(item.image,item.title)}<div><small>${escape(item.category||'News')}</small><h3>${escape(item.title)}</h3><p>${escape(item.summary)}</p><footer>${escape((item.sources||[])[0]||'')} · ${date(item.date)}</footer></div></a>`).join('');
    $('#load-more').hidden=shown.length>=list.length;
  }
  function applyLanguage(){
    const en=document.documentElement.dataset.lang==='en';document.querySelectorAll('[data-copy]').forEach(node=>{node.dataset.pt??=node.textContent;node.textContent=en?(copies[node.dataset.copy]||node.dataset.pt):node.dataset.pt});$('#search').placeholder=en?'Search title or topic':'Buscar título ou assunto';if(state.data){renderFeature();renderFeed()}
  }
  $('#filters').addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(!button)return;state.filter=button.dataset.filter;state.limit=9;document.querySelectorAll('[data-filter]').forEach(item=>item.classList.toggle('is-active',item===button));renderFeed()});
  $('#search').addEventListener('input',event=>{state.query=event.target.value.trim();state.limit=9;renderFeed()});
  $('#load-more').addEventListener('click',()=>{state.limit+=9;renderFeed()});
  fetch('data/db.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(data=>{state.data=data;$('#last-update').textContent=data.display_date||date(data.last_updated);$('#data-state').textContent=document.documentElement.lang==='en'?'Static file loaded':'Arquivo estático carregado';renderFeature();renderFeed()}).catch(()=>{$('#data-state').textContent=document.documentElement.lang==='en'?'Data file unavailable':'Arquivo de dados indisponível'});
  new MutationObserver(applyLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});applyLanguage();
})();
