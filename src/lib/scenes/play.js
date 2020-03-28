import Phaser from "phaser";

import { PLAY_SCENE_KEY } from "../utils/const";

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: PLAY_SCENE_KEY,
    });
  }

  create() {}
}
