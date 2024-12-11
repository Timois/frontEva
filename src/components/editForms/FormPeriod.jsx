/* eslint-disable no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { PeriodSchema } from '../../models/schemas/PeriodSchema'
import { ContainerInput } from '../login/ContainerInput'
import { Input } from '../login/Input'
import { Validate } from '../forms/components/Validate'
import { SelectInput } from '../forms/components/SelectInput'
import { ContainerButton } from '../login/ContainerButton'
import { Button } from '../login/Button'


const levels = [
    {value: 1, text: "1"}, {value: 2, text: "2"}, {value: 3, text: "3"}, {value: 4, text: "4"}, {value: 5, text: "5"}
]
export const FormPeriod = () => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(PeriodSchema) })

    const onSubmit = (data) => {
        console.log(data)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
            <Input name={"name"} control={control} type={"text"} placeholder={"Ingrese un periodo"} />
                <Validate error={errors.period} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput options={levels} />
                <Validate error={errors.level} />
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