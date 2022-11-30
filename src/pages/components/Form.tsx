import React, { Dispatch, SetStateAction, useState } from "react";
import StepperController from "./stepperController";
import DatosPersonales from "./steps/datosPersonales";
import Dependientes from "./steps/dependientes";
import parameters from "../../personalization/parameters.json";
import { trpc } from "../../utils/trpc";
import Sent from "./sent";

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
        postResult.mutate(results);
        setPosted(true);
      } catch (cause) {
        console.error({ cause }, "Failed Post");
      }
    }
  };

  const postDependientes = trpc.solicitudEmpleoPost.dependientes.useMutation({
    onSuccess(results) {
      console.log("DEPENDIENTES POST", results);
      setCurrentStep(parameters.steps.length + 1);
    },
  });

  const postResult = trpc.solicitudEmpleoPost.solicitudEmpleo.useMutation({
    onSuccess(result) {
      console.log("SOLICITUD POST", result);
      dependientes.forEach((dependiente: any) => {
        dependiente.codigo_solicitud = result.Numero;
        dependiente.cedula = String(dependiente?.cedula)?.replaceAll("-", "");
      });
      postDependientes.mutate(dependientes);
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
      case 4:
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
      case 5:
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
      case 6:
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
      case 7:
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
