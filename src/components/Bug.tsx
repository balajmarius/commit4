import { memo } from 'react'

interface BugProps {
  active: boolean
  exploding: boolean
  x: number
  y: number
  columnIndex: number
  bugIndex: number
  width: number
  height: number
}

export const Bug = memo(function Bug({
  active,
  exploding,
  x,
  y,
  columnIndex,
  bugIndex,
  width,
  height,
}: BugProps) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div
        className="absolute left-0 top-0"
        style={{
          width,
          height,
          backgroundImage: `url(/assets/images/sprites/bugs-${columnIndex}.png)`,
          backgroundPosition: `-${bugIndex * width}px 0`,
          backgroundRepeat: 'no-repeat',
          opacity: active && !exploding ? 1 : 0.05,
        }}
      />
      <div
        className="absolute left-0 top-0"
        style={{
          width,
          height,
          backgroundImage: `url(/assets/images/sprites/explosions-${columnIndex}.png)`,
          backgroundPosition: `-${bugIndex * width}px 0`,
          backgroundRepeat: 'no-repeat',
          opacity: exploding ? 1 : 0.05,
        }}
      />
    </div>
  )
})
