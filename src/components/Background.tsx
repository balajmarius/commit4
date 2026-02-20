import { GAME } from '../types/config'

export function Background() {
  return (
    <div
      className="absolute left-0 top-0"
      style={{
        width: GAME.width,
        height: GAME.height,
        backgroundImage: 'url(/assets/images/sprites/background.png)',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}
