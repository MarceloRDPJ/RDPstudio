export function initRodNeuralVisual() {
  const canvas = document.querySelector('.rod-neural-canvas')
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const context = canvas.getContext('2d')
  const nodes = Array.from({ length: 18 }, (_, index) => {
    const angle = index / 18 * Math.PI * 2
    const radius = 31 + (index % 4) * 4
    return {
      angle,
      radius,
      speed: .0014 + (index % 3) * .00035,
      offset: (index % 2 ? 1 : -1) * .09,
    }
  })

  let frame
  function draw(time = 0) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    const points = nodes.map(node => {
      const angle = node.angle + time * node.speed
      return {
        x: 56 + Math.cos(angle) * node.radius,
        y: 56 + Math.sin(angle + node.offset) * node.radius,
      }
    })
    context.strokeStyle = 'rgba(178,217,139,.25)'
    context.lineWidth = 1
    points.forEach((point, index) => {
      points.slice(index + 1).forEach(other => {
        const distance = Math.hypot(point.x - other.x, point.y - other.y)
        if (distance > 28) return
        context.globalAlpha = 1 - distance / 28
        context.beginPath()
        context.moveTo(point.x, point.y)
        context.lineTo(other.x, other.y)
        context.stroke()
      })
    })
    context.globalAlpha = 1
    points.forEach((point, index) => {
      context.fillStyle = index % 4 ? '#b2d98b' : '#78baa2'
      context.beginPath()
      context.arc(point.x, point.y, index % 4 ? 1.4 : 2.1, 0, Math.PI * 2)
      context.fill()
    })
    frame = requestAnimationFrame(draw)
  }
  frame = requestAnimationFrame(draw)
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frame)
    if (!document.hidden) frame = requestAnimationFrame(draw)
  })
}
