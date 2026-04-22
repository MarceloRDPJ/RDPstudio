import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.3.0/dist/fuse.min.mjs'

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

class RodKnowledgeEngine {
  constructor(knowledge) {
    this.knowledge = knowledge
    this.projectFuse = new Fuse(
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

    this.faqFuse = new Fuse(knowledge.faq, {
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
    return this.knowledge.intents.find(intent =>
      intent.keywords.some(keyword => normalized.includes(normalizeText(keyword)))
    )
  }

  findProjects(query) {
    return this.projectFuse.search(query).slice(0, 3).map(result => result.item)
  }

  findFaq(query) {
    return this.faqFuse.search(query).slice(0, 2).map(result => result.item)
  }

  answer(query, context = {}) {
    const normalized = normalizeText(query)
    const projects = this.findProjects(query)
    const faq = this.findFaq(query)
    const intent = this.findIntent(query)
    const responses = []
    const suggestions = []

    if (!normalized) {
      return {
        text: pickOne(this.knowledge.assistant.welcome),
        suggestions: this.knowledge.assistant.starterQuestions,
      }
    }

    if (intent?.id === 'greeting') {
      responses.push(intent.response)
    }

    if (intent?.id === 'about-studio') {
      responses.push(intent.response)
      responses.push(`Em uma frase: ${this.knowledge.studio.summary}`)
      suggestions.push('Quais projetos mostram mais automação?', 'Qual projeto tem IA?', 'Me fale sobre Marcelo')
    }

    if (intent?.id === 'about-profile') {
      responses.push(intent.response)
      responses.push(this.knowledge.profile.summary)
      suggestions.push('Quais areas ele domina?', 'Me fale da RDP Studio', 'Como entrar em contato?')
    }

    if (intent?.id === 'contact') {
      responses.push(intent.response)
    }

    if (intent?.id === 'project-recommendation') {
      responses.push(intent.response)
    }

    if (/sobre mim|sobre voce|curriculo|currículo|formacao|formação|certificacao|certificação/.test(normalized)) {
      responses.push(`${this.knowledge.profile.summary}\n\nFormacao em destaque:\n- ${this.knowledge.profile.education.join('\n- ')}`)
      suggestions.push('Quais projetos mostram segurança?', 'Me fale da RDP Studio')
    }

    if (/rdp studio|empresa|estudio|studio|consultoria/.test(normalized)) {
      responses.push(`${this.knowledge.studio.summary}\n\nPilares da RDP Studio:\n- ${this.knowledge.studio.pillars.join('\n- ')}`)
    }

    if (/hospedagem|github pages|cloudflare|statico|estatico|deploy/.test(normalized)) {
      const hostingFaq = this.knowledge.faq.find(item => item.id === 'hosting')
      if (hostingFaq) responses.push(hostingFaq.answer)
    }

    if (/backend|api|servidor|fullstack|full stack/.test(normalized)) {
      const backendFaq = this.knowledge.faq.find(item => item.id === 'backend')
      if (backendFaq) responses.push(backendFaq.answer)
    }

    const targetedProject = projects[0]
    if (targetedProject) {
      const wantsUsage = /como usa|como usar|usar|funciona|abrir|mexer|operar/.test(normalized)
      const wantsTechnical = /stack|tecnologia|linguagem|backend|frontend|automacao|automação/.test(normalized)
      const wantsSummary = /explica|resuma|resume|fale sobre|me fala|me explique|o que e|oque e/.test(normalized) || isQuestion(normalized)

      if (wantsSummary || !responses.length) {
        responses.push(`Sobre ${targetedProject.name}: ${targetedProject.summary}\n\nProblema: ${targetedProject.problem}\nSolucao: ${targetedProject.solution}`)
      }

      if (wantsUsage) {
        responses.push(`Como usar ${targetedProject.name}:\n- ${targetedProject.howToUse.join('\n- ')}`)
      }

      if (wantsTechnical) {
        responses.push(`Snapshot tecnico de ${targetedProject.name}:\n- Stack: ${targetedProject.stack.join(', ')}\n- Estrutura: ${targetedProject.backendMode}\n- Abrir: ${targetedProject.projectUrl}`)
      }

      suggestions.push(
        `Como usar ${targetedProject.name}?`,
        `Me explique ${targetedProject.name}`,
        `Qual stack de ${targetedProject.name}?`
      )
    }

    if (!responses.length && faq.length) {
      responses.push(faq[0].answer)
      suggestions.push('Me fale dos projetos', 'Quem e Marcelo?', 'Qual projeto tem IA?')
    }

    if (!responses.length) {
      responses.push(
        `Entendi a direcao da sua pergunta, mas quero te responder de forma util. Posso te explicar a RDP Studio, falar do Marcelo, resumir os projetos ou mostrar como usar cada ferramenta. Se quiser, tente citar o nome do projeto ou o assunto principal.`
      )
      suggestions.push(...this.knowledge.assistant.starterQuestions.slice(0, 4))
    }

    const dedupedSuggestions = Array.from(new Set(suggestions)).slice(0, 5)
    return {
      text: responses.join('\n\n'),
      suggestions: dedupedSuggestions.length ? dedupedSuggestions : this.knowledge.assistant.starterQuestions.slice(0, 4),
      project: targetedProject || null,
    }
  }
}

class RodAssistant {
  constructor({ knowledgePath = DEFAULT_KNOWLEDGE_PATH } = {}) {
    this.knowledgePath = knowledgePath
    this.engine = null
    this.elements = {}
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
    const toggle = createElement('button', 'rod-toggle')
    toggle.type = 'button'
    toggle.innerHTML = `
      <span class="rod-toggle-badge"><i class="fa-solid fa-microchip"></i></span>
      <span class="rod-toggle-text">
        <span class="rod-toggle-title">${knowledge.assistant.name}</span>
        <span class="rod-toggle-subtitle">Assistente do portfolio</span>
      </span>
      <i class="fa-solid fa-angle-up"></i>
    `

    panel.innerHTML = `
      <header class="rod-header">
        <div class="rod-header-title">
          <div class="rod-avatar"><i class="fa-solid fa-robot"></i></div>
          <div class="rod-title-copy">
            <h3>${knowledge.assistant.name}</h3>
            <p>${knowledge.assistant.title}</p>
          </div>
        </div>
        <div class="rod-header-actions">
          <button type="button" class="rod-icon-btn" data-rod-clear title="Reiniciar conversa"><i class="fa-solid fa-rotate-left"></i></button>
          <button type="button" class="rod-icon-btn" data-rod-close title="Fechar"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </header>
      <div class="rod-body">
        <div class="rod-status"><span class="rod-status-dot"></span> Linguagem natural local com busca fuzzy e base de conhecimento do portfolio.</div>
        <div class="rod-messages custom-scrollbar" data-rod-messages></div>
        <div class="rod-suggestions" data-rod-suggestions></div>
        <div class="rod-input-row">
          <textarea class="rod-input custom-scrollbar" rows="1" placeholder="Pergunte sobre voce, RDP Studio, ferramentas, stack ou como usar um projeto..." data-rod-input></textarea>
          <button type="button" class="rod-send" data-rod-send><i class="fa-solid fa-arrow-up"></i></button>
        </div>
        <div class="rod-footer-note">Dica: o ROD entende erros comuns de digitacao, nomes de projetos, perguntas abertas e duvidas de uso.</div>
      </div>
    `

    shell.appendChild(panel)
    shell.appendChild(toggle)
    document.body.appendChild(shell)

    this.elements = {
      shell,
      panel,
      toggle,
      messages: panel.querySelector('[data-rod-messages]'),
      suggestions: panel.querySelector('[data-rod-suggestions]'),
      input: panel.querySelector('[data-rod-input]'),
      send: panel.querySelector('[data-rod-send]'),
      close: panel.querySelector('[data-rod-close]'),
      clear: panel.querySelector('[data-rod-clear]'),
    }
  }

  bindEvents() {
    const { toggle, panel, input, send, close, clear } = this.elements

    toggle.addEventListener('click', () => panel.classList.toggle('is-open'))
    close.addEventListener('click', () => panel.classList.remove('is-open'))
    clear.addEventListener('click', () => {
      this.elements.messages.innerHTML = ''
      this.elements.suggestions.innerHTML = ''
      this.addBotMessage(pickOne(this.engine.knowledge.assistant.welcome), this.engine.knowledge.assistant.starterQuestions)
    })

    send.addEventListener('click', () => this.handleSubmit())
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.handleSubmit()
      }
    })
  }

  addMessage(text, role = 'bot') {
    const bubble = createElement('div', `rod-bubble ${role}`)
    bubble.textContent = text
    this.elements.messages.appendChild(bubble)
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight
  }

  addBotMessage(text, suggestions = []) {
    this.addMessage(text, 'bot')
    this.renderSuggestions(suggestions)
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

  handleSubmit() {
    const question = this.elements.input.value.trim()
    if (!question) return

    this.addMessage(question, 'user')
    const answer = this.engine.answer(question)
    this.elements.input.value = ''
    this.addBotMessage(answer.text, answer.suggestions)
  }
}

window.initROD = async function initROD(options = {}) {
  const assistant = new RodAssistant(options)
  await assistant.init()
  return assistant
}
