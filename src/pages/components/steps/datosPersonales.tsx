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
import Alert from "../alert";

const edadMinima = 16;

const schema = z.object({
  nombres: string().min(1, { message: "El nombre es requerido" }),
  apellido1: string().min(1, { message: "El primer apellido es requerido" }),
  apellido2: string(),
  cedula: string().min(13, { message: "Debe ingresar una cédula válida" }),
  pasaporte: string(),
  sexo: string({ invalid_type_error: "Debe indicar su sexo" }).min(1),
  estadoCivil: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar su estado civil" }
  ),
  lugarNacimiento: string().min(1, {
    message: "El lugar de nacimiento es requerido",
  }),
  fechaNacimiento: string().min(1, {
    message: "La fecha de nacimiento es requerida",
  }),
  direccion: string().min(3, { message: "La dirección es requerida" }),
  telefono1: string().min(9, {
    message: "Ingrese un número telefónico válido",
  }),
  telefono2: string(),
  email: string().email({ message: "Ingrese un correo electrónico válido" }),
  nacionalidad: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar su nacionalidad" }
  ),
  //REMOVER PAIS Y AJUSTAR REGISTROS PROVINCIA -> CIUDAD
  municipio: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar su municipio" }
  ),
  provincia: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar su provincia" }
  ),
  ciudad: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    { required_error: "Debe indicar su ciudad" }
  ),
  zona: object({
    label: string(),
    value: number(),
  }).optional(),
  lenguaNativa: object({
    label: string().optional(),
    value: number().optional(),
  }).optional(),
  tieneDependiente: object(
    {
      label: string().min(1),
      value: string().min(1),
    },
    { required_error: "Debe indicar si tiene dependientes" }
  ),
  terms: literal(true),
});

interface datosPersonalesProps {
  step: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  results: unknown;
  setResults: Dispatch<SetStateAction<unknown>>;
}

export default function DatosPersonales({
  step,
  setCurrentStep,
  results,
  setResults,
}: datosPersonalesProps) {
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

  const [termsAndConditions, setTermsAndConditions] = useState<boolean>(false);
  const [openTermsModal, setOpenTermsModal] = useState<boolean>(false);

  const estadoCivilOpciones = [
    { value: 1, label: "Soltero(a)" },
    { value: 2, label: "Casado(a)" },
    { value: 3, label: "Viudo(a)" },
    { value: 4, label: "Divorciado(a)" },
    { value: 5, label: "Unión Libre" },
  ];

  /** Llamadas a API con opciones a desplegar en elementos de Select */

  const nacionalidades = trpc.formOptions.getAllNationalities.useQuery();

  const ciudades = trpc.formOptions.getAllCities.useQuery();

  const provincias = trpc.formOptions.getAllDominicanProvinces.useQuery();

  const zonas = trpc.formOptions.getAllZones.useQuery();

  const idiomas = trpc.formOptions.getAllLanguages.useQuery();

  /**  */

  /**Arreglos de objetos a utilizar en los Selects */

  const nacionalidadesOpciones: unknown[] = [];

  const ciudadesOpciones: unknown[] = [];

  const provinciasOpciones: unknown[] = [];

  const municipiosOpciones: unknown[] = [];

  const zonasOpciones: unknown[] = [];

  const idiomasOpciones: unknown[] = [];

  /**  */

  //Valor seleccionado de pais para filtrar las opciones de provincias
  const watchFields = watch(["pais", "provincia"]);

  //Llamada al API EN CASCADA

  const municipios = trpc.formOptions.getAllMunicipios.useQuery(
    watchFields[1]?.value
  );

  /**Insercion de objetos con atributos value,label a utilizar en los Selects */

  nacionalidades.data?.forEach((nacionalidad) => {
    if (nacionalidad.Codigo > 0) {
      nacionalidadesOpciones.push({
        value: nacionalidad.Codigo,
        label: nacionalidad.Descripcion,
      });
    }
  });

  ciudades.data?.forEach((ciudad) => {
    if (ciudad.Codigo > 0) {
      ciudadesOpciones.push({
        value: ciudad.Codigo,
        label: ciudad.Descripcion,
      });
    }
  });

  zonas.data?.forEach((zona) => {
    if (zona.CODIGO > 0) {
      zonasOpciones.push({
        value: zona.CODIGO,
        label: zona.DESCRIPCION,
      });
    }
  });

  provincias.data?.forEach((provincia) => {
    if (provincia.CODIGO > 0) {
      provinciasOpciones.push({
        value: provincia.CODIGO,
        label: provincia.DESCRIPCION,
      });
    }
  });

  municipios.data?.forEach((municipio) => {
    if (municipio.CODIGO > 0) {
      municipiosOpciones.push({
        value: municipio.CODIGO,
        label: municipio.DESCRIPCION,
      });
    }
  });

  idiomas.data?.forEach((idioma) => {
    if (idioma.Codigo > 0) {
      idiomasOpciones.push({
        value: idioma.Codigo,
        label: idioma.Descripcion,
      });
    }
  });

  const onSave = (formValues: any) => {
    console.log("State Results:", results);
    console.log("FORM VALUES:", formValues);
    setResults(formValues);
    if (formValues?.tieneDependiente?.value === "1") {
      handleClick("next");
    } else {
      setCurrentStep(3);
    }
  };

  const handleClick = (direction: string) => {
    let newStep = step;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds
    newStep > 0 &&
      newStep <= parameters.steps.length &&
      setCurrentStep(newStep);
  };

  return (
    <form className="text-center text-sm" onSubmit={handleSubmit(onSave)}>
      {/* Terms and Conditions: TO-DO (add Modal with the terms) */}
      <input
        id="default-checkbox"
        type="checkbox"
        {...register("terms")}
        checked={termsAndConditions}
        onChange={() => {
          setTermsAndConditions(!termsAndConditions);
        }}
        className="mr-4 h-4 w-4 rounded-md border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
      />
      <Alert
        open={openTermsModal}
        title={"Términos y Condiciones"}
        messages={[parameters.termsText]}
        setClose={() => setOpenTermsModal(false)}
      />
      Estoy de acuerdo con los
      <span
        className="cursor-pointer font-semibold text-blue-500 hover:text-blue-700"
        onClick={() => setOpenTermsModal(true)}
      >
        {" "}
        Términos de uso
      </span>
      {/* Form Box */}
      <div className="mt-8 w-72 rounded-md border border-gray-300 p-4 text-left lg:w-full">
        {/* Form Title */}
        <h2 className="pl-2 text-lg font-semibold text-[color:var(--fontColor)]">
          Datos Personales
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
              Nombres <b className="text-red-500">*</b>{" "}
            </p>
            <input
              type="text"
              maxLength={30}
              {...register("nombres")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
            {errors?.nombres && (
              <span className="block text-sm text-red-500">
                {errors.nombres.message?.toString()}
              </span>
            )}
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Primer Apellido <b className="text-red-500">*</b>
            </p>
            <input
              type="text"
              maxLength={30}
              {...register("apellido1")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
            {errors?.apellido1 && (
              <span className="block text-sm text-red-500">
                {errors.apellido1.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* ROW 2 */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Segundo Apellido{" "}
            </p>
            <input
              type="text"
              maxLength={30}
              {...register("apellido2")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
          </div>

          <div className="hidden pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              TO BE ADDED <b className="text-red-500">*</b>
            </p>
            <input
              type="text"
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
          </div>
        </div>

        {/* ROW 3 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Cédula <b className="text-red-500">*</b>
            </p>
            <InputMask
              mask="999-9999999-9"
              type="text"
              alwaysShowMask={false}
              {...register("cedula")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
            {errors?.cedula && (
              <span className="block text-sm text-red-500">
                {errors.cedula.message?.toString()}
              </span>
            )}
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">Pasaporte</p>
            <input
              type="text"
              maxLength={25}
              {...register("pasaporte")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
          </div>
        </div>

        {/* ROW 4 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Sexo <b className="text-red-500">*</b>
            </p>

            <div className="flex">
              <label className="inline-flex items-center pt-1">
                <input
                  type="radio"
                  {...register("sexo")}
                  value={"1"}
                  className="accent-[color:var(--stepperColor)]"
                />
                <span className="ml-2">Femenino</span>
              </label>

              <label className="inline-flex items-center pt-1 pl-3">
                <input
                  type="radio"
                  {...register("sexo")}
                  value={"2"}
                  className="accent-[color:var(--stepperColor)]"
                />
                <span className="ml-2">Masculino</span>
              </label>
            </div>
            {errors?.sexo && (
              <span className="block text-sm text-red-500">
                {errors.sexo.message?.toString()}
              </span>
            )}
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Estado Civil <b className="text-red-500">*</b>
            </p>

            <Controller
              name="estadoCivil"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={estadoCivilOpciones}
                />
              )}
            />
            {errors?.estadoCivil && (
              <span className="block text-sm text-red-500">
                {errors.estadoCivil.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* NO CHANGES UPWARDS */}

        {/* ROW 5 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Fecha Nacimiento <b className="text-red-500">*</b>
            </p>
            <input
              type="date"
              max={`${new Date().getFullYear() - edadMinima}-${
                new Date().getMonth() + 1
              }-${
                new Date().getDate().toString().length === 1 ? "0" : ""
              }${new Date().getDate()}`}
              {...register("fechaNacimiento")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
            {errors?.fechaNacimiento && (
              <span className="block text-sm text-red-500">
                {errors.fechaNacimiento.message?.toString()}
              </span>
            )}
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Nacionalidad <b className="text-red-500">*</b>
            </p>
            <Controller
              name="nacionalidad"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={nacionalidadesOpciones}
                />
              )}
            />
            {errors?.nacionalidad && (
              <span className="block text-sm text-red-500">
                {errors.nacionalidad.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* NEW ROW 6 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Lugar Nacimiento <b className="text-red-500">*</b>
            </p>
            <input
              type="text"
              maxLength={50}
              {...register("lugarNacimiento")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
            {errors?.lugarNacimiento && (
              <span className="block text-sm text-red-500">
                {errors.lugarNacimiento.message?.toString()}
              </span>
            )}
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Lengua Nativa
            </p>
            <Controller
              name="lenguaNativa"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={idiomasOpciones}
                />
              )}
            />
          </div>
        </div>

        {/* NEW ROW 7 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block justify-start">
            <p className="text-md text-[color:var(--fontColor)]">
              Provincia <b className="text-red-500">*</b>
            </p>
            <Controller
              name="provincia"
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
            {errors?.provincia && (
              <span className="block text-sm text-red-500">
                {errors.provincia.message?.toString()}
              </span>
            )}
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Municipio <b className="text-red-500">*</b>
            </p>
            <Controller
              name="municipio"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={municipiosOpciones}
                />
              )}
            />
            {errors?.municipio && (
              <span className="block text-sm text-red-500">
                {errors.municipio.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* NEW ROW 8 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block justify-start">
            <p className="text-md text-[color:var(--fontColor)]">
              Ciudad <b className="text-red-500">*</b>
            </p>
            <Controller
              name="ciudad"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={ciudadesOpciones}
                />
              )}
            />
            {errors?.ciudad && (
              <span className="block text-sm text-red-500">
                {errors.ciudad.message?.toString()}
              </span>
            )}
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">Zona</p>
            <Controller
              name="zona"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={zonasOpciones}
                />
              )}
            />
          </div>
        </div>

        {/* NEW ROW 9 (DIRECCION) */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Dirección <b className="text-red-500">*</b>
            </p>

            <textarea
              maxLength={250}
              {...register("direccion")}
              className="text-md mt-2 h-20 w-full border border-gray-300 focus:outline-0 lg:mt-1 lg:h-8 lg:w-[35rem] lg:border-t-0 lg:border-r-0 lg:border-l-0 lg:border-b lg:pt-2"
            />
            {errors?.direccion && (
              <span className="block text-sm text-red-500">
                {errors.direccion.message?.toString()}
              </span>
            )}

            {/* <textarea 
                maxLength={250}
                {...register("direccion")}
                className='lg:hidden align-text-bottom text-md focus:outline-0 border border-gray-300 mt-1 block' cols={35} rows={3}/>
                {errors?.direccion && <span className='text-red-500 text-sm block lg:hidden'>{errors.direccion.message?.toString()}</span>} */}
          </div>
        </div>

        {/* ROW 10 */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Teléfono Celular <b className="text-red-500">*</b>
            </p>
            <div className="flex">
              <FontAwesomeIcon
                className="mt-1 h-6 w-6 border-b border-gray-300 pr-1 pl-2 text-gray-300"
                icon={faPhone}
              />
              <input
                type="text"
                maxLength={20}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                inputMode="numeric"
                {...register("telefono1")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 pl-2 focus:outline-0 lg:w-[13.4rem]"
              />
            </div>
            {errors?.telefono1 && (
              <span className="block text-sm text-red-500">
                {errors.telefono1.message?.toString()}
              </span>
            )}
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Teléfono Residencial
            </p>
            <div className="flex">
              <FontAwesomeIcon
                className="mt-1 h-6 w-6 border-b border-gray-300 pr-1 pl-2 text-gray-300"
                icon={faPhone}
              />
              <input
                type="text"
                maxLength={20}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                inputMode="numeric"
                {...register("telefono2")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 pl-2 focus:outline-0 lg:w-[13.4rem]"
              />
            </div>
          </div>
        </div>

        {/* ROW 11 */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Correo Electrónico <b className="text-red-500">*</b>
            </p>
            <div className="flex">
              <FontAwesomeIcon
                className="mt-1 h-6 w-6 border-b border-gray-300 pr-1 pl-2 text-gray-300"
                icon={faEnvelope}
              />
              <input
                type="email"
                maxLength={100}
                {...register("email")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 pl-2 focus:outline-0 lg:w-[13.4rem]"
              />
            </div>
            {errors?.email && (
              <span className="block text-sm text-red-500">
                {errors.email.message?.toString()}
              </span>
            )}
          </div>

          <div className="block justify-start pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              ¿Tiene dependientes económicos? <b className="text-red-500">*</b>
            </p>
            <Controller
              name="tieneDependiente"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className={`w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60`}
                  {...field}
                  options={[
                    { value: "1", label: "Si" },
                    { value: "0", label: "No" },
                  ]}
                />
              )}
            />
            {errors?.tieneDependiente && (
              <span className="block text-sm text-red-500">
                {errors.tieneDependiente.message?.toString()}
              </span>
            )}
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
