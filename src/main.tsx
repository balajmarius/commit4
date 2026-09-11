import { isNil } from "es-toolkit";
import { createRoot } from "react-dom/client";

import { Commit4 } from "@/core/commit4";

console.log(`
        __
    ___( o)>
    \\ <_. )   For Adi,
     \`---'

  You gave me the passion for making retro games.
  You will never be forgotten.
`);

const mount = document.getElementById("root");

if (isNil(mount)) {
  throw new Error("Root is missing.");
}

createRoot(mount).render(<Commit4 />);
