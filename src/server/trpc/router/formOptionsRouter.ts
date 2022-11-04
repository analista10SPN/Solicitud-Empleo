import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const formOptionsRouter = router({
  getAllNationalities: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.nacionalidades.findMany();
  }),
});
