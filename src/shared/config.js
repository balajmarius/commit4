import { DIFFICULTY_MAP } from '../helpers/levels'

export const GAME = {
  width: 400,
  height: 300,
  alpha: {
    active: 1,
    disabled: 0.05,
  },
  score: {
    x: 381,
    y: 58,
  },
}

export const PLAYER = {
  x: 30,
  y: 247,
  width: 48,
  height: 48,
  timeout: 750,
  frames: [{ x: 32, y: 0 }, { x: 132, y: 0 }, { x: 212, y: 0 }, { x: 270, y: 0 }],
}

export const BUGS = {
  x: 0,
  y: 0,
  queue: 2,
  timeout: DIFFICULTY_MAP.EASY,
  frames: [
    {
      x: 0,
      y: 0,
      width: 70,
      height: 55,
      bugs: [{ x: -4, y: -5 }, { x: 8, y: 45 }, { x: 22, y: 105 }, { x: 41, y: 161 }, { x: 61, y: 210 }],
    },
    {
      x: 87,
      y: 10,
      width: 65,
      height: 39,
      bugs: [{ x: -4, y: -4 }, { x: 8, y: 47 }, { x: 24, y: 103 }, { x: 42, y: 161 }, { x: 52, y: 207 }],
    },
    {
      x: 163,
      y: 3,
      width: 70,
      height: 52,
      bugs: [{ x: -4, y: -4 }, { x: 8, y: 50 }, { x: 24, y: 109 }, { x: 42, y: 163 }, { x: 53, y: 208 }],
    },
    {
      x: 245,
      y: 10,
      width: 72,
      height: 40,
      bugs: [{ x: -4, y: -4 }, { x: 4, y: 45 }, { x: 22, y: 102 }, { x: 38, y: 157 }, { x: 56, y: 206 }],
    },
  ],
}

export const BULLETS = {
  x: 37,
  y: 42,
  width: 7,
  height: 13,
  timeout: 200,
  frames: [
    {
      x: 0,
      y: 0,
      bullets: [{ x: 1, y: 3 }, { x: 15, y: 55 }, { x: 31, y: 110 }, { x: 48, y: 167 }],
    },
    {
      x: 82,
      y: 0,
      bullets: [{ x: 0, y: 2 }, { x: 15, y: 59 }, { x: 30, y: 112 }, { x: 46, y: 164 }],
    },
    {
      x: 159,
      y: 0,
      bullets: [{ x: 0, y: 3 }, { x: 19, y: 65 }, { x: 32, y: 115 }, { x: 48, y: 163 }],
    },
    {
      x: 239,
      y: 0,
      bullets: [{ x: 1, y: 4 }, { x: 16, y: 58 }, { x: 32, y: 113 }, { x: 48, y: 165 }],
    },
  ],
}
