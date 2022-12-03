import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { optional, number, object, string, z } from "zod";
import { trpc } from "../../../utils/trpc";
import parameters from "../../../personalization/parameters.json";
import StepperController from "../stepperController";
import Select from "react-select";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import TableComponent from "../tableComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

interface keyable {
  [key: string]: any;
}

interface experienciaProps {
  step: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  experiencias: any[];
  setExperiencias: Dispatch<React.SetStateAction<any[]>>;
}

const schema = z.object({
  nombreEmpresa: string().min(1, { message: "El nombre es requerido" }),
  telefono: string().min(8, {
    message: "Debe indicar un teléfono válido",
  }),
  fechaInicio: string().min(1, {
    message: "La fecha de inicio es requerida",
  }),
  fechaSalida: string().optional(),
  salarioInicial: string().optional(),
  salarioFinal: string().optional(),
  funciones: string().optional(),
  ultimoPuesto: string().optional(),
  motivoSalida: string().optional(),
  supervisor: string().optional(),
  areaExperiencia: object({
    label: string(),
    value: number(),
  }).optional(),
});

const defaultMaskOptions = {
  prefix: "$",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ",",
  allowDecimal: true,
  decimalSymbol: ".",
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 7, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
};

export default function ExperienciaLaboral({
  step,
  setCurrentStep,
  experiencias,
  setExperiencias,
}: experienciaProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // API CALLS TO GET MENU OPTIONS DATA

  const areasExperiencia = trpc.formOptions.getAllExperienceAreas.useQuery();

  //MENU OPTIONS VARIABLES

  const areasExperienciaOpciones: unknown[] = [];

  //FILLING IN MENU OPTIONS VARIABLES WITH DATA

  areasExperiencia.data?.forEach((area) => {
    if (area.Codigo > 0) {
      areasExperienciaOpciones.push({
        value: area.Codigo,
        label: area.Descripcion,
      });
    }
  });

  //Controller functions
  const onSave = (formValues: any) => {
    console.log("State Results:", experiencias);
    console.log("FORM VALUES:", formValues);
    setExperiencias([...experiencias, formValues]);
  };

  const handleClick = (direction: string) => {
    let newStep = step;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds
    newStep > 0 &&
      newStep <= parameters.steps.length &&
      setCurrentStep(newStep);
  };

  const currencyMask = createNumberMask(defaultMaskOptions);

  return (
    <form className="text-center text-sm" onSubmit={handleSubmit(onSave)}>
      {/* Form Box */}
      <div className="mt-8 w-72 rounded-md border border-gray-300 p-4 text-left lg:w-full">
        {/* Form Title */}
        <h2 className="pl-2 text-lg font-semibold text-[color:var(--fontColor)]">
          Experiencia Laboral
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
              Nombre de la Empresa <b className="text-red-500">*</b>{" "}
            </p>
            <input
              type="text"
              maxLength={60}
              {...register("nombreEmpresa")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
            {errors?.nombreEmpresa && (
              <span className="block text-sm text-red-500">
                {errors.nombreEmpresa.message?.toString()}
              </span>
            )}
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">Teléfono</p>
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
                {...register("telefono")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 pl-2 focus:outline-0 lg:w-[13.4rem]"
              />
            </div>
            {errors?.telefono && (
              <span className="block text-sm text-red-500">
                {errors.telefono.message?.toString()}
              </span>
            )}
          </div>
        </div>

        {/* ROW 2 */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Fecha Inicio <b className="text-red-500">*</b>
            </p>
            <input
              type="date"
              {...register("fechaInicio")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
            {errors?.fechaInicio && (
              <span className="block text-sm text-red-500">
                {errors.fechaInicio.message?.toString()}
              </span>
            )}
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Fecha Salida
            </p>
            <input
              type="date"
              {...register("fechaSalida")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
          </div>
        </div>

        {/* ROW 3 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Salario Inicial <b className="text-red-500">*</b>
            </p>
            <MaskedInput
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
              mask={currencyMask}
              {...defaultMaskOptions}
              {...register("salarioInicial")}
            />
          </div>

          <div className="block pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Salario Final
            </p>
            <MaskedInput
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
              mask={currencyMask}
              {...defaultMaskOptions}
              {...register("salarioFinal")}
            />
          </div>
        </div>

        {/* ROW 4 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Funciones a su Cargo
            </p>
            <textarea
              {...register("funciones")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
          </div>

          <div className="pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">
              Último Puesto Desempeñado
            </p>
            <input
              type="text"
              maxLength={60}
              {...register("ultimoPuesto")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
          </div>
        </div>

        {/* ROW 5 */}

        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Motivo de Salida
            </p>
            <textarea
              maxLength={100}
              {...register("motivoSalida")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
          </div>

          <div className="pt-4 lg:pt-0">
            <p className="text-md text-[color:var(--fontColor)]">Supervisor</p>
            <input
              type="text"
              maxLength={80}
              {...register("supervisor")}
              className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
            />
          </div>
        </div>

        {/* ROW 6 */}
        <div className="justify-between p-2 lg:flex lg:pt-6">
          <div className="block">
            <p className="text-md text-[color:var(--fontColor)]">
              Área de Experiencia
            </p>
            <Controller
              name="areaExperiencia"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione..."
                  className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                  {...field}
                  options={areasExperienciaOpciones}
                />
              )}
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

        {/* ROW 7 */}
        <div className="flex justify-end p-2 lg:pt-6">
          <button
            type="submit"
            className=" h-9 w-9 rounded-full bg-[color:var(--stepperColor)] pb-1 text-2xl text-white shadow shadow-gray-800 hover:shadow-md hover:shadow-gray-700"
          >
            &#43;
          </button>
        </div>
      </div>
      {/* Table Component */}
      {areasExperienciaOpciones?.length > 0 && experiencias?.length > 0 && (
        <TableComponent
          data={experiencias}
          setData={setExperiencias}
          columnProps={[
            {
              name: "Nombre de la Empresa",
              property: "nombreEmpresa",
              type: "text",
            },
            {
              name: "Teléfono",
              property: "telefono",
              type: "telefono",
            },
            {
              name: "Fecha Inicio",
              property: "fechaInicio",
              type: "date",
            },
            {
              name: "Fecha Salida",
              property: "fechaSalida",
              type: "date",
            },
            {
              name: "Salario Inicial",
              property: "salarioInicial",
              type: "text",
            },
            {
              name: "Salario Final",
              property: "salarioFinal",
              type: "text",
            },
            {
              name: "Funciones a su Cargo",
              property: "funciones",
              type: "textarea",
            },
            {
              name: "Último Puesto Desempeñado ",
              property: "ultimoPuesto",
              type: "text",
            },
            {
              name: "Motivo de Salida ",
              property: "motivoSalida",
              type: "text",
            },
            {
              name: "Supervisor ",
              property: "supervisor",
              type: "text",
            },
            {
              name: "Área de Experiencia ",
              property: "areaExperiencia.value",
              type: "select",
            },
          ]}
          selectOptions={[
            {
              id: "areaExperiencia",
              optionsArray: areasExperienciaOpciones,
            },
          ]}
        />
      )}
      <StepperController
        steps={parameters.steps}
        currentStep={step}
        handleClick={handleClick}
        submit={false}
      ></StepperController>
    </form>
  );
}
