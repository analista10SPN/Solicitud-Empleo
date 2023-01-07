import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import superjson from "superjson";

export const solicitudEmpleoPostRouter = router({
  validPost: publicProcedure
    .input(
      z
        .object({
          cedula: z.string().nullable(),
          posicion: z.string().nullable(),
        })
        .nullable()
    )
    .query(async ({ ctx, input }) => {
      const solicitud = await ctx.prisma.solicitud_Empleo_Web.findMany({
        where: {
          AND: [
            {
              Cedula: input?.cedula,
            },
            {
              Posicion_aspira: input?.posicion,
            },
          ],
        },
      });

      let validPostValue = true;

      solicitud.forEach((sol) => {
        if (
          sol.Fecha_Solicitud?.getDate() === new Date().getDate() &&
          sol.Fecha_Solicitud?.getMonth() === new Date().getMonth() &&
          sol.Fecha_Solicitud?.getFullYear() === new Date().getFullYear()
        ) {
          validPostValue = false;
          return false;
        }
      });
      return validPostValue;
    }),
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
        zona: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
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
        preferenciaGeografica: z.object(
          {
            label: z.string().min(1),
            value: z.number().min(1),
          },
          { required_error: "Debe indicar su preferencia geográfica" }
        ),
        // CAMPO DB = DispuestoCambioResidencia
        cambiarResidencia: z.object(
          {
            label: z.string().min(1),
            value: z.number().min(1),
          },
          {
            required_error:
              "Debe indicar si está dispuesto a cambiar residencia",
          }
        ),

        // CAMPO DB = Empleado_anteriormente
        empleadoAnteriormente: z.object(
          {
            label: z.string().min(1),
            value: z.number().min(1),
          },
          { required_error: "Debe indicar si ha sido empleado nuestro" }
        ),

        // CAMPO DB = Empleado_Actualmente
        empleadoActualmente: z.object(
          {
            label: z.string().min(1),
            value: z.number().min(1),
          },
          { required_error: "Debe indicar si está empleado actualmente" }
        ),
        // CAMPO DB = Fecha_Disponible
        fechaDisponible: z.string().min(1, {
          message: "Debe indicar fecha de disponibilidad",
        }),
        // CAMPO DB (POR AGREGAR) = ModalidadTrabajo
        modalidadTrabajo: z.object(
          {
            label: z.string().min(1),
            value: z.number().min(1),
          },
          { required_error: "Debe indicar la modalidad preferida" }
        ),
        // CAMPO DB = AreaLaboral
        areaLaboral: z.object(
          {
            label: z.string().min(1),
            value: z.number().min(1),
          },
          { required_error: "Debe indicar el área laboral preferida" }
        ),
        //AGREGAR PERMISO DB TABLA Posiciones
        // CAMPO DB = Posicion_aspira
        posicionAspira1: z.object(
          {
            label: z.string().min(1),
            value: z.number().min(1),
          },
          { required_error: "Debe indicar la posición a la que aspira" }
        ),
        // CAMPO DB = Posicion_aspira2
        posicionAspira2: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
        // CAMPO DB = Posicion_aspira3
        posicionAspira3: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
        // CAMPO DB = Posiciones_Puede_Aplicar
        posicionesPuedeAplicar: z.string().optional(),
        // CAMPO DB = ComoTeEnteraste
        comoSeEntero: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
        //CAMPO DB = TipoContratacion
        tipoContratacion: z.object(
          {
            label: z.string().min(1),
            value: z.number().min(1),
          },
          { required_error: "Debe indicar el tipo de contratación" }
        ),
        // CAMPO DB = Nombre_FamiliarAmigo
        parentescoConocido: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
        // CAMPO DB (POR AGREGAR) = Parentesco_FamiliarAmigo
        nombreConocido: z.string().optional(),
        // CAMPO DB = Salario_aspira
        salarioAspira: z.number().optional(),
        // CAMPO DB = Horario_Disponible
        horarioDisponible: z.object(
          {
            label: z.string(),
            value: z.number(),
          },
          { required_error: "Debe indicar el horario disponible" }
        ),
        // CAMPO DB = Dispuesto_Trabajar_Horas_Extras
        dispuestoTrabajarHorasExtras: z.object(
          {
            label: z.string(),
            value: z.number(),
          },
          {
            required_error:
              "Debe indicar si está dispuesto a trabajar horas extras",
          }
        ),
        // CAMPO DB (Agregar) = Dispuesto_Trabajar
        dispuestoTrabajar: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
        // CAMPO DB = Tipo_Licencia
        tipoLicencia: z.object(
          {
            label: z.string(),
            value: z.number(),
          },
          { required_error: "Debe indicar el tipo de licencia que posee" }
        ),
        // CAMPO DB = Maneja_Motor
        manejaMotor: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
        // CAMPO DB = Posee_Vehiculo
        poseeVehiculo: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
        // CAMPO DB = Medio_Transporte
        medioTransporte: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .optional(),
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
          PreferenciaGeografica: input.preferenciaGeografica.value,
          DispuestoCambioResidencia: input.cambiarResidencia.value,
          Empleado_anteriormente: String(input.empleadoAnteriormente.value),
          Empleado_Actualmente: String(input.empleadoActualmente.value),
          Fecha_Disponible: new Date(input.fechaDisponible).toISOString(),
          Modalidad_Trabajo: input.modalidadTrabajo.value,
          AreaLaboral: input.areaLaboral.value,
          Posicion_aspira: String(input.posicionAspira1.value),
          Posicion_aspira2: String(input?.posicionAspira2?.value),
          Posicion_aspira3: String(input?.posicionAspira3?.value),
          Posiciones_Puede_Aplicar: String(input?.posicionesPuedeAplicar),
          ComoTeEnteraste: input.comoSeEntero?.value,
          TipoContratacion: input.tipoContratacion.value,
          Nombre_FamiliarAmigo: String(input?.nombreConocido),
          Parentesco_FamiliarAmigo: input.parentescoConocido?.value,
          Salario_aspira: input.salarioAspira,
          Horario_Disponible: input.horarioDisponible.value,
          Dispuesto_Trabajar_Horas_Extras:
            input.dispuestoTrabajarHorasExtras.value,
          Dispuesto_Trabajar: input.dispuestoTrabajar?.value,
          Tipo_Licencia: input.tipoLicencia.value,
          Maneja_Motor: String(input.manejaMotor?.value),
          Posee_Vehiculo: String(input.poseeVehiculo?.value),
          Medio_Transporte: input.medioTransporte?.value,
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
  referenciasPersonales: publicProcedure
    .input(
      z.array(
        z.object({
          codigo_solicitud: z.number(),
          nombre: z.string(),
          telefono: z.string(),
          tipoReferencia: z
            .object({
              label: z.string(),
              value: z.number(),
            })
            .optional(),
          email: z.string().optional(),
          compania: z.string().optional(),
          ocupacion: z.string().optional(),
          parentesco: z.string().optional(),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.solicitud_Empleo_Web_Referencias.createMany(
        {
          data: input.map((referencia) => {
            return {
              Codigo_Solicitud: referencia.codigo_solicitud,
              Nombre: referencia.nombre,
              Telefono: referencia.telefono,
              Compania: referencia?.compania,
              Ocupacion: referencia?.ocupacion,
              Parentesco: referencia?.parentesco,
              E_Mail: referencia?.email,
              Tipo_Referencia: referencia?.tipoReferencia?.value,
            };
          }),
        }
      );
      return post;
    }),

  solicitudAnexo: publicProcedure
    .input(
      z.object({
        codigo_solicitud: z.number(),
        idAnexo: z.number(),
        orden: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const post: any = await ctx.prisma.solicitudWebAnexo.create({
        data: {
          Id_Solicitud: input.codigo_solicitud,
          Id_Anexo: input.idAnexo,
          Orden: input.orden,
        },
      });
      return post;
    }),

  anexo: publicProcedure
    .input(
      z.object({
        codigo_solicitud: z.number(),
        nombre: z.string(),
        extension: z.string(),
        descripcion: z.string(),
        binary: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const post: any = await ctx.prisma.anexo.create({
        data: {
          Nombre: input.nombre,
          Extension: input.extension,
          Descripcion: input.descripcion,
          Imagen: Buffer.from(input.binary, "base64"),
        },
      });
      const postRelation: any = await ctx.prisma.solicitudWebAnexo.create({
        data: {
          Id_Solicitud: input.codigo_solicitud,
          Id_Anexo: Number(
            JSON.parse(JSON.stringify(superjson.serialize(await post).json))
              ?.IdAnexo
          ),
          Orden: 0,
        },
      });
      return [superjson.serialize(post).json, postRelation];
    }),
});
