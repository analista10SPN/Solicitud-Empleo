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
        municipio: z.object({
          label: z.string().min(1),
          value: z.number().min(1),
        }),
        provincia: z.object({
          label: z.string(),
          value: z.number(),
        }),
        ciudad: z.object({
          label: z.string(),
          value: z.number(),
        }),
        zona: z.object({
          label: z.string(),
          value: z.number(),
        }),
        lenguaNativa: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
        tieneDependiente: z.object({
          label: z.string(),
          value: z.string(),
        }),
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
          Municipio: String(input.municipio.value),
          Provincia: String(input.provincia.value),
          Ciudad: String(input.ciudad.value),
          Zona: String(input.zona?.value),
          Lengua_Nativa: input.lenguaNativa?.value,
          TieneDependiente: String(input.tieneDependiente.value),
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
  experienciaLaboral: publicProcedure
    .input(
      z.array(
        z.object({
          codigo_solicitud: z.number(),
          nombreEmpresa: z.string(),
          telefono: z.string(),
          fechaInicio: z.string(),
          fechaSalida: z.string().optional(),
          salarioInicial: z.string().optional(),
          salarioFinal: z.string().optional(),
          funciones: z.string().optional(),
          ultimoPuesto: z.string().optional(),
          motivoSalida: z.string().optional(),
          supervisor: z.string().optional(),
          areaExperiencia: z
            .object({
              label: z.string(),
              value: z.number(),
            })
            .optional(),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      const post =
        await ctx.prisma.solicitud_Empleo_Web_Experiencia_Laboral.createMany({
          data: input.map((experencia) => {
            return {
              Codigo_Solicitud: experencia.codigo_solicitud,
              Nombre_Empresa: experencia.nombreEmpresa,
              Telefono: experencia.telefono,
              Fecha_Inicio: new Date(experencia?.fechaInicio),
              Fecha_Salida: new Date(String(experencia?.fechaSalida)),
              Salario_Inicial: Number(experencia.salarioInicial),
              Salario_Final: Number(experencia.salarioFinal),
              Funciones_A_Cargo: experencia.funciones,
              Ultimo_Puesto: experencia.ultimoPuesto,
              Motivo_Salida: experencia.motivoSalida,
              Supervisor: experencia.supervisor,
              Area_Experiencia: experencia.areaExperiencia?.value,
            };
          }),
        });
      return post;
    }),
  formacionAcademica: publicProcedure
    .input(
      z.array(
        z.object({
          codigo_solicitud: z.number(),
          centroDocente: z.string(),
          carrera: z.string().optional(),
          grado: z.object({
            label: z.string(),
            value: z.number(),
          }),
          ciudad: z.object({
            label: z.string(),
            value: z.number(),
          }),
          fechaInicio: z.string(),
          fechaTermino: z.string(),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      const post =
        await ctx.prisma.solicitud_Empleo_Web_Formacion_Acad.createMany({
          data: input.map((formacion) => {
            return {
              Codigo_Solicitud: formacion.codigo_solicitud,
              Centro_Docente: formacion.centroDocente,
              Fecha_Inicio: new Date(formacion.fechaInicio).toISOString(),
              Fecha_Termino: new Date(formacion.fechaTermino).toISOString(),
              Ciudad_Centro_Docente: Number(formacion.ciudad.value),
              Nivel_Academico: Number(formacion.grado.value),
              Carrera: formacion?.carrera,
            };
          }),
        });
      return post;
    }),

  idiomas: publicProcedure
    .input(
      z.array(
        z.object({
          codigo_solicitud: z.number(),
          idioma: z.object({
            label: z.string().min(1),
            value: z.number().min(1),
          }),
          lee: z.boolean(),
          escribe: z.boolean(),
          habla: z.boolean(),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.solicitudEmpIdiomas.createMany({
        data: input.map((idioma) => {
          return {
            CodigoSolicitud: idioma.codigo_solicitud,
            Idioma: idioma.idioma.label,
            Lee: idioma.lee,
            Habla: idioma.habla,
            Escribe: idioma.escribe,
          };
        }),
      });
      return post;
    }),
});
