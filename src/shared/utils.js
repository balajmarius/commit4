export const getUniqueInteger = (queue, columns, game) => {
  let randomInteger = game.rnd.integerInRange(0, columns.length-1)

  if (queue.includes(randomInteger)) {
    return getUniqueInteger(queue, columns, game)
  }

  return randomInteger
}
