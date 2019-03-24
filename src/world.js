import { firstWorld } from './worlds'

export class World {
  constructor(game) {
    const { canvas, context } = game
    this.game = game
    this.canvas = canvas
    this.context = context
    const unitLength = canvas.height / 16
    this.unitLength = unitLength
    this.groundHeight = canvas.height - (unitLength * 2)
    this.blocks = []
  }

  createWorld(world) {
    world.squares.map((column, columnIndex) =>
      column.map((block, rowIndex) => {
        if (!block) return
        this.blocks.push(new block(this.game, {
          x: columnIndex * this.unitLength,
          y: rowIndex * this.unitLength,
          width: this.unitLength,
          height: this.unitLength
        }))
      })
    )
  }

  init() {
    this.createWorld(firstWorld)
  }

  draw(scrollX) {
    this.context.fillStyle = firstWorld.background || '#6496f5'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.restore()
    this.blocks.forEach(block => block.draw(scrollX))
  }
}
