import { Suspense } from "react";

import { Scene } from "@/core/scene";

export const Commit4 = () => {
  return (
    <div className="after:bg-screen after:bg-no-repeat after:absolute after:inset-0">
      <Suspense>
        <Scene />
      </Suspense>
    </div>
  );
};
