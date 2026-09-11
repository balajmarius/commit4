import { useRef, useState } from "react";
import { difference, sample, without, head } from "es-toolkit";

import { ACTOR_LANES, ACTOR_CELL_IDLE, ACTOR_CELL_OFFSET, ACTOR_CELL_LAST } from "@/utils/const";

export const useBugs = () => {
  const queue = useRef<readonly number[]>([]);

  const [cells, setCells] = useState(() => {
    return Array.from(ACTOR_LANES).fill(ACTOR_CELL_IDLE);
  });

  const step = () => {
    const available = difference(ACTOR_LANES, queue.current);
    const lane = sample(available) ?? head(queue.current);

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

  return { cells, step };
};
