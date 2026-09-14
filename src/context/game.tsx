import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useCounter, useEventListener } from "usehooks-ts";
import { isNil, isNotNil, randomInt } from "es-toolkit";

import {
  ACTOR_CELL_IDLE,
  ACTOR_CELL_OFFSET,
  ACTOR_CELL_LAST,
} from "@/utils/const";

import { useSfx } from "@/hooks/useSfx";

type GameState = "stop" | "play" | "dead";

type LaneState = {
  bug: number;
  bullet: number;
  collision: number | null;
};

type GameValue = {
  lane: number;
  lanes: LaneState[];
  score: number;
};

type GameProviderProps = {
  children: ReactNode;
};

const OCTO_LANE_FIRST = 0;
const OCTO_LANE_LAST = 3;
const OCTO_LANE_OFFSET = 1;

const BUG_TICK_MS = 500;
const BULLET_TICK_MS = 200;

const GAME_CONTROL_KEYS = ["Space", "ArrowLeft", "ArrowRight"];

const GameContext = createContext<GameValue | null>(null);

export const GameProvider = ({ children }: GameProviderProps) => {
  const sfx = useSfx();
  const score = useCounter();

  const [lanes, setLanes] = useState<LaneState[]>([
    { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collision: null },
    { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collision: null },
    { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collision: null },
    { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collision: null },
  ]);

  const [lane, setLane] = useState(OCTO_LANE_FIRST);

  const handleBugs = useCallback(() => {
    const lane = randomInt(lanes.length);

    setLanes((current) => {
      return current.map((actor, index) => {
        if (isNotNil(actor.collision)) {
          return { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collision: null };
        }
        if (index === lane) {
          return { ...actor, bug: actor.bug + ACTOR_CELL_OFFSET };
        }
        return actor;
      });
    });
  }, [lanes.length]);

  const handleBullets = useCallback(() => {
    setLanes((current) => {
      return current.map((actor) => {
        if (actor.bullet === ACTOR_CELL_IDLE) {
          return actor;
        }
        // Remove the bullet
        // when it hits the bug.
        if (actor.bullet === actor.bug) {
          return { ...actor, bullet: ACTOR_CELL_IDLE, collision: actor.bullet };
        }
        return { ...actor, bullet: actor.bullet - ACTOR_CELL_OFFSET };
      });
    });
  }, []);

  const handleFire = () => {
    setLanes((current) => {
      return current.map((actor, index) => {
        if (index === lane && actor.bullet === ACTOR_CELL_IDLE) {
          return { ...actor, bullet: ACTOR_CELL_LAST };
        }
        return actor;
      });
    });
  };

  useEventListener("keydown", (event) => {
    event.preventDefault();

    if (event.repeat) {
      return;
    }

    // Handheld click for every game key.
    // Space, left, and right share this press sound.
    if (GAME_CONTROL_KEYS.includes(event.code)) {
      sfx.play("game/keyPress");
    }

    if (event.code === "Space") {
      handleFire();
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
  });

  useEffect(() => {
    const bugs = setInterval(handleBugs, BUG_TICK_MS);
    const bullets = setInterval(handleBullets, BULLET_TICK_MS);

    return () => {
      clearInterval(bugs);
      clearInterval(bullets);
    };
  }, [handleBugs, handleBullets]);

  return (
    <GameContext.Provider
      value={{
        lane,
        lanes,
        score: score.count,
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
