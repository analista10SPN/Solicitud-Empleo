import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const solicitudEmpleoPostRouter = router({
  solicitudEmpleo: publicProcedure
    .input(
      z.object({
        nombres: z.string(),
        apellido1: z.string(),
        apellido2: z.string(),
        cedula: z.string(),
        pasaporte: z.string(),
        sexo: z.string(),
        estadoCivil: z.object({
          label: z.string(),
          value: z.number(),
        }),
        lugarNacimiento: z.string(),
        fechaNacimiento: z.string(),
        direccion: z.string(),
        telefono1: z.string(),
        telefono2: z.string(),
        email: z.string().email(),
        nacionalidad: z.object({
          label: z.string(),
          value: z.number(),
        }),
        pais: z.object({
          label: z.string().min(1),
          value: z.number().min(1),
        }),
        provincia: z.object({
          label: z.string(),
          value: z.number(),
        }),
        ciudad: z.string(),
        zona: z.string(),
        lenguaNativa: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
        tieneDependiente: z
          .object({
            label: z.string(),
            value: z.string(),
          })
          .optional(),
        terms: z.literal(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.solicitud_Empleo_Web.create({
        data: {
          Nombre: input.nombres,
          Fecha_Solicitud: new Date(
            new Date().toString().concat(" UTC")
          ).toISOString(),
          Apellido_Paterno: input.apellido1,
          Apellido_Materno: input.apellido2,
          Cedula: input.cedula,
          Pasaporte: input.pasaporte,
          Sexo: input.sexo,
          Estado_Civil: String(input.estadoCivil.value),
          Lugar_Nacimiento: input.lugarNacimiento,
          Fecha_Nacimiento: new Date(input.fechaNacimiento).toISOString(),
          Direccion: input.direccion,
          Telefono1: input.telefono1,
          Telefono2: input.telefono2,
          E_Mail: input.email,
          Nacionalidad: String(input.nacionalidad.value),
          Pais: input.pais.value,
          Provincia: String(input.provincia.value),
          Ciudad: input.ciudad,
          Zona_Descripcion: input.zona,
          Lengua_Nativa: input.lenguaNativa?.value,
          TieneDependiente: String(input.tieneDependiente?.value),
        },
      });
      return post;
    }),
  dependientes: publicProcedure
    .input(
      z.array(
        z.object({
          codigo_solicitud: z.number(),
          nombre: z.string(),
          cedula: z.string(),
          sexo: z.object({
            label: z.string(),
            value: z.string(),
          }),
          nivelAcademico: z.object({
            label: z.string(),
            value: z.number(),
          }),
          fechaNacimiento: z.string(),
          parentesco: z.object({
            label: z.string(),
            value: z.number(),
          }),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      const post =
        await ctx.prisma.solicitud_Empleo_Web_Dependientes.createMany({
          data: input.map((dependiente) => {
            return {
              Codigo_Solicitud: dependiente.codigo_solicitud,
              Nombre: dependiente.nombre,
              Fecha_Nacimiento: new Date(
                dependiente.fechaNacimiento
              ).toISOString(),
              Genero: Number(dependiente.sexo.value),
              Id_Parentesco: dependiente.parentesco.value,
              Cedula: dependiente.cedula,
              NivelAcademico: dependiente.nivelAcademico.value,
            };
          }),
        });
      return post;
    }),
});
