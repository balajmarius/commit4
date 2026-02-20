import { memo } from 'react'
import { GAME, DIGIT_GLYPHS } from '../types/config'

interface ScoreDisplayProps {
  score: number
}

export const ScoreDisplay = memo(function ScoreDisplay({ score }: ScoreDisplayProps) {
  const digits = String(score).split('')

  // Calculate total width for right-alignment (anchor x = 1 means right-aligned)
  let totalWidth = 0
  for (const d of digits) {
    const glyph = DIGIT_GLYPHS[d]
    if (glyph) totalWidth += glyph.xadvance
  }

  let offsetX = 0

  return (
    <div
      className="absolute"
      style={{
        left: GAME.score.x - totalWidth,
        top: GAME.score.y,
      }}
    >
      {digits.map((d, i) => {
        const glyph = DIGIT_GLYPHS[d]
        if (!glyph) return null
        const x = offsetX + 1 // xoffset = 1 for all digits
        offsetX += glyph.xadvance
        return (
          <div
            key={i}
            className="absolute top-0"
            style={{
              left: x,
              width: glyph.width,
              height: glyph.height,
              backgroundImage: 'url(/assets/fonts/digital.png)',
              backgroundPosition: `-${glyph.x}px -${glyph.y}px`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )
      })}
    </div>
  )
})
