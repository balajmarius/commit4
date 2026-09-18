import "@/i18n";

import { isNil } from "es-toolkit";
import { createRoot } from "react-dom/client";

import { GameProvider } from "@/context/game";
import { Commit4 } from "@/core/commit4";

console.log(`
        __
    ___( o)>
    \\ <_. )   For Adi.
     \`---'
`);

const mount = document.getElementById("root");

if (isNil(mount)) {
  throw new Error("Root is missing.");
}

createRoot(mount).render(
  <GameProvider>
    <Commit4 />
  </GameProvider>,
);
