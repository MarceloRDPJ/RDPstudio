import './rod-assistant.js'
window.addEventListener('DOMContentLoaded', async () => {
  if (!window.initROD || document.querySelector('.rod-launcher') || document.body.classList.contains('rod-page')) return

  try {
    await window.initROD({
      knowledgePath: '../assets/data/rod-knowledge.json',
      mode: 'panel',
      subtlePrompt: false
    })
  } catch (error) {
    console.error('Não foi possível iniciar o ROD.', error)
  }
})
