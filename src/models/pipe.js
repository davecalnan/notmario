import { Model } from './model'

export class Pipe extends Model {
  constructor(game, options) {
    super(game, options)
  }

  draw(scrollX) {
    if (this.inViewport(scrollX)) {
      this.context.fillStyle = 'green'
      this.context.fillRect(scrollX + this.x, this.y, this.width, this.height)
    }
  }
}