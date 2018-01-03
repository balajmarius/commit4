import { GAME } from './shared/config'
import * as States from './states'

class Game extends Phaser.Game {
 
  constructor() {
 
    super(GAME.width, GAME.height, Phaser.AUTO, 'game', 'loading')

    this.state.add('loading', States.loading, false)
    this.state.add('play', States.play, false)
  
  }

}

new Game()
