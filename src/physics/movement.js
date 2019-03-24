import { STICKY_THRESHOLD } from './constants'
import { AXES } from '../geometry'

const move = entity => {
  entity.x += entity.vx
  entity.y += entity.vy
}

const accelerate = entity => {
  entity.vx += entity.ax
  entity.vy += entity.ay
}

export const moveEntities = entities => {
  entities.forEach(entity => {
    accelerate(entity)
    move(entity)
  })
}

export const stopIfLowVelocity = (entity, axis) => {
  let v
  if (axis === AXES.VERTICAL) { v = entity.vy }
  if (axis === AXES.HORIZONTAL) { v = entity.vx }
  // if (v === undefined) {
  //   throw new Error('Invalid axis provided.')
  // }
  if (Math.abs(v) < STICKY_THRESHOLD) {
    v = 0
  }
}

