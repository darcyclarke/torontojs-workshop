
window.onload = function () {

  // variables & constants
  var then = Date.now()
  var worlds = []
  const CANVAS = document.querySelector('canvas')
  const CTX = CANVAS.getContext('2d')
  const FPS = (1000 / 60)
  const GUI = new dat.GUI()
  const stats = new Stats()
  stats.showPanel(0)
  document.body.appendChild(stats.dom)

  const SETTINGS = {
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
    CANVAS.width = window.innerWidth
    CANVAS.height = window.innerHeight
    CANVAS.depth = 300
  }

  function generateWorlds () {
    worlds = []
    for(let i = 0; i < SETTINGS.amount; i++) {
      worlds.push(new world())
    }
  }

  // our world class
  class world {

    constructor () {
      this.props = {
        matrix: 0,
        pos: {
          x: (Math.random() * (CANVAS.width * 2)),
          y: (Math.random() * (CANVAS.height * 2)),
          z: (Math.random() * (CANVAS.depth * 2))
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
      this.props.speed.x += SETTINGS.gravity.x * 0.1 * (Math.random() * 2 - 1)
      this.props.speed.y += SETTINGS.gravity.y * 0.1 * (Math.random() * 2 - 1)
      this.props.speed.z += SETTINGS.gravity.z * 0.1 * (Math.random() * 2 - 1)

      // update position
      this.props.pos.x += this.props.speed.x
      this.props.pos.y += this.props.speed.y
      this.props.pos.z += this.props.speed.z

      var sin = Math.sin(SETTINGS.angle)
      var cos = Math.cos(SETTINGS.angle)

      var rotatedX = cos * this.props.pos.x + sin * (this.props.pos.z - SETTINGS.camera)
      var rotatedZ = -sin * this.props.pos.x + cos * (this.props.pos.z - SETTINGS.camera) + SETTINGS.camera

      this.props.matrix = CANVAS.depth / (CANVAS.depth - rotatedZ)
      this.props.proj.x = rotatedX * this.props.matrix + (CANVAS.width / 2)
      this.props.proj.y = this.props.pos.y * this.props.matrix + (CANVAS.height / 2)

    }

    // draw
    draw () {
      let radius = SETTINGS.radius * this.props.matrix
      if (radius < 0) {
        return
      }
      CTX.arc(this.props.proj.x, this.props.proj.y, radius, 0, Math.PI*2)
      CTX.fillStyle = SETTINGS.color
      CTX.fill()
    }

    // paint
    paint () {
      CTX.beginPath()
      this.move()
      this.draw()
      CTX.closePath()
    }
  }

  // paint
  function paint() {
      requestAnimationFrame(paint)
      stats.begin()
      let now = Date.now()
      let elapsed = now - then
      // check if time has elapsed to paint next frame
      if (elapsed > FPS) {
        // update timer
        then = now - (elapsed % FPS)
        // clean up canvas
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)
        CANVAS.style.backgroundColor = SETTINGS.background
        // paint objects to canvas
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

  GUI.addColor(SETTINGS, 'color').listen()
  GUI.addColor(SETTINGS, 'background').listen()
  GUI.add(SETTINGS, 'amount').min(1).max(1000).step(10).listen().onChange(generateWorlds)
  GUI.add(SETTINGS, 'radius').min(2).max(100).step(1).listen()
  GUI.add(SETTINGS, 'camera').min(10).max(1000).step(10).listen()
  GUI.add(SETTINGS, 'angle').min(0).max(10).step(0.05).listen()
  GUI.add(SETTINGS, 'speed').min(0).max(50).step(0.5).listen()
  GUI.remember(SETTINGS)

  var sizeOptions = GUI.addFolder('Canvas')
  sizeOptions.add(CANVAS, 'width').min(1).max(CANVAS.width).step(1).listen()
  sizeOptions.add(CANVAS, 'height').min(1).max(CANVAS.height).step(1).listen()
  sizeOptions.add(CANVAS, 'depth').min(1).max(CANVAS.depth).step(1).listen()
  GUI.remember(CANVAS)

  var gravityOptions = GUI.addFolder('Gravity')
  gravityOptions.add(SETTINGS.gravity, 'x').min(-10).max(25).step(0.1).listen()
  gravityOptions.add(SETTINGS.gravity, 'y').min(-10).max(25).step(0.1).listen()
  gravityOptions.add(SETTINGS.gravity, 'z').min(-10).max(25).step(0.1).listen()
  GUI.remember(SETTINGS.gravity)

  // create things/objects/bodies
  // const box = new thing()
  // const earth = new world()
  // // Add box folder
  // var boxOptions = GUI.addFolder('Box')
  // boxOptions.add(box.pos, 'x').step(1)
  // boxOptions.add(box.pos, 'y').step(1)
  // boxOptions.add(box.size, 'w').min(1).max(CANVAS.width).step(1)
  // boxOptions.add(box.size, 'h').min(1).max(CANVAS.height).step(1)
  // boxOptions.addColor(box, 'color')
  // Add earth folder
  // var earthOptions = GUI.addFolder('Earth')
  // earthOptions.add(earth.pos, 'x').step(1)
  // earthOptions.add(earth.pos, 'y').step(1)
  // earthOptions.add(earth.size, 'w').min(1).max(CANVAS.width).step(1)
  // earthOptions.add(earth.size, 'h').min(1).max(CANVAS.height).step(1)
  // earthOptions.addColor(earth, 'color')

}
