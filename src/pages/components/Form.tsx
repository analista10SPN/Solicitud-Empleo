import React, { Dispatch, SetStateAction, useState } from 'react'
import StepperController from './stepperController'
import { DatosPersonales } from './steps/datosPersonales'
import parameters from '../../personalization/parameters.json'


type formProps={
  step:number,
  setCurrentStep: Dispatch<SetStateAction<number>>,
}
//SetCanGoForward pass as props
export const FormComponent = ({step, setCurrentStep}:formProps) => {

  const handleClick = (direction:string) => {
    
    let newStep = step;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds
    newStep > 0 && newStep <= parameters.steps.length && setCurrentStep(newStep);
  };

  const [termsAndConditions, setTermsAndConditions] = useState<boolean>(false)
  
  const onSave = () =>{
    console.log("Form Values:")
  }

 const formContent = () =>{ 
  switch(step){
    case 1: return <div className='text-sm text-center'>
      <input id="default-checkbox" type="checkbox" checked={termsAndConditions} onChange={()=>{setTermsAndConditions(!termsAndConditions)
      // setCanGoForward(termsAndConditions)
      }} className="w-4 h-4 text-blue-600 bg-gray-100 rounded-md mr-4 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
      Estoy de acuerdo con los 
      <span className='font-semibold text-blue-500 hover:text-blue-700 cursor-pointer'> Términos de uso</span> 
      {/* setCanGoForward pass as props */}
      <DatosPersonales/>
      </div>
    case 2: return <div className='text-xl'> STEP 2 </div>
    case 3: return <div className='text-xl'> STEP 3 </div>
    case 4: return <div className='text-xl'> STEP 4 </div>
    case 5: return <div className='text-xl'> STEP 5 </div>
    case 6: return <div className='text-xl'> STEP 6 </div>
    case 7: return <div className='text-xl'> STEP 7 </div>
    case 8: return <div className='text-xl'> STEP 8 </div>
    case 9: return <div className='text-xl'> STEP 9 </div>
    default: return <div></div>
  }}

  
  return <form onSubmit={onSave}>
    {formContent()}
     <StepperController handleClick={handleClick} currentStep={step} steps={parameters.steps}/>
  </form>
}
