import { Suspense } from "react";

import { useGame } from "@/context/game";

import { Scene } from "@/core/scene";

export const Commit4 = () => {
  const { handleStart } = useGame();

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 font-sans text-ink antialiased sm:px-12 sm:py-16 xl:grid-cols-[minmax(0,1fr)_41.5rem] xl:gap-16">
      <header className="mx-auto w-full max-w-166 self-start xl:sticky xl:top-16 xl:mx-0 xl:pt-16">
        <h1 className="text-3xl leading-tight font-normal tracking-tight text-balance">COMMIT4</h1>
        <p className="mt-5 max-w-130 text-base leading-relaxed text-pretty">
          A throwback to classic LCD games, built for GitHub Game Off 2017. Winner of{" "}
          <a
            href="https://github.blog/open-source/gaming/game-off-2017-winners/"
            className="whitespace-nowrap text-link underline decoration-link/30 underline-offset-4 hover:decoration-link"
          >
            Best Theme Interpretation
          </a>
          .
        </p>
        <p className="mt-5 max-w-130 text-base leading-relaxed text-pretty">
          Click Start/On or press Enter to start. Move with the left and right arrow keys, and press Space to
          commit.
        </p>
        <a
          href="https://github.com/balajmarius/commit4"
          className="mt-5 inline-flex items-center gap-2 font-serif text-lg font-medium text-link italic underline decoration-link/30 underline-offset-4 hover:decoration-link"
        >
          Star on GitHub <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="relative mx-auto flex h-235 w-166 items-start justify-center after:absolute after:inset-0 after:bg-case after:bg-no-repeat after:drop-shadow-xl">
        <div className="relative mt-23 h-75 w-100 bg-lcd bg-no-repeat after:absolute after:inset-0 after:bg-screen after:bg-no-repeat">
          <Suspense>
            <Scene />
          </Suspense>
        </div>

        <button
          type="button"
          aria-label="Start/On"
          className="absolute top-133 left-47.5 z-10 h-19 w-14 cursor-pointer bg-button bg-no-repeat opacity-0 outline-none active:opacity-100"
          onClick={handleStart}
        />
      </div>
    </main>
  );
};
