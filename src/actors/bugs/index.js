import { BUGS } from '../../shared/config'
import { getUniqueInteger, getIsAvailable } from '../../shared/utils'

import Column from './column'

class Bugs extends Phaser.Group {

  constructor(game, name, player) {

    super(game, null, name)

    this.x = BUGS.x
    this.y = BUGS.y

    this.queue = []
    this.updateTime = 0
    this.cleanTime = 0

    BUGS.frames.forEach((frame, current) => {

      this.addChild(new Column(this.game, name, frame, current, player))

    })

    this.move = this.move.bind(this)
    this.spawn = this.spawn.bind(this)
    this.render = this.render.bind(this)
    this.remove = this.remove.bind(this)
    this.cleanup = this.cleanup.bind(this)

    this.game.world.addChild(this)

  }

  remove(column) {

    const index = this.queue.indexOf(column)
    this.queue.splice(index, 1)
    this.cleanTime = this.game.time.now

  }

  spawn() {

    if (this.queue.length === this.children.length) {

      return

    }

    const currentSpawn = getUniqueInteger(this.queue, this.children, this.game)

    this.queue.push(currentSpawn)
    this.updateTime = this.game.time.now

  }

  move() {

    if (!this.queue.length) {

      return

    }

    const current = this.queue.shift()
    const column = this.children[current]

    column.render()

    this.queue.push(current)
    this.updateTime = this.game.time.now

  }

  cleanup() {

    this.children.forEach(column => column.hit && column.reset())

  }

  render() {

    const isCleanAvailable = getIsAvailable(this.cleanTime, this.game.time.now)
    const isUpdateAvailable = getIsAvailable(this.updateTime, this.game.time.now)

    if (isCleanAvailable) {

      this.cleanup()

    }

    if (isUpdateAvailable) {

      const isSpawnFull = this.queue.length > BUGS.queue

      if (isSpawnFull) {

        this.game.sound.play('tick')

        return this.move()
      
      }

      return this.spawn()

    }

  }

}

export default Bugs
