import { useState } from "react";

import { ACTOR_LANES, ACTOR_CELL_IDLE, ACTOR_CELL_OFFSET, ACTOR_CELL_LAST } from "@/utils/const";

export const useBullets = () => {
  const [cells, setCells] = useState(() => {
    return Array.from(ACTOR_LANES).fill(ACTOR_CELL_IDLE);
  });

  const fire = (lane: number) => {
    setCells((current) => {
      if (current[lane] !== ACTOR_CELL_IDLE) {
        return current;
      }
      return current.map((cell, index) => {
        if (index === lane) {
          return ACTOR_CELL_LAST;
        }
        return cell;
      });
    });
  };

  const step = () => {
    setCells((current) => {
      return current.map((cell) => {
        return Math.max(ACTOR_CELL_IDLE, cell - ACTOR_CELL_OFFSET);
      });
    });
  };

  return { cells, fire, step };
};
