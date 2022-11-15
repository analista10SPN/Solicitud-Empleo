import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const formOptionsRouter = router({
  getAllNationalities: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.nacionalidades.findMany();
  }),
  getAllCountries: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.paises.findMany();
  }),
  getAllDominicanProvinces: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.pROVINCIAS.findMany();
  }),
  getAllLanguages: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.idiomas.findMany();
  }),
});
