import React, { Dispatch, SetStateAction, useState } from "react";
import StepperController from "./stepperController";
import DatosPersonales from "./steps/datosPersonales";
import Dependientes from "./steps/dependientes";
import ExperienciaLaboral from "./steps/experienciaLaboral";
import parameters from "../../personalization/parameters.json";
import { trpc } from "../../utils/trpc";
import Sent from "./sent";
import FormacionAcademica from "./steps/formacionAcademica";
import Idiomas from "./steps/idiomas";
import InformacionesAdicionales from "./steps/informacionesAdicionales";
import ReferenciasPersonales from "./steps/referenciasPersonales";

interface formProps {
  step: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

export default function FormComponent({ step, setCurrentStep }: formProps) {
  interface keyable {
    [key: string]: any;
  }

  const [results, setResults] = useState<any>({});
  const [dependientes, setDependientes] = useState<any>([]);
  const [experienciasLaborales, setExperienciasLaborales] = useState<any>([]);
  const [formacionAcademicaArray, setFormacionAcademicaArray] = useState<any>(
    []
  );
  const [referenciasPersonales, setReferenciasPersonales] = useState<any>([]);
  const [idiomasArray, setIdiomasArray] = useState<any>([]);
  const [posted, setPosted] = useState<boolean>(false);

  const handleClick = (direction: string) => {
    let newStep = step;

    direction === "next" ? newStep++ : newStep--;

    if (
      direction !== "next" &&
      newStep === 2 &&
      results.tieneDependiente.value === "0"
    ) {
      newStep--;
    }
    // check if steps are within bounds
    newStep > 0 &&
      newStep <= parameters.steps.length &&
      setCurrentStep(newStep);

    if (newStep > parameters.steps.length && !posted) {
      try {
        results.cedula = String(results?.cedula)?.replaceAll("-", "");
        if (results.zona === undefined) {
          results.zona = { label: "", value: 0 };
        }

        if (results.posicionAspira2 === undefined) {
          results.posicionAspira2 = { label: "", value: 0 };
        }
        if (results.posicionAspira3 === undefined) {
          results.posicionAspira3 = { label: "", value: 0 };
        }

        if (results.manejaMotor === undefined) {
          results.manejaMotor = { label: "", value: 0 };
        }
        if (results.poseeVehiculo === undefined) {
          results.poseeVehiculo = { label: "", value: 0 };
        }

        postResult.mutate(results);
        setPosted(true);
      } catch (cause) {
        console.error({ cause }, "Failed Post");
      }
    }
  };

  const postReferenciasPersonales =
    trpc.solicitudEmpleoPost.referenciasPersonales.useMutation({
      onSuccess(results) {
        console.log("REFERENCIAS PERSONALES POST", results);
        setCurrentStep(parameters.steps.length + 1);
      },
    });

  const postIdiomas = trpc.solicitudEmpleoPost.idiomas.useMutation({
    onSuccess(results) {
      console.log("IDIOMAS POST", results);
      // setCurrentStep(parameters.steps.length + 1);
    },
  });

  const postFormacionAcademica =
    trpc.solicitudEmpleoPost.formacionAcademica.useMutation({
      onSuccess(results) {
        console.log("FORMACION ACADEMICA POST", results);
        // setCurrentStep(parameters.steps.length + 1);
      },
    });

  const postExperienciasLaborales =
    trpc.solicitudEmpleoPost.experienciaLaboral.useMutation({
      onSuccess(results) {
        console.log("EXPERIENCIA LABORAL POST", results);
      },
    });

  const postDependientes = trpc.solicitudEmpleoPost.dependientes.useMutation({
    onSuccess(results) {
      console.log("DEPENDIENTES POST", results);
      // setCurrentStep(parameters.steps.length + 1);
    },
  });

  const postResult = trpc.solicitudEmpleoPost.solicitudEmpleo.useMutation({
    onSuccess(result) {
      console.log("SOLICITUD POST", result);

      dependientes.forEach((dependiente: any) => {
        dependiente.codigo_solicitud = result.Numero;
        dependiente.cedula = String(dependiente?.cedula)?.replaceAll("-", "");
      });

      experienciasLaborales.forEach((experiencia: any) => {
        experiencia.codigo_solicitud = result.Numero;
        experiencia.salarioInicial = String(experiencia?.salarioInicial)
          ?.replace("$", "")
          ?.replaceAll(",", "");
        experiencia.salarioFinal = String(experiencia?.salarioFinal)
          ?.replace("$", "")
          ?.replaceAll(",", "");

        if (isNaN(Number(experiencia.salarioInicial)))
          experiencia.salarioInicial = String(0);
        if (isNaN(Number(experiencia.salarioFinal)))
          experiencia.salarioFinal = String(0);
      });

      formacionAcademicaArray.forEach((formacion: any) => {
        formacion.codigo_solicitud = result.Numero;
      });

      idiomasArray.forEach((idioma: any) => {
        idioma.codigo_solicitud = result.Numero;
      });

      referenciasPersonales.forEach((referencia: any) => {
        referencia.codigo_solicitud = result.Numero;
      });

      postDependientes.mutate(dependientes);
      postExperienciasLaborales.mutate(experienciasLaborales);
      postFormacionAcademica.mutate(formacionAcademicaArray);
      postIdiomas.mutate(idiomasArray);
      postReferenciasPersonales.mutate(referenciasPersonales);
    },
  });

  // console.log("RESULTS:",results['tieneDependiente']['label'])

  const formContent = () => {
    switch (step) {
      case 1:
        return (
          <DatosPersonales
            step={step}
            setCurrentStep={setCurrentStep}
            results={results}
            setResults={setResults}
          />
        );
      case 2:
        return (
          <Dependientes
            step={step}
            setCurrentStep={setCurrentStep}
            dependientes={dependientes}
            setDependientes={setDependientes}
          />
        );
      case 3:
        return (
          <ExperienciaLaboral
            step={step}
            setCurrentStep={setCurrentStep}
            experiencias={experienciasLaborales}
            setExperiencias={setExperienciasLaborales}
            tieneDependiente={
              results?.tieneDependiente?.value === "0" ? false : true
            }
          />
        );
      case 4:
        return (
          <FormacionAcademica
            step={step}
            setCurrentStep={setCurrentStep}
            formacionAcademicaArray={formacionAcademicaArray}
            setFormacionAcademicaArray={setFormacionAcademicaArray}
          />
        );
      case 5:
        return (
          <Idiomas
            step={step}
            setCurrentStep={setCurrentStep}
            idiomasArray={idiomasArray}
            setIdiomasArray={setIdiomasArray}
          />
        );
      case 6:
        return (
          <InformacionesAdicionales
            step={step}
            setCurrentStep={setCurrentStep}
            results={results}
            setResults={setResults}
          />
        );
      case 7:
        return (
          <ReferenciasPersonales
            step={step}
            setCurrentStep={setCurrentStep}
            referenciasPersonales={referenciasPersonales}
            setReferenciasPersonales={setReferenciasPersonales}
          />
        );
      case 8:
        return (
          <div className="text-center text-xl">
            {" "}
            TO BE ADDED...
            <StepperController
              handleClick={handleClick}
              currentStep={step}
              steps={parameters.steps}
              submit={false}
            />
          </div>
        );
      case 9:
        return (
          <div className="text-center text-xl">
            {" "}
            TO BE ADDED...
            <StepperController
              handleClick={handleClick}
              currentStep={step}
              steps={parameters.steps}
              submit={false}
            />
          </div>
        );
      case 10:
        return <Sent email={results?.email} />;
      default:
        return <div></div>;
    }
  };

  return <>{formContent()}</>;
}
