import { Assets, Spritesheet, Texture } from "pixi.js";
import { use } from "react";

import data from "@/static/atlas/atlas.json";
import src from "@/static/atlas/atlas.png?url";

const preload = async () => {
  const texture = await Assets.load<Texture>(src);
  const sheet = new Spritesheet({ texture, data });

  await sheet.parse();

  return sheet;
};

const atlas = preload();

export const useAtlas = () => {
  return use(atlas);
};
