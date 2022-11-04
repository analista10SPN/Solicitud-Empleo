// src/server/router/_app.ts
import { router } from "../trpc";

import { formOptionsRouter } from "./formOptionsRouter";

export const appRouter = router({
  formOptions: formOptionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
