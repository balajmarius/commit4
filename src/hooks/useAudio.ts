import { useRef, useCallback } from 'react'
import type { AudioName } from '../types/config'
import { AUDIO_FILES } from '../types/config'

const POOL_SIZE = 3

export function useAudio() {
  const pools = useRef<Record<string, HTMLAudioElement[]> | null>(null)

  if (pools.current === null) {
    const p: Record<string, HTMLAudioElement[]> = {}
    for (const name of AUDIO_FILES) {
      p[name] = Array.from({ length: POOL_SIZE }, () => {
        const a = new Audio(`/assets/audio/${name}.mp3`)
        a.preload = 'auto'
        return a
      })
    }
    pools.current = p
  }

  const play = useCallback((name: AudioName) => {
    const pool = pools.current?.[name]
    if (!pool) return
    const audio = pool.find(a => a.paused || a.ended) ?? pool[0]!
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [])

  return play
}
