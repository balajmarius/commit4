import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { useCounter, useEventCallback, useEventListener } from "usehooks-ts";
import { isNil, isNotNil, negate, randomInt } from "es-toolkit";

import { ACTOR_CELL_IDLE, ACTOR_CELL_OFFSET, ACTOR_CELL_LAST, BUG_EXPLOSION_MS } from "@/utils/const";

import { useSfx } from "@/hooks/useSfx";

type GameState = "off" | "on" | "dead";

type LaneState = {
  bug: number;
  bullet: number;
  collision: { cell: number; startedAt: number } | null;
};

type GameValue = {
  gameState: GameState;
  fireLane: number | null;
  lane: number;
  lanes: LaneState[];
  score: number;
  handleStart: () => void;
};

type GameProviderProps = {
  children: ReactNode;
};

const OCTO_LANE_FIRST = 0;
const OCTO_LANE_LAST = 3;
const OCTO_LANE_OFFSET = 1;

const BUG_TICK_MS = 500;
const BULLET_TICK_MS = 200;

const GAME_TICK_START = 0;
const GAME_CONTROL_KEYS = ["Space", "Enter", "ArrowLeft", "ArrowRight"];

const GAME_LANES: LaneState[] = [
  { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collision: null },
  { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collision: null },
  { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collision: null },
  { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collision: null },
];

const GameContext = createContext<GameValue | null>(null);

export const GameProvider = ({ children }: GameProviderProps) => {
  const frame = useRef<number | null>(null);
  const fireEndsAt = useRef<number | null>(null);
  const startedAt = useRef(GAME_TICK_START);
  const lastBugTick = useRef(GAME_TICK_START);
  const lastBulletTick = useRef(GAME_TICK_START);

  const { play } = useSfx();
  const { count, increment, reset } = useCounter();

  const [lanes, setLanes] = useState(GAME_LANES);
  const [gameState, setGameState] = useState<GameState>("off");
  const [lane, setLane] = useState(OCTO_LANE_FIRST);
  const [fireLane, setFireLane] = useState<number | null>(null);

  const handleStart = () => {
    if (gameState === "on") {
      setGameState("off");
    } else {
      setGameState("on");
    }

    reset();
    setFireLane(null);
    setLane(OCTO_LANE_FIRST);
    setLanes(GAME_LANES);
    play("game/keyPress");

    fireEndsAt.current = null;
    startedAt.current = performance.now();
    lastBugTick.current = GAME_TICK_START;
    lastBulletTick.current = GAME_TICK_START;
  };

  const handleBugs = useEventCallback(() => {
    const laneIndex = randomInt(lanes.length);
    const laneState = lanes[laneIndex];

    if (isNotNil(laneState.collision)) {
      return;
    }
    // Keep an overlap in place until
    // the bullet tick registers the impact.
    if (laneState.bullet !== ACTOR_CELL_IDLE && laneState.bug === laneState.bullet) {
      return;
    }

    const bug = laneState.bug + ACTOR_CELL_OFFSET;

    setLanes((current) => {
      return current.map((laneState, index) => {
        if (index === laneIndex) {
          return { ...laneState, bug };
        }
        return laneState;
      });
    });

    if (bug > ACTOR_CELL_LAST) {
      play("octo/die");
      setGameState("dead");
      // Stop the game when
      // the bug moves past the last cell.
      frame.current = null;
    }
  });

  const handleBullets = useCallback(
    (startedAt: number) => {
      setLanes((current) => {
        return current.map((laneState) => {
          if (laneState.bullet === ACTOR_CELL_IDLE) {
            return laneState;
          }
          // Keep the impact visible for
          // one bullet tick before removing the shot.
          if (isNotNil(laneState.collision)) {
            return { ...laneState, bullet: ACTOR_CELL_IDLE };
          }

          const bullet = laneState.bullet - ACTOR_CELL_OFFSET;
          const isCollided = laneState.bug === laneState.bullet || laneState.bug === bullet;

          if (laneState.bug !== ACTOR_CELL_IDLE && isCollided) {
            increment();
            play("bug/hit");
            // Keep the bullet at impact
            // and record when the explosion started.
            return { ...laneState, bullet: laneState.bug, collision: { cell: laneState.bug, startedAt } };
          }
          return { ...laneState, bullet };
        });
      });
    },
    [play, increment],
  );

  const handleCollisions = useCallback((now: number) => {
    const isExpired = ({ collision }: LaneState) => {
      return isNotNil(collision) && now - collision.startedAt >= BUG_EXPLOSION_MS;
    };

    setLanes((current) => {
      if (current.every(negate(isExpired))) {
        return current;
      }
      return current.map((laneState) => {
        if (isExpired(laneState)) {
          return { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collision: null };
        }
        return laneState;
      });
    });
  }, []);

  const handleFire = () => {
    if (lanes[lane].bullet !== ACTOR_CELL_IDLE || isNotNil(lanes[lane].collision)) {
      return;
    }

    setFireLane(lane);
    fireEndsAt.current = performance.now() + BUG_TICK_MS;

    setLanes((current) => {
      return current.map((laneState, index) => {
        if (index === lane) {
          return { ...laneState, bullet: ACTOR_CELL_LAST };
        }
        return laneState;
      });
    });
  };

  const handleMoveLeft = () => {
    setLane((current) => {
      return Math.max(OCTO_LANE_FIRST, current - OCTO_LANE_OFFSET);
    });
  };

  const handleMoveRight = () => {
    setLane((current) => {
      return Math.min(OCTO_LANE_LAST, current + OCTO_LANE_OFFSET);
    });
  };

  useEventListener("keydown", (event) => {
    const isNotControlKey = GAME_CONTROL_KEYS.every((key) => {
      return key !== event.code;
    });

    if (isNotControlKey) {
      return;
    }

    event.preventDefault();

    if (event.repeat) {
      return;
    }
    if (event.code === "Enter") {
      handleStart();
      return;
    }
    if (gameState !== "on") {
      return;
    }

    setFireLane(null);
    play("game/keyPress");

    fireEndsAt.current = null;

    if (event.code === "Space") {
      handleFire();
    }
    if (event.code === "ArrowLeft") {
      handleMoveLeft();
    }
    if (event.code === "ArrowRight") {
      handleMoveRight();
    }
  });

  useEffect(() => {
    if (gameState !== "on") {
      return;
    }

    const update = (now: number) => {
      const bugTick = Math.floor((now - startedAt.current) / BUG_TICK_MS);
      const bulletTick = Math.floor((now - startedAt.current) / BULLET_TICK_MS);

      if (isNotNil(fireEndsAt.current) && now >= fireEndsAt.current) {
        setFireLane(null);
        fireEndsAt.current = null;
      }

      handleCollisions(now);

      // Keep a fixed order when
      // both movements fall on the same frame.
      if (bugTick > lastBugTick.current) {
        handleBugs();
        lastBugTick.current = bugTick;
      }
      if (isNil(frame.current)) {
        return;
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
  }, [gameState, handleBugs, handleBullets, handleCollisions]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        fireLane,
        lane,
        lanes,
        score: count,
        handleStart,
        handleMoveLeft,
        handleMoveRight,
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
