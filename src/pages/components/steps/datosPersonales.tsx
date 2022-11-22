import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Select, { OptionsOrGroups } from 'react-select'
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { trpc } from '../../../utils/trpc';
import { FieldValues, UseFormRegister, useController, Control, Controller, UseFormWatch, UseFormSetValue, FieldErrorsImpl } from 'react-hook-form';
import InputMask from "react-input-mask";
import StepperController from '../stepperController';
import parameters from '../../../personalization/parameters.json'
import { useForm } from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import { literal, number, object, string, z} from "zod";

const edadMinima:number = 16;

const schema = z.object({
  nombres: string().min(1,{message:"El nombre es requerido"}),
  apellido1: string().min(1,{message:"El primer apellido es requerido"}),
  apellido2:string(),
  cedula:string().min(13,{message:"Debe ingresar una cédula válida"}),
  pasaporte:string(),
  sexo:string({invalid_type_error:"Debe indicar su sexo"}).min(1),
  estadoCivil:object({
  label: string().min(1),
  value: number().min(1),
},{required_error:"Debe indicar su estado civil"}),
  lugarNacimiento:string().min(1,{message:"El lugar de nacimiento es requerido"}),
  fechaNacimiento:string().min(1,{message:"La fecha de nacimiento es requerida"}),
  direccion:string().min(3,{message:"La dirección es requerida"}),
  telefono1:string().min(9,{message:"Ingrese un número telefónico válido"}),
  telefono2:string(),
  email:string().email({message:"Ingrese un correo electrónico válido"}),
  nacionalidad:object({
  label: string().min(1),
  value: number().min(1),
},{required_error:"Debe indicar su nacionalidad"}),
  pais:object({
  label: string().min(1),
  value: number().min(1),
},{required_error:"Debe indicar su pais de residencia"}),
  provincia:object({
  label: string().min(1),
  value: number().min(1),
},{required_error:"Debe indicar su provincia de residencia"}),
  ciudad:string().min(3,{message:"La ciudad es requerida"}),
  zona:string(),
  lenguaNativa:object({
  label: string().optional(),
  value: number().optional(),
}).optional(),
  tieneDependiente:object({
  label: string().optional(),
  value: string().optional(),
}).optional(),
  terms: literal(true)

})

interface datosPersonalesProps {
  step:number,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  results:Object,
  setResults: Dispatch<SetStateAction<Object>>,

}

export const DatosPersonales = ({ step, setCurrentStep,results, setResults}:datosPersonalesProps) => {

  const {register, handleSubmit, formState: { errors }, control, watch} = useForm({
    resolver: zodResolver(schema)
  });

  const [termsAndConditions, setTermsAndConditions] = useState<boolean>(false)

  const estadoCivilOpciones = [
  { value: 1, label: 'Soltero(a)' },
  { value: 2, label: 'Casado(a)' },
  { value: 3, label: 'Viudo(a)' },
  { value: 4, label: 'Divorciado(a)' },
  { value: 5, label: 'Unión Libre' },
]


  /** Llamadas a API con opciones a desplegar en elementos de Select */

  const nacionalidades = trpc.formOptions.getAllNationalities.useQuery();

  const paises = trpc.formOptions.getAllCountries.useQuery();

  const provincias = trpc.formOptions.getAllDominicanProvinces.useQuery();

  const idiomas = trpc.formOptions.getAllLanguages.useQuery();

   /**  */

    /**Arreglos de objetos a utilizar en los Selects */

  const nacionalidadesOpciones: Object[] = []

  const paisesOpciones: Object[] = []

  const provinciasOpciones: Object[] = []

  const idiomasOpciones: Object[] = []

    /**  */

  //Valor seleccionado de pais para filtrar las opciones de provincias
  const watchFields = watch(["pais"])



  /**Insercion de objetos con atributos value,label a utilizar en los Selects */

  nacionalidades.data?.forEach(nacionalidad=>{
    if(nacionalidad.Codigo>0){
      nacionalidadesOpciones.push({
        value:nacionalidad.Codigo,
        label:nacionalidad.Descripcion
      })
    }
  }
  )

  paises.data?.forEach(pais=>{
    if(pais.Codigo>0){
      paisesOpciones.push({
        value:pais.Codigo,
        label:pais.Descripcion
      })
    }
  }
  )

  provincias.data?.forEach(provincia=>{
    if(provincia.CODIGO>0 && provincia.CODIGO < 33 && watchFields[0]?.value === 1){
      provinciasOpciones.push({
        value:provincia.CODIGO,
        label:provincia.DESCRIPCION
      })
    }
    else if(watchFields[0]?.value !==1 && provincia.CODIGO>32){
        provinciasOpciones.push({
        value:provincia.CODIGO,
        label:provincia.DESCRIPCION
      })
    }
  }
  )

  idiomas.data?.forEach(idioma=>{
    if(idioma.Codigo>0){
      idiomasOpciones.push({
        value:idioma.Codigo,
        label:idioma.Descripcion
      })
    }
  }
  )

  const onSave = (formValues:any) =>{

      console.log("State Results:",results)
      console.log("FORM VALUES:",formValues)
      setResults(formValues)
      if(formValues?.tieneDependiente?.value === '1'){
        handleClick("next")
      }
      else{
        setCurrentStep(3)
      }
    
  }


  const handleClick = (direction:string) => {
   
    let newStep = step;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds
    newStep > 0 && newStep <= parameters.steps.length && setCurrentStep(newStep);
    
  };

  return (
    <form className='text-sm text-center' onSubmit={handleSubmit(onSave)}>
      
      {/* Terms and Conditions: TO-DO (add Modal with the terms) */}
      <input id="default-checkbox" type="checkbox" {...register("terms")} checked={termsAndConditions} onChange={()=>{setTermsAndConditions(!termsAndConditions)}} 
      className="w-4 h-4 text-blue-600 bg-gray-100 rounded-md mr-4 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
      Estoy de acuerdo con los 
      <span className='font-semibold text-blue-500 hover:text-blue-700 cursor-pointer'> Términos de uso</span> 
      
      {/* Form Box */}
      <div className='w-72 lg:w-full rounded-md border border-gray-300 text-left mt-8 p-4'>
            {/* Form Title */}
            <h2 className='text-lg text-[color:var(--fontColor)] pl-2 font-semibold'>Datos Personales</h2>
            <span className='text-sm text-gray-500 block pl-2 lg:w-full'>Los campos marcados con 
            <b className='text-red-500'> (*)</b> son obligatorios y deben ser llenados para enviar la solicitud.
            </span>
        
        {/* ROW 1 */}
        <div className='lg:flex p-2 justify-between pt-8'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Nombres <b className='text-red-500'>*</b> </p>
                <input type="text" 
                 maxLength={30}
                {...register("nombres")}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                {errors?.nombres && <span className='text-red-500 text-sm block'>{errors.nombres.message?.toString()}</span>}
                 </div>
            
            <div className='block pt-4 lg:pt-0'> 
                <p className='text-[color:var(--fontColor)] text-md'>Primer Apellido <b className='text-red-500'>*</b></p>
                <input type="text"
                 maxLength={30} 
                {...register("apellido1")}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                  {errors?.apellido1 && <span className='text-red-500 text-sm block'>{errors.apellido1.message?.toString()}</span>}
                 </div>

        </div>

        {/* ROW 2 */}
        <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Segundo Apellido </p>
                <input type="text" 
                 maxLength={30}
                {...register("apellido2")}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>
            
            <div className='hidden pt-4 lg:pt-0'> 
                <p className='text-[color:var(--fontColor)] text-md'>TO BE ADDED <b className='text-red-500'>*</b></p>
                <input type="text" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>

        </div>

        {/* ROW 3 */}
        
        <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Cédula <b className='text-red-500'>*</b></p>
                <InputMask 
                mask='999-9999999-9'
                type="text"
                alwaysShowMask={false}
                 {...register('cedula')}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 {errors?.cedula && <span className='text-red-500 text-sm block'>{errors.cedula.message?.toString()}</span>}
                 </div>
            
            <div className='block pt-4 lg:pt-0'> 
                <p className='text-[color:var(--fontColor)] text-md'>Pasaporte</p>
                <input type="text" 
                 maxLength={25}
                {...register("pasaporte")}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>

        </div>

        {/* ROW 4 */}

        <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Sexo <b className='text-red-500'>*</b></p>
                
                <div className='flex'>
                <label className="inline-flex items-center pt-1">
                  <input type="radio" 
                  {...register("sexo")}
                  value={'1'} className='accent-[color:var(--stepperColor)]' />
                  <span className="ml-2">Femenino</span>
                </label>

                <label className="inline-flex items-center pt-1 pl-3">
                  <input type="radio" 
                  {...register("sexo")}
                  value={'2'} className='accent-[color:var(--stepperColor)]' />
                  <span className="ml-2">Masculino</span>
                </label>
                </div>
                 {errors?.sexo && <span className='text-red-500 text-sm block'>{errors.sexo.message?.toString()}</span>}

                 </div>
            
            <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Estado Civil <b className='text-red-500'>*</b></p>
                
                <Controller name='estadoCivil' control={control} render={({field})=>(
                  <Select placeholder='Seleccione...' className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0'
                {...field}
                options={estadoCivilOpciones} />
                )} />
                 {errors?.estadoCivil && <span className='text-red-500 text-sm block'>{errors.estadoCivil.message?.toString()}</span>}
                 </div>

        </div>

        {/* ROW 5 */}

          <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Lugar Nacimiento <b className='text-red-500'>*</b></p>
                <input type="text" 
                 maxLength={50}
                {...register('lugarNacimiento')}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 {errors?.lugarNacimiento && <span className='text-red-500 text-sm block'>{errors.lugarNacimiento.message?.toString()}</span>}
                 </div>
            
            <div className='block pt-4 lg:pt-0'> 
                <p className='text-[color:var(--fontColor)] text-md'>Fecha Nacimiento <b className='text-red-500'>*</b></p>
                <input type="date"
                max={`${new Date().getFullYear()-edadMinima}-${new Date().getMonth()+1}-${new Date().getDate()}`} 
                {...register('fechaNacimiento')}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 {errors?.fechaNacimiento && <span className='text-red-500 text-sm block'>{errors.fechaNacimiento.message?.toString()}</span>}
                 </div>

        </div>

        {/* ROW 6 */}
         <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Dirección <b className='text-red-500'>*</b></p>
                
               
                <textarea 
                maxLength={250}
                {...register("direccion")}
                className='text-md border lg:pt-2 mt-2 h-20 lg:h-8 focus:outline-0 lg:border-t-0 lg:border-r-0 lg:border-l-0 lg:border-b border-gray-300 w-full lg:w-[35rem] lg:mt-1' />
                {errors?.direccion && <span className='text-red-500 text-sm block'>{errors.direccion.message?.toString()}</span>}
                
              
                {/* <textarea 
                maxLength={250}
                {...register("direccion")}
                className='lg:hidden align-text-bottom text-md focus:outline-0 border border-gray-300 mt-1 block' cols={35} rows={3}/>
                {errors?.direccion && <span className='text-red-500 text-sm block lg:hidden'>{errors.direccion.message?.toString()}</span>} */}
                 </div>
            

        </div>

        {/* ROW 7 */}
          <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Teléfono Celular <b className='text-red-500'>*</b></p>
                <div className='flex'>
                <FontAwesomeIcon className='text-gray-300 w-6 h-6 border-b border-gray-300 mt-1 pr-1 pl-2' icon={faPhone} />
                <input type="text"
                maxLength={20}
                onKeyPress={(event) => {
                 if (!/[0-9]/.test(event.key)) {
                 event.preventDefault();
                   }
                 }} 
                inputMode='numeric' 
                {...register("telefono1")}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-[13.4rem] pt-1 pl-2' />
                 </div>
                 {errors?.telefono1 && <span className='text-red-500 text-sm block'>{errors.telefono1.message?.toString()}</span>}
                 </div>
            
            <div className='block pt-4 lg:pt-0'> 
                <p className='text-[color:var(--fontColor)] text-md'>Teléfono Residencial</p>
                <div className='flex'>
                <FontAwesomeIcon className='text-gray-300 w-6 h-6 border-b border-gray-300 mt-1 pr-1 pl-2' icon={faPhone} />
                <input type="text" 
                 maxLength={20}
                onKeyPress={(event) => {
                 if (!/[0-9]/.test(event.key)) {
                 event.preventDefault();
                   }
                 }} 
                inputMode='numeric'
                {...register("telefono2")}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-[13.4rem] pt-1 pl-2' />
                 </div>
                 </div>

        </div>

        {/* ROW 8 */}
        <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Correo Electrónico <b className='text-red-500'>*</b></p>
                <div className='flex'>
                <FontAwesomeIcon className='text-gray-300 w-6 h-6 border-b border-gray-300 mt-1 pr-1 pl-2' icon={faEnvelope} />
                <input type="email" 
                 maxLength={100}
                {...register("email")}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-[13.4rem] pt-1 pl-2' />
                 </div>
                 {errors?.email && <span className='text-red-500 text-sm block'>{errors.email.message?.toString()}</span>}
                 </div>
            
               <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Nacionalidad <b className='text-red-500'>*</b></p>
                 <Controller name='nacionalidad' control={control} render={({field})=>(
                  <Select placeholder='Seleccione...' className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0'
                 {...field}
                 options={nacionalidadesOpciones} />
                )} />
                {errors?.nacionalidad && <span className='text-red-500 text-sm block'>{errors.nacionalidad.message?.toString()}</span>}
                 </div>

        </div>

        {/* ROW 9 */}
        <div className='lg:flex p-2 justify-between lg:pt-6'>

               <div className='block justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Pais <b className='text-red-500'>*</b></p>
                <Controller name='pais' control={control} render={({field})=>(
                    <Select placeholder='Seleccione...' 
                    className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0' 
                    {...field} 
                    options={paisesOpciones}/>
                )} />
                {errors?.pais && <span className='text-red-500 text-sm block'>{errors.pais.message?.toString()}</span>}
                </div>
            
               <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Provincia <b className='text-red-500'>*</b></p>
                  <Controller name='provincia' control={control} render={({field})=>(
                    <Select placeholder='Seleccione...' 
                    className={`w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0` } 
                    {...field} 
                    options={provinciasOpciones}/>
                )} />
                  {errors?.provincia && <span className='text-red-500 text-sm block'>{errors.provincia.message?.toString()}</span>}
                 </div>

        </div>

        {/* ROW 10 */}

        <div className='lg:flex p-2 justify-between lg:pt-6'>

               <div className='block justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Ciudad <b className='text-red-500'>*</b></p>
                <input type="text" 
                 maxLength={30}
                {...register("ciudad")}
                className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 {errors?.ciudad && <span className='text-red-500 text-sm block'>{errors.ciudad.message?.toString()}</span>}
                 </div>
            
               <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Zona</p>
                 <input type="text" 
                  maxLength={50}
                 {...register("zona")}
                 className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>

        </div>

        {/* ROW 11 */}
        <div className='lg:flex p-2 justify-between lg:pt-6'>

               <div className='block justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Lengua Nativa</p>
                 <Controller name='lenguaNativa' control={control} render={({field})=>(
 
                    <Select placeholder='Seleccione...' 
                    className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0' 
                    {...field}  
                    options={idiomasOpciones} />
                
                )} />
                 </div>
            
               <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>¿Tiene dependientes económicos?</p>
                  <Controller name='tieneDependiente' control={control} render={({field})=>(
 
                    <Select placeholder='Seleccione...' 
                    className={`w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0` }
                    {...field} 
                    options={[{value:'1',label:"Si"},{value:'0',label:"No"}]}/>
                 
                
                )} />
                  </div>

        </div>

        </div>
        <StepperController steps={parameters.steps} currentStep={step} handleClick={handleClick}></StepperController>
        </form>
  )
}
