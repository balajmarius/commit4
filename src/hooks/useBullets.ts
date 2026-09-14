import { useRef, useState } from "react";
import { union } from "es-toolkit";

import { ACTOR_LANES, ACTOR_CELL_IDLE, ACTOR_CELL_OFFSET, ACTOR_CELL_LAST } from "@/utils/const";

export const useBullets = () => {
  const pending = useRef<number[]>([]);

  const [cells, setCells] = useState<number[]>(() => {
    return Array.from(ACTOR_LANES).fill(ACTOR_CELL_IDLE);
  });

  const spawn = (lane: number) => {
    if (cells[lane] === ACTOR_CELL_IDLE) {
      pending.current = union(pending.current, [lane]);
    }
  };

  const step = () => {
    // Keep this tick's shots:
    // React may run the state updater later.
    const queued = pending.current;
    // Accept new shots for the next tick
    // without changing the captured list.
    pending.current = [];

    setCells((current) => {
      return current.map((cell, lane) => {
        if (cell === ACTOR_CELL_IDLE && queued.includes(lane)) {
          return ACTOR_CELL_LAST;
        }
        return Math.max(ACTOR_CELL_IDLE, cell - ACTOR_CELL_OFFSET);
      });
    });
  };

  return { cells, spawn, step };
};
