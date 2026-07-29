(() => {
 const container=document.getElementById('home-projects'); if(!container) return;
 const selected=['igreja-casa','validador-firewall','scanner-game-free'];
 function render(){const lang=document.documentElement.dataset.lang||'pt-BR'; const key=lang==='en'?'en':'pt';
  const projects=(window.RDP_PROJECTS||[]).filter(p=>selected.includes(p.slug));
  container.innerHTML=projects.map((p,i)=>{const c=p[key]; return `<article class="feature-project ${i===1?'reverse':''}"><a class="feature-media" href="${p.livePath}"><img src="${p.screenshot}" alt="${c.name}" loading="eager" decoding="async"></a><div class="feature-copy"><div class="eyebrow">${c.eyebrow}</div><h3>${c.name}</h3><p>${c.summary}</p><div class="meta-row">${p.technologies.slice(0,4).map(t=>`<span>${t}</span>`).join('')}</div><a class="text-link" href="${p.livePath}">${c.cta} →</a></div></article>`}).join('');}
 const rail=document.querySelector('[data-org-rail]');
 const carousel=document.querySelector('[data-org-carousel]');
 const rotation=document.querySelector('[data-org-rotation]');
 const preview=document.querySelector('[data-org-preview]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let offset=0,last=0,frame=0,rotating=!reduced.matches,hovering=false;
 const originals=[...(rail?.children||[])];
 originals.forEach(item=>{const clone=item.cloneNode(true);clone.tabIndex=-1;clone.setAttribute('aria-hidden','true');rail.appendChild(clone)});
 function setRotationLabel(){if(!rotation)return;rotation.querySelector('span').textContent=rotating?'Ⅱ':'▶';rotation.setAttribute('aria-label',rotating?'Pausar rotação':'Iniciar rotação')}
 function tick(time){if(last&&rotating&&!hovering&&!reduced.matches){offset+=(time-last)*.035;const setWidth=originals.reduce((sum,item)=>sum+item.getBoundingClientRect().width,0);if(setWidth&&offset>=setWidth)offset-=setWidth;rail.style.transform=`translate3d(${-offset}px,0,0)`}last=time;frame=requestAnimationFrame(tick)}
 function showPreview(item){if(!preview||item.getAttribute('aria-hidden')==='true')return;preview.hidden=false;preview.querySelector('[data-org-preview-name]').textContent=item.dataset.orgName;preview.querySelector('[data-org-preview-detail]').textContent=item.dataset.orgDetail;const link=preview.querySelector('[data-org-preview-link]');if(item.dataset.orgHref){link.hidden=false;link.href=item.dataset.orgHref;if(item.dataset.orgExternal){link.target='_blank';link.rel='noopener noreferrer'}else{link.removeAttribute('target');link.removeAttribute('rel')}}else link.hidden=true}
 originals.forEach(item=>{item.addEventListener('mouseenter',()=>showPreview(item));item.addEventListener('focus',()=>{rotating=false;setRotationLabel();showPreview(item)});item.addEventListener('click',()=>showPreview(item))});
 carousel?.addEventListener('mouseenter',()=>hovering=true);
 carousel?.addEventListener('mouseleave',()=>hovering=false);
 rotation?.addEventListener('click',()=>{rotating=!rotating;setRotationLabel()});
 reduced.addEventListener?.('change',()=>{if(reduced.matches)rotating=false;setRotationLabel()});
 setRotationLabel();frame=requestAnimationFrame(tick);
 document.addEventListener('rdp:language',render); render();
})();
