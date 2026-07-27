(() => {
 const container=document.getElementById('home-projects'); if(!container) return;
 const selected=['igreja-casa','validador-firewall','scanner-game-free'];
 function render(){const lang=document.documentElement.dataset.lang||'pt-BR'; const key=lang==='en'?'en':'pt';
  const projects=(window.RDP_PROJECTS||[]).filter(p=>selected.includes(p.slug));
  container.innerHTML=projects.map((p,i)=>{const c=p[key]; return `<article class="feature-project ${i===1?'reverse':''}"><a class="feature-media ${p.screenshot?'':'synthetic'}" href="projeto.html?slug=${p.slug}">${p.screenshot?`<img src="${p.screenshot}" alt="${c.name}">`:`<div class="project-symbol" data-accent="${p.accent}"><span>${c.type}</span><strong>${c.name}</strong><p>${c.highlights.slice(0,3).join(' · ')}</p></div>`}</a><div class="feature-copy"><div class="eyebrow">${c.eyebrow}</div><h3>${c.name}</h3><p>${c.summary}</p><div class="meta-row">${p.technologies.slice(0,4).map(t=>`<span>${t}</span>`).join('')}</div><a class="text-link" href="projeto.html?slug=${p.slug}">${c.cta}</a></div></article>`}).join('');}
 document.addEventListener('rdp:language',render); render();
})();