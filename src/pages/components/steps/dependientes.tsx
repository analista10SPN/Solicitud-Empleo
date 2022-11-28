import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { optional, number, object, string, z } from 'zod'
import { trpc } from '../../../utils/trpc';
import parameters from '../../../personalization/parameters.json'
import StepperController from '../stepperController';
import Select from 'react-select';
import InputMask from "react-input-mask";
import { TableComponent } from '../tableComponent';

 interface keyable {
    [key: string]: any  
  }

interface dependientesProps {
  step:number,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  dependientes:any[],
  setDependientes: Dispatch<React.SetStateAction<any[]>>,

}

const schema = z.object({
  nombre: string().min(1,{message:"El nombre es requerido"}),
  cedula:string().regex(/^$|^[0-9]{3}?-?[0-9]{7}?-?[0-9]{1}?$/g,{message:"Debe indicar una cédula válida (opcional)"}),
  sexo:object({
  label: string(),
  value: string(),
},{required_error:"Debe indicar el sexo"}),
  nivelAcademico:object({
  label: string(),
  value: number(),
},{required_error:"Debe indicar el nivel académico"}),
  fechaNacimiento:string().min(1,{message:"La fecha de nacimiento es requerida"}),
  parentesco:object({
  label: string(),
  value: number(),
},{required_error:"Debe indicar el parentesco"}),
})



export const Dependientes = ({ step, setCurrentStep,dependientes, setDependientes}:dependientesProps) => {
 
    const {register, handleSubmit, formState: { errors }, control, watch} = useForm({
    resolver: zodResolver(schema)
  });

    

    const watchFields = watch(["cedula"])

     // API CALLS TO GET MENU OPTIONS DATA

    const nivelesAcademico = trpc.formOptions.getAllAcademicLevels.useQuery();

    const parentescos = trpc.formOptions.getAllRelationships.useQuery();

    //MENU OPTIONS VARIABLES

    const nivelesAcademicosOpciones: Object[] = []

    const parentescosOpciones: Object[] = []

    const sexoOpciones = [{label:'Femenino', value: '1'},{label:'Masculino',value:'2'}]

    //FILLING IN MENU OPTIONS VARIABLES WITH DATA

    nivelesAcademico.data?.forEach(nivel=>{
    if(nivel.CODIGO>0){
      nivelesAcademicosOpciones.push({
        value:nivel.CODIGO,
        label:nivel.DESCRIPCION
      })
    }
  }
  )

    parentescos.data?.forEach(parentesco=>{
    if(parentesco.Parentesco_Codigo>0){
      parentescosOpciones.push({
        value:parentesco.Parentesco_Codigo,
        label:parentesco.Descripcion
      })
    }
  }
  )
   
  //Controller functions
   const onSave = (formValues:any) =>{

      console.log("State Results:",dependientes)
      console.log("FORM VALUES:",formValues)
      setDependientes([...dependientes,formValues])

    
  }


  const handleClick = (direction:string) => {
   
    let newStep = step;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds
    newStep > 0 && newStep <= parameters.steps.length && setCurrentStep(newStep);
    
  };

    return (
    <form className='text-sm text-center' onSubmit={handleSubmit(onSave)}>
      
      {/* Form Box */}
      <div className='w-72 lg:w-full rounded-md border border-gray-300 text-left mt-8 p-4'>
            {/* Form Title */}
            <h2 className='text-lg text-[color:var(--fontColor)] pl-2 font-semibold'>Dependientes</h2>
            <span className='text-sm text-gray-500 block pl-2 lg:w-full'>Los campos marcados con 
            <b className='text-red-500'> (*)</b> son obligatorios y deben ser llenados para enviar la solicitud.
            </span>
        
        {/* ROW 1 */}
        <div className='lg:flex p-2 justify-between pt-8'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Nombre <b className='text-red-500'>*</b> </p>
                <textarea  
                 maxLength={80}
                {...register("nombre")}
                className='text-md border lg:pt-2 mt-2 h-10 lg:h-8 focus:outline-0 lg:border-t-0 lg:border-r-0 lg:border-l-0 lg:border-b border-gray-300 w-full lg:w-[35rem] lg:mt-1'/>
                {errors?.nombre && <span className='text-red-500 text-sm block'>{errors.nombre.message?.toString()}</span>}
                 </div>

        </div>

        {/* ROW 2 */}
        <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Fecha Nacimiento <b className='text-red-500'>*</b></p>
                <input type="date" 
                {...register('fechaNacimiento')}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 {errors?.fechaNacimiento && <span className='text-red-500 text-sm block'>{errors.fechaNacimiento.message?.toString()}</span>}
                 </div>
            
              <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Nivel Académico <b className='text-red-500'>*</b></p>
                
                <Controller name='nivelAcademico' control={control} render={({field})=>(
                  <Select placeholder='Seleccione...' className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0'
                {...field}
                options={nivelesAcademicosOpciones} />
                )} />
                 {errors?.nivelAcademico && <span className='text-red-500 text-sm block'>{errors.nivelAcademico.message?.toString()}</span>}
                 </div>

        </div>

        {/* ROW 3 */}
        
        <div className='lg:flex p-2 justify-between lg:pt-6'>

              <div className='block justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Parentesco <b className='text-red-500'>*</b></p>
                <Controller name='parentesco' control={control} render={({field})=>(
                    <Select placeholder='Seleccione...' 
                    className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0' 
                    {...field} 
                    options={parentescosOpciones}/>
                )} />
                {errors?.parentesco && <span className='text-red-500 text-sm block'>{errors.parentesco.message?.toString()}</span>}
                </div>
            
            <div className='block pt-4 lg:pt-0'> 
                 <p className='text-[color:var(--fontColor)] text-md'>Cédula</p>
                <InputMask 
                mask='999-9999999-9'
                type="text"
                alwaysShowMask={false}
                 {...register('cedula')}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                  { errors?.cedula && <span className='text-red-500 text-sm block'>{errors?.cedula.message?.toString()}</span>}
                 </div>

        </div>

        {/* ROW 4 */}

        <div className='lg:flex p-2 justify-between lg:pt-6'>

              <div className='block justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Sexo <b className='text-red-500'>*</b></p>
                <Controller name='sexo' control={control} render={({field})=>(
                    <Select placeholder='Seleccione...' 
                    className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0' 
                    {...field} 
                    options={sexoOpciones}/>
                )} />
                {errors?.sexo && <span className='text-red-500 text-sm block'>{errors.sexo.message?.toString()}</span>}
                </div>
            
              <div className='hidden pt-4 lg:pt-0'> 
                <p className='text-[color:var(--fontColor)] text-md'>TO BE ADDED <b className='text-red-500'>*</b></p>
                <input type="text" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>

        </div>

        {/* ROW 5 */}

          <div className='flex justify-end p-2 lg:pt-6'>
            <button type='submit'
             className=' rounded-full hover:shadow-md shadow shadow-gray-800 hover:shadow-gray-700 pb-1 text-2xl w-9 h-9 text-white bg-[color:var(--stepperColor)]'>&#43;
             </button>
         

        </div>

        </div>
        {/* Table Component */}
        {(nivelesAcademicosOpciones.length > 0 && dependientes.length > 0) && <TableComponent data={dependientes} setData={setDependientes} columnProps={
          [{name:"Nombre",property:"nombre"},
          {name:"Fecha Nacimiento",property:"fechaNacimiento"},
          {name:"Nivel Académico",property:"nivelAcademico.value"},
          {name:"Parentesco",property:"parentesco.value"},
          {name:"Cédula",property:"cedula"},
          {name:"Sexo",property:"sexo.value"}]
        } 
        selectOptions={[{
          id:"nivelAcademico",
          optionsArray: nivelesAcademicosOpciones
        },
        {
          id:"parentesco",
          optionsArray: parentescosOpciones
        },
        {
          id:"sexo",
          optionsArray: sexoOpciones
        }]}/>}
        <StepperController steps={parameters.steps} currentStep={step} handleClick={handleClick} submit={false}></StepperController>
        </form>
  )
}
