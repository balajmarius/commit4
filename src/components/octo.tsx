import { useGame } from "@/context/game";
import { useAtlas } from "@/hooks/useAtlas";

import { ACTOR_CELL_LAST, SPRITE_ALPHA_ACTIVE, SPRITE_ALPHA_DISABLED } from "@/utils/const";

const OCTO_LANES = [
  {
    x: 62,
    y: 247,
    body: "octo/body/0",
    tentacles: "octo/tentacles/0",
    blast: "octo/blast/0",
    blastX: -1,
    blastY: -37,
  },
  {
    x: 162,
    y: 247,
    body: "octo/body/1",
    tentacles: "octo/tentacles/1",
    blast: "octo/blast/1",
    blastX: -23,
    blastY: -30,
  },
  {
    x: 242,
    y: 247,
    body: "octo/body/2",
    tentacles: "octo/tentacles/2",
    blast: "octo/blast/2",
    blastX: -26,
    blastY: -36,
  },
  {
    x: 300,
    y: 247,
    body: "octo/body/3",
    tentacles: "octo/tentacles/3",
    blast: "octo/blast/3",
    blastX: 1,
    blastY: -31,
  },
] as const;

export const Octo = () => {
  const { textures } = useAtlas();
  const { playerLaneIndex, laneStates, firingLaneIndex, gameState } = useGame();

  const isActive = gameState !== "off";
  const blast = laneStates.findIndex((laneState) => {
    return laneState.bug > ACTOR_CELL_LAST;
  });

  return (
    <pixiContainer>
      {OCTO_LANES.map((cell, index) => {
        return (
          <pixiContainer key={cell.body} x={cell.x} y={cell.y}>
            <pixiSprite
              texture={textures[cell.blast]}
              x={cell.blastX}
              y={cell.blastY}
              alpha={index === blast ? SPRITE_ALPHA_ACTIVE : SPRITE_ALPHA_DISABLED}
            />
            <pixiSprite
              texture={textures[cell.tentacles]}
              alpha={index === firingLaneIndex ? SPRITE_ALPHA_ACTIVE : SPRITE_ALPHA_DISABLED}
            />
            <pixiSprite
              texture={textures[cell.body]}
              alpha={isActive && index === playerLaneIndex ? SPRITE_ALPHA_ACTIVE : SPRITE_ALPHA_DISABLED}
            />
          </pixiContainer>
        );
      })}
    </pixiContainer>
  );
};
