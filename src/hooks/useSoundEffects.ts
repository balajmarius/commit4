import { useRef, useEffect } from 'react'
import type { GameState } from '../types/game'
import type { AudioName } from '../types/config'

export function useSoundEffects(
  state: GameState,
  play: (name: AudioName) => void,
) {
  const prev = useRef(state)

  useEffect(() => {
    const p = prev.current
    prev.current = state

    // Player moved or fired
    if (
      state.player.currentPosition !== p.player.currentPosition ||
      (state.player.firing && !p.player.firing)
    ) {
      play('press')
    }

    // Bug exploded (score increased)
    if (state.score > p.score) {
      play('explode')
    }

    // Bug ticked (bugUpdateTime changed while queue was full = move happened)
    if (
      state.bugUpdateTime !== p.bugUpdateTime &&
      p.bugQueue.length > 2 &&
      !state.player.dead
    ) {
      play('tick')
    }

    // Player died
    if (state.player.dead && !p.player.dead) {
      play('die')
    }
  })
}
