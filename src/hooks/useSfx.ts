import { Howl } from "howler";

import die from "@/static/sounds/die.mp3?url";
import hit from "@/static/sounds/hit.mp3?url";
import tick from "@/static/sounds/tick.mp3?url";
import keyPress from "@/static/sounds/keyPress.mp3?url";

const SFX = {
  "bug/hit": new Howl({ src: [hit] }),
  "octo/die": new Howl({ src: [die] }),
  "game/tick": new Howl({ src: [tick] }),
  "game/keyPress": new Howl({ src: [keyPress] }),
} as const;

export type Sfx = keyof typeof SFX;

const play = (sfx: Sfx) => {
  SFX[sfx].play();
};

export const useSfx = () => {
  return { play };
};
