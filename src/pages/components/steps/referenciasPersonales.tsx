import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { optional, number, object, string, z, unknown, boolean } from "zod";
import { trpc } from "../../../utils/trpc";
import parameters from "../../../personalization/parameters.json";
import StepperController from "../stepperController";
import Select from "react-select";
import InputMask from "react-input-mask";
import TableComponent from "../tableComponent";
import { useState, useEffect } from "react";
import Alert from "../alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

interface keyable {
  [key: string]: any;
}

interface referenciasPersonalesProps {
  step: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  referenciasPersonales: any[];
  setReferenciasPersonales: Dispatch<React.SetStateAction<any[]>>;
}

const schema = z.object({
  nombre: string().min(1, { message: "El nombre es requerido" }),
  telefono: string().min(1, {
    message: "Debe indicar un número de teléfono válido",
  }),
  compania: string().optional(),
  ocupacion: string().optional(),
  email: string()
    .email({ message: "Debe indicar un correo electrónico válido" })
    .optional(),
  tipoReferencia: object({
    label: string(),
    value: number(),
  }).optional(),
  parentesco: string().optional(),
});

export default function ReferenciasPersonales({
  step,
  setCurrentStep,
  referenciasPersonales,
  setReferenciasPersonales,
}: referenciasPersonalesProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [isSubmitSuccesfull, setIsSubmitSuccesfull] = useState<boolean>(false);
  const [openDuplicateAlert, setOpenDuplicateAlert] = useState<boolean>(false);
  const [openMinimumAlert, setOpenMinimumAlert] = useState<boolean>(false);
  const [openDeleteConfirmationAlert, setOpenDeleteConfirmationAlert] =
    useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);

  // API CALLS TO GET MENU OPTIONS DATA

  //MENU OPTIONS VARIABLES

  const tipoReferenciasOpciones = [
    { label: "Personal", value: 1 },
    { label: "Profesional", value: 2 },
  ];

  //FILLING IN MENU OPTIONS VARIABLES WITH DATA

  //Controller functions
  const onSave = (formValues: any) => {
    console.log("State Results:", referenciasPersonales);
    console.log("FORM VALUES:", formValues);

    //CHECK FOR DUPLICATE REGISTERS
    const referenciasWithNewValue = [...referenciasPersonales, formValues];
    const uniqueValues = new Set(referenciasWithNewValue.map((v) => v.nombre));
    const uniqueIds = new Set(referenciasWithNewValue.map((v) => v.telefono));
    console.log(uniqueValues, referenciasWithNewValue);

    if (
      uniqueIds.size < referenciasWithNewValue.length &&
      formValues?.telefono?.length > 0
    ) {
      console.log("duplicates found");
      setOpenDuplicateAlert(true);
      return;
    } else if (uniqueValues.size < referenciasWithNewValue.length) {
      const possibleDuplicate = referenciasPersonales.find(
        (referencia) => referencia.nombre === formValues.nombre
      );
      if (possibleDuplicate) {
        console.log("duplicates found");
        setOpenDuplicateAlert(true);
        return;
      }
    }

    //<--- IF NO DUPLICATES --->

    setReferenciasPersonales([...referenciasPersonales, formValues]);
    setIsSubmitSuccesfull(true);
  };

  const handleClick = (direction: string) => {
    let newStep = step;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds

    if (direction === "next" && referenciasPersonales?.length < 3) {
      setOpenMinimumAlert(true);
      return;
    }

    newStep > 0 &&
      newStep <= parameters.steps.length &&
      setCurrentStep(newStep);
  };

  //RESET AFTER SUBMITION

  useEffect(() => {
    if (isSubmitSuccesfull) {
      reset({
        tipoReferencia: null,
        telefono: "",
        parentesco: "",
        nombre: "",
        compania: "",
        ocupacion: "",
        correo: "",
      });
      resetCallBack();
    }
  }, [isSubmitSuccesfull]);

  const resetCallBack = () => {
    setIsSubmitSuccesfull(false);
  };

  return (
    <>
      <Alert
        title="Registro Duplicado"
        messages={[
          "Está intentando ingresar una referencia con un nombre/teléfono que ya existe en la tabla de Referencias Personales.",
        ]}
        open={openDuplicateAlert}
        setClose={() => setOpenDuplicateAlert(false)}
      />

      <Alert
        title="Mínimo Requerido"
        messages={[
          "Debe agregar un mínimo de 3 referencias personales para continuar.",
        ]}
        open={openMinimumAlert}
        setClose={() => setOpenMinimumAlert(false)}
      />

      <form className="text-center text-sm" onSubmit={handleSubmit(onSave)}>
        {/* Form Box */}
        <div
          className={`mt-8 w-72 rounded-md border border-gray-300 p-4 text-left lg:w-[40rem] ${
            referenciasPersonales?.length > 0 ? "lg:ml-[15%]" : ""
          }`}
        >
          {/* Form Title */}
          <h2 className="pl-2 text-lg font-semibold text-[color:var(--fontColor)]">
            Referencias Personales (No Familiares/parientes, <b>mínimo 3</b>)
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
                Nombre Completo <b className="text-red-500">*</b>{" "}
              </p>
              <textarea
                maxLength={80}
                {...register("nombre")}
                className="text-md mt-2 h-10 w-full border border-gray-300 focus:outline-0 lg:mt-1 lg:h-8 lg:w-[35rem] lg:border-t-0 lg:border-r-0 lg:border-l-0 lg:border-b lg:pt-2"
              />
              {errors?.nombre && (
                <span className="block text-sm text-red-500">
                  {errors.nombre.message?.toString()}
                </span>
              )}
            </div>
          </div>

          {/* ROW 2 */}
          <div className="justify-between p-2 lg:flex lg:pt-6">
            <div className="block justify-start">
              <p className="text-md text-[color:var(--fontColor)]">
                Teléfono <b className="text-red-500">*</b>
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

            <div className="block justify-start pt-4 lg:pt-0">
              <p className="text-md text-[color:var(--fontColor)]">
                Correo Electrónico
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
            </div>
          </div>

          {/* ROW 3 */}

          <div className="justify-between p-2 lg:flex lg:pt-6">
            <div className="block">
              <p className="text-md text-[color:var(--fontColor)]">Compañía</p>
              <input
                type="text"
                maxLength={30}
                {...register("compania")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
              />
            </div>

            <div className="block justify-start pt-4 lg:pt-0">
              <p className="text-md text-[color:var(--fontColor)]">Ocupación</p>
              <input
                type="text"
                maxLength={30}
                {...register("ocupacion")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
              />
            </div>
          </div>

          {/* ROW 4 */}

          <div className="justify-between p-2 lg:flex lg:pt-6">
            <div className="block justify-start">
              <p className="text-md text-[color:var(--fontColor)]">
                Parentesco
              </p>
              <input
                type="text"
                maxLength={30}
                {...register("parentesco")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
              />
            </div>

            <div className="block justify-start pt-4 lg:pt-0">
              <p className="text-md text-[color:var(--fontColor)]">
                Tipo de Referencia
              </p>
              <Controller
                name="tipoReferencia"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Seleccione..."
                    className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                    {...field}
                    options={tipoReferenciasOpciones}
                  />
                )}
              />
            </div>
          </div>

          {/* ROW 5 */}

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
        {(referenciasPersonales?.length > 0 || openDeleteConfirmationAlert) && (
          <TableComponent
            data={referenciasPersonales}
            setData={setReferenciasPersonales}
            openDeleteConfirmationAlert={openDeleteConfirmationAlert}
            setOpenDeleteConfirmationAlert={setOpenDeleteConfirmationAlert}
            deleteConfirmation={deleteConfirmation}
            setDeleteConfirmation={setDeleteConfirmation}
            columnProps={[
              { name: "Nombre", property: "nombre", type: "text", max: 80 },
              {
                name: "Teléfono",
                property: "telefono",
                type: "telefono",
                max: 20,
              },
              {
                name: "Correo Electrónico",
                property: "email",
                type: "text",
                max: 100,
              },
              {
                name: "Compañía",
                property: "compania",
                type: "text",
                max: 30,
              },
              {
                name: "Ocupación",
                property: "ocupacion",
                type: "text",
                max: 30,
              },
              {
                name: "Parentesco",
                property: "parentesco",
                type: "text",
                max: 30,
              },
              {
                name: "Tipo de Referencia",
                property: "tipoReferencia.value",
                type: "select",
              },
            ]}
            selectOptions={[
              {
                id: "tipoReferencia",
                optionsArray: tipoReferenciasOpciones,
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
    </>
  );
}
