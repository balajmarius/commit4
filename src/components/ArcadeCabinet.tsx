import { CABINET } from '../types/config'
import { GameScreen } from './GameScreen'
import type { GameState } from '../types/game'

interface ArcadeCabinetProps {
  state: GameState
}

export function ArcadeCabinet({ state }: ArcadeCabinetProps) {
  return (
    <div className="relative mx-auto" style={{ width: CABINET.width }}>
      <div
        className="relative"
        style={{
          width: CABINET.width,
          height: CABINET.height,
          backgroundImage: 'url(/assets/images/ui/case.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          zIndex: 200,
        }}
      />
      <GameScreen state={state} />
    </div>
  )
}
