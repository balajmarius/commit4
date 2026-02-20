import { useEffect } from 'react'
import { IMAGE_FILES } from '../types/config'
import { ActionType } from '../state/actions'
import type { GameAction } from '../state/actions'

export function useAssetLoader(dispatch: React.Dispatch<GameAction>) {
  useEffect(() => {
    let cancelled = false
    const promises = IMAGE_FILES.map(
      src =>
        new Promise<void>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = reject
          img.src = src
        }),
    )

    Promise.all(promises).then(() => {
      if (!cancelled) dispatch({ type: ActionType.ASSETS_LOADED })
    })

    return () => {
      cancelled = true
    }
  }, [dispatch])
}
