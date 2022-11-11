import React, { useState, useEffect, useRef } from "react";

type stepperProps = {
  steps: string[],
  currentStep : number,
}

const Stepper = ({ steps, currentStep}:stepperProps) => {
  const [newStep, setNewStep] = useState<any>([]);
  const stepsRef = useRef<Object>();

  const updateStep = (stepNumber:number, steps:any) => {
    const newSteps = [...steps];
    let count = 0;
    while (count < newSteps.length) {
      //current step
      if (count === stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: true,
          selected: true,
          completed: true,
        };
        count++;
      }

      //step completed
      else if (count < stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: true,
          completed: true,
        };
        count++;
      }
      //step pending
      else {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: false,
          completed: false,
        };
        count++;
      }
    }

    return newSteps;
  };

  useEffect(() => {
    const stepsState = steps.map((step, index) =>
      Object.assign(
        {},
        {
          description: step,
          completed: false,
          highlighted: index === 0 ? true : false,
          selected: index === 0 ? true : false,
        }
      )
    );

    stepsRef.current = stepsState;
    const current = updateStep(currentStep - 1, stepsRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  const stepsDisplay = newStep.map((step: { selected: any; completed: any; highlighted: any; description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, index: number) => {
    return (
      <div
        key={index}
        className={
          index !== newStep.length - 1
            ? "w-full flex items-center"
            : "flex items-center"
        }
      >
        <div className={`relative flex flex-col items-center text-[color:var(--stepperColor)]`}>
         <p> {index+1}/{newStep.length}</p>
          <div
            className={`rounded-full transition duration-500 ease-in-out border-2 border-gray-300 h-6 w-7 flex items-center justify-center py-3  ${
              step.selected
                ? `bg-white text-white font-bold border border-[color:var(--stepperColor)] `
                : ""
            }`}
          >
            {step.completed ? (
              <span className={`text-[color:var(--stepperColor)] font-bold text-xl`}>&#10061;</span>
            ) : (
              index + 1
            )}
          </div>
          {step.selected && <div
            className={`absolute top-0 text-center mt-16 w-32 text-xs font-medium uppercase ${
              step.highlighted ? `text-[color:var(--stepperColor)]` : "text-gray-400"
            }`}
          >
            {step.description}
          </div>}
        </div>
        <div
          className={`mb-[-20px] flex-auto border-t-2 transition duration-500 ease-in-out  ${
            step.completed ? `border-[color:var(--stepperColor)]` : "border-gray-300 "
          }  `}
        ></div>
      </div>
    );
  });

  return (
    <div className="mx-8 p-4 flex justify-between items-center">
      {stepsDisplay}
    </div>
  );
};
export default Stepper;