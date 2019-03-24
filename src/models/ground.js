import { Model } from './model'
import spriteImage from '../img/ground.png'

export class Ground extends Model {
  constructor(game, options) {
    super(game, options)
    const sprite = new Image()
    sprite.src = spriteImage
    this.sprite = sprite
  }
}
