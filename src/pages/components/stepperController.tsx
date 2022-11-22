
type stepperControllerProps = {
    handleClick : (arg0: string)=>void,
    currentStep:number,
    steps: string[],
}



export default function StepperController({ handleClick, currentStep, steps }:stepperControllerProps) {
    return (
    <div className="container mt-4 mb-8 flex justify-around">
      <button
        onClick={(e) => { e.preventDefault() ;handleClick("back")}}
        className={`cursor-pointer rounded-xl border-2 border-slate-300 bg-white py-2 px-4 font-semibold uppercase text-slate-400 transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white  ${
          currentStep === 1 ? " cursor-not-allowed opacity-50 " : ""
        }`}
      >
        Atrás
      </button>

      {currentStep < steps.length &&
      <button
        type="submit"
        className={`cursor-pointer rounded-lg bg-[color:var(--stepperColor)] py-2 px-4 font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white`}
      >
        Siguiente
      </button>}

      {currentStep === steps.length && 
      <button
        type="submit"
        onClick={() => {handleClick("next")}}
        className={`cursor-pointer rounded-lg bg-[color:var(--stepperColor)] py-2 px-4 font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white`}
      >
       Enviar
      </button>}

    </div>
  );
}