import { BUGS } from './config'

export const getUniqueInteger = (queue, columns, game) => {

  let randomInteger = game.rnd.integerInRange(0, columns.length - 1)

  if (queue.includes(randomInteger)) {

    return getUniqueInteger(queue, columns, game)

  }

  return randomInteger

}

export const getIsAvailable = (lastTime, gameTime, timeout = BUGS.timeout) => {

  if (lastTime + timeout > gameTime) {

    return false

  }

  return true

}
