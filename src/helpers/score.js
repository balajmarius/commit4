import { GAME } from '../shared/config'

class Score extends Phaser.BitmapText {

  constructor(game) {

    super(game, GAME.score.x, GAME.score.y, 'digital', 0, 20)

    this.text = 0
    this.anchor.x = 1

    this.add = this.add.bind(this)

    this.game.world.addChild(this)

  }

  add() {

    this.text++

  }

}

export default Score
