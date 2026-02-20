import { useEffect } from 'react'
import { GamePhase } from '../types/game'
import { ActionType } from '../state/actions'
import type { GameAction } from '../state/actions'

export function useKeyboard(
  phase: GamePhase,
  playerDead: boolean,
  dispatch: React.Dispatch<GameAction>,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          if (phase === GamePhase.READY) {
            dispatch({ type: ActionType.START_GAME })
          } else if (phase === GamePhase.GAME_OVER) {
            dispatch({ type: ActionType.RESTART })
          }
          break
        case 'ArrowLeft':
          if (phase === GamePhase.PLAYING && !playerDead) {
            dispatch({ type: ActionType.MOVE_LEFT })
          }
          break
        case 'ArrowRight':
          if (phase === GamePhase.PLAYING && !playerDead) {
            dispatch({ type: ActionType.MOVE_RIGHT })
          }
          break
        case ' ':
          e.preventDefault()
          if (phase === GamePhase.PLAYING && !playerDead) {
            dispatch({ type: ActionType.FIRE })
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, playerDead, dispatch])
}
