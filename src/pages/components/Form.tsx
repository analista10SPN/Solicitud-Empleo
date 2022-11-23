import React, { Dispatch, SetStateAction, useState } from 'react'
import { DatosPersonales } from './steps/datosPersonales'
import { Dependientes } from './steps/dependientes'


interface formProps{
  step:number,
  setCurrentStep: Dispatch<SetStateAction<number>>,
}

export const FormComponent = ({step, setCurrentStep}:formProps) => {

  interface keyable {
    [key: string]: any  
  }

  const [results, setResults] = useState<keyable>({})
  const [dependientes, setDependientes] = useState<keyable[]>([])
  
  // console.log("RESULTS:",results['tieneDependiente']['label'])

 const formContent = () =>{ 
  switch(step){
    case 1: return <DatosPersonales step={step} setCurrentStep={setCurrentStep} results={results} setResults={setResults}/>
    case 2: return <Dependientes step={step} setCurrentStep={setCurrentStep} dependientes={dependientes} setDependientes={setDependientes} />
    case 3: return <div className='text-xl'> TO BE ADDED... </div>
    case 4: return <div className='text-xl'> TO BE ADDED... </div>
    case 5: return <div className='text-xl'> TO BE ADDED... </div>
    case 6: return <div className='text-xl'> TO BE ADDED... </div>
    case 7: return <div className='text-xl'> TO BE ADDED... </div>
    case 8: return <div className='text-xl'> TO BE ADDED... </div>
    case 9: return <div className='text-xl'> TO BE ADDED... </div>
    default: return <div></div>
  }}

  
  return <>
    {formContent()} 
  </>
}
