/* eslint-disable no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ContainerInput } from '../login/ContainerInput'
import { ContainerButton } from '../login/ContainerButton'
import { Button } from '../login/Button'
import { Validate } from './components/Validate'
import { DateInput } from './components/DateInput'

export const FormPeriodExtension = () => {
  const { control, handleSubmit, reset,  formState: { errors } } = useForm({ resolver: zodResolver(FormPeriodExtension) })

    const onSubmit = (data) => {
        console.log(data)
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <DateInput label={"Fecha de inicio"} name={"initial_date"} control={control} type={"date"} />
                <Validate error={errors.initial_date} />
            </ContainerInput>
            <ContainerInput>
                <DateInput label={"Fecha de fin"} name={"end_date"} control={control} type={"date"} />
                <Validate error={errors.end_date} />
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
