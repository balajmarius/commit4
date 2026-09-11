import { extend } from "@pixi/react";
import { Container, Sprite } from "pixi.js";

import { useAtlas } from "@/hooks/useAtlas";
import { useGame } from "@/context/game";

import { SPRITE_ALPHA_ACTIVE, SPRITE_ALPHA_DISABLED } from "@/utils/const";

extend({ Container, Sprite });

const COMMIT_LANES = [
  {
    x: 0,
    y: 0,
    cells: [
      { x: 1, y: 3 },
      { x: 15, y: 55 },
      { x: 31, y: 110 },
      { x: 48, y: 167 },
    ],
  },
  {
    x: 82,
    y: 0,
    cells: [
      { x: 0, y: 2 },
      { x: 15, y: 59 },
      { x: 30, y: 112 },
      { x: 46, y: 164 },
    ],
  },
  {
    x: 159,
    y: 0,
    cells: [
      { x: 0, y: 3 },
      { x: 19, y: 65 },
      { x: 32, y: 115 },
      { x: 48, y: 163 },
    ],
  },
  {
    x: 239,
    y: 0,
    cells: [
      { x: 1, y: 4 },
      { x: 16, y: 58 },
      { x: 32, y: 113 },
      { x: 48, y: 165 },
    ],
  },
] as const;

const COMMIT_X = 37;
const COMMIT_Y = 42;

export const Commit = () => {
  const atlas = useAtlas();
  const { bullets } = useGame();

  const getAlpha = (lane: number, cell: number) => {
    if (bullets[lane] === cell) {
      return SPRITE_ALPHA_ACTIVE;
    }
    return SPRITE_ALPHA_DISABLED;
  };

  return (
    <pixiContainer x={COMMIT_X} y={COMMIT_Y}>
      {COMMIT_LANES.map((lane, laneIndex) => {
        return (
          <pixiContainer key={lane.x} x={lane.x} y={lane.y}>
            {lane.cells.map((cell, cellIndex) => {
              return (
                <pixiSprite
                  key={`${cell.x}-${cell.y}`}
                  x={cell.x}
                  y={cell.y}
                  texture={atlas.textures.commit}
                  alpha={getAlpha(laneIndex, cellIndex)}
                />
              );
            })}
          </pixiContainer>
        );
      })}
    </pixiContainer>
  );
};
