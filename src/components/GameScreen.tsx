import { GAME } from '../types/config'
import { Background } from './Background'
import { ScanlineOverlay } from './ScanlineOverlay'
import { ScoreDisplay } from './ScoreDisplay'
import { Player } from './Player'
import { BugsLayer } from './BugsLayer'
import { BulletsLayer } from './BulletsLayer'
import type { GameState } from '../types/game'

interface GameScreenProps {
  state: GameState
}

export function GameScreen({ state }: GameScreenProps) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{ width: GAME.width, height: GAME.height, left: 190, top: 130 }}
    >
      <Background />
      <ScoreDisplay score={state.score} />
      <Player player={state.player} />
      <BugsLayer bugColumns={state.bugColumns} />
      <BulletsLayer bulletColumns={state.bulletColumns} />
      <ScanlineOverlay />
    </div>
  )
}
