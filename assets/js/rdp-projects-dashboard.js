(() => {
  const fallback = window.RDP_PROJECTS || [];
  const curatedBySlug = Object.fromEntries(fallback.map((project) => [project.slug, project]));
  const families = {
    platforms: ['igreja-casa', 'scanner-game-free'],
    tools: ['validador-firewall', 'relatorio-interativo'],
    automations: ['abertura-chamados-glpi', 'assistente-vendas-ia'],
    studies: ['controle-acesso-visao']
  };
  const labels = {
    'pt-BR': {
      all: 'Todos', platforms: 'Plataformas', tools: 'Ferramentas',
      automations: 'Automações', studies: 'Estudos de caso',
      summary: '7 projetos entre plataformas, ferramentas, automações e estudos de caso.',
      image: 'Imagem do projeto'
    },
    en: {
      all: 'All', platforms: 'Platforms', tools: 'Tools',
      automations: 'Automations', studies: 'Case studies',
      summary: '7 projects across platforms, tools, automations and case studies.',
      image: 'Project image'
    }
  };
  let source = [];
  let active = 'all';
  let query = '';
  const elements = {
    filters: document.getElementById('project-filters'),
    list: document.getElementById('projects-list'),
    search: document.getElementById('project-search'),
    empty: document.getElementById('projects-empty'),
    summary: document.getElementById('portfolio-summary')
  };
  const language = () => document.documentElement.dataset.lang === 'en' ? 'en' : 'pt-BR';
  const copy = (project) => project[language() === 'en' ? 'en' : 'pt'] || project.pt;
  const familyOf = (slug) => Object.entries(families).find(([, slugs]) => slugs.includes(slug))?.[0] || 'studies';
  const text = (key) => labels[language()][key];

  async function load() {
    try {
      const response = await fetch('data/projects.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Project catalog unavailable');
      const raw = await response.json();
      source = raw.map((project) => ({
        ...curatedBySlug[project.slug],
        ...project,
        pt: curatedBySlug[project.slug]?.pt,
        en: curatedBySlug[project.slug]?.en,
        livePath: `../${project.projectUrl.replace(/^\.\.\//, '')}`
      }));
    } catch (error) {
      source = fallback;
    }
    render();
  }
  function matches(project) {
    const projectCopy = copy(project);
    const matchesFamily = active === 'all' || familyOf(project.slug) === active;
    const content = [projectCopy.name, projectCopy.summary, projectCopy.problem, projectCopy.category, ...(project.technologies || [])]
      .join(' ').toLocaleLowerCase(language());
    return matchesFamily && content.includes(query.toLocaleLowerCase(language()));
  }
  function renderFilters() {
    elements.filters.innerHTML = ['all', ...Object.keys(families)].map((family) =>
      `<button class="filter-button${family === active ? ' active' : ''}" type="button" data-family="${family}" aria-pressed="${family === active}">${text(family)}</button>`
    ).join('');
  }
  function renderList() {
    const projects = source.filter(matches);
    elements.empty.hidden = projects.length > 0;
    elements.list.innerHTML = projects.map((project) => {
      const projectCopy = copy(project);
      return `<article class="project-row">
        <a class="project-row-image" href="${project.livePath}" aria-label="${projectCopy.cta}: ${projectCopy.name}">
          <img src="${project.screenshot}" alt="${text('image')}: ${projectCopy.name}" loading="lazy">
          <span class="project-image-fallback" aria-hidden="true">${projectCopy.name}</span>
        </a>
        <div class="project-row-copy">
          <div class="project-row-meta"><span>${text(familyOf(project.slug))}</span><span>${projectCopy.status}</span></div>
          <h2><a href="${project.livePath}">${projectCopy.name}</a></h2>
          <p>${projectCopy.summary}</p>
          <a class="row-action" href="${project.livePath}" aria-label="${projectCopy.cta}: ${projectCopy.name}">
            <span>${projectCopy.cta}</span><span aria-hidden="true">→</span>
          </a>
        </div>
      </article>`;
    }).join('');
    elements.list.querySelectorAll('.project-row-image img').forEach((image) => {
      image.addEventListener('error', () => image.closest('.project-row-image')?.classList.add('is-missing'), { once: true });
    });
  }
  function render() {
    elements.summary.textContent = text('summary');
    renderFilters();
    renderList();
  }
  elements.filters?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-family]');
    if (!button) return;
    active = button.dataset.family;
    render();
  });
  elements.search?.addEventListener('input', (event) => {
    query = event.target.value.trim();
    renderList();
  });
  document.addEventListener('rdp:language', render);
  load();
})();
