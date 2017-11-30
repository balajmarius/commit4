import { BULLETS, GAME } from '../../shared/config'
import { getIsAvailable } from '../../shared/utils'

import Column from './column'

class Bullets extends Phaser.Group {
  constructor(game, name, bugs, score) {
    super(game, null, name)

    this.x = BULLETS.x
    this.y = BULLETS.y

    this.stack = []
    this.updateTime = 0

    this.fire = this.fire.bind(this)
    this.render = this.render.bind(this)
    this.remove = this.remove.bind(this)

    BULLETS.frames.forEach((frame, index) => {
      this.addChild(new Column(this.game, name, frame, index, this.remove, score, bugs))
    })

    this.game.world.addChild(this)
  }

  fire(column) {
    if (this.stack.includes(column)) {
      return
    }

    this.stack.push(column)
  }

  remove(column) {
    const index = this.stack.indexOf(column)
    this.stack.splice(index, 1)
  }

  render() {
    const isUpdateAvailable = getIsAvailable(this.updateTime, this.game.time.now, BULLETS.timeout)
    
    if (!isUpdateAvailable) {
      return
    }

    this.stack.forEach(column => {
      this.children[column].render()
    })

    this.updateTime = this.game.time.now
  }
}

export default Bullets
