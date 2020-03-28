import Phaser from "phaser";

import { ASSETS_COORDINATES } from "../utils/const";

export default class Bugs extends Phaser.GameObjects.Group {
  constructor() {
    super();

    this.x = ASSETS_COORDINATES.BUGS.x;
    this.y = ASSETS_COORDINATES.BUGS.y;
  }
}
