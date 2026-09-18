import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useIntersectionObserver } from "usehooks-ts";

import { useGame } from "@/context/game";

import { Scene } from "@/core/scene";
import { Layout } from "@/core/layout";

export const Commit4 = () => {
  const { t } = useTranslation();
  const { ref, entry } = useIntersectionObserver();

  const { handleStart } = useGame();

  const isCaseClip = Boolean(entry?.rootBounds && entry.boundingClientRect.top > entry.rootBounds.bottom);

  return (
    <Layout>
      <div className="@container relative mx-auto aspect-166/235 w-full max-w-166">
        <div className="absolute top-0 left-0 flex h-235 w-166 origin-top-left scale-[calc(100cqw/41.5rem)] justify-center after:absolute after:inset-0 after:bg-case after:bg-no-repeat after:drop-shadow-xl">
          <div className="relative mt-23 h-75 w-100 bg-lcd after:absolute after:inset-0 after:bg-screen">
            <Suspense>
              <Scene />
            </Suspense>
          </div>

          <button
            type="button"
            aria-label={t("game.start")}
            className="absolute top-133 left-47.5 z-10 h-19 w-14 cursor-pointer bg-button opacity-0 outline-none active:opacity-100"
            onClick={handleStart}
          />
        </div>

        <div ref={ref} aria-hidden="true" className="pointer-events-none absolute bottom-0 h-px w-full" />

        {isCaseClip ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
            <div className="fixed inset-x-0 bottom-0 h-24 bg-linear-to-t from-white via-white/30 to-transparent" />
          </div>
        ) : null}
      </div>
    </Layout>
  );
};
