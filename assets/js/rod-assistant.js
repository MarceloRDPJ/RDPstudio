const DEFAULT_KNOWLEDGE_PATH = '../assets/data/rod-knowledge.json'

function stripAccents(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function normalizeText(value = '') {
  return stripAccents(String(value).toLowerCase())
    .replace(/[“”"'`´]/g, '')
    .replace(/[^a-z0-9\s/.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function pickOne(list = []) {
  if (!list.length) return ''
  return list[Math.floor(Math.random() * list.length)]
}

function isQuestion(text) {
  return text.includes('?') || /^(quem|como|qual|quais|o que|oque|onde|quando|por que|porque)/.test(text)
}

function createElement(tag, className, html) {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (html !== undefined) el.innerHTML = html
  return el
}

function bullets(items = [], max = 3) {
  return items.slice(0, max).map(item => `- ${item}`).join('\n')
}

function dedupeParagraphs(paragraphs = []) {
  const seen = new Set()
  return paragraphs.filter(paragraph => {
    const key = normalizeText(paragraph)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function compact(text = '') {
  return text.replace(/\n{3,}/g, '\n\n').trim()
}

function editDistance(a = '', b = '') {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0]
    previous[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j]
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
      diagonal = above
    }
  }
  return previous[b.length]
}

function tokenScore(queryToken, candidateToken) {
  if (queryToken === candidateToken) return 1
  if (candidateToken.includes(queryToken) || queryToken.includes(candidateToken)) return 0.82
  const longest = Math.max(queryToken.length, candidateToken.length)
  if (!longest) return 0
  return Math.max(0, 1 - editDistance(queryToken, candidateToken) / longest)
}

class LocalSearch {
  constructor(items = [], options = {}) {
    this.items = items
    this.keys = (options.keys || []).map(key =>
      typeof key === 'string' ? { name: key, weight: 1 } : key
    )
  }

  value(item, path) {
    return path.split('.').reduce((current, key) => current?.[key], item)
  }

  search(query) {
    const queryTokens = normalizeText(query).split(' ').filter(Boolean)
    if (!queryTokens.length) return []

    return this.items
      .map(item => {
        let weightedScore = 0
        let totalWeight = 0
        this.keys.forEach(({ name, weight = 1 }) => {
          const raw = this.value(item, name)
          const values = Array.isArray(raw) ? raw : [raw]
          const candidateTokens = normalizeText(values.filter(Boolean).join(' ')).split(' ').filter(Boolean)
          const score = queryTokens.reduce((sum, queryToken) => {
            const best = candidateTokens.reduce(
              (current, candidateToken) => Math.max(current, tokenScore(queryToken, candidateToken)),
              0
            )
            return sum + best
          }, 0) / queryTokens.length
          weightedScore += score * weight
          totalWeight += weight
        })
        const score = totalWeight ? weightedScore / totalWeight : 0
        return { item, score: 1 - score }
      })
      .filter(result => result.score < 0.72)
      .sort((a, b) => a.score - b.score)
  }
}

function humanizePtBr(text = '') {
  const replacements = [
    [/\bautomacao\b/gi, 'automação'],
    [/\bseguranca\b/gi, 'segurança'],
    [/\btecnica\b/gi, 'técnica'],
    [/\btecnico\b/gi, 'técnico'],
    [/\binteligencia\b/gi, 'inteligência'],
    [/\boperacao\b/gi, 'operação'],
    [/\boperacional\b/gi, 'operacional'],
    [/\binformacao\b/gi, 'informação'],
    [/\bexplicacao\b/gi, 'explicação'],
    [/\bdemonstracao\b/gi, 'demonstração'],
    [/\baplicacao\b/gi, 'aplicação'],
    [/\bsolucao\b/gi, 'solução'],
    [/\bsolucoes\b/gi, 'soluções'],
    [/\bgestao\b/gi, 'gestão'],
    [/\bvalidacao\b/gi, 'validação'],
    [/\bduplicidades\b/gi, 'duplicidades'],
    [/\bnegocio\b/gi, 'negócio'],
    [/\bnegocios\b/gi, 'negócios'],
    [/\bconversacional\b/gi, 'conversacional'],
    [/\bexplica\b/gi, 'explica'],
    [/\bvoce\b/gi, 'você'],
    [/\bvoce\s+\b/gi, 'você '],
    [/\bnao\b/gi, 'não'],
    [/\bsera\b/gi, 'será'],
    [/\bacao\b/gi, 'ação'],
    [/\bacoes\b/gi, 'ações'],
    [/\bduvida\b/gi, 'dúvida'],
    [/\bduvidas\b/gi, 'dúvidas'],
    [/\bpagina\b/gi, 'página'],
    [/\bpaginas\b/gi, 'páginas'],
    [/\bexpansao\b/gi, 'expansão'],
    [/\batraves\b/gi, 'através'],
    [/\bpre visualizacao\b/gi, 'pré-visualização'],
    [/\bguia\b/gi, 'guia'],
    [/\bconteudo\b/gi, 'conteúdo'],
    [/\bconteudos\b/gi, 'conteúdos'],
    [/\btecnologias\b/gi, 'tecnologias'],
    [/\bmais rapidos\b/gi, 'mais rápidos'],
    [/\bmais rapidas\b/gi, 'mais rápidas'],
    [/\bpratico\b/gi, 'prático'],
    [/\bpratica\b/gi, 'prática'],
    [/\bpublico\b/gi, 'público'],
    [/\bambig[uú]o\b/gi, 'ambíguo'],
    [/\bportifolio\b/gi, 'portfólio'],
    [/\bportfolio\b/gi, 'portfólio'],
    [/\bexperiencia\b/gi, 'experiência'],
    [/\bareas\b/gi, 'áreas'],
    [/\bqual e\b/gi, 'qual é'],
    [/\bquem e\b/gi, 'quem é'],
    [/\bo que e\b/gi, 'o que é'],
    [/\bvoce pode\b/gi, 'você pode'],
    [/\bme fale\b/gi, 'me fale'],
    [/\bate\b/gi, 'até']
  ]

  return replacements.reduce((acc, [pattern, value]) => acc.replace(pattern, value), text)
}

class RodKnowledgeEngine {
  constructor(knowledge) {
    this.knowledge = knowledge
    this.projectFuse = new LocalSearch(
      knowledge.projects.map(project => ({
        ...project,
        searchable: [project.name, ...(project.aliases || []), ...(project.keywords || []), project.category, project.summary, project.problem].join(' '),
      })),
      {
        includeScore: true,
        threshold: 0.36,
        ignoreLocation: true,
        minMatchCharLength: 2,
        keys: [
          { name: 'name', weight: 3 },
          { name: 'aliases', weight: 2.8 },
          { name: 'keywords', weight: 2.4 },
          { name: 'category', weight: 1.3 },
          { name: 'summary', weight: 1.1 },
          { name: 'problem', weight: 1.2 },
          { name: 'searchable', weight: 0.8 },
        ],
      }
    )

    this.faqFuse = new LocalSearch(knowledge.faq, {
      includeScore: true,
      threshold: 0.34,
      ignoreLocation: true,
      keys: [
        { name: 'question', weight: 2.4 },
        { name: 'keywords', weight: 2.8 },
        { name: 'answer', weight: 1.1 },
      ],
    })
  }

  findIntent(query) {
    const normalized = normalizeText(query)
    const exact = this.knowledge.intents.find(intent =>
      intent.keywords.some(keyword => {
        const phrase = normalizeText(keyword)
        return normalized === phrase || normalized.includes(` ${phrase} `) || normalized.startsWith(`${phrase} `) || normalized.endsWith(` ${phrase}`)
      })
    )
    if (exact) return exact

    const queryTokens = normalized.split(' ').filter(token => token.length > 1)
    let best = null
    let bestScore = 0
    this.knowledge.intents.forEach(intent => {
      intent.keywords.forEach(keyword => {
        const keywordTokens = normalizeText(keyword).split(' ').filter(token => token.length > 1)
        if (!keywordTokens.length) return
        const score = keywordTokens.reduce((sum, keywordToken) => {
          const closest = queryTokens.reduce((current, queryToken) => Math.max(current, tokenScore(queryToken, keywordToken)), 0)
          return sum + closest
        }, 0) / keywordTokens.length
        const coverage = keywordTokens.filter(keywordToken => queryTokens.some(queryToken => tokenScore(queryToken, keywordToken) >= .72)).length / keywordTokens.length
        const weighted = score * .7 + coverage * .3
        if (weighted > bestScore) {
          best = intent
          bestScore = weighted
        }
      })
    })
    return bestScore >= .74 ? best : null
  }

  findProjects(query) {
    return this.projectFuse.search(query).slice(0, 3).map(result => result.item)
  }

  findFaq(query) {
    return this.faqFuse.search(query).slice(0, 2).map(result => result.item)
  }

  findDirectFaq(query) {
    const normalized = normalizeText(query)
    let best = null
    let bestScore = 0
    this.knowledge.faq.forEach(item => {
      const phrases = [item.question, ...(item.keywords || [])].map(normalizeText)
      const score = phrases.reduce((total, phrase) => {
        if (!phrase) return total
        if (normalized.includes(phrase)) return total + Math.max(3, phrase.split(' ').length * 2)
        const overlap = phrase.split(' ').filter(word => word.length > 3 && normalized.includes(word)).length
        return total + overlap
      }, 0)
      if (score > bestScore) {
        best = item
        bestScore = score
      }
    })
    return bestScore >= 2 ? best : null
  }

  answer(query, context = {}) {
    const normalized = normalizeText(query)
    const projects = this.findProjects(query)
    const faq = this.findFaq(query)
    const directFaq = this.findDirectFaq(query)
    const intent = this.findIntent(query)
    const responses = []
    const suggestions = []
    const actions = []

    if (!normalized) {
      return {
        text: humanizePtBr(pickOne(this.knowledge.assistant.welcome)),
        suggestions: this.knowledge.assistant.starterQuestions,
        actions: [],
        context,
      }
    }

    const projectByContext = this.knowledge.projects.find(project => project.slug === context.lastProjectSlug)
    const recommendationByContext = (context.lastRecommendationSlugs || [])
      .map(slug => this.knowledge.projects.find(project => project.slug === slug))
      .filter(Boolean)

    let contextualProject = projects[0] || null
    const conversationalIntentIds = new Set(['greeting', 'identity', 'wellbeing', 'thanks', 'goodbye', 'capabilities'])
    if (conversationalIntentIds.has(intent?.id)) contextualProject = null
    const generalFaqIds = new Set(['hosting', 'backend', 'best-project', 'project-states', 'usable-now', 'privacy', 'rod-operation', 'languages', 'themes', 'project-images', 'contact-reason'])
    if (directFaq && generalFaqIds.has(directFaq.id)) contextualProject = null

    if (!contextualProject && /^(me mostra|mostra|abrir|abre|abre ele|esse|esse ai|essa ferramenta|essa)$/.test(normalized)) {
      contextualProject = recommendationByContext[0] || projectByContext || null
    }

    if (!contextualProject && /(como usar|como usa|me guie|me guia|guie|guia|mostra como)/.test(normalized)) {
      contextualProject = projectByContext || recommendationByContext[0] || null
    }

    if (intent?.id === 'greeting') {
      responses.push(intent.response)
    }

    if (['identity', 'wellbeing', 'thanks', 'goodbye', 'capabilities'].includes(intent?.id)) {
      responses.push(intent.response)
    }

    if (intent?.id === 'about-studio' || /rdp studio|empresa|estudio|studio|consultoria/.test(normalized)) {
      responses.push(`${this.knowledge.studio.summary}\n\nPilares:\n${bullets(this.knowledge.studio.pillars, 3)}`)
      suggestions.push('Quais projetos mostram mais automação?', 'Qual projeto tem IA?', 'Me fale sobre Marcelo')
    }

    if (intent?.id === 'about-profile' || /sobre mim|sobre voce|curriculo|curriculo|formacao|formacao|certificacao|certificacao|marcelo/.test(normalized)) {
      responses.push(`${this.knowledge.profile.summary}\n\nDestaques:\n${bullets(this.knowledge.profile.highlights, 3)}`)
      suggestions.push('Quais áreas ele domina?', 'Me fale da RDP Studio', 'Como entrar em contato?')
    }

    if (intent?.id === 'contact') {
      responses.push(intent.response)
    }

    if (directFaq && !['about-profile', 'about-studio'].includes(intent?.id)) {
      responses.push(directFaq.answer)
    }

    if (intent?.id === 'project-recommendation') {
      responses.push(intent.response)
      context.lastRecommendationSlugs = ['controle-acesso-visao', 'abertura-chamados-glpi', 'validador-firewall', 'assistente-vendas-ia', 'scanner-game-free']
      suggestions.push('Me mostra', 'Como usar o GLPI Automator?', 'Como usar o Validador de MACs?')
    }

    if (!directFaq && /hospedagem|github pages|cloudflare|statico|estatico|deploy/.test(normalized)) {
      const hostingFaq = this.knowledge.faq.find(item => item.id === 'hosting')
      if (hostingFaq) responses.push(hostingFaq.answer)
    }

    if (!directFaq && /backend|api|servidor|fullstack|full stack/.test(normalized)) {
      const backendFaq = this.knowledge.faq.find(item => item.id === 'backend')
      if (backendFaq) responses.push(backendFaq.answer)
    }

    if (/cada projeto|todos os projetos|todos projetos|me fale dos projetos|me fale um pouco de cada projeto|resuma os projetos/.test(normalized)) {
      const catalogSummary = this.knowledge.projects
        .slice(0, 5)
        .map(project => `- ${project.name}: ${project.problem}`)
        .join('\n')
      responses.push(`Resumo rapido do portfolio:\n${catalogSummary}`)
      suggestions.push('Qual projeto tem IA?', 'Qual projeto mostra automação?', 'Como usar o Validador de MACs?')
    }

    const targetedProject = contextualProject
    if (targetedProject) {
      const wantsUsage = /como usa|como usar|usar|funciona|abrir|mexer|operar|me guia|me guie|mostra como/.test(normalized)
      const wantsTechnical = /stack|tecnologia|linguagem|backend|frontend|automacao|automacao/.test(normalized)
      const wantsSummary = /explica|resuma|resume|fale sobre|me fala|me explique|o que e|oque e/.test(normalized) || isQuestion(normalized)

      if (!directFaq && (wantsSummary || !responses.length)) {
        responses.push(`Sobre ${targetedProject.name}: ${targetedProject.summary}\n\nProblema: ${targetedProject.problem}\nSolucao: ${targetedProject.solution}`)
      }

      if (wantsUsage && !directFaq) {
        responses.push(`Como usar ${targetedProject.name}:\n${bullets(targetedProject.howToUse, 3)}`)
      }

      if (wantsUsage) {
        if (targetedProject.guidedTourUrl) {
          actions.push({ label: 'Abrir e me guiar', href: targetedProject.guidedTourUrl, primary: true })
        }
        actions.push({ label: 'Abrir projeto', href: targetedProject.projectUrl, primary: false })
      }

      if (/^(me mostra|mostra|abrir|abre|abre ele|esse|essa ferramenta)$/.test(normalized)) {
        responses.push(`Claro. Vou te mostrar ${targetedProject.name}, que faz sentido nesse contexto.`)
        if (targetedProject.guidedTourUrl) {
          actions.push({ label: 'Abrir e me guiar', href: targetedProject.guidedTourUrl, primary: true })
        }
        actions.push({ label: 'Abrir projeto', href: targetedProject.projectUrl, primary: false })
      }

      if (/^(me guie|me guia|guia|me leva|me leve)$/.test(normalized)) {
        responses.push(`Posso te guiar por ${targetedProject.name}. Vou abrir a página certa e destacar os pontos principais.`)
        if (targetedProject.guidedTourUrl) {
          actions.push({ label: 'Abrir e me guiar', href: targetedProject.guidedTourUrl, primary: true })
        } else {
          actions.push({ label: 'Abrir projeto', href: targetedProject.projectUrl, primary: true })
        }
      }

      if (wantsTechnical) {
        responses.push(`Snapshot tecnico:\n- Stack: ${targetedProject.stack.join(', ')}\n- Estrutura: ${targetedProject.backendMode}`)
      }

      suggestions.push(
        `Como usar ${targetedProject.name}?`,
        `Me explique ${targetedProject.name}`,
        `Qual stack de ${targetedProject.name}?`
      )
    }

    if (!responses.length && faq.length) {
      responses.push(faq[0].answer)
      suggestions.push('Me fale dos projetos', 'Quem é Marcelo?', 'Qual projeto tem IA?')
    }

    if (!responses.length) {
      responses.push('Posso te explicar a RDP Studio, falar do Marcelo, resumir projetos ou te guiar para uma ferramenta específica. Se quiser, cita o nome do projeto ou a dúvida principal.')
      suggestions.push(...this.knowledge.assistant.starterQuestions.slice(0, 4))
    }

    context.lastProjectSlug = targetedProject?.slug || context.lastProjectSlug || null

    return {
      text: humanizePtBr(compact(dedupeParagraphs(responses).join('\n\n'))),
      suggestions: Array.from(new Set(suggestions)).slice(0, 5),
      actions: actions.slice(0, 2),
      project: targetedProject || null,
      context,
    }
  }
}

class RodAssistant {
  constructor({ knowledgePath = DEFAULT_KNOWLEDGE_PATH, currentProjectSlug = null, subtlePrompt = false } = {}) {
    this.knowledgePath = knowledgePath
    this.engine = null
    this.elements = {}
    this.currentProjectSlug = currentProjectSlug
    this.subtlePrompt = subtlePrompt
    this.nudgeTimeout = null
    this.context = {
      lastProjectSlug: currentProjectSlug,
      lastRecommendationSlugs: []
    }
  }

  async init() {
    const response = await fetch(this.knowledgePath)
    const knowledge = await response.json()
    this.engine = new RodKnowledgeEngine(knowledge)
    this.render(knowledge)
    this.bindEvents()
    this.addBotMessage(pickOne(knowledge.assistant.welcome), knowledge.assistant.starterQuestions)
  }

  render(knowledge) {
    const shell = createElement('div', 'rod-shell')
    const panel = createElement('section', 'rod-panel')
    const nudge = createElement('div', 'rod-nudge')
    const toggle = createElement('button', 'rod-toggle')
    toggle.type = 'button'
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-controls', 'rod-panel')
    toggle.setAttribute('aria-label', `Abrir ${knowledge.assistant.name}`)
    toggle.innerHTML = `
      <canvas class="rod-neural-canvas" width="112" height="112" aria-hidden="true"></canvas>
      <span class="rod-toggle-badge" aria-hidden="true"><img class="rod-brand-logo" src="../assets/images/branding/logo.png" alt=""></span>
      <span class="sr-only">${knowledge.assistant.name} — mapa do portfólio</span>
    `

    panel.id = 'rod-panel'
    panel.setAttribute('aria-label', `${knowledge.assistant.name} — guia da RDP Studio`)
    panel.innerHTML = `
      <header class="rod-header">
        <div class="rod-header-title">
          <div class="rod-avatar" aria-hidden="true"><img class="rod-brand-logo" src="../assets/images/branding/logo.png" alt=""></div>
          <div class="rod-title-copy">
            <h3>${knowledge.assistant.name}</h3>
            <p>Guia da RDP Studio</p>
          </div>
        </div>
        <div class="rod-header-actions">
          <button type="button" class="rod-icon-btn" data-rod-clear title="Reiniciar conversa" aria-label="Reiniciar conversa">↻</button>
          <button type="button" class="rod-icon-btn" data-rod-close title="Fechar" aria-label="Fechar">×</button>
        </div>
      </header>
      <div class="rod-body">
        <nav class="rod-context-map" aria-label="Áreas que o ROD pode relacionar">
          <button type="button" data-rod-context="Compare os sete projetos e seus formatos">Projetos</button>
          <button type="button" data-rod-context="Conte a trajetória profissional de Marcelo">Marcelo</button>
          <button type="button" data-rod-context="Relacione as tecnologias aos problemas resolvidos">Tecnologias</button>
          <button type="button" data-rod-context="Explique a RDP Studio e a marca">RDP Studio</button>
        </nav>
        <div class="rod-status"><span class="rod-status-dot"></span> Mapa local dos projetos e da trajetória de Marcelo.</div>
        <div class="rod-messages custom-scrollbar" data-rod-messages aria-live="polite" aria-relevant="additions"></div>
        <div class="rod-actions" data-rod-actions></div>
        <div class="rod-suggestions" data-rod-suggestions></div>
        <div class="rod-input-row">
          <textarea class="rod-input custom-scrollbar" rows="1" aria-label="Pergunta para o ROD" placeholder="Pergunte sobre um projeto, tecnologia ou como usar uma ferramenta" data-rod-input></textarea>
          <button type="button" class="rod-send" data-rod-send aria-label="Enviar pergunta">↑</button>
        </div>
        <div class="rod-footer-note">O ROD consulta conteúdo deste portfólio no navegador. Ele não envia a conversa para um servidor.</div>
      </div>
    `

    nudge.innerHTML = `
      <div>Se você quiser, eu posso te explicar esta página e te guiar pelos pontos principais.</div>
      <button type="button">Quero ajuda</button>
    `

    nudge.querySelector('button').addEventListener('click', () => {
      nudge.classList.remove('is-visible')
      panel.classList.add('is-open')
      this.handlePrompt(`Me explique ${this.currentProjectSlug || 'este projeto'} e me guie`)
    })

    shell.appendChild(nudge)
    shell.appendChild(panel)
    shell.appendChild(toggle)
    document.body.appendChild(shell)

    this.elements = {
      shell,
      nudge,
      panel,
      toggle,
      messages: panel.querySelector('[data-rod-messages]'),
      actions: panel.querySelector('[data-rod-actions]'),
      suggestions: panel.querySelector('[data-rod-suggestions]'),
      input: panel.querySelector('[data-rod-input]'),
      send: panel.querySelector('[data-rod-send]'),
      close: panel.querySelector('[data-rod-close]'),
      clear: panel.querySelector('[data-rod-clear]'),
      contexts: [...panel.querySelectorAll('[data-rod-context]')],
    }
  }

  bindEvents() {
    const { toggle, panel, input, send, close, clear, contexts } = this.elements

    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open')
      toggle.setAttribute('aria-expanded', String(open))
      toggle.setAttribute('aria-label', `${open ? 'Fechar' : 'Abrir'} ${this.engine.knowledge.assistant.name}`)
      if (open) window.setTimeout(() => input.focus(), 60)
    })
    toggle.addEventListener('click', () => this.elements.nudge.classList.remove('is-visible'))
    close.addEventListener('click', () => {
      panel.classList.remove('is-open')
      toggle.setAttribute('aria-expanded', 'false')
      toggle.focus()
    })
    clear.addEventListener('click', () => {
      this.elements.messages.innerHTML = ''
      this.elements.actions.innerHTML = ''
      this.elements.suggestions.innerHTML = ''
      this.addBotMessage(humanizePtBr(pickOne(this.engine.knowledge.assistant.welcome)), this.engine.knowledge.assistant.starterQuestions)
    })

    send.addEventListener('click', () => this.handleSubmit())
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.handleSubmit()
      }
    })
    contexts.forEach(button => button.addEventListener('click', () => this.handlePrompt(button.dataset.rodContext)))
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) {
        panel.classList.remove('is-open')
        toggle.setAttribute('aria-expanded', 'false')
        toggle.focus()
      }
    })
  }

  scheduleNudge() {
    if (!this.subtlePrompt || !this.currentProjectSlug) return
    if (this.nudgeTimeout) clearTimeout(this.nudgeTimeout)
    this.nudgeTimeout = window.setTimeout(() => {
      if (!this.elements.panel.classList.contains('is-open')) {
        this.elements.nudge.classList.add('is-visible')
      }
    }, 3600)
  }

  addMessage(text, role = 'bot') {
    const bubble = createElement('div', `rod-bubble ${role}`)
    bubble.textContent = text
    this.elements.messages.appendChild(bubble)
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight
    return bubble
  }

  async addBotMessage(text, suggestions = [], actions = []) {
    const typing = createElement('div', 'rod-bubble bot typing', '<span class="rod-typing-dot"></span><span class="rod-typing-dot"></span><span class="rod-typing-dot"></span>')
    this.elements.messages.appendChild(typing)
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight

    await new Promise(resolve => setTimeout(resolve, 180))

    typing.remove()
    this.addMessage(text, 'bot')

    this.renderActions(actions)
    this.renderSuggestions(suggestions)
  }

  renderActions(actions) {
    this.elements.actions.innerHTML = ''
    actions.forEach(action => {
      const link = createElement('a', `rod-action ${action.primary ? '' : 'secondary'}`, action.label)
      link.href = action.href
      link.target = '_self'
      this.elements.actions.appendChild(link)
    })
  }

  renderSuggestions(suggestions) {
    this.elements.suggestions.innerHTML = ''
    suggestions.forEach(suggestion => {
      const button = createElement('button', 'rod-suggestion', suggestion)
      button.type = 'button'
      button.addEventListener('click', () => {
        this.elements.input.value = suggestion
        this.handleSubmit()
      })
      this.elements.suggestions.appendChild(button)
    })
  }

  async handleSubmit() {
    const question = this.elements.input.value.trim()
    if (!question) return

    this.addMessage(question, 'user')
    const answer = this.engine.answer(question, { ...this.context })
    this.context = answer.context || this.context
    this.elements.input.value = ''
    await this.addBotMessage(answer.text, answer.suggestions, answer.actions || [])
  }

  async handlePrompt(question) {
    const answer = this.engine.answer(question, { ...this.context })
    this.context = answer.context || this.context
    await this.addBotMessage(answer.text, answer.suggestions, answer.actions || [])
  }
}

class RodLauncher {
  constructor({ knowledgePath = DEFAULT_KNOWLEDGE_PATH, currentProjectSlug = null } = {}) {
    this.knowledgePath = knowledgePath
    this.currentProjectSlug = currentProjectSlug
    this.elements = {}
  }

  async init() {
    const isProject = this.knowledgePath.startsWith('../../')
    const base = isProject ? '../../hub/rod.html' : 'rod.html'
    const href = this.currentProjectSlug ? `${base}?project=${encodeURIComponent(this.currentProjectSlug)}` : base
    const link = createElement('a', 'rod-launcher')
    link.href = href
    link.setAttribute('aria-label', 'Abrir ROD, guia da RDP Studio')
    link.innerHTML = `
      <span class="rod-launcher-network" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i><i></i>
      </span>
      <span class="rod-launcher-core" aria-hidden="true">
        <img class="rod-brand-logo" src="${isProject ? '../../' : '../'}assets/images/branding/logo.png" alt="">
      </span>
      <span class="sr-only">Abrir ROD</span>
    `
    document.body.appendChild(link)
    this.elements = { link }
  }

  scheduleNudge() {}
}

window.RodKnowledgeEngine = RodKnowledgeEngine
window.initROD = async function initROD(options = {}) {
  const assistant = options.mode === 'panel' ? new RodAssistant(options) : new RodLauncher(options)
  await assistant.init()
  assistant.scheduleNudge()
  return assistant
}
