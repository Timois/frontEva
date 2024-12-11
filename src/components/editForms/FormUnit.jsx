/* eslint-disable no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { UnitSchema } from '../../models/schemas/UnitSchema'
import { ContainerInput } from '../login/ContainerInput'
import { Input } from '../login/Input'
import { Validate } from '../forms/components/Validate'
import { LabelLogin } from '../login/LabelLogin'
import { SelectInput } from '../forms/components/SelectInput'
import { ContainerButton } from '../login/ContainerButton'
import { Button } from '../login/Button'
const arrayOption = [{ value: "unidad", text: "Unidad" }, { value: "facultad", text: "Facultad" }]
export const FormUnit = () => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(UnitSchema) })

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
            <ContainerInput>
                <SelectInput options={arrayOption} />
                <Validate error={errors.type} />
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
