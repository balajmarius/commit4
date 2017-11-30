import * as Actors from '../actors'
import * as Helpers from '../helpers'

class Play extends Phaser.State {
  create() {           
    this.game.add.sprite(0, 0, 'background')

    this.score = new Helpers.Score(this.game)
    this.player = new Actors.Player(this.game, 'octocat')    
    this.bugs = new Actors.Bugs(this.game, 'bugs', this.player)
    this.bullets = new Actors.Bullets(this.game, 'bullets', this.bugs, this.score)
    this.controls = new Helpers.Controls(this.game, this.player, this.bullets, this.bugs)    
  }

  update() {
    if (this.player.dead) {
      return
    }

    this.player.render()
    this.bullets.render()
    this.bugs.render()
  }
}

export default Play
