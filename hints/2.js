
window.onload = function () {

  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  var img = new Image()
  img.src = './images/bob.jpg'
  img.onload = () => ctx.drawImage(img, 0, 0, 250, 200)

}
