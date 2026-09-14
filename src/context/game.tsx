import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react";

import { isNil } from "es-toolkit";
import { useCounter, useEventListener } from "usehooks-ts";

import { useSfx } from "@/hooks/useSfx";
import { useBugs } from "@/hooks/useBugs";
import { useBullets } from "@/hooks/useBullets";

type GameState = "stop" | "play" | "dead";

type GameValue = {
  bugs: number[];
  bullets: number[];
  explosions: number[];
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
  const game = useRef({ bugs, bullets, sfx, score });

  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const bulletInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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
    if (event.code === "Space" && status !== "dead") {
      bullets.fire(lane);
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
    game.current = { bugs, bullets, sfx, score };
  });

  useEffect(() => {
    if (status !== "play") {
      return;
    }

    // Play immediate tick sounds
    game.current.sfx.play("game/tick");

    interval.current = setInterval(() => {
      game.current.bugs.step();
      game.current.sfx.play("game/tick");
    }, BUGS_TICK_MS);

    bulletInterval.current = setInterval(() => {
      const { bugs, bullets, sfx, score } = game.current;
      const hits = bullets.step(bugs.cells);

      hits.forEach((lane) => {
        bugs.remove(lane);
        score.increment();
        sfx.play("bug/hit");
      });
    }, BULLET_TICK_MS);

    return () => {
      if (interval.current !== null) {
        clearInterval(interval.current);
        interval.current = null;
      }
      if (bulletInterval.current !== null) {
        clearInterval(bulletInterval.current);
        bulletInterval.current = null;
      }
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
        explosions: bugs.explosions,
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
