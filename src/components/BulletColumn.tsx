import { memo } from 'react'
import { Bullet } from './Bullet'
import { BULLETS } from '../types/config'
import type { BulletColumnState } from '../types/game'

interface BulletColumnProps {
  columnIndex: number
  column: BulletColumnState
}

export const BulletColumn = memo(function BulletColumn({ columnIndex, column }: BulletColumnProps) {
  const frame = BULLETS.frames[columnIndex]!
  return (
    <div className="absolute" style={{ left: frame.x, top: frame.y }}>
      {frame.bullets.map((pos, i) => (
        <Bullet
          key={i}
          x={pos.x}
          y={pos.y}
          active={column.bullets[i]?.active ?? false}
        />
      ))}
    </div>
  )
})
