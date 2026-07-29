(() => {
 const container=document.getElementById('home-projects'); if(!container) return;
 const selected=['igreja-casa','validador-firewall','scanner-game-free'];
 function render(){const lang=document.documentElement.dataset.lang||'pt-BR'; const key=lang==='en'?'en':'pt';
  const projects=(window.RDP_PROJECTS||[]).filter(p=>selected.includes(p.slug));
  container.innerHTML=projects.map((p,i)=>{const c=p[key]; return `<article class="feature-project ${i===1?'reverse':''}"><a class="feature-media" href="${p.livePath}"><img src="${p.screenshot}" alt="${c.name}" loading="eager" decoding="async"></a><div class="feature-copy"><div class="eyebrow">${c.eyebrow}</div><h3>${c.name}</h3><p>${c.summary}</p><div class="meta-row">${p.technologies.slice(0,4).map(t=>`<span>${t}</span>`).join('')}</div><a class="text-link" href="${p.livePath}">${c.cta} →</a></div></article>`}).join('');}
 const rail=document.querySelector('[data-org-rail]');
 const position=document.querySelector('[data-org-position]');
 const carousel=document.querySelector('[data-org-carousel]');
 const rotation=document.querySelector('[data-org-rotation]');
 const dots=document.querySelector('[data-org-dots]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,timer=null,rotating=!reduced.matches;
 const total=rail?.children.length||0;
 function cardWidth(){return rail?.clientWidth||0}
 function go(index,behavior='smooth'){if(!rail||!total)return;current=(index+total)%total;rail.scrollTo({left:current*cardWidth(),behavior});update()}
 function update(){if(!rail||!position)return;position.textContent=`${current+1} / ${total}`;[...dots.children].forEach((d,i)=>d.setAttribute('aria-current',String(i===current)))}
 function stop(permanent=false){clearInterval(timer);timer=null;rail?.setAttribute('aria-live','polite');if(permanent)rotating=false;if(rotation){rotation.textContent='▶';rotation.setAttribute('aria-label','Iniciar rotação')}}
 function start(){if(!rotating||reduced.matches)return;clearInterval(timer);rail?.setAttribute('aria-live','off');timer=setInterval(()=>go(current+1),5000);if(rotation){rotation.textContent='Ⅱ';rotation.setAttribute('aria-label','Pausar rotação')}}
 if(dots)for(let i=0;i<total;i++){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Mostrar organização ${i+1}`);b.addEventListener('click',()=>{stop(true);go(i)});dots.appendChild(b)}
 document.querySelector('[data-org-prev]')?.addEventListener('click',()=>{stop(true);go(current-1)});
 document.querySelector('[data-org-next]')?.addEventListener('click',()=>{stop(true);go(current+1)});
 rotation?.addEventListener('click',()=>{rotating=!rotating;rotating?start():stop(true)});
 rail?.addEventListener('scrollend',()=>{current=Math.round(rail.scrollLeft/cardWidth());update()});
 carousel?.addEventListener('mouseenter',()=>clearInterval(timer));
 carousel?.addEventListener('mouseleave',start);
 carousel?.addEventListener('focusin',()=>stop(true));
 reduced.addEventListener?.('change',()=>reduced.matches?stop(true):null);
 addEventListener('resize',()=>go(current,'auto'));update();start();
 document.addEventListener('rdp:language',render); render();
})();
