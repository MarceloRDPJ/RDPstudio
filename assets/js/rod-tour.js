function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getElement(selector) {
  return typeof selector === 'string' ? document.querySelector(selector) : selector
}

class RodTour {
  constructor(steps) {
    this.steps = steps
    this.index = 0
    this.currentTarget = null
    this.shell = null
    this.copy = null
  }

  async start() {
    this.render()
    await this.showStep(0)
  }

  render() {
    this.shell = document.createElement('div')
    this.shell.className = 'rod-tour-shell'
    this.shell.innerHTML = `
      <div class="rod-tour-head">
        <div class="rod-tour-title">
          <div class="rod-tour-title-badge"><i class="fa-solid fa-robot"></i></div>
          <div class="rod-tour-title-copy">
            <h4>ROD está te guiando</h4>
            <p>Assistente ativo da ferramenta</p>
          </div>
        </div>
        <button class="rod-tour-close" type="button"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="rod-tour-body">
        <div class="rod-tour-step"></div>
        <div class="rod-tour-copy"></div>
        <div class="rod-tour-actions">
          <button type="button" class="rod-tour-secondary" data-rod-tour-skip>Encerrar</button>
          <button type="button" class="rod-tour-next" data-rod-tour-next>Próximo</button>
        </div>
      </div>
    `

    document.body.appendChild(this.shell)
    this.copy = this.shell.querySelector('.rod-tour-copy')
    this.stepLabel = this.shell.querySelector('.rod-tour-step')
    this.nextButton = this.shell.querySelector('[data-rod-tour-next]')

    this.shell.querySelector('.rod-tour-close').addEventListener('click', () => this.finish())
    this.shell.querySelector('[data-rod-tour-skip]').addEventListener('click', () => this.finish())
    this.nextButton.addEventListener('click', () => this.next())
  }

  async typeText(text) {
    this.copy.textContent = ''
    for (const char of text) {
      this.copy.textContent += char
      await wait(8)
    }
  }

  clearHighlight() {
    if (this.currentTarget) {
      this.currentTarget.classList.remove('rod-tour-highlight')
      this.currentTarget = null
    }
  }

  async showStep(index) {
    this.clearHighlight()
    this.index = index
    const step = this.steps[index]
    if (!step) return this.finish()

    if (typeof step.before === 'function') {
      await step.before()
    }

    const target = getElement(step.selector)
    if (target) {
      this.currentTarget = target
      target.classList.add('rod-tour-highlight')
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      await wait(350)
    }

    this.stepLabel.textContent = `Passo ${index + 1} de ${this.steps.length}`
    await this.typeText(step.text)
    this.nextButton.textContent = index === this.steps.length - 1 ? 'Concluir' : 'Próximo'
  }

  async next() {
    await this.showStep(this.index + 1)
  }

  finish() {
    this.clearHighlight()
    if (this.shell) this.shell.remove()
    const url = new URL(window.location.href)
    url.searchParams.delete('rodTour')
    window.history.replaceState({}, '', url.toString())
  }
}

window.initRODTour = function initRODTour() {
  const params = new URLSearchParams(window.location.search)
  const tourId = params.get('rodTour')
  if (!tourId || !window.ROD_TOUR_DEFINITIONS) return
  const steps = window.ROD_TOUR_DEFINITIONS[tourId]
  if (!steps || !steps.length) return
  const tour = new RodTour(steps)
  window.setTimeout(() => tour.start(), 500)
}
