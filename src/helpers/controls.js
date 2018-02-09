import { BUGS } from '../shared/config'
import { DIFFICULTY_MAP } from './levels'

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
    this.start_down =  this.start_down.bind(this)
    this.start_up =  this.start_up.bind(this)
    this.left_down =  this.left_down.bind(this)
    this.left_up =  this.left_up.bind(this)
    this.right_down =  this.right_down.bind(this)
    this.right_up =  this.right_up.bind(this)
    this.commit_down =  this.commit_down.bind(this)
    this.commit_up =  this.commit_up.bind(this)

    this.left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)

    this.startbutton = document.querySelector('.start__button')
    this.startbutton.onpointerdown = this.start_down
    this.startbutton.onpointerup = this.start_up

    this.leftbutton = document.querySelector('.left__button')
    this.leftbutton.onpointerdown = this.left_down
    this.leftbutton.onpointerup = this.left_up

    this.rightbutton = document.querySelector('.right__button')
    this.rightbutton.onpointerdown = this.right_down
    this.rightbutton.onpointerup = this.right_up

    this.commitbutton = document.querySelector('.commit__button')
    this.commitbutton.onpointerdown = this.commit_down
    this.commitbutton.onpointerup = this.commit_up

    this.left.onDown.add(this.goLeft)
    this.right.onDown.add(this.goRight)
    this.spacebar.onDown.add(this.fire)
    this.enter.onDown.add(this.restart)

  }

  start_down(){

    this.startbutton.style.opacity = 1.0
    this.restart()
  
  }

  start_up(){

    this.startbutton.style.opacity = 0.0
  
  }

  left_down(){

    this.leftbutton.style.opacity = 1.0
    this.goLeft()
  
  }

  left_up(){

    this.leftbutton.style.opacity = 0.0
  
  }
  right_down(){

    this.rightbutton.style.opacity = 1.0
    this.goRight()
  
  }

  right_up(){

    this.rightbutton.style.opacity = 0.0
  
  }
  commit_down(){

    this.commitbutton.style.opacity = 1.0
    this.fire()
  
  }

  commit_up(){

    this.commitbutton.style.opacity = 0.0
  
  }
  restart() {

    if (this.player.dead) {

      BUGS.timeout = DIFFICULTY_MAP.EASY
      this.game.state.start('play')

    }

  }

  fire() {

    if (!this.player.dead) {

      this.player.fire()
      this.bullets.fire(this.player.currentPosition)

    }

  }

  goLeft() {

    if (!this.player.dead) {

      this.player.goLeft()

    }

  }

  goRight() {

    if (!this.player.dead) {

      this.player.goRight()

    }

  }

}

export default Controls
