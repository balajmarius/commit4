import { useRef, useState } from "react";
import { union } from "es-toolkit";

import { ACTOR_LANES, ACTOR_CELL_IDLE, ACTOR_CELL_OFFSET, ACTOR_CELL_LAST } from "@/utils/const";

export const useBullets = () => {
  const pending = useRef<readonly number[]>([]);
  const hits = useRef<readonly number[]>([]);

  const [cells, setCells] = useState(() => {
    return Array.from(ACTOR_LANES).fill(ACTOR_CELL_IDLE);
  });

  const fire = (lane: number) => {
    if (cells[lane] === ACTOR_CELL_IDLE) {
      pending.current = union(pending.current, [lane]);
    }
  };

  const step = (bugs: number[]) => {
    const next = cells.map((cell, lane) => {
      if (hits.current.includes(lane)) {
        return ACTOR_CELL_IDLE;
      }
      if (pending.current.includes(lane)) {
        return ACTOR_CELL_LAST;
      }
      return Math.max(ACTOR_CELL_IDLE, cell - ACTOR_CELL_OFFSET);
    });

    pending.current = [];

    hits.current = ACTOR_LANES.filter((lane) => {
      if (next[lane] === ACTOR_CELL_IDLE || bugs[lane] === ACTOR_CELL_IDLE) {
        return false;
      }
      return bugs[lane] === next[lane] || bugs[lane] === next[lane] + ACTOR_CELL_OFFSET;
    });

    setCells(
      next.map((cell, lane) => {
        if (hits.current.includes(lane)) {
          return bugs[lane];
        }
        return cell;
      }),
    );

    return hits.current;
  };

  return { cells, fire, step };
};
