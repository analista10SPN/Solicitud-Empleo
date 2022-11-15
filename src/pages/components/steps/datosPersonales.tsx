import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import Select, { OptionsOrGroups } from 'react-select'
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { trpc } from '../../../utils/trpc';



//SetCanGoForward recieve as props

export const DatosPersonales = () => {


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

  const [paisSeleccionado, setPaisSeleccionado] = useState<number>(1)


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
    if(provincia.CODIGO>0 && paisSeleccionado ===1){
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

  return (
    <div className='w-72 lg:w-full rounded-md border border-gray-300 text-left mt-8 p-4'>
        <h2 className='text-lg text-[color:var(--fontColor)] pl-2 font-semibold'>Datos Personales</h2>
        <span className='text-sm text-gray-500 block pl-2 lg:w-full'>Los campos marcados con 
        <b className='text-red-500'> (*)</b> son obligatorios y deben ser llenados para enviar la solicitud.
        </span>
        
        {/* ROW 1 */}
        <div className='lg:flex p-2 justify-between pt-8'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Nombres <b className='text-red-500'>*</b> </p>
                <input type="text" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>
            
            <div className='block pt-4 lg:pt-0'> 
                <p className='text-[color:var(--fontColor)] text-md'>Primer Apellido <b className='text-red-500'>*</b></p>
                <input type="text" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>

        </div>

        {/* ROW 2 */}
        <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Segundo Apellido </p>
                <input type="text" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
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
                <input type="text" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>
            
            <div className='block pt-4 lg:pt-0'> 
                <p className='text-[color:var(--fontColor)] text-md'>Pasaporte</p>
                <input type="text" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>

        </div>

        {/* ROW 4 */}

        <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Sexo <b className='text-red-500'>*</b></p>
                
                <div className='flex'>
                <label className="inline-flex items-center pt-1">
                  <input type="radio" name='sexo' value={1} className='accent-[color:var(--stepperColor)]' />
                  <span className="ml-2">Femenino</span>
                </label>

                <label className="inline-flex items-center pt-1 pl-3">
                  <input type="radio" name='sexo' value={2} className='accent-[color:var(--stepperColor)]' />
                  <span className="ml-2">Masculino</span>
                </label>
                </div>

                 </div>
            
            <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Estado Civil <b className='text-red-500'>*</b></p>
                <Select placeholder='Seleccione...' className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0' options={estadoCivilOpciones} />
                 </div>

        </div>

        {/* ROW 5 */}

          <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Lugar Nacimiento <b className='text-red-500'>*</b></p>
                <input type="text" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>
            
            <div className='block pt-4 lg:pt-0'> 
                <p className='text-[color:var(--fontColor)] text-md'>Fecha Nacimiento <b className='text-red-500'>*</b></p>
                <input type="date" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>

        </div>

        {/* ROW 6 */}
         <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Dirección <b className='text-red-500'>*</b></p>
                <input type="text" className='hidden lg:block text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-[35rem] pt-1' />
                <textarea className='lg:hidden align-text-bottom text-md focus:outline-0 border border-gray-300 mt-1 block' name="direccion" id="direccion" cols={35} rows={3}/>
                 </div>
            

        </div>

        {/* ROW 7 */}
          <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Teléfono Celular <b className='text-red-500'>*</b></p>
                <div className='flex'>
                <FontAwesomeIcon className='text-gray-300 w-6 h-6 border-b border-gray-300 mt-1 pr-1 pl-2' icon={faPhone} />
                <input type="phone" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-[13.4rem] pt-1 pl-2' />
                 </div>
                 </div>
            
            <div className='block pt-4 lg:pt-0'> 
                <p className='text-[color:var(--fontColor)] text-md'>Teléfono Residencial</p>
                <div className='flex'>
                <FontAwesomeIcon className='text-gray-300 w-6 h-6 border-b border-gray-300 mt-1 pr-1 pl-2' icon={faPhone} />
                <input type="phone" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-[13.4rem] pt-1 pl-2' />
                 </div>
                 </div>

        </div>

        {/* ROW 8 */}
        <div className='lg:flex p-2 justify-between lg:pt-6'>

            <div className='block'> 
                <p className='text-[color:var(--fontColor)] text-md'>Correo Electrónico <b className='text-red-500'>*</b></p>
                <div className='flex'>
                <FontAwesomeIcon className='text-gray-300 w-6 h-6 border-b border-gray-300 mt-1 pr-1 pl-2' icon={faEnvelope} />
                <input type="email" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-[13.4rem] pt-1 pl-2' />
                 </div>
                 </div>
            
               <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Nacionalidad <b className='text-red-500'>*</b></p>
                <Select placeholder='Seleccione...' className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0' options={nacionalidadesOpciones} />
                 </div>

        </div>

        {/* ROW 9 */}
        <div className='lg:flex p-2 justify-between lg:pt-6'>

               <div className='block justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Pais <b className='text-red-500'>*</b></p>
                <Select placeholder='Seleccione...' className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0' options={paisesOpciones} />
                 </div>
            
               <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Provincia <b className='text-red-500'>*</b></p>
                  <Select placeholder='Seleccione...' className={`w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0` } options={provinciasOpciones} isDisabled={paisSeleccionado!==1}/>
                 </div>

        </div>

        {/* ROW 10 */}

        <div className='lg:flex p-2 justify-between lg:pt-6'>

               <div className='block justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Ciudad <b className='text-red-500'>*</b></p>
                <input type="text" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>
            
               <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Zona</p>
                 <input type="text" className='text-md focus:outline-0 border-t-0 border-r-0 border-l-0 border-b border-gray-300 w-full lg:w-60 pt-1' />
                 </div>

        </div>

        {/* ROW 11 */}
        <div className='lg:flex p-2 justify-between lg:pt-6'>

               <div className='block justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>Lengua Nativa</p>
                <Select placeholder='Seleccione...' className='w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0' options={idiomasOpciones} />
                 </div>
            
               <div className='block pt-4 lg:pt-0 justify-start'> 
                <p className='text-[color:var(--fontColor)] text-md'>¿Tiene dependientes económicos?</p>
                  <Select placeholder='Seleccione...' className={`w-full lg:w-60 pt-1 focus:outline-0 outline-none border-0` } options={[{value:'1',label:"Si"},{value:'0',label:"No"}]}/>
                 </div>

        </div>


        </div>
  )
}
