import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useCounter, useEventListener } from "usehooks-ts";
import { isNil, isNotNil, negate, randomInt } from "es-toolkit";

import {
  ACTOR_CELL_IDLE,
  ACTOR_CELL_OFFSET,
  ACTOR_CELL_LAST,
  BUG_EXPLOSION_MS,
} from "@/utils/const";

import { useSfx } from "@/hooks/useSfx";

type LaneState = {
  bug: number;
  bullet: number;
  collision: { cell: number; startedAt: number } | null;
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
const GAME_TICK_START_MS = 0;
const GAME_CONTROL_KEYS = ["Space", "ArrowLeft", "ArrowRight"];

const GameContext = createContext<GameValue | null>(null);

export const GameProvider = ({ children }: GameProviderProps) => {
  const { play } = useSfx();
  const { count, increment } = useCounter();

  const frame = useRef<number | null>(null);
  const lastBugTick = useRef(GAME_TICK_START_MS);
  const lastBulletTick = useRef(GAME_TICK_START_MS);

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
        if (index !== lane || isNotNil(actor.collision)) {
          return actor;
        }
        // Keep an overlap in place until
        // the bullet tick registers the impact.
        if (actor.bullet !== ACTOR_CELL_IDLE && actor.bug === actor.bullet) {
          return actor;
        }
        return { ...actor, bug: actor.bug + ACTOR_CELL_OFFSET };
      });
    });
  }, [lanes.length]);

  const handleBullets = useCallback((startedAt: number) => {
    setLanes((current) => {
      return current.map((actor) => {
        if (actor.bullet === ACTOR_CELL_IDLE) {
          return actor;
        }
        // Keep the impact visible for
        // one bullet tick before removing the shot.
        if (isNotNil(actor.collision)) {
          return { ...actor, bullet: ACTOR_CELL_IDLE };
        }

        const bullet = actor.bullet - ACTOR_CELL_OFFSET;
        const isCollision = actor.bug === actor.bullet || actor.bug === bullet;

        if (actor.bug !== ACTOR_CELL_IDLE && isCollision) {
          increment();
          play("bug/hit");
          // Keep the bullet at impact
          // and record when the explosion started.
          return {
            ...actor,
            bullet: actor.bug,
            collision: { cell: actor.bug, startedAt },
          };
        }
        return { ...actor, bullet };
      });
    });
  }, [play, increment]);

  const handleCollisions = useCallback((now: number) => {
    const isExpired = ({ collision }: LaneState) => {
      return (
        isNotNil(collision) && now - collision.startedAt >= BUG_EXPLOSION_MS
      );
    };

    setLanes((current) => {
      if (current.every(negate(isExpired))) {
        return current;
      }
      return current.map((actor) => {
        if (isExpired(actor)) {
          return {
            bug: ACTOR_CELL_IDLE,
            bullet: ACTOR_CELL_IDLE,
            collision: null,
          };
        }
        return actor;
      });
    });
  }, []);

  const handleFire = () => {
    setLanes((current) => {
      return current.map((actor, index) => {
        if (
          index === lane &&
          actor.bullet === ACTOR_CELL_IDLE &&
          isNil(actor.collision)
        ) {
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
      play("game/keyPress");
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
    const startedAt = performance.now();

    lastBugTick.current = GAME_TICK_START_MS;
    lastBulletTick.current = GAME_TICK_START_MS;

    const update = (now: number) => {
      const bugTick = Math.floor((now - startedAt) / BUG_TICK_MS);
      const bulletTick = Math.floor((now - startedAt) / BULLET_TICK_MS);

      handleCollisions(now);

      // Keep a fixed order when
      // both movements fall on the same frame.
      if (bugTick > lastBugTick.current) {
        handleBugs();
        lastBugTick.current = bugTick;
      }
      if (bulletTick > lastBulletTick.current) {
        handleBullets(now);
        lastBulletTick.current = bulletTick;
      }

      frame.current = requestAnimationFrame(update);
    };

    frame.current = requestAnimationFrame(update);

    return () => {
      if (isNotNil(frame.current)) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
    };
  }, [handleBugs, handleBullets, handleCollisions]);

  return (
    <GameContext.Provider
      value={{
        lane,
        lanes,
        score: count,
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
