import Bullet from './bullet'

class Column extends Phaser.Group {

  constructor(game, name, frame, index, remove, score, bugs) {

    super(game, null, name)

    this.x = frame.x
    this.y = frame.y

    this.hit = false
    this.index = index
    this.currentPosition = 3

    this.bugs = bugs
    this.score = score
    this.remove = remove

    this.reset = this.reset.bind(this)
    this.render = this.render.bind(this)

    frame.bullets.forEach(coordinates => {

      this.addChild(new Bullet(this.game, name, coordinates))
    
    })

    this.game.world.addChild(this)
  
  }

  reset() {

    this.hit = false
    this.currentPosition = 3
    this.children.forEach(bullet => bullet.disable())
    this.remove(this.index)
  
  }

  render() {

    if (this.hit) {

      return this.reset()
    
    }

    const currentBullet = this.children[this.currentPosition]
    const previousBullet = this.children[this.currentPosition + 1]
    const nextBullet = this.children[this.currentPosition - 1]

    const bugsColumn = this.bugs.children[this.index]
    const currentBug = bugsColumn.children[this.currentPosition]
    const nextBug = bugsColumn.children[this.currentPosition + 1]

    currentBullet.activate()

    if (previousBullet) {

      previousBullet.disable()
    
    }

    // fix collison bug
    // refactor this
    if (currentBug.active || nextBug.active) {

      this.hit = true
      this.score.add()

      if (currentBug.active) {

        return currentBug.explode()
      
      }

      currentBullet.disable()
      previousBullet.activate()

      if (nextBug.active) {

        return nextBug.explode()
      
      }
    
    }

    if (nextBullet) {

      this.currentPosition--
    
    } else {

      this.hit = true
    
    }
  
  }

}

export default Column
