import { GRAVITY } from './constants'

class Entity {
  constructor(options) {
    const { x, y, width, height } = options
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  get top() {
    return this.y
  }

  get right() {
    return this.x + this.width
  }

  get bottom() {
    return this.y + this.height
  }

  get left() {
    return this.x
  }

  get midX() {
    return (this.left + this.right) / 2
  }

  get midY() {
    return (this.top + this.bottom) / 2
  }

  get halfWidth() {
    return this.width / 2
  }

  get halfHeight() {
    return this.height / 2
  }
}

export class StaticEntity extends Entity {
  constructor(options) {
    super(options)
  }
}

export class DynamicEntity extends Entity {
  constructor(options) {
    super(options)
    const { vx, vy, ax, ay } = options
    this.vx = vx
    this.vy = vy
    this.ax = ax
    this.ay = ay || GRAVITY
  }
}
