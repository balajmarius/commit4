import { useReducer } from 'react'
import { gameReducer, initialState } from './state/gameReducer'
import { useAssetLoader } from './hooks/useAssetLoader'
import { useAudio } from './hooks/useAudio'
import { useGameLoop } from './hooks/useGameLoop'
import { useKeyboard } from './hooks/useKeyboard'
import { useSoundEffects } from './hooks/useSoundEffects'
import { Loader } from './components/Loader'
import { ArcadeCabinet } from './components/ArcadeCabinet'

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialState)
  const play = useAudio()

  useAssetLoader(dispatch)
  useGameLoop(state.phase, dispatch)
  useKeyboard(state.phase, state.player.dead, dispatch)
  useSoundEffects(state, play)

  return (
    <>
      <Loader phase={state.phase} />
      <ArcadeCabinet state={state} />
    </>
  )
}
