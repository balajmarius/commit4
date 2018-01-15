import Bug from './bug'

class Column extends Phaser.Group {

  constructor(game, name, frame, current, player) {

    super(game, null, name)

    this.x = frame.x
    this.y = frame.y

    this.hit = false
    this.index = current
    this.currentPosition = 0
    this.player = player

    this.reset = this.reset.bind(this)
    this.render = this.render.bind(this)
    this.remove = this.remove.bind(this)

    frame.bugs.forEach((coordinates, index) => {

      this.addChild(new Bug(this.game, name, coordinates, current, index, this.remove))

    })

    this.game.world.addChild(this)

  }

  reset() {

    this.hit = false
    this.currentPosition = 0
    this.children.forEach(bug => bug.disable())

  }

  remove() {

    this.hit = true
    this.parent.remove(this.index)

  }

  render() {

    if (this.hit) {

      return this.reset()

    }

    const currentBug = this.children[this.currentPosition]
    const previousBug = this.children[this.currentPosition - 1]
    const nextBug = this.children[this.currentPosition + 1]

    currentBug.activate()

    if (previousBug) {

      previousBug.disable()

    }

    if (nextBug) {

      return this.currentPosition++

    }

    this.player.die()

  }

}

export default Column
