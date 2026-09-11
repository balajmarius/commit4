import { Application, extend } from "@pixi/react";
import { Sprite } from "pixi.js";

import { useAtlas } from "@/hooks/useAtlas";

import { GameProvider } from "@/context/game";

import { Bug } from "@/components/bug";
import { Commit } from "@/components/commit";
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
        <Bug />
        <Commit />
        <Octo />
        <Score />
      </GameProvider>
    </Application>
  );
};
