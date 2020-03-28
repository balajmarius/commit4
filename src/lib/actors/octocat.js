import Phaser from "phaser";

import { ASSETS_COORDINATES } from "../utils/const";

export default class Octocat extends Phaser.GameObjects.Group {
  constructor() {
    super();

    this.x = ASSETS_COORDINATES.OCTOCAT.x;
    this.y = ASSETS_COORDINATES.OCTOCAT.y;
  }

  shoot() {}

  disarm() {}

  disable() {}

  activate() {}
}
