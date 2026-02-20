import { memo } from 'react'
import { Bug } from './Bug'
import { BUGS } from '../types/config'
import type { BugColumnState } from '../types/game'

interface BugColumnProps {
  columnIndex: number
  column: BugColumnState
}

export const BugColumn = memo(function BugColumn({ columnIndex, column }: BugColumnProps) {
  const frame = BUGS.frames[columnIndex]!
  return (
    <div className="absolute" style={{ left: frame.x, top: frame.y }}>
      {frame.bugs.map((pos, i) => (
        <Bug
          key={i}
          x={pos.x}
          y={pos.y}
          columnIndex={columnIndex}
          bugIndex={i}
          width={frame.width}
          height={frame.height}
          active={column.bugs[i]?.active ?? false}
          exploding={column.bugs[i]?.exploding ?? false}
        />
      ))}
    </div>
  )
})
