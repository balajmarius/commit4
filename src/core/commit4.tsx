import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { useGame } from "@/context/game";

import { Scene } from "@/core/scene";
import { Layout } from "@/core/layout";

export const Commit4 = () => {
  const { t } = useTranslation();
  const { handleStart } = useGame();

  return (
    <Layout>
      <div className="relative mx-auto flex h-235 w-166 justify-center after:absolute after:inset-0 after:bg-case after:bg-no-repeat after:drop-shadow-xl">
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
    </Layout>
  );
};
