import { World } from './world'
import { Player } from './player'
import { moveEntities, detectCollisions, resolveCollisions } from './physics'

export class Game {
  constructor(canvas) {
    this.options = {
      debug: false
    }
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.entities = []
    this.scrollX = 0
    this.debug = {
      draw: scrollX => {
        this.context.restore()
        const stats = [
          `Player`,
          `x: ${ Math.floor(this.player.x) }`,
          `y: ${ Math.floor(this.player.y) }`,
          `y: ${ Math.floor(this.player.y) }`,
          `vx: ${ Math.floor(this.player.vx) }`,
          `vy: ${ Math.floor(this.player.vy) }`,
          `ax ${ this.player.ax }`,
          `ay ${ this.player.ay }`,
          `Game`,
          `scrollX: ${ Math.floor(scrollX) }`,
          `inViewport: ${ this.canvas.width - scrollX }`
        ]
        stats.forEach((string, index) => this.context.fillText(string, 10, (index + 1) * 12))
      }
    }
  }

  init() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.world = new World(this)
    this.world.init()

    this.player = new Player(this, {
      x: this.world.unitLength * 0.1,
      y: this.world.groundHeight - this.world.unitLength * 1,
      ay: 0
    })
    this.world.player = this.player

    this.entities.push(this.player)
    this.world.blocks.forEach(block => this.entities.push(block))
    this.addEventListeners()
    this.animate()
  }

  addEventListeners() {
    window.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') {
        this.player.startMoving('right')
      }
      if (event.key === 'ArrowLeft') {
        this.player.startMoving('left')
      }
      if (event.code === 'Space') {
        this.player.jump()
      }
      if (this.options.debug) {
        if (event.key === 'c') {
          console.log(detectCollisions([this.player], this.world.blocks))
        }
        if (event.key === 'p') {
          console.log(this.player)
        }
      }
    })

    window.addEventListener('keyup', event => {
      if (event.key === 'ArrowRight') {
        this.player.stopMoving()
      }
      if (event.key === 'ArrowLeft') {
        this.player.stopMoving()
      }
    })

    window.addEventListener('touchstart', event => {
      this.touchTimer = event.timeStamp
      const xPosition = event.touches[0].clientX / this.canvas.width
      if (xPosition > 0.8) {
        this.player.startMoving('right')
      }
      if (xPosition < 0.2) {
        this.player.startMoving('left')
      }
    })

    window.addEventListener('touchend', event => {
      const durationOfTouch = event.timeStamp - this.touchTimer
      if (durationOfTouch < 100) {
        this.player.jump()
      }
      this.player.stopMoving()
    })
  }

  handlePhysics() {
    moveEntities([this.player])
    const collisions = detectCollisions([this.player], this.world.blocks)
    resolveCollisions(collisions)
  }

  draw(scrollX) {
    this.context.save()
    this.context.beginPath()
    this.world.draw(scrollX)
    this.player.draw(scrollX)
    if (this.options.debug) this.debug.draw(scrollX)
  }

  resetCanvas() {
    this.context.fillStyle = 'white'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  scrollCanvas() {
    if (this.player.x > (this.canvas.width * 0.8) - this.scrollX) {
      this.scrollX -= 10
    }
    if (this.player.x < (this.canvas.width * 0.2) - this.scrollX) {
      if (this.scrollX < -10) {
        this.scrollX += 10
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate())
    this.update()
  }

  update() {
    this.handlePhysics()
    this.resetCanvas()
    this.scrollCanvas(this.player.vx)
    this.draw(this.scrollX)
  }
}
