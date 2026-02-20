import { PLAYER } from '../types/config'
import { Octocat } from './Octocat'
import type { PlayerState } from '../types/game'

interface PlayerProps {
  player: PlayerState
}

export function Player({ player }: PlayerProps) {
  return (
    <div className="absolute" style={{ left: PLAYER.x, top: PLAYER.y }}>
      {PLAYER.frames.map((_, i) => (
        <Octocat
          key={i}
          frameIndex={i}
          isActive={player.currentPosition === i}
          isFiring={player.currentPosition === i && player.firing}
        />
      ))}
    </div>
  )
}
