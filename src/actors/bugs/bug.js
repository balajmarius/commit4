import { GAME } from '../../shared/config'

class Bug extends Phaser.Group {

  constructor(game, name, coordinates, current, index, remove) {

    super(game, null, `${name}-skeleton`)

    this.x = coordinates.x
    this.y = coordinates.y

    this.active = false
    this.remove = remove

    const body = this.create(0, 0, `${name}-${current}`, index)
    const explosion = this.create(0, 0, `explosion-${current}`, index)

    body.alpha = GAME.alpha.disabled
    explosion.alpha = GAME.alpha.disabled

    this.explode = this.explode.bind(this)
    this.disable = this.disable.bind(this)
    this.activate = this.activate.bind(this)

    this.game.world.addChild(this)

  }

  explode() {

    const [, explosion] = this.children
    explosion.alpha = GAME.alpha.active
    this.active = true
    this.remove()
    this.game.sound.play('explode')

  }

  disable() {

    this.children.forEach(frame => (frame.alpha = GAME.alpha.disabled))
    this.active = false

  }

  activate() {

    const [body] = this.children
    body.alpha = GAME.alpha.active
    this.active = true

  }

}

export default Bug
