import Phaser from "phaser";

import { ASSETS_COORDINATES, PLAY_SCENE_KEY } from "../utils/const";

import Bugs from "../actors/bugs";
import Octocat from "../actors/octocat";
import Bullets from "../actors/bullets";

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: PLAY_SCENE_KEY,
    });
  }

  create() {
    this.add.sprite(
      ASSETS_COORDINATES.BATTLEGROUND.x,
      ASSETS_COORDINATES.BATTLEGROUND.y,
      "atlas",
      "battleground",
    );

    this.bugs = new Bugs();
    this.bullets = new Bullets();
    this.octocat = new Octocat();
  }

  update() {}
}
