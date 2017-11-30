import { GAME } from '../../shared/config'

class Octocat extends Phaser.Group {
  constructor(game, name, coordinates, frame) {
    super(game, null, `${name}-${frame}`)

    this.x = coordinates.x
    this.y = coordinates.y

    this.fire = this.fire.bind(this)
    this.disarm = this.disarm.bind(this)
    this.disable = this.disable.bind(this)
    this.activate = this.activate.bind(this)

    const body = this.create(0, 0, `${name}-body`, frame)
    const tentacles = this.create(0, 0, `${name}-tentacles`, frame)

    tentacles.alpha = GAME.alpha.disabled
    body.alpha = frame ? GAME.alpha.disabled : GAME.alpha.active    

    this.game.world.addChild(this)
  }

  disarm() {
    const [,tentacles] = this.children
    tentacles.alpha = GAME.alpha.disabled
  }

  fire() {
    const [,tentacles] = this.children
    tentacles.alpha = GAME.alpha.active
  }

  disable() {
    this.children.forEach(frame => frame.alpha = GAME.alpha.disabled)
  }

  activate() {
    const [body] = this.children
    body.alpha = GAME.alpha.active
  }
}

export default Octocat
