import './rod-assistant.js'

window.addEventListener('DOMContentLoaded', async () => {
  if (!window.initROD || document.querySelector('.rod-shell')) return

  try {
    await window.initROD({
      knowledgePath: '../assets/data/rod-knowledge.json',
      subtlePrompt: false
    })
  } catch (error) {
    console.error('Não foi possível iniciar o ROD.', error)
  }
})
