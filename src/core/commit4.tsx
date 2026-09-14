import { Suspense } from "react";

import { Scene } from "@/core/scene";

export const Commit4 = () => {
  return (
    <div className="relative mx-auto flex min-h-screen w-3xl items-start justify-center after:absolute after:inset-0 after:bg-case after:bg-no-repeat">
      <div className="relative mt-33 after:absolute after:inset-0 after:bg-screen after:bg-no-repeat">
        <Suspense>
          <Scene />
        </Suspense>
      </div>
    </div>
  );
};
