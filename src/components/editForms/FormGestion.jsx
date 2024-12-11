/* eslint-disable no-unused-vars */
import React from 'react'
import { Button } from '../login/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AcademicSchema } from '../../models/schemas/AcademicSchema'
import { ContainerInput } from '../login/ContainerInput'
import { YearInput } from '../forms/components/YearInput'
import { Validate } from '../forms/components/Validate'
import { DateInput } from '../forms/components/DateInput'
import { ContainerButton } from '../login/ContainerButton'

export const  FormGestion = () => {
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ resolver: zodResolver(AcademicSchema) })

    const onSubmit = (data) => {
        console.log(data)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <YearInput errors={errors} register={register} label={"Año"} name={"year"} control={control} type={"date"}/>
                <Validate error={errors.year}/>
            </ContainerInput>
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