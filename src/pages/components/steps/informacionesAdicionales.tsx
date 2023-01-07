import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useState } from "react";
import Select from "react-select";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { trpc } from "../../../utils/trpc";
import { Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import StepperController from "../stepperController";
import parameters from "../../../personalization/parameters.json";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { literal, number, object, string, z } from "zod";
import CurrencyInput from "react-currency-input-field";

const schema = z.object({
  //CAMPO DB = PreferenciaGeografica
  preferenciaGeografica: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar su preferencia geográfica" }
  ),
  // CAMPO DB = DispuestoCambioResidencia
  cambiarResidencia: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar si está dispuesto a cambiar residencia" }
  ),

  // CAMPO DB = Empleado_anteriormente
  empleadoAnteriormente: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar si ha sido empleado nuestro" }
  ),

  // CAMPO DB = Empleado_Actualmente
  empleadoActualmente: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar si está empleado actualmente" }
  ),
  // CAMPO DB = Fecha_Disponible
  fechaDisponible: string().min(1, {
    message: "Debe indicar fecha de disponibilidad",
  }),
  // CAMPO DB (POR AGREGAR) = ModalidadTrabajo
  modalidadTrabajo: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar la modalidad preferida" }
  ),
  // CAMPO DB = AreaLaboral
  areaLaboral: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar el área laboral preferida" }
  ),
  //AGREGAR PERMISO DB TABLA Posiciones
  // CAMPO DB = Posicion_aspira
  posicionAspira1: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar la posición a la que aspira" }
  ),
  // CAMPO DB = Posicion_aspira2
  posicionAspira2: object({
    label: string(),
    value: number(),
  }).optional(),
  // CAMPO DB = Posicion_aspira3
  posicionAspira3: object({
    label: string(),
    value: number(),
  }).optional(),
  // CAMPO DB = Posiciones_Puede_Aplicar
  posicionesPuedeAplicar: string().optional(),
  // CAMPO DB = ComoTeEnteraste
  comoSeEntero: object({
    label: string(),
    value: number(),
  }).optional(),
  //CAMPO DB = TipoContratacion
  tipoContratacion: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar el tipo de contratación" }
  ),
  // CAMPO DB = Nombre_FamiliarAmigo
  parentescoConocido: object({
    label: string(),
    value: number(),
  }).optional(),
  // CAMPO DB (POR AGREGAR) = Parentesco_FamiliarAmigo
  nombreConocido: string().optional(),
  // CAMPO DB = Salario_aspira
  salarioAspira: number().optional(),
  // CAMPO DB = Horario_Disponible
  horarioDisponible: object(
    {
      label: string(),
      value: number(),
    },
    { required_error: "Debe indicar el horario disponible" }
  ),
  // CAMPO DB = Dispuesto_Trabajar_Horas_Extras
  dispuestoTrabajarHorasExtras: object(
    {
      label: string(),
      value: number(),
    },
    { required_error: "Debe indicar si está dispuesto a trabajar horas extras" }
  ),
  // CAMPO DB (Agregar) = Dispuesto_Trabajar
  dispuestoTrabajar: object({
    label: string(),
    value: number(),
  }).optional(),
  // CAMPO DB = Tipo_Licencia
  tipoLicencia: object(
    {
      label: string(),
      value: number(),
    },
    { required_error: "Debe indicar el tipo de licencia que posee" }
  ),
  // CAMPO DB = Maneja_Motor
  manejaMotor: object({
    label: string(),
    value: number(),
  }).optional(),
  // CAMPO DB = Posee_Vehiculo
  poseeVehiculo: object({
    label: string(),
    value: number(),
  }).optional(),
  // CAMPO DB = Medio_Transporte
  medioTransporte: object({
    label: string(),
    value: number(),
  }).optional(),
});

interface informacionesAdicionalesProps {
  step: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  results: unknown;
  setResults: Dispatch<SetStateAction<unknown>>;
}

export default function InformacionesAdicionales({
  step,
  setCurrentStep,
  results,
  setResults,
}: informacionesAdicionalesProps) {
  let storedResultsValues = {};
  if (results) {
    storedResultsValues = results;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    defaultValues: JSON.parse(JSON.stringify(storedResultsValues)),
    resolver: zodResolver(schema),
  });

  const yesNoOptions = [
    { value: 2, label: "Si" },
    { value: 1, label: "No" },
  ];

  const modalidadTrabajoOptions = [
    { value: 1, label: "Presencial" },
    { value: 2, label: "Remoto" },
    { value: 3, label: "Mixto" },
  ];

  const viasConocimientoVacante = [
    { value: 1, label: "Búsqueda en Internet" },
    { value: 2, label: "Periódico" },
    { value: 3, label: "Radio" },
    { value: 4, label: "Redes Sociales" },
    { value: 5, label: "Referimiento" },
    { value: 6, label: "Televisión" },
  ];

  const tiposContrataciones = [
    { value: 1, label: "Tiempo Completo" },
    { value: 2, label: "Tiempo Parcial" },
    { value: 3, label: "Por Proyecto" },
  ];

  const horariosDeTrabajo = [
    { value: 1, label: "Horario Ordinario" },
    { value: 2, label: "Horario Mixto" },
    { value: 3, label: "Horario Nocturno" },
  ];

  const dispuestoTrabajarOpciones = [
    { value: 1, label: "Fines de Semana" },
    { value: 2, label: "Días Feriados" },
    { value: 3, label: "Ambos" },
    { value: 4, label: "Ninguno" },
  ];

  const tiposLicenciasOpciones = [
    { value: 1, label: "Ninguna" },
    { value: 2, label: "Licencia de Motor" },
    { value: 3, label: "Licencia de Vehículos Ligeros" },
    { value: 4, label: "Licencia de Vehículos Pesados" },
  ];

  const medioTransporteOpciones = [
    { value: 1, label: "Automóvil" },
    { value: 2, label: "Bicicleta" },
    { value: 3, label: "Motor" },
    { value: 4, label: "Transporte Privado" },
    { value: 5, label: "Transporte Público" },
  ];

  /** Llamadas a API con opciones a desplegar en elementos de Select */

  const provincias = trpc.formOptions.getAllDominicanProvinces.useQuery();
  const posiciones = trpc.formOptions.getAllPositions.useQuery();
  const areasLaborales = trpc.formOptions.getAllExperienceAreas.useQuery();
  const parentesco = trpc.formOptions.getAllRelationships.useQuery();

  /**  */

  /**Arreglos de objetos a utilizar en los Selects */

  const provinciasOpciones: unknown[] = [];
  const posicionesOpciones: unknown[] = [];
  const areasLaboralesOpciones: unknown[] = [];
  const parentescoOpciones: unknown[] = [];

  /**  */

  //Valor seleccionado de pais para filtrar las opciones de provincias
  const watchFields = watch(["salarioAspira", "provincia"]);

  //Llamada al API EN CASCADA

  /**Insercion de objetos con atributos value,label a utilizar en los Selects */

  provincias.data?.forEach((provincia) => {
    if (provincia.CODIGO > 0) {
      provinciasOpciones.push({
        value: provincia.CODIGO,
        label: provincia.DESCRIPCION,
      });
    }
  });

  posiciones.data?.forEach((posicion) => {
    if (posicion.Codigo > 0) {
      posicionesOpciones.push({
        value: posicion.Codigo,
        label: posicion.descripcion,
      });
    }
  });

  areasLaborales.data?.forEach((area) => {
    if (area.Codigo > 0) {
      areasLaboralesOpciones.push({
        value: area.Codigo,
        label: area.Descripcion,
      });
    }
  });

  parentesco.data?.forEach((parentesco) => {
    if (parentesco.Parentesco_Codigo > 0) {
      parentescoOpciones.push({
        value: parentesco.Parentesco_Codigo,
        label: parentesco.Descripcion,
      });
    }
  });

  const onSave = (formValues: any) => {
    setResults((prevState: any) => {
      return { ...prevState, ...formValues };
    });

    console.log("State Results:", results);
    console.log("FORM VALUES:", formValues);

    handleClick("next");
  };

  const handleClick = (direction: string) => {
    let newStep = step;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds
    newStep > 0 &&
      newStep <= parameters.steps.length &&
      setCurrentStep(newStep);
  };
  console.log("ERRORS", errors);

  return (
    <form className="text-center text-sm" onSubmit={handleSubmit(onSave)}>
      {/* Terms and Conditions: TO-DO (add Modal with the terms) */}
      {/* Form Box */}
      <div className="mt-8 w-72 rounded-md border border-gray-300 p-4 text-left lg:w-full">
        {/* Form Title */}
        <h2 className="pl-2 text-lg font-semibold text-[color:var(--fontColor)]">
          Informaciones Adicionales
        </h2>
        <span className="block pl-2 text-sm text-gray-500 lg:w-full">
          Los campos marcados con
          <b className="text-red-500"> (*)</b> son obligatorios y deben ser
          llenados para enviar la solicitud.
        </span>

        {/* ROW 1 */}
        <div className="justify-between p-2 pt-8 lg:flex">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Preferencia geográfica para laborar{" "}
              <b className="text-red-500">*</b>
            </p>

            <Controller
              name="preferenciaGeografica"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={provinciasOpciones}
                />
              )}
            />
            {errors?.preferenciaGeografica && (
              <span className="block text-sm text-red-500">
                {errors.preferenciaGeografica.message?.toString()}
              </span>
            )}
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)] lg:w-60">
              ¿Está dispuesto a cambiar de residencia?{" "}
              <b className="text-red-500">*</b>
            </p>

            <Controller
              name="cambiarResidencia"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={yesNoOptions}
                />
              )}
            />
            {errors?.cambiarResidencia && (
              <span className="block text-sm text-red-500">
                {errors.cambiarResidencia.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* ROW 2 */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)] lg:w-60">
              ¿Ha sido empleado nuestro anteriormente?{" "}
              <b className="text-red-500">*</b>
            </p>

            <Controller
              name="empleadoAnteriormente"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={yesNoOptions}
                />
              )}
            />
            {errors?.empleadoAnteriormente && (
              <span className="block text-sm text-red-500">
                {errors.empleadoAnteriormente.message?.toString()}
              </span>
            )}
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              ¿Está empleado en estos momentos?{" "}
              <b className="text-red-500">*</b>
            </p>

            <Controller
              name="empleadoActualmente"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={yesNoOptions}
                />
              )}
            />
            {errors?.empleadoActualmente && (
              <span className="block text-sm text-red-500">
                {errors.empleadoActualmente.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* ROW 3 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Fecha de Disponibilidad <b className="text-red-500">*</b>
            </p>
            <input
              type="date"
              min={`${new Date().getFullYear()}-${
                new Date().getMonth().toString().length === 1 ? "0" : ""
              }${new Date().getMonth() + 1}-${
                new Date().getDate().toString().length === 1 ? "0" : ""
              }${new Date().getDate()}`}
              {...register("fechaDisponible")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
            {errors?.fechaDisponibilidad && (
              <span className="block text-sm text-red-500">
                {errors.fechaDisponibilidad.message?.toString()}
              </span>
            )}
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Modalidad de Trabajo <b className="text-red-500">*</b>
            </p>

            <Controller
              name="modalidadTrabajo"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={modalidadTrabajoOptions}
                />
              )}
            />
            {errors?.modalidadTrabajo && (
              <span className="block text-sm text-red-500">
                {errors.modalidadTrabajo.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* ROW 4 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Área laboral preferida <b className="text-red-500">*</b>
            </p>

            <Controller
              name="areaLaboral"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={areasLaboralesOpciones}
                />
              )}
            />
            {errors?.areaLaboral && (
              <span className="block text-sm text-red-500">
                {errors.areaLaboral.message?.toString()}
              </span>
            )}
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              ¿Posición a la que aspira? (1) <b className="text-red-500">*</b>
            </p>

            <Controller
              name="posicionAspira1"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={posicionesOpciones}
                />
              )}
            />
            {errors?.posicionAspira1 && (
              <span className="block text-sm text-red-500">
                {errors.posicionAspira1.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* NO CHANGES UPWARDS */}

        {/* ROW 5 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              ¿Posición a la que aspira? (2)
            </p>

            <Controller
              name="posicionAspira2"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={posicionesOpciones}
                />
              )}
            />
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              ¿Posición a la que aspira? (3)
            </p>

            <Controller
              name="posicionAspira3"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={posicionesOpciones}
                />
              )}
            />
          </div>
        </div>

        {/* NEW ROW 6 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Indique las posiciones a las que puede aplicar
            </p>
            <textarea
              maxLength={200}
              {...register("posicionesPuedeAplicar")}
              className="text-md mt-2 h-10 w-full border border-gray-300 focus:outline-0 lg:mt-1 lg:h-8 lg:w-[35rem] lg:border-t-0 lg:border-r-0 lg:border-l-0 lg:border-b lg:pt-2"
            />
          </div>
        </div>

        {/* NEW ROW 7 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block justify-start">
            <p className="text-md text-[color:var(--fontColor)]">
              ¿Cómo se enteró de la vacante?
            </p>
            <Controller
              name="comoSeEntero"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={viasConocimientoVacante}
                />
              )}
            />
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Tipo de contratación deseada <b className="text-red-500">*</b>
            </p>
            <Controller
              name="tipoContratacion"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={tiposContrataciones}
                />
              )}
            />
            {errors?.tipoContratacion && (
              <span className="block text-sm text-red-500">
                {errors.tipoContratacion.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* NEW ROW 8 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block justify-start">
            <p className="text-md text-[color:var(--fontColor)] lg:w-60">
              Nombre de un conocido o familiar que labora en esta empresa{" "}
            </p>
            <input
              type="text"
              maxLength={80}
              {...register("nombreConocido")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Parentesco del conocido
            </p>
            <Controller
              name="parentescoConocido"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={parentescoOpciones}
                />
              )}
            />
          </div>
        </div>

        {/* NEW ROW 9 (DIRECCION) */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Salario al que aspira
            </p>

            <Controller
              name="salarioAspira"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
                  decimalsLimit={2}
                  decimalScale={2}
                  prefix={"$"}
                  allowNegativeValue={false}
                  decimalSeparator={"."}
                  groupSeparator={","}
                  defaultValue={0}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      Number(
                        e.target.value.replace("$", "").replaceAll(",", "")
                      )
                    )
                  }
                />
              )}
            />

            {/* <textarea 
                maxLength={250}
                {...register("direccion")}
                className='lg:hidden align-text-bottom text-md focus:outline-0 border border-gray-300 mt-1 block' cols={35} rows={3}/>
                {errors?.direccion && <span className='text-red-500 text-sm block lg:hidden'>{errors.direccion.message?.toString()}</span>} */}
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Horario Disponible <b className="text-red-500">*</b>
            </p>
            <Controller
              name="horarioDisponible"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={horariosDeTrabajo}
                />
              )}
            />
            {errors?.horarioDisponible && (
              <span className="block text-sm text-red-500">
                {errors.horarioDisponible.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* ROW 10 */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              ¿Dispuesto a trabajar horas extras?{" "}
              <b className="text-red-500">*</b>
            </p>
            <Controller
              name="dispuestoTrabajarHorasExtras"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={yesNoOptions}
                />
              )}
            />
            {errors?.dispuestoTrabajarHorasExtras && (
              <span className="block text-sm text-red-500">
                {errors.dispuestoTrabajarHorasExtras.message?.toString()}
              </span>
            )}
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Dispuesto a Trabajar
            </p>
            <Controller
              name="dispuestoTrabajar"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={dispuestoTrabajarOpciones}
                />
              )}
            />
          </div>
        </div>

        {/* ROW 11 */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Tipo de licencia de conducir <b className="text-red-500"> *</b>
            </p>
            <Controller
              name="tipoLicencia"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={tiposLicenciasOpciones}
                />
              )}
            />
            {errors?.tipoLicencia && (
              <span className="block text-sm text-red-500">
                {errors.tipoLicencia.message?.toString()}
              </span>
            )}
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              ¿Sabe manejar vehículos de motor?
            </p>
            <Controller
              name="manejaMotor"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={yesNoOptions}
                />
              )}
            />
          </div>
        </div>

        {/* ROW 12 */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              ¿Posee vehículo?
            </p>
            <Controller
              name="poseeVehiculo"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={yesNoOptions}
                />
              )}
            />
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              ¿Cuál es su medio de transporte?
            </p>
            <Controller
              name="medioTransporte"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={medioTransporteOpciones}
                />
              )}
            />
          </div>
        </div>
      </div>
      <StepperController
        steps={parameters.steps}
        currentStep={step}
        handleClick={handleClick}
        submit={true}
      ></StepperController>
    </form>
  );
}
