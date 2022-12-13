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

interface keyable {
  [key: string]: any;
}

interface idiomasProps {
  step: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  idiomasArray: any[];
  setIdiomasArray: Dispatch<React.SetStateAction<any[]>>;
}

const schema = z.object({
  idioma: object(
    {
      label: string().min(1),
      value: number().min(1),
    },
    {
      required_error: "Debe indicar el idioma",
      invalid_type_error: "Debe indicar el idioma",
    }
  ),
  lee: boolean(),
  habla: boolean(),
  escribe: boolean(),
});

export default function Idiomas({
  step,
  setCurrentStep,
  idiomasArray,
  setIdiomasArray,
}: idiomasProps) {
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

  // API CALLS TO GET MENU OPTIONS DATA

  const idiomas = trpc.formOptions.getAllLanguages.useQuery();

  //MENU OPTIONS VARIABLES

  const idiomasOpciones: unknown[] = [];

  //FILLING IN MENU OPTIONS VARIABLES WITH DATA

  idiomas.data?.forEach((idioma) => {
    if (idioma.Codigo > 0) {
      idiomasOpciones.push({
        value: idioma.Codigo,
        label: idioma.Descripcion,
      });
    }
  });

  //Controller functions
  const onSave = (formValues: any) => {
    console.log("State Results:", idiomasArray);
    console.log("FORM VALUES:", formValues);

    //CHECK FOR DUPLICATE REGISTERS
    const idiomasArrayWithNewValue = [...idiomasArray, formValues];
    const uniqueValues = new Set(
      idiomasArrayWithNewValue.map((v) => v.idioma?.value)
    );

    console.log(uniqueValues, idiomasArrayWithNewValue);

    if (uniqueValues.size < idiomasArrayWithNewValue.length) {
      const possibleDuplicate = idiomasArray.find(
        (i) => i.idioma.value === formValues.idioma.value
      );
      if (possibleDuplicate) {
        console.log("duplicates found");
        setOpenDuplicateAlert(true);
        return;
      }
    }

    //<--- IF NO DUPLICATES --->

    setIdiomasArray([...idiomasArray, formValues]);
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
        idioma: null,
        lee: false,
        habla: false,
        escribe: false,
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
          "Está intentando ingresar un idioma que ya existe en la tabla de Idiomas.",
        ]}
        open={openDuplicateAlert}
        setClose={() => setOpenDuplicateAlert(false)}
      />

      <form className="text-center text-sm" onSubmit={handleSubmit(onSave)}>
        {/* Form Box */}
        <div
          className={`mt-8 w-72 rounded-md border border-gray-300 p-4 text-left ${
            idiomasArray?.length > 0 ? "lg:ml-[26.5%]" : ""
          }`}
        >
          {/* Form Title */}
          <h2 className="pl-2 text-lg font-semibold text-[color:var(--fontColor)]">
            Idiomas
          </h2>
          <span className="block pl-2 text-sm text-gray-500 lg:w-full">
            Indique los idiomas que habla, lee y/o escribe.
          </span>

          {/* ROW 1 */}
          <div className="justify-between p-2 pt-8 lg:flex">
            <div className="block">
              <p className="text-md text-[color:var(--fontColor)]">
                Idioma <b className="text-red-500">*</b>{" "}
              </p>
              <Controller
                name="idioma"
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
              {errors?.idioma && (
                <span className="block text-sm text-red-500">
                  {errors.idioma.message?.toString()}
                </span>
              )}
            </div>
          </div>

          {/* ROW 2 */}
          <div className="justify-between p-2 lg:flex lg:pt-6">
            <div className="flex justify-start">
              <input
                id="default-checkbox"
                type="checkbox"
                {...register("lee")}
                className="mr-1 h-4 w-4 rounded-md border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <p className="text-md mr-3 text-[color:var(--fontColor)]">Lee</p>

              <input
                id="default-checkbox"
                type="checkbox"
                {...register("habla")}
                className="mr-1 h-4 w-4 rounded-md border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <p className="text-md mr-3 text-[color:var(--fontColor)]">
                Habla
              </p>

              <input
                id="default-checkbox"
                type="checkbox"
                {...register("escribe")}
                className="mr-1 h-4 w-4 rounded-md border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <p className="text-md mr-3 text-[color:var(--fontColor)]">
                Escribe
              </p>
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
        {((idiomasOpciones?.length > 0 && idiomasArray?.length > 0) ||
          openDeleteConfirmationAlert) && (
          <div className="lg:pl-[12.5%]">
            <TableComponent
              data={idiomasArray}
              setData={setIdiomasArray}
              openDeleteConfirmationAlert={openDeleteConfirmationAlert}
              setOpenDeleteConfirmationAlert={setOpenDeleteConfirmationAlert}
              deleteConfirmation={deleteConfirmation}
              setDeleteConfirmation={setDeleteConfirmation}
              columnProps={[
                {
                  name: "Idioma",
                  property: "idioma.value",
                  type: "select",
                },
                {
                  name: "Lee",
                  property: "lee",
                  type: "checkbox",
                },
                {
                  name: "Habla",
                  property: "habla",
                  type: "checkbox",
                },
                {
                  name: "Escribe",
                  property: "escribe",
                  type: "checkbox",
                },
              ]}
              selectOptions={[
                {
                  id: "idioma",
                  optionsArray: idiomasOpciones,
                },
              ]}
            />
          </div>
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
