import { Model } from './model'
import spriteImage from '../img/random.png'

export class Random extends Model {
  constructor(game, options) {
    super(game, options)
    const sprite = new Image()
    sprite.src = spriteImage
    this.sprite = sprite
  }
}
