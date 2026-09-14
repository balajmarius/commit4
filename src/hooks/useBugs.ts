import { useEffect, useRef, useState } from "react";
import { difference, sample, without, head } from "es-toolkit";

import {
  ACTOR_LANES,
  ACTOR_CELL_IDLE,
  ACTOR_CELL_OFFSET,
  ACTOR_CELL_LAST,
  BUG_EXPLOSION_MS,
} from "@/utils/const";

export const useBugs = () => {
  const queue = useRef<readonly number[]>([]);

  const [cells, setCells] = useState(() => {
    return Array.from(ACTOR_LANES).fill(ACTOR_CELL_IDLE);
  });

  const [explosions, setExplosions] = useState(() => {
    return Array.from(ACTOR_LANES).fill(ACTOR_CELL_IDLE);
  });

  const remove = (lane: number) => {
    queue.current = without(queue.current, lane);

    setExplosions((current) => {
      return current.map((cell, index) => {
        if (index === lane) {
          return cells[lane];
        }
        return cell;
      });
    });

    setCells((current) => {
      return current.map((cell, index) => {
        if (index === lane) {
          return ACTOR_CELL_IDLE;
        }
        return cell;
      });
    });
  };

  useEffect(() => {
    if (explosions.every((cell) => cell === ACTOR_CELL_IDLE)) {
      return;
    }

    const timeout = setTimeout(() => {
      setExplosions(Array.from(ACTOR_LANES).fill(ACTOR_CELL_IDLE));
    }, BUG_EXPLOSION_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [explosions]);

  const step = () => {
    const available = difference(ACTOR_LANES, queue.current).filter((lane) => {
      return explosions[lane] === ACTOR_CELL_IDLE;
    });
    const lane = sample(available) ?? head(queue.current);

    if (lane === undefined) {
      return;
    }

    queue.current = [...without(queue.current, lane), lane];

    setCells((current) => {
      if (current[lane] >= ACTOR_CELL_LAST) {
        return current;
      }
      return current.map((cell, index) => {
        if (index === lane) {
          return cell + ACTOR_CELL_OFFSET;
        }
        return cell;
      });
    });
  };

  return { cells, explosions, remove, step };
};
