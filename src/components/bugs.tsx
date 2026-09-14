import { extend } from "@pixi/react";
import { Container, Sprite } from "pixi.js";

import { useGame } from "@/context/game";
import { useAtlas } from "@/hooks/useAtlas";

import { SPRITE_ALPHA_ACTIVE, SPRITE_ALPHA_DISABLED } from "@/utils/const";

extend({ Container, Sprite });

const BUG_LANES = [
  {
    x: 0,
    y: 0,
    cells: [
      { x: -4, y: -5, body: "bug/0/0", squash: "squash/0/0" },
      { x: 8, y: 45, body: "bug/0/1", squash: "squash/0/1" },
      { x: 22, y: 105, body: "bug/0/2", squash: "squash/0/2" },
      { x: 41, y: 161, body: "bug/0/3", squash: "squash/0/3" },
    ],
  },
  {
    x: 87,
    y: 10,
    cells: [
      { x: -4, y: -4, body: "bug/1/0", squash: "squash/1/0" },
      { x: 8, y: 47, body: "bug/1/1", squash: "squash/1/1" },
      { x: 24, y: 103, body: "bug/1/2", squash: "squash/1/2" },
      { x: 42, y: 161, body: "bug/1/3", squash: "squash/1/3" },
    ],
  },
  {
    x: 163,
    y: 3,
    cells: [
      { x: -4, y: -4, body: "bug/2/0", squash: "squash/2/0" },
      { x: 8, y: 50, body: "bug/2/1", squash: "squash/2/1" },
      { x: 24, y: 109, body: "bug/2/2", squash: "squash/2/2" },
      { x: 42, y: 163, body: "bug/2/3", squash: "squash/2/3" },
    ],
  },
  {
    x: 245,
    y: 10,
    cells: [
      { x: -4, y: -4, body: "bug/3/0", squash: "squash/3/0" },
      { x: 4, y: 45, body: "bug/3/1", squash: "squash/3/1" },
      { x: 22, y: 102, body: "bug/3/2", squash: "squash/3/2" },
      { x: 38, y: 157, body: "bug/3/3", squash: "squash/3/3" },
    ],
  },
] as const;

export const Bugs = () => {
  const { bugs } = useGame();
  const { textures } = useAtlas();

  const alpha = (lane: number, cell: number) => {
    if (bugs[lane] === cell) {
      return SPRITE_ALPHA_ACTIVE;
    }
    return SPRITE_ALPHA_DISABLED;
  };

  return (
    <pixiContainer>
      {BUG_LANES.map((lane, laneIndex) => {
        return (
          <pixiContainer key={`${lane.x}-${lane.y}`} x={lane.x} y={lane.y}>
            {lane.cells.map((cell, cellIndex) => {
              return (
                <pixiContainer key={cell.body} x={cell.x} y={cell.y}>
                  <pixiSprite
                    texture={textures[cell.squash]}
                    alpha={SPRITE_ALPHA_DISABLED}
                  />
                  <pixiSprite
                    texture={textures[cell.body]}
                    alpha={alpha(laneIndex, cellIndex)}
                  />
                </pixiContainer>
              );
            })}
          </pixiContainer>
        );
      })}
    </pixiContainer>
  );
};
