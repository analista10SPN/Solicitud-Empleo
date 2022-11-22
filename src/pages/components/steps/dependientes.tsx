import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form';
import { number, object, string, z } from 'zod'
import { trpc } from '../../../utils/trpc';

interface dependientesProps {
  step:number,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  results:Object,
  setResults: Dispatch<SetStateAction<Object>>,

}

const schema = z.object({
  nombre: string().min(1,{message:"El nombre es requerido"}),
  cedula:string().min(13,{message:"Debe ingresar una cédula válida"}),
  sexo:string({invalid_type_error:"Debe indicar su sexo"}).min(1),
  nivelAcademico:object({
  label: string(),
  value: number(),
}).optional(),
  fechaNacimiento:string().min(1,{message:"La fecha de nacimiento es requerida"}),
  parentesco:object({
  label: string(),
  value: number(),
}).optional(),
})

export const Dependientes = ({ step, setCurrentStep,results, setResults}:dependientesProps) => {
 
    const {register, handleSubmit, formState: { errors }, reset, control, watch, setValue} = useForm({
    resolver: zodResolver(schema)
  });

    const nivelesAcademico = trpc.formOptions.getAllAcademicLevels.useQuery();

    const parentescos = trpc.formOptions.getAllRelationships.useQuery();
   

    return (
    <div>dependientes</div>
  )
}
