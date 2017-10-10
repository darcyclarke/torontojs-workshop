
window.onload = function () {

  // variables & constants
  var then = Date.now()
  var worlds = []
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')
  const fps = (1000 / 60)
  const gui = new dat.GUI()
  const stats = new Stats()
  stats.showPanel(0)
  document.body.appendChild(stats.dom)

  const settings = {
    amount: 500,
    gravity: {
      x: 0,
      y: 0.5,
      z: 0
    },
    background: '#1a1a1a',
    color: 'rgba(255, 255, 255, 1)',
    radius: 2.5,
    camera: 200,
    speed: 5,
    angle: 1
  }

  function setDimensions () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.depth = 300
  }

  function generateWorlds () {
    worlds = []
    for(let i = 0; i < settings.amount; i++) {
      worlds.push(new world())
    }
  }

  // our world class
  class world {

    constructor () {
      this.props = {
        matrix: 0,
        pos: {
          x: (Math.random() * (canvas.width * 2)),
          y: (Math.random() * (canvas.height * 2)),
          z: (Math.random() * (canvas.depth * 2))
        },
        proj: {
          x: 0,
          y: 0
        },
        speed: {
          x: 0,
          y: 0,
          z: 0
        }
      }
    }

    // move
    move () {
      // update speed
      this.props.speed.x += settings.gravity.x * 0.1 * (Math.random() * 2 - 1)
      this.props.speed.y += settings.gravity.y * 0.1 * (Math.random() * 2 - 1)
      this.props.speed.z += settings.gravity.z * 0.1 * (Math.random() * 2 - 1)

      // update position
      this.props.pos.x += this.props.speed.x
      this.props.pos.y += this.props.speed.y
      this.props.pos.z += this.props.speed.z

      var sin = Math.sin(settings.angle)
      var cos = Math.cos(settings.angle)

      var rotatedX = cos * this.props.pos.x + sin * (this.props.pos.z - settings.camera)
      var rotatedZ = -sin * this.props.pos.x + cos * (this.props.pos.z - settings.camera) + settings.camera

      this.props.matrix = canvas.depth / (canvas.depth - rotatedZ)
      this.props.proj.x = rotatedX * this.props.matrix + (canvas.width / 2)
      this.props.proj.y = this.props.pos.y * this.props.matrix + (canvas.height / 2)

    }

    draw () {
      let radius = settings.radius * this.props.matrix
      if (radius < 0) {
        return
      }
      ctx.arc(this.props.proj.x, this.props.proj.y, radius, 0, Math.PI*2)
      ctx.fillStyle = settings.color
      ctx.fill()
    }

    paint () {
      ctx.beginPath()
      this.move()
      this.draw()
      ctx.closePath()
    }
  }

  // paint
  function paint() {
      requestAnimationFrame(paint)
      stats.begin()
      let now = Date.now()
      let elapsed = now - then
      if (elapsed > fps) {
        then = now - (elapsed % fps)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvas.style.backgroundColor = settings.background
        worlds.forEach((world) => world.paint())
      }
      stats.end()
  }

  // Init
  setDimensions()
  generateWorlds()
  paint()

  // Events
  window.addEventListener('resize', setDimensions)

  gui.addColor(settings, 'color').listen()
  gui.addColor(settings, 'background').listen()
  gui.add(settings, 'amount').min(1).max(1000).step(10).listen().onChange(generateWorlds)
  gui.add(settings, 'radius').min(2).max(100).step(1).listen()
  gui.add(settings, 'camera').min(10).max(1000).step(10).listen()
  gui.add(settings, 'angle').min(0).max(10).step(0.05).listen()
  gui.add(settings, 'speed').min(0).max(50).step(0.5).listen()
  gui.remember(settings)

  var sizeOptions = gui.addFolder('Canvas')
  sizeOptions.add(canvas, 'width').min(1).max(canvas.width).step(1).listen()
  sizeOptions.add(canvas, 'height').min(1).max(canvas.height).step(1).listen()
  sizeOptions.add(canvas, 'depth').min(1).max(canvas.depth).step(1).listen()
  gui.remember(canvas)

  var gravityOptions = gui.addFolder('Gravity')
  gravityOptions.add(settings.gravity, 'x').min(-10).max(25).step(0.1).listen()
  gravityOptions.add(settings.gravity, 'y').min(-10).max(25).step(0.1).listen()
  gravityOptions.add(settings.gravity, 'z').min(-10).max(25).step(0.1).listen()
  gui.remember(settings.gravity)

}
