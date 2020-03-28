import Phaser from "phaser";

import { PLAY_SCENE_KEY, BOOT_SCENE_KEY } from "../utils/const";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: BOOT_SCENE_KEY,
    });

    this.assets = [
      { type: "audio", key: "intro", path: "intro.mp3" },
      { type: "audio", key: "tick", path: "tick.mp3" },
      { type: "audio", key: "button", path: "button.mp3" },
      { type: "audio", key: "explosion", path: "explosion.mp3" },
      { type: "audio", key: "death", path: "death.mp3" },
      { type: "audio", key: "death", path: "death.mp3" },
      { type: "atlas", key: "atlas", path: "atlas.png", map: "atlas.json" },
      { type: "font", key: "digital", path: "digital.png", map: "digital.xml" },
    ];
  }

  preload() {
    this.assets.forEach((asset) => {
      if (asset.type === "audio") {
        this.load.audio(asset.key, asset.path);
      }
      if (asset.type === "atlas") {
        this.load.atlas(asset.key, asset.path, asset.map, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      }
      if (asset.type === "font") {
        this.load.bitmapFont(asset.key, asset.path, asset.map);
      }
    });
  }

  create() {
    this.scene.start(PLAY_SCENE_KEY);
  }
}
