import { Application, extend } from "@pixi/react";
import { Sprite } from "pixi.js";

import { useAtlas } from "@/hooks/useAtlas";

import { GameProvider } from "@/context/game";

import { Bugs } from "@/components/bugs";
import { Bullets } from "@/components/bullets";
import { Octo } from "@/components/octo";
import { Score } from "@/components/score";

const SCENE_WIDTH = 400;
const SCENE_HEIGHT = 300;

// Registers Sprite so
// <pixiSprite> is available in JSX.
extend({ Sprite });

export const Scene = () => {
  const atlas = useAtlas();

  return (
    <Application width={SCENE_WIDTH} height={SCENE_HEIGHT}>
      <GameProvider>
        <pixiSprite texture={atlas.textures.environment} />
        <Bugs />
        <Bullets />
        <Octo />
        <Score />
      </GameProvider>
    </Application>
  );
};
