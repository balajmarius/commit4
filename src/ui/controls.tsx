import { useTranslation } from "react-i18next";

import { useGame } from "@/context/game";

export const Controls = () => {
  const { t } = useTranslation();
  const { handleStart, handleMoveLeft, handleMoveRight, handleFire } = useGame();

  return (
    <>
      <button
        type="button"
        aria-label={t("game.moveLeft")}
        className="absolute top-128.75 left-17 z-10 h-26.25 w-18 cursor-pointer bg-button-left opacity-0 outline-none active:opacity-100"
        onClick={handleMoveLeft}
      />
      <button
        type="button"
        aria-label={t("game.start")}
        className="absolute top-133 left-47.5 z-10 h-19 w-14 cursor-pointer bg-button opacity-0 outline-none active:opacity-100"
        onClick={handleStart}
      />
      <button
        type="button"
        aria-label={t("game.commit")}
        className="absolute top-128.75 left-102.25 z-10 h-26.25 w-18 cursor-pointer bg-button-commit opacity-0 outline-none active:opacity-100"
        onClick={handleFire}
      />
      <button
        type="button"
        aria-label={t("game.moveRight")}
        className="absolute top-128.75 left-130.75 z-10 h-26.25 w-18 cursor-pointer bg-button-right opacity-0 outline-none active:opacity-100"
        onClick={handleMoveRight}
      />
    </>
  );
};
