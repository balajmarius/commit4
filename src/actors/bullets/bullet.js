import { BULLETS, GAME } from '../../shared/config'

class Bullet extends Phaser.Sprite {
  constructor(game, name, coordinates) {
    super(game, coordinates.x, coordinates.y, name)

    this.active = false
    this.alpha = GAME.alpha.disabled    

    this.disable = this.disable.bind(this)
    this.activate = this.activate.bind(this)

    this.game.world.addChild(this)
  }

  disable() {
    this.active = false
    this.alpha = GAME.alpha.disabled
  }

  activate() {
    this.active = true
    this.alpha = GAME.alpha.active
  }
}

export default Bullet
