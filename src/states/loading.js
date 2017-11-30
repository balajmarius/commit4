import { PLAYER, BUGS } from '../shared/config'

class Loading extends Phaser.State {
  create() {
    this.preloader.remove()
    this.game.state.start('play')
  }

  preload() {
    this.preloader = document.querySelector('.preloader')

    this.game.load.image('case', 'images/ui/case.png')
    this.game.load.image('bullets', 'images/sprites/bullets.png')
    this.game.load.image('background', 'images/sprites/background.png')

    this.game.load.spritesheet('octocat-body', 'images/sprites/octocat-body.png', PLAYER.width, PLAYER.height)
    this.game.load.spritesheet('octocat-tentacles', 'images/sprites/octocat-tentacles.png', PLAYER.width, PLAYER.height)

    BUGS.frames.forEach((bug, index) => {
      this.game.load.spritesheet(`bugs-${index}`, `images/sprites/bugs-${index}.png`, bug.width, bug.height)
      this.game.load.spritesheet(`explosion-${index}`, `images/sprites/explosions-${index}.png`, bug.width, bug.height)
    })

    this.game.load.audio('press', 'audio/press.mp3')
    this.game.load.audio('tick', 'audio/tick.mp3')
    this.game.load.audio('explode', 'audio/explode.mp3')
    this.game.load.audio('die', 'audio/die.mp3')

    this.game.load.bitmapFont('digital', 'fonts/digital.png', 'fonts/digital.xml');
  }
}

export default Loading
