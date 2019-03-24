import { DynamicEntity } from './physics'
import stationaryImage from './img/mario-stationary.png'
import jumpingImage from './img/mario-jumping.png'

export class Player extends DynamicEntity {
  constructor(game, options) {
    const { context, world } = game
    const { x, y, width, height, vx, vy, ax, ay } = options
    super({
      x: x || 0,
      y: y || 0,
      width: width || world.unitLength * 0.8,
      height: height || world.unitLength * 1,
      vx: vx || 0,
      vy: vy || 0,
      ax: ax || 0,
      ay: ay
    })
    this.game = game
    this.world = world
    this.context = context
    this.sprites = {}
    this.sprites.stationary = new Image()
    this.sprites.stationary.src = stationaryImage
    this.sprites.jumping = new Image()
    this.sprites.jumping.src = jumpingImage
  }

  draw(scrollX) {
    if (!this.touchingTheGround) {
      return this.context.drawImage(this.sprites.jumping, scrollX + this.x, this.y, this.width, this.height)
    }
    this.context.drawImage(this.sprites.stationary, scrollX + this.x, this.y, this.width, this.height)
    this.context.restore()
  }

  startMoving(direction) {
    const speed = this.world.unitLength / 10
    if (direction === 'left') return (this.vx = speed * -1)
    if (direction === 'right') return (this.vx = speed)
  }

  stopMoving() {
    this.vx = 0
  }

  jump() {
    if (this.touchingTheGround) return (this.vy = -this.world.unitLength / 3)
  }
}
