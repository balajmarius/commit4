import { GAME, BUGS } from '../shared/config'
import { SCORE_DIFFICULTY_MAP } from './levels'

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

    if (SCORE_DIFFICULTY_MAP[this.text]) {

      BUGS.timeout = SCORE_DIFFICULTY_MAP[this.text]

    }

  }

}

export default Score
