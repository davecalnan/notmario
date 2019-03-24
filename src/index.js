import { Game } from './game'

const main = () => {
  window.game = new Game(document.querySelector('#game'))
  game.init()
}

document.addEventListener('DOMContentLoaded', main)