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
  results: any[];
  setResults: Dispatch<React.SetStateAction<any[]>>;
}

const schema = z.object({
  comentarioEscrito: string().optional(),
});

export default function Comentarios({
  step,
  setCurrentStep,
  results,
  setResults,
}: dependientesProps) {
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
    reset,
  } = useForm({
    defaultValues: JSON.parse(JSON.stringify(storedResultsValues)),
    resolver: zodResolver(schema),
  });

  //Controller functions
  const onSave = (formValues: any) => {
    console.log("Comentarios:------------>", results);
    setResults((prevState: any) => {
      return { ...prevState, ...formValues };
    });
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

  //RESET AFTER SUBMITION

  return (
    <form className="text-center text-sm" onSubmit={handleSubmit(onSave)}>
      {/* Form Box */}
      <div
        className={`mt-8 w-72 rounded-md border border-gray-300 p-4 text-left lg:w-[40rem]`}
      >
        {/* Form Title */}
        <h2 className="pl-2 text-lg font-semibold text-[color:var(--fontColor)]">
          Comentarios
        </h2>
        <span className="block pb-8 pl-2 text-sm text-gray-500 lg:w-full">
          Los campos marcados con
          <b className="text-red-500"> (*)</b> son obligatorios y deben ser
          llenados para enviar la solicitud.
        </span>

        <span className="pl-2 font-semibold text-[color:var(--fontColor)]">
          Comentario Escrito
        </span>
        <textarea
          {...register("comentarioEscrito")}
          className="text-md mt-2 ml-2 h-40 w-full border border-gray-300 p-2 focus:outline-0 lg:mt-1 lg:h-56 lg:w-[35rem] lg:pt-2"
        />
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
