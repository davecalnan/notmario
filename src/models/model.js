import { StaticEntity } from '../physics'
import spriteImage from '../img/ground.png'

export class Model extends StaticEntity {
  constructor(game, options) {
    const { context, canvas } = game
    super(options)
    this.canvas = canvas
    this.context = context
    const sprite = new Image()
    sprite.src = spriteImage
    this.sprite = sprite
  }

  inViewport(scrollX) {
    return this.x >= scrollX && this.x < this.canvas.width - scrollX
  }

  draw(scrollX) {
    if (this.inViewport(scrollX)) {
      this.context.drawImage(this.sprite, scrollX + this.x, this.y, this.width, this.height)
    }
  }
}