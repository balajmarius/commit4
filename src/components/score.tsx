import { extend } from "@pixi/react";
import { Container, Sprite } from "pixi.js";

import { useGame } from "@/context/game";
import { useAtlas } from "@/hooks/useAtlas";

import { SPRITE_ALPHA_ACTIVE, SPRITE_ALPHA_DISABLED } from "@/utils/const";

extend({ Container, Sprite });

const SCORE_X = 381;
const SCORE_Y = 58;
const SCORE_ADVANCE = 9;

const SCORE_FRAMES = [
  "score/0",
  "score/1",
  "score/2",
  "score/3",
  "score/4",
  "score/5",
  "score/6",
  "score/7",
  "score/8",
  "score/9",
] as const;

export const Score = () => {
  const { score, status } = useGame();

  const atlas = useAtlas();
  const digits = [...String(score)];

  return (
    <pixiContainer x={SCORE_X} y={SCORE_Y}>
      {digits.map((digit, index) => {
        return (
          <pixiSprite
            key={`${digit}-${index}`}
            x={(index - digits.length) * SCORE_ADVANCE}
            texture={atlas.textures[SCORE_FRAMES[Number(digit)]]}
            alpha={status === "play" ? SPRITE_ALPHA_ACTIVE : SPRITE_ALPHA_DISABLED}
          />
        );
      })}
    </pixiContainer>
  );
};
