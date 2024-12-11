/* eslint-disable no-unused-vars */
import React from 'react'
import { Button } from '../login/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CareerSchema } from '../../models/schemas/CareerSchema'
import { ContainerInput } from '../login/ContainerInput'
import { Input } from '../login/Input'
import { Validate } from '../forms/components/Validate'
import { LabelLogin } from '../login/LabelLogin'
import { ContainerButton } from '../login/ContainerButton'

export const FormCareer = () => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(CareerSchema) })

    const onSubmit = (data) => {
        console.log(data)
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)} >
            <ContainerInput>
                <Input name={"name"} control={control} type={"text"} placeholder={"Ingrese un nombre"} />
                <Validate error={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input name={"initials"} control={control} type={"text"} placeholder={"Ingrese la sigla"} />
                <Validate error={errors.initials} />
            </ContainerInput>
            <ContainerInput>
                <LabelLogin text={"Selecciona un logo"}></LabelLogin>
                <Input name={"logo"} control={control} type={"file"} />
                <Validate error={errors.logo} />
            </ContainerInput>
            <ContainerButton>
                <Button type={"submit"} name={"submit"}>
                    <span>Guardar</span>
                </Button>
                <Button type={"button"} name={"reset"} onClick={reset}>
                    <span>Limpiar</span>
                </Button>
            </ContainerButton>
        </form>
  )
}
