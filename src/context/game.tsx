import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { useCounter, useEventCallback, useEventListener } from "usehooks-ts";
import { clamp, isNil, isNotNil, negate, randomInt } from "es-toolkit";
import { Howl } from "howler";

import die from "@/static/sounds/die.mp3?url";
import hit from "@/static/sounds/hit.mp3?url";
import tick from "@/static/sounds/tick.mp3?url";
import press from "@/static/sounds/press.mp3?url";

import { ACTOR_CELL_IDLE, ACTOR_CELL_OFFSET, ACTOR_CELL_LAST, BUG_EXPLOSION_MS } from "@/utils/const";

type GameState = "off" | "on" | "dead";

type LaneState = {
  bug: number;
  bullet: number;
  collisionAt: number | null;
};

type GameValue = {
  gameState: GameState;
  firingLaneIndex: number | null;
  playerLaneIndex: number;
  laneStates: LaneState[];
  score: number;
  handleStart: () => void;
  handleFire: () => void;
  handleMoveLeft: () => void;
  handleMoveRight: () => void;
};

type GameProviderProps = {
  children: ReactNode;
};

const OCTO_LANE_FIRST = 0;
const OCTO_LANE_LAST = 3;
const OCTO_LANE_OFFSET = 1;

const BUG_TICK_MS = 500;
const BULLET_TICK_MS = 200;

const GAME_LANES: LaneState[] = [
  { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collisionAt: null },
  { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collisionAt: null },
  { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collisionAt: null },
  { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collisionAt: null },
];
const GAME_TICK_START = 0;

const sounds = {
  hit: new Howl({ src: [hit] }),
  die: new Howl({ src: [die] }),
  tick: new Howl({ src: [tick] }),
  press: new Howl({ src: [press] }),
} as const;

const GameContext = createContext<GameValue | null>(null);

export const GameProvider = ({ children }: GameProviderProps) => {
  const frame = useRef<number | null>(null);
  const firingEndsAt = useRef<number | null>(null);
  const startedAt = useRef(GAME_TICK_START);
  const lastBugTick = useRef(GAME_TICK_START);
  const lastBulletTick = useRef(GAME_TICK_START);
  const previousCollisionsAt = useRef<(number | null)[]>([]);

  const { count, increment, reset } = useCounter();

  const [laneStates, setLaneStates] = useState(GAME_LANES);
  const [gameState, setGameState] = useState<GameState>("off");
  const [playerLaneIndex, setPlayerLaneIndex] = useState(OCTO_LANE_FIRST);
  const [firingLaneIndex, setFiringLaneIndex] = useState<number | null>(null);

  const handleStart = () => {
    if (gameState === "on") {
      setGameState("off");
    } else {
      setGameState("on");
    }

    reset();
    sounds.press.play();

    setFiringLaneIndex(null);
    setPlayerLaneIndex(OCTO_LANE_FIRST);
    setLaneStates(GAME_LANES);

    firingEndsAt.current = null;
    startedAt.current = performance.now();
    lastBugTick.current = GAME_TICK_START;
    lastBulletTick.current = GAME_TICK_START;
  };

  const handleBugs = useEventCallback(() => {
    const laneIndex = randomInt(laneStates.length);
    const laneState = laneStates[laneIndex];

    if (isNotNil(laneState.collisionAt)) {
      return;
    }
    // Keep an overlap in place until
    // the bullet tick registers the impact.
    if (laneState.bullet !== ACTOR_CELL_IDLE && laneState.bug === laneState.bullet) {
      return;
    }

    const bug = laneState.bug + ACTOR_CELL_OFFSET;

    setLaneStates((current) => {
      return current.map((laneState, index) => {
        if (index === laneIndex) {
          return { ...laneState, bug };
        }
        return laneState;
      });
    });

    if (bug > ACTOR_CELL_LAST) {
      sounds.die.play();
      setGameState("dead");
      // Stop the game when
      // the bug moves past the last cell.
      frame.current = null;
    }
  });

  const handleBullets = useCallback((now: number) => {
    setLaneStates((current) => {
      const canSkipUpdate = current.every((actor) => {
        return actor.bullet === ACTOR_CELL_IDLE;
      });

      if (canSkipUpdate) {
        return current;
      }

      return current.map((laneState) => {
        if (laneState.bullet === ACTOR_CELL_IDLE) {
          return laneState;
        }
        // Keep the impact visible for
        // one bullet tick before removing the shot.
        if (isNotNil(laneState.collisionAt)) {
          return { ...laneState, bullet: ACTOR_CELL_IDLE };
        }

        const bullet = laneState.bullet - ACTOR_CELL_OFFSET;
        const isCollided = laneState.bug === laneState.bullet || laneState.bug === bullet;

        if (laneState.bug !== ACTOR_CELL_IDLE && isCollided) {
          // Keep the bullet at impact
          // and record when the explosion started.
          return { ...laneState, bullet: laneState.bug, collisionAt: now };
        }
        return { ...laneState, bullet };
      });
    });
  }, []);

  const handleCollisionsCleanup = useCallback((now: number) => {
    const isExpired = ({ collisionAt }: LaneState) => {
      return isNotNil(collisionAt) && now - collisionAt >= BUG_EXPLOSION_MS;
    };

    setLaneStates((current) => {
      if (current.every(negate(isExpired))) {
        return current;
      }
      return current.map((laneState) => {
        if (isExpired(laneState)) {
          return { bug: ACTOR_CELL_IDLE, bullet: ACTOR_CELL_IDLE, collisionAt: null };
        }
        return laneState;
      });
    });
  }, []);

  const handleFire = () => {
    const hasCollision = isNotNil(laneStates[playerLaneIndex].collisionAt);
    const hasBullet = laneStates[playerLaneIndex].bullet !== ACTOR_CELL_IDLE;

    sounds.press.play();

    if (gameState !== "on" || hasCollision || hasBullet) {
      return;
    }

    setFiringLaneIndex(playerLaneIndex);
    firingEndsAt.current = performance.now() + BUG_TICK_MS;

    setLaneStates((current) => {
      return current.map((laneState, index) => {
        if (index === playerLaneIndex) {
          return { ...laneState, bullet: ACTOR_CELL_LAST };
        }
        return laneState;
      });
    });
  };

  const handleMove = (offset: number) => {
    sounds.press.play();

    if (gameState !== "on") {
      return;
    }

    setFiringLaneIndex(null);
    firingEndsAt.current = null;

    setPlayerLaneIndex((current) => {
      return clamp(current + offset, OCTO_LANE_FIRST, OCTO_LANE_LAST);
    });
  };

  const handleMoveLeft = () => {
    handleMove(-OCTO_LANE_OFFSET);
  };

  const handleMoveRight = () => {
    handleMove(OCTO_LANE_OFFSET);
  };

  useEventListener("keydown", (event) => {
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
    if (event.code === "Space") {
      event.preventDefault();
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
    laneStates.forEach((actor, index) => {
      const isNewCollision =
        isNotNil(actor.collisionAt) && actor.collisionAt !== previousCollisionsAt.current[index];

      if (isNewCollision) {
        increment();
        sounds.hit.play();
      }
    });

    previousCollisionsAt.current = laneStates.map((actor) => {
      return actor.collisionAt;
    });
  }, [laneStates, increment]);

  useEffect(() => {
    if (gameState !== "on") {
      return;
    }

    const update = (now: number) => {
      const bugTick = Math.floor((now - startedAt.current) / BUG_TICK_MS);
      const bulletTick = Math.floor((now - startedAt.current) / BULLET_TICK_MS);

      if (isNotNil(firingEndsAt.current) && now >= firingEndsAt.current) {
        setFiringLaneIndex(null);
        firingEndsAt.current = null;
      }

      handleCollisionsCleanup(now);

      // Keep a fixed order when
      // both movements fall on the same frame.
      if (bugTick > lastBugTick.current) {
        handleBugs();
        sounds.tick.play();
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
  }, [gameState, handleBugs, handleBullets, handleCollisionsCleanup]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        firingLaneIndex,
        playerLaneIndex,
        laneStates,
        score: count,
        handleStart,
        handleFire,
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
