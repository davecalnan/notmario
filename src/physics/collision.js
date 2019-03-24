import { SIDES, AXES } from '../geometry'
import { stopIfLowVelocity } from './movement'

export const colliding = (a, b) => {
  const collidingX = a.right >= b.left && a.left <= b.right
  const collidingY = a.bottom >= b.top && a.top <= b.bottom
  return collidingX && collidingY
}

export const detectCollisions = (dynamicEntities, staticEntities) =>
  dynamicEntities.map(dynamicEntity =>
    staticEntities.map(staticEntity => {
      dynamicEntity.touchingTheGround = false
      if (colliding(dynamicEntity, staticEntity)) {
        return {
          a: dynamicEntity,
          b: staticEntity
        }
      }
    }).filter(collision => collision !== undefined)
  ).flat()

export const resolveCollisions = collisions => {
  if (!collisions.length) return
  return collisions.map(collision => {
    const side = calculateCollisionSide(collision)
    const { a, b } = collision
    const RESTITUTION = 0

    if (side === SIDES.TOP) {
      a.y = b.bottom
      a.vy = -a.vy * RESTITUTION
      stopIfLowVelocity(AXES.VERTICAL)
    }
    if (side === SIDES.RIGHT) {
      a.x = b.left - a.width
      a.vx = -a.vx * RESTITUTION
      stopIfLowVelocity(AXES.HORIZONTAL)
    }
    if (side === SIDES.BOTTOM) {
      a.y = b.top - a.height
      a.vy = -a.vy * RESTITUTION
      stopIfLowVelocity(AXES.VERTICAL)
      a.touchingTheGround = true
    }
    if (side === SIDES.LEFT) {
      a.x = b.right
      a.vx = -a.vx * RESTITUTION
      stopIfLowVelocity(AXES.HORIZONTAL)
    }
  })
}

const calculateCollisionSide = collision => {
  const { a, b } = collision
  const dx = (b.midX - a.midX) / b.halfWidth
  const dy = (b.midY - a.midY) / b.halfWidth

  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  // If the object is approaching from the sides
  if (absDx > absDy) {
    // If the player is approaching from the left
    if (dx > 0) {
      return SIDES.RIGHT
      // If the player is approaching from the right
    } else {
      return SIDES.LEFT
    }
    // If this collision is coming from the top or bottom more
  } else {
    // If the player is approaching from above
    if (dy > 0) {
      return SIDES.BOTTOM
      // If the player is approaching from below
    } else {
      return SIDES.TOP
    }
  }
}