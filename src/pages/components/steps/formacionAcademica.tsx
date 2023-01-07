import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { optional, number, object, string, z, unknown } from "zod";
import { trpc } from "../../../utils/trpc";
import parameters from "../../../personalization/parameters.json";
import StepperController from "../stepperController";
import Select from "react-select";
import InputMask from "react-input-mask";
import TableComponent from "../tableComponent";
import { useState, useEffect } from "react";
import Alert from "../alert";

interface keyable {
  [key: string]: any;
}

interface formacionAcademicaProps {
  step: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  formacionAcademicaArray: any[];
  setFormacionAcademicaArray: Dispatch<React.SetStateAction<any[]>>;
}

const schema = z.object({
  grado: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    {
      required_error: "Debe indicar el grado académico",
      invalid_type_error: "Debe indicar el grado académico",
    }
  ),
  fechaInicio: string().min(1, {
    message: "La fecha de inicio es requerida",
  }),
  fechaTermino: string().optional(),
  centroDocente: string().min(1, {
    message: "Debe indicar el nombre del centro docente",
  }),
  ciudad: object(
    {
      label: string(),
      value: number(),
    },
    {
      required_error: "Debe indicar la ciudad del centro docente",
      invalid_type_error: "Debe indicar la ciudad del centro docente",
    }
  ),
  carrera: string().optional(),
});

export default function FormacionAcademica({
  step,
  setCurrentStep,
  formacionAcademicaArray,
  setFormacionAcademicaArray,
}: formacionAcademicaProps) {
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

  const [openDateConflictAlert, setOpenDateConflictAlert] =
    useState<boolean>(false);
  const [isSubmitSuccesfull, setIsSubmitSuccesfull] = useState<boolean>(false);
  const [openDuplicateAlert, setOpenDuplicateAlert] = useState<boolean>(false);
  const [openDeleteConfirmationAlert, setOpenDeleteConfirmationAlert] =
    useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);

  const watchFields = watch(["fechaInicio"]);

  // API CALLS TO GET MENU OPTIONS DATA

  const nivelesAcademico = trpc.formOptions.getAllAcademicLevels.useQuery();

  const ciudades = trpc.formOptions.getAllCities.useQuery();

  //MENU OPTIONS VARIABLES

  const nivelesAcademicosOpciones: unknown[] = [];

  const ciudadesOpciones: unknown[] = [];

  //FILLING IN MENU OPTIONS VARIABLES WITH DATA

  nivelesAcademico.data?.forEach((nivel) => {
    if (nivel.CODIGO > 0) {
      nivelesAcademicosOpciones.push({
        value: nivel.CODIGO,
        label: nivel.DESCRIPCION,
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

  //Controller functions
  const onSave = (formValues: any) => {
    console.log("State Results:", formacionAcademicaArray);
    console.log("FORM VALUES:", formValues);

    //CHECK FOR DUPLICATE REGISTERS
    const formacionAcademicaArrayWithNewValue = [
      ...formacionAcademicaArray,
      formValues,
    ];
    const uniqueValues = new Set(
      formacionAcademicaArrayWithNewValue.map((v) => v.grado?.value)
    );
    const uniqueIds = new Set(
      formacionAcademicaArrayWithNewValue.map((v) => v.fechaInicio)
    );
    console.log(uniqueValues, formacionAcademicaArrayWithNewValue);

    if (uniqueIds.size < formacionAcademicaArrayWithNewValue.length) {
      console.log("duplicates found");
      setOpenDateConflictAlert(true);
      return;
    } else if (uniqueValues.size < formacionAcademicaArrayWithNewValue.length) {
      const possibleDuplicate = formacionAcademicaArray.find(
        (formacion) => formacion.grado.value === formValues.grado.value
      );
      if (possibleDuplicate) {
        console.log("duplicates found");
        setOpenDuplicateAlert(true);
        return;
      }
    }

    const startDate = new Date(formValues.fechaInicio);
    const endDate = new Date(
      formValues?.fechaTermino?.length > 0 ? formValues.fechaTermino : null
    );

    let invalidDate = false;
    formacionAcademicaArray.forEach((formacionAcademica) => {
      if (
        startDate.getTime() >=
          new Date(formacionAcademica.fechaInicio).getTime() &&
        startDate.getTime() <
          new Date(formacionAcademica.fechaTermino).getTime()
      ) {
        invalidDate = true;

        return;
      } else if (
        endDate.getTime() >=
          new Date(formacionAcademica.fechaInicio).getTime() &&
        endDate.getTime() < new Date(formacionAcademica.fechaTermino).getTime()
      ) {
        invalidDate = true;

        return;
      }
    });

    if (invalidDate) {
      setOpenDateConflictAlert(true);
      return;
    }

    //<--- IF NO DUPLICATES --->

    setFormacionAcademicaArray([...formacionAcademicaArray, formValues]);
    setIsSubmitSuccesfull(true);
  };

  const handleClick = (direction: string) => {
    let newStep = step;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds
    newStep > 0 &&
      newStep <= parameters.steps.length &&
      setCurrentStep(newStep);
  };

  //RESET AFTER SUBMITION

  useEffect(() => {
    if (isSubmitSuccesfull) {
      reset({
        grado: null,
        fechaInicio: "",
        fechaTermino: "",
        centroDocente: "",
        ciudad: null,
        carrera: "",
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
          "Está intentando ingresar un grado que ya existe en la tabla de Formación Académica.",
        ]}
        open={openDuplicateAlert}
        setClose={() => setOpenDuplicateAlert(false)}
      />

      <Alert
        title="Fecha Inválida"
        messages={["Las fechas indicadas chocan con fechas ya registradas."]}
        open={openDateConflictAlert}
        setClose={() => setOpenDateConflictAlert(false)}
      />

      <form className="text-center text-sm" onSubmit={handleSubmit(onSave)}>
        {/* Form Box */}
        <div
          className={`mt-8 w-72 rounded-md border border-gray-300 p-4 text-left lg:w-[40rem] ${
            formacionAcademicaArray?.length > 0 ? "lg:ml-[15%]" : ""
          }`}
        >
          {/* Form Title */}
          <h2 className="pl-2 text-lg font-semibold text-[color:var(--fontColor)]">
            Formación Académica
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
                Grado <b className="text-red-500">*</b>{" "}
              </p>
              <Controller
                name="grado"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Seleccione..."
                    className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                    {...field}
                    options={nivelesAcademicosOpciones}
                  />
                )}
              />
              {errors?.grado && (
                <span className="block text-sm text-red-500">
                  {errors.grado.message?.toString()}
                </span>
              )}
            </div>
          </div>

          {/* ROW 2 */}
          <div className="justify-between p-2 lg:flex lg:pt-6">
            <div className="block justify-start">
              <p className="text-md text-[color:var(--fontColor)]">
                Fecha de Inicio <b className="text-red-500">*</b>
              </p>
              <input
                type="date"
                max={`${new Date().getFullYear()}-${
                  new Date().getMonth().toString().length === 1 ? "0" : ""
                }${new Date().getMonth() + 1}-${
                  new Date().getDate().toString().length === 1 ? "0" : ""
                }${new Date().getDate()}`}
                {...register("fechaInicio")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
              />
              {errors?.fechaInicio && (
                <span className="block text-sm text-red-500">
                  {errors.fechaInicio.message?.toString()}
                </span>
              )}
            </div>

            <div className="block justify-start pt-4 lg:pt-0">
              <p className="text-md text-[color:var(--fontColor)]">
                Fecha de Término
              </p>
              <input
                type="date"
                min={watchFields[0]?.length > 0 ? watchFields[0] : ""}
                disabled={watchFields[0]?.length === 0 ? true : false}
                max={`${new Date().getFullYear()}-${
                  new Date().getMonth().toString().length === 1 ? "0" : ""
                }${new Date().getMonth() + 1}-${
                  new Date().getDate().toString().length === 1 ? "0" : ""
                }${new Date().getDate()}`}
                {...register("fechaTermino")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
              />
            </div>
          </div>

          {/* ROW 3 */}

          <div className="justify-between p-2 lg:flex lg:pt-6">
            <div className="block">
              <p className="text-md text-[color:var(--fontColor)]">
                Centro Docente <b className="text-red-500">*</b>
              </p>
              <input
                type="text"
                maxLength={60}
                {...register("centroDocente")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
              />
              {errors?.centroDocente && (
                <span className="block text-sm text-red-500">
                  {errors.centroDocente.message?.toString()}
                </span>
              )}
            </div>

            <div className="block justify-start pt-4 lg:pt-0">
              <p className="text-md text-[color:var(--fontColor)]">
                Ciudad del Centro Docente <b className="text-red-500">*</b>
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
          </div>

          {/* ROW 4 */}

          <div className="justify-between p-2 lg:flex lg:pt-6">
            <div className="block justify-start">
              <p className="text-md text-[color:var(--fontColor)]">
                Carrera o Especialidad
              </p>

              <input
                type="text"
                maxLength={60}
                {...register("carrera")}
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
        {((nivelesAcademicosOpciones?.length > 0 &&
          formacionAcademicaArray?.length > 0) ||
          openDeleteConfirmationAlert) && (
          <TableComponent
            data={formacionAcademicaArray}
            setData={setFormacionAcademicaArray}
            openDeleteConfirmationAlert={openDeleteConfirmationAlert}
            setOpenDeleteConfirmationAlert={setOpenDeleteConfirmationAlert}
            deleteConfirmation={deleteConfirmation}
            setDeleteConfirmation={setDeleteConfirmation}
            columnProps={[
              {
                name: "Grado",
                property: "grado.value",
                type: "select",
              },
              {
                name: "Fecha de Inicio",
                property: "fechaInicio",
                type: "date",
              },
              {
                name: "Fecha de Término",
                property: "fechaTermino",
                type: "date",
              },
              {
                name: "Centro Docente",
                property: "centroDocente",
                type: "text",
                max: 60,
              },
              {
                name: "Ciudad Centro Docente",
                property: "ciudad.value",
                type: "select",
              },
              {
                name: "Carrera o Especialidad",
                property: "carrera",
                type: "text",
                max: 60,
              },
            ]}
            selectOptions={[
              {
                id: "grado",
                optionsArray: nivelesAcademicosOpciones,
              },
              {
                id: "ciudad",
                optionsArray: ciudadesOpciones,
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
