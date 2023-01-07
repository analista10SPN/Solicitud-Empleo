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

interface dependientesProps {
  step: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  dependientes: any[];
  setDependientes: Dispatch<React.SetStateAction<any[]>>;
}

const schema = z.object({
  nombre: string().min(1, { message: "El nombre es requerido" }),
  cedula: string().regex(/^$|^[0-9]{3}?-?[0-9]{7}?-?[0-9]{1}?$/g, {
    message: "Debe indicar una cédula válida (opcional)",
  }),
  sexo: object(
    {
      label: string(),
      value: string(),
    },
    {
      required_error: "Debe indicar el sexo",
      invalid_type_error: "Debe indicar el sexo",
    }
  ),
  nivelAcademico: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    {
      required_error: "Debe indicar el nivel académico",
      invalid_type_error: "Debe indicar el nivel académico",
    }
  ),
  fechaNacimiento: string().min(1, {
    message: "La fecha de nacimiento es requerida",
  }),
  parentesco: object(
    {
      label: string(),
      value: number(),
    },
    {
      required_error: "Debe indicar el parentesco",
      invalid_type_error: "Debe indicar el parentesco",
    }
  ),
});

export default function Dependientes({
  step,
  setCurrentStep,
  dependientes,
  setDependientes,
}: dependientesProps) {
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
  const [openDeleteConfirmationAlert, setOpenDeleteConfirmationAlert] =
    useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [openMinimumAlert, setOpenMinimumAlert] = useState<boolean>(false);

  // API CALLS TO GET MENU OPTIONS DATA

  const nivelesAcademico = trpc.formOptions.getAllAcademicLevels.useQuery();

  const parentescos = trpc.formOptions.getAllRelationships.useQuery();

  //MENU OPTIONS VARIABLES

  const nivelesAcademicosOpciones: unknown[] = [];

  const parentescosOpciones: unknown[] = [];

  const sexoOpciones = [
    { label: "Femenino", value: "1" },
    { label: "Masculino", value: "2" },
  ];

  //FILLING IN MENU OPTIONS VARIABLES WITH DATA

  nivelesAcademico.data?.forEach((nivel) => {
    if (nivel.CODIGO > 0) {
      nivelesAcademicosOpciones.push({
        value: nivel.CODIGO,
        label: nivel.DESCRIPCION,
      });
    }
  });

  parentescos.data?.forEach((parentesco) => {
    if (parentesco.Parentesco_Codigo > 0) {
      parentescosOpciones.push({
        value: parentesco.Parentesco_Codigo,
        label: parentesco.Descripcion,
      });
    }
  });

  //Controller functions
  const onSave = (formValues: any) => {
    console.log("State Results:", dependientes);
    console.log("FORM VALUES:", formValues);

    //CHECK FOR DUPLICATE REGISTERS
    const dependientesWithNewValue = [...dependientes, formValues];
    const uniqueValues = new Set(dependientesWithNewValue.map((v) => v.nombre));
    const uniqueIds = new Set(dependientesWithNewValue.map((v) => v.cedula));
    console.log(uniqueValues, dependientesWithNewValue);

    if (
      uniqueIds.size < dependientesWithNewValue.length &&
      formValues?.cedula?.length > 0
    ) {
      console.log("duplicates found");
      setOpenDuplicateAlert(true);
      return;
    } else if (uniqueValues.size < dependientesWithNewValue.length) {
      const possibleDuplicate = dependientes.find(
        (dependiente) => dependiente.nombre === formValues.nombre
      );
      if (possibleDuplicate?.cedula === formValues?.cedula) {
        console.log("duplicates found");
        setOpenDuplicateAlert(true);
        return;
      }
    }

    //<--- IF NO DUPLICATES --->

    setDependientes([...dependientes, formValues]);
    setIsSubmitSuccesfull(true);
  };

  const handleClick = (direction: string) => {
    let newStep = step;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds

    if (direction === "next" && dependientes?.length === 0) {
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
        nivelAcademico: null,
        sexo: null,
        parentesco: null,
        nombre: "",
        fechaNacimiento: "",
        cedula: "",
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
          "Está intentando ingresar un dependiente que ya existe en la tabla de Dependientes Adicionales",
        ]}
        open={openDuplicateAlert}
        setClose={() => setOpenDuplicateAlert(false)}
      />
      <Alert
        title="Mínimo Requerido"
        messages={[
          "Debe agregar un mínimo de 1 dependiente adicional para continuar.",
        ]}
        open={openMinimumAlert}
        setClose={() => setOpenMinimumAlert(false)}
      />

      <form className="text-center text-sm" onSubmit={handleSubmit(onSave)}>
        {/* Form Box */}
        <div
          className={`mt-8 w-72 rounded-md border border-gray-300 p-4 text-left lg:w-[40rem] ${
            dependientes?.length > 0 ? "lg:ml-[15%]" : ""
          }`}
        >
          {/* Form Title */}
          <h2 className="pl-2 text-lg font-semibold text-[color:var(--fontColor)]">
            Dependientes
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
                Parentesco <b className="text-red-500">*</b>
              </p>
              <Controller
                name="parentesco"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Seleccione..."
                    className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                    {...field}
                    options={parentescosOpciones}
                  />
                )}
              />
              {errors?.parentesco && (
                <span className="block text-sm text-red-500">
                  {errors.parentesco.message?.toString()}
                </span>
              )}
            </div>

            <div className="block justify-start pt-4 lg:pt-0">
              <p className="text-md text-[color:var(--fontColor)]">
                Fecha Nacimiento <b className="text-red-500">*</b>
              </p>
              <input
                type="date"
                {...register("fechaNacimiento")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
              />
              {errors?.fechaNacimiento && (
                <span className="block text-sm text-red-500">
                  {errors.fechaNacimiento.message?.toString()}
                </span>
              )}
            </div>
          </div>

          {/* ROW 3 */}

          <div className="justify-between p-2 lg:flex lg:pt-6">
            <div className="block">
              <p className="text-md text-[color:var(--fontColor)]">Cédula</p>
              <InputMask
                mask="999-9999999-9"
                type="text"
                alwaysShowMask={false}
                {...register("cedula")}
                className="text-md w-full border-t-0 border-r-0 border-l-0 border-b border-gray-300 pt-1 focus:outline-0 lg:w-60"
              />
              {errors?.cedula && (
                <span className="block text-sm text-red-500">
                  {errors?.cedula.message?.toString()}
                </span>
              )}
            </div>

            <div className="block justify-start pt-4 lg:pt-0">
              <p className="text-md text-[color:var(--fontColor)]">
                Sexo <b className="text-red-500">*</b>
              </p>
              <Controller
                name="sexo"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Seleccione..."
                    className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                    {...field}
                    options={sexoOpciones}
                  />
                )}
              />
              {errors?.sexo && (
                <span className="block text-sm text-red-500">
                  {errors.sexo.message?.toString()}
                </span>
              )}
            </div>
          </div>

          {/* ROW 4 */}

          <div className="justify-between p-2 lg:flex lg:pt-6">
            <div className="block justify-start">
              <p className="text-md text-[color:var(--fontColor)]">
                Nivel Académico <b className="text-red-500">*</b>
              </p>

              <Controller
                name="nivelAcademico"
                control={control}
                render={({ field }) => (
                  <Select
                    key={"nivelAcademicoKey"}
                    placeholder="Seleccione..."
                    className="w-full border-0 pt-1 outline-none focus:outline-0 lg:w-60"
                    {...field}
                    options={nivelesAcademicosOpciones}
                  />
                )}
              />
              {errors?.nivelAcademico && (
                <span className="block text-sm text-red-500">
                  {errors.nivelAcademico.message?.toString()}
                </span>
              )}
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
        {((nivelesAcademicosOpciones?.length > 0 && dependientes?.length > 0) ||
          openDeleteConfirmationAlert) && (
          <TableComponent
            data={dependientes}
            setData={setDependientes}
            openDeleteConfirmationAlert={openDeleteConfirmationAlert}
            setOpenDeleteConfirmationAlert={setOpenDeleteConfirmationAlert}
            deleteConfirmation={deleteConfirmation}
            setDeleteConfirmation={setDeleteConfirmation}
            columnProps={[
              { name: "Nombre", property: "nombre", type: "text", max: 80 },
              {
                name: "Fecha Nacimiento",
                property: "fechaNacimiento",
                type: "date",
              },
              {
                name: "Nivel Académico",
                property: "nivelAcademico.value",
                type: "select",
              },
              {
                name: "Parentesco",
                property: "parentesco.value",
                type: "select",
              },
              { name: "Cédula", property: "cedula", type: "cedula" },
              { name: "Sexo", property: "sexo.value", type: "select" },
            ]}
            selectOptions={[
              {
                id: "nivelAcademico",
                optionsArray: nivelesAcademicosOpciones,
              },
              {
                id: "parentesco",
                optionsArray: parentescosOpciones,
              },
              {
                id: "sexo",
                optionsArray: sexoOpciones,
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
