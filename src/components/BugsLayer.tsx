import { BUGS } from '../types/config'
import { BugColumn } from './BugColumn'
import type { BugColumnState } from '../types/game'

interface BugsLayerProps {
  bugColumns: BugColumnState[]
}

export function BugsLayer({ bugColumns }: BugsLayerProps) {
  return (
    <div className="absolute" style={{ left: BUGS.x, top: BUGS.y }}>
      {bugColumns.map((col, i) => (
        <BugColumn key={i} columnIndex={i} column={col} />
      ))}
    </div>
  )
}
