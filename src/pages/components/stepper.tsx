import React, { useState, useEffect, useRef } from "react";

type stepperProps = {
  steps: string[];
  currentStep: number;
};

const Stepper = ({ steps, currentStep }: stepperProps) => {
  const [newStep, setNewStep] = useState<any>([]);
  const stepsRef = useRef<unknown>();

  const updateStep = (stepNumber: number, steps: string[] | any) => {
    const newSteps = [...steps];
    let count = 0;
    while (count < newSteps.length) {
      //current step
      if (count === stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: true,
          selected: true,
          completed: false,
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
    const stepsState = steps?.map((step, index) =>
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

  const stepsDisplay = newStep?.map(
    (
      step: {
        selected: boolean;
        completed: boolean;
        highlighted: boolean;
        description: string;
      },
      index: number
    ) => {
      return (
        <div
          key={index}
          className={
            index !== newStep.length - 1
              ? "flex w-full items-center"
              : "flex items-center"
          }
        >
          <div
            className={`relative flex flex-col items-center text-[color:var(--stepperColor)]`}
          >
            <p>
              {" "}
              {index + 1}/{newStep.length}
            </p>
            <div
              className={`flex h-6 w-7 items-center justify-center rounded-full border-2 border-gray-300 py-3 transition duration-500 ease-in-out  ${
                step.selected
                  ? `border border-[color:var(--stepperColor)] bg-white font-bold text-[color:var(--stepperColor)] `
                  : ""
              }`}
            >
              {step.completed ? (
                <span
                  className={`text-xl font-bold text-[color:var(--stepperColor)]`}
                >
                  &#10003;
                </span>
              ) : (
                index + 1
              )}
            </div>
            {step.selected && (
              <div
                className={`absolute top-0 mt-16 hidden w-32 text-center text-xs font-medium uppercase lg:block ${
                  step.highlighted
                    ? `text-[color:var(--stepperColor)]`
                    : "text-gray-400"
                }`}
              >
                {step.description}
              </div>
            )}
          </div>
          <div
            className={`mb-[-20px] flex-auto border-t-2 transition duration-500 ease-in-out  ${
              step.completed
                ? `border-[color:var(--stepperColor)]`
                : "border-gray-300 "
            }  `}
          ></div>
        </div>
      );
    }
  );

  return (
    <div className="mx-8 flex items-center justify-between p-4">
      {stepsDisplay}
    </div>
  );
};
export default Stepper;
