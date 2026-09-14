import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

import { isNil } from "es-toolkit";
import { useCounter, useEventListener } from "usehooks-ts";

import { useSfx } from "@/hooks/useSfx";
import { useBugs } from "@/hooks/useBugs";
import { useBullets } from "@/hooks/useBullets";

import { ACTOR_LANES, ACTOR_CELL_IDLE } from "@/utils/const";

type GameState = "stop" | "play" | "dead";

type GameValue = {
  bugs: number[];
  bullets: number[];
  lane: number;
  score: number;
  status: GameState;
};

type GameProviderProps = {
  children: ReactNode;
};

const OCTO_LANE_FIRST = 0;
const OCTO_LANE_LAST = 3;
const OCTO_LANE_OFFSET = 1;

const BUGS_TICK_MS = 500;
const BULLET_TICK_MS = 300;
const GAME_CONTROL_KEYS = ["Space", "ArrowLeft", "ArrowRight"];

const GameContext = createContext<GameValue | null>(null);

export const GameProvider = ({ children }: GameProviderProps) => {
  const sfx = useSfx();
  const score = useCounter();

  const bugs = useBugs();
  const bullets = useBullets();

  const [lane, setLane] = useState(OCTO_LANE_FIRST);
  const [status, setStatus] = useState<GameState>("stop");

  useEventListener("keydown", (event) => {
    event.preventDefault();

    if (event.repeat) {
      return;
    }

    // Handheld click for every game key.
    // Space, left, and right share this press sound.
    if (GAME_CONTROL_KEYS.includes(event.code)) {
      if (status === "stop") {
        setStatus("play");
      }
      sfx.play("game/keyPress");
    }

    // Move the octo one lane to the left.
    // Stay on the first lane if there is no further cell.
    if (event.code === "ArrowLeft") {
      setLane((current) => {
        return Math.max(OCTO_LANE_FIRST, current - OCTO_LANE_OFFSET);
      });
    }
    // Move the octo one lane to the right.
    // Stay on the last lane if there is no further cell.
    if (event.code === "ArrowRight") {
      setLane((current) => {
        return Math.min(OCTO_LANE_LAST, current + OCTO_LANE_OFFSET);
      });
    }

    if (event.code === "Space") {
      bullets.spawn(lane);
    }
  });

  useEffect(() => {
    if (status !== "play") {
      return;
    }

    const bugsInterval = setInterval(() => {
      bugs.step();
      sfx.play("game/tick");
    }, BUGS_TICK_MS);

    const bulletsInterval = setInterval(() => {
      bullets.step();
    }, BULLET_TICK_MS);

    return () => {
      clearInterval(bugsInterval);
      clearInterval(bulletsInterval);
    };
  }, [status]);

  return (
    <GameContext.Provider
      value={{
        lane,
        status,
        score: score.count,
        bugs: bugs.cells,
        bullets: bullets.cells,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const value = useContext(GameContext);

  if (isNil(value)) {
    throw new Error("useGame must be used within GameProvider.");
  }

  return value;
};
