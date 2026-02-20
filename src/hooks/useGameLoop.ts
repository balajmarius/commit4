import { useEffect } from 'react'
import { GamePhase } from '../types/game'
import { ActionType } from '../state/actions'
import type { GameAction } from '../state/actions'

export function useGameLoop(phase: GamePhase, dispatch: React.Dispatch<GameAction>) {
  useEffect(() => {
    if (phase !== GamePhase.PLAYING) return

    let raf: number

    const loop = () => {
      dispatch({ type: ActionType.TICK, now: Date.now() })
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(raf)
  }, [phase, dispatch])
}
