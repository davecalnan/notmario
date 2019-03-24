import { Model } from './model'

export class Door extends Model {
  constructor(game, options) {
    super(game, options)
  }

  draw(scrollX) {
    if (this.inViewport(scrollX)) {
      this.context.fillStyle = 'black'
      this.context.fillRect(scrollX + this.x, this.y, this.width, this.height)
    }
  }
}