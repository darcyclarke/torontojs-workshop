
window.onload = function () {

  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx.fillStyle = 'red'
  ctx.fillRect(50, 50, 100, 100)

}
