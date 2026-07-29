(() => {
 const container=document.getElementById('home-projects'); if(!container) return;
 const selected=['igreja-casa','validador-firewall','scanner-game-free'];
 function render(){const lang=document.documentElement.dataset.lang||'pt-BR'; const key=lang==='en'?'en':'pt';
  const projects=(window.RDP_PROJECTS||[]).filter(p=>selected.includes(p.slug));
  container.innerHTML=projects.map((p,i)=>{const c=p[key]; return `<article class="feature-project ${i===1?'reverse':''}"><a class="feature-media" href="${p.livePath}"><img src="${p.screenshot}" alt="${c.name}" loading="eager" decoding="async"></a><div class="feature-copy"><div class="eyebrow">${c.eyebrow}</div><h3>${c.name}</h3><p>${c.summary}</p><div class="meta-row">${p.technologies.slice(0,4).map(t=>`<span>${t}</span>`).join('')}</div><a class="text-link" href="${p.livePath}">${c.cta} →</a></div></article>`}).join('');}
 const rail=document.querySelector('[data-org-rail]');
 const preview=document.querySelector('[data-org-preview]');
 document.querySelector('[data-org-rotation]')?.remove();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let offset=0,last=0,frame=0,pausedLogo=null;
 const originals=[...(rail?.children||[])];
 originals.forEach(item=>{const clone=item.cloneNode(true);clone.tabIndex=-1;clone.setAttribute('aria-hidden','true');rail.appendChild(clone)});
 function loopWidth(){return rail?.scrollWidth/2||0}
 function tick(time){if(last&&!pausedLogo&&!reduced.matches){const speed=innerWidth<640?.048:.068;offset+=(time-last)*speed;const width=loopWidth();if(width&&offset>=width)offset%=width;rail.style.transform=`translate3d(${-offset}px,0,0)`}last=time;frame=requestAnimationFrame(tick)}
 function showPreview(item){if(!preview)return;preview.hidden=false;preview.querySelector('[data-org-preview-name]').textContent=item.dataset.orgName;preview.querySelector('[data-org-preview-detail]').textContent=item.dataset.orgDetail;const link=preview.querySelector('[data-org-preview-link]');if(item.dataset.orgHref){link.hidden=false;link.href=item.dataset.orgHref;if(item.dataset.orgExternal){link.target='_blank';link.rel='noopener noreferrer'}else{link.removeAttribute('target');link.removeAttribute('rel')}}else link.hidden=true}
 function hidePreview(){if(preview)preview.hidden=true}
 rail?.addEventListener('pointerover',event=>{const item=event.target.closest('button[data-org-name]');if(!item||item.contains(event.relatedTarget))return;pausedLogo=item;showPreview(item)})
 rail?.addEventListener('pointerout',event=>{const item=event.target.closest('button[data-org-name]');if(!item||item.contains(event.relatedTarget))return;if(pausedLogo===item)pausedLogo=null;hidePreview()})
 rail?.addEventListener('focusin',event=>{const item=event.target.closest('button[data-org-name]');if(!item)return;pausedLogo=item;showPreview(item)})
 rail?.addEventListener('focusout',event=>{const item=event.target.closest('button[data-org-name]');if(!item||item.contains(event.relatedTarget))return;if(pausedLogo===item)pausedLogo=null;hidePreview()})
 rail?.addEventListener('click',event=>{const item=event.target.closest('button[data-org-name]');if(item&&matchMedia('(hover: none)').matches)showPreview(item)})
 reduced.addEventListener?.('change',()=>{last=performance.now()});
 frame=requestAnimationFrame(tick);
 document.addEventListener('rdp:language',render); render();
})();
