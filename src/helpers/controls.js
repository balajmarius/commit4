class Controls {
  constructor(game, player, bullets, bugs) {
    this.game = game
    this.bugs = bugs    
    this.player = player
    this.bullets = bullets

    this.fire = this.fire.bind(this)
    this.goLeft = this.goLeft.bind(this)
    this.goRight = this.goRight.bind(this)
    this.restart = this.restart.bind(this)

    this.left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
    
    this.left.onDown.add(this.goLeft)
    this.right.onDown.add(this.goRight)
    this.spacebar.onDown.add(this.fire)
    this.enter.onDown.add(this.restart)
  }

  restart() {
    if (!this.player.dead) {
      return
    }

    this.game.state.start('play')
  }

  fire() {
    if (this.player.dead) {
      return
    }

    this.player.fire()
    this.bullets.fire(this.player.currentPosition)
  }

  goLeft() {
    if (this.player.dead) {
      return
    }

    this.player.goLeft()
  }

  goRight() {
    if (this.player.dead) {
      return
    }

    this.player.goRight()
  }
}

export default Controls
