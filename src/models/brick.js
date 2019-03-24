import { Model } from './model'
import spriteImage from '../img/brick.png'

export class Brick extends Model {
  constructor(game, options) {
    super(game, options)
    const sprite = new Image()
    sprite.src = spriteImage
    this.sprite = sprite
  }
}
