import { BULLETS } from '../types/config'
import { BulletColumn } from './BulletColumn'
import type { BulletColumnState } from '../types/game'

interface BulletsLayerProps {
  bulletColumns: BulletColumnState[]
}

export function BulletsLayer({ bulletColumns }: BulletsLayerProps) {
  return (
    <div className="absolute" style={{ left: BULLETS.x, top: BULLETS.y }}>
      {bulletColumns.map((col, i) => (
        <BulletColumn key={i} columnIndex={i} column={col} />
      ))}
    </div>
  )
}
