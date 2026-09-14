import { Suspense } from "react";

import { Scene } from "@/core/scene";

export const Commit4 = () => {
  return (
    <div className="relative mx-auto my-8 flex h-screen w-166 items-start justify-center after:absolute after:inset-0 after:bg-case after:bg-no-repeat after:drop-shadow-xl">
      <div className="relative mt-23 after:absolute after:inset-0 after:bg-screen after:bg-no-repeat">
        <Suspense>
          <Scene />
        </Suspense>
      </div>
    </div>
  );
};
