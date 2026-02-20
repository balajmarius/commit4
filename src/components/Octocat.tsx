import { memo } from 'react'
import { PLAYER } from '../types/config'

interface OctocatProps {
  frameIndex: number
  isActive: boolean
  isFiring: boolean
}

export const Octocat = memo(function Octocat({ frameIndex, isActive, isFiring }: OctocatProps) {
  const frame = PLAYER.frames[frameIndex]!
  return (
    <div className="absolute" style={{ left: frame.x, top: frame.y }}>
      <div
        className="absolute left-0 top-0"
        style={{
          width: PLAYER.width,
          height: PLAYER.height,
          backgroundImage: 'url(/assets/images/sprites/octocat-body.png)',
          backgroundPosition: `-${frameIndex * PLAYER.width}px 0`,
          backgroundRepeat: 'no-repeat',
          opacity: isActive ? 1 : 0.05,
        }}
      />
      <div
        className="absolute left-0 top-0"
        style={{
          width: PLAYER.width,
          height: PLAYER.height,
          backgroundImage: 'url(/assets/images/sprites/octocat-tentacles.png)',
          backgroundPosition: `-${frameIndex * PLAYER.width}px 0`,
          backgroundRepeat: 'no-repeat',
          opacity: isActive && isFiring ? 1 : 0.05,
        }}
      />
    </div>
  )
})
