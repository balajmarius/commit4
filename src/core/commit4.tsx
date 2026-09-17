import { Suspense } from "react";

import { useGame } from "@/context/game";

import { Scene } from "@/core/scene";

export const Commit4 = () => {
  const { handleStart } = useGame();

  return (
    <div className="relative mx-auto my-8 flex h-235 w-166 items-start justify-center after:absolute after:inset-0 after:bg-case after:bg-no-repeat after:drop-shadow-xl">
      <div className="relative mt-23 h-75 w-100 bg-lcd after:absolute after:inset-0 after:bg-screen after:bg-no-repeat">
        <Suspense>
          <Scene />
        </Suspense>
      </div>

      <button
        type="button"
        className="absolute top-133 left-47.5 z-10 h-19 w-14 cursor-pointer bg-button bg-no-repeat opacity-0 outline-none active:opacity-100"
        onClick={handleStart}
      />
    </div>
  );
};
