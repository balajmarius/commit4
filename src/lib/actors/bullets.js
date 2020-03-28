import Phaser from "phaser";

import { ASSETS_COORDINATES } from "../utils/const";

export default class Bullets extends Phaser.GameObjects.Group {
  constructor() {
    super();

    this.x = ASSETS_COORDINATES.BULLETS.x;
    this.y = ASSETS_COORDINATES.BULLETS.y;
  }
}
