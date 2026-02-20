import { memo } from 'react'
import { BULLETS } from '../types/config'

interface BulletProps {
  active: boolean
  x: number
  y: number
}

export const Bullet = memo(function Bullet({ active, x, y }: BulletProps) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: BULLETS.width,
        height: BULLETS.height,
        backgroundImage: 'url(/assets/images/sprites/bullets.png)',
        backgroundPosition: '0 0',
        backgroundRepeat: 'no-repeat',
        opacity: active ? 1 : 0.05,
      }}
    />
  )
})
