import Phaser from "phaser";

import { GAME_WIDTH, GAME_HEIGHT, GAME_TITLE, GAME_PARENT } from "./utils/const";

import PlayScene from "./scenes/play";
import BootScene from "./scenes/boot";

function DOMContentLoaded() {
  return new Phaser.Game({
    title: GAME_TITLE,
    parent: GAME_PARENT,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    type: Phaser.AUTO,
    scene: [BootScene, PlayScene],
  });
}

document.addEventListener("DOMContentLoaded", DOMContentLoaded);
