import { StaticEntity } from '../physics'

export class Block extends StaticEntity {
  constructor(game, options) {
    const { canvas, context } = game
    super(options)
    this.canvas = canvas
    this.context = context
  }

  draw(scrollX) {
    this.context.strokeRect(scrollX + this.x, this.y, this.width, this.height)
  }
}