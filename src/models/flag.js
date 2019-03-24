import { Model } from './model'

export class Flag extends Model {
  constructor(game, options) {
    const { world } = game
    super(game, options)
    this.world = world
    this.width = world.unitLength * 0.25
  }

  draw(scrollX) {
    if (this.inViewport(scrollX)) {
      this.context.fillStyle = 'white'
      this.context.fillRect(scrollX + this.x + (this.world.unitLength * 0.375), this.y, this.width, this.height)
    }
  }
}