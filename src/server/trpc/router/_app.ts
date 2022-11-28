// src/server/router/_app.ts
import { router } from "../trpc";

import { formOptionsRouter } from "./formOptionsRouter";
import { solicitudEmpleoPostRouter } from './postRouter';

export const appRouter = router({
  formOptions: formOptionsRouter,
  solicitudEmpleoPost:solicitudEmpleoPostRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
