import { Application, extend } from "@pixi/react";
import { Container, Sprite } from "pixi.js";

import { useAtlas } from "@/hooks/useAtlas";

import { Bugs } from "@/components/bugs";
import { Bullets } from "@/components/bullets";
import { Octo } from "@/components/octo";
import { Score } from "@/components/score";

const SCENE_WIDTH = 400;
const SCENE_HEIGHT = 300;

// Register the Pixi elements used throughout the scene.
extend({ Container, Sprite });

export const Scene = () => {
  const atlas = useAtlas();

  return (
    <Application width={SCENE_WIDTH} height={SCENE_HEIGHT} backgroundAlpha={0}>
      <pixiSprite texture={atlas.textures.environment} />
      <Bugs />
      <Bullets />
      <Octo />
      <Score />
    </Application>
  );
};
