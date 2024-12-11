/* eslint-disable no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ContainerInput } from '../login/ContainerInput'
import { Input } from '../login/Input'
import { Validate } from './components/Validate'
import { SelectInput } from './components/SelectInput'
import { PeriodSchema } from '../../models/schemas/PeriodSchema'
import { PeriodContext } from '../../context/PeriodProvider'
import { postApi } from '../../services/axiosServices/ApiService'
import { ContainerButton } from '../login/ContainerButton'
import { Button } from '../login/Button'

const option = [{ value: "1", text: "1" }, { value: "2", text: "2" }, { value: "3", text: "3" }, { value: "4", text: "4" }, { value: "5", text: "5" }]
export const FormPeriod = () => {

    const [response, setResponse] = useState(false)
    const { addPeriod } = useContext(PeriodContext)
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({ resolver: zodResolver(PeriodSchema) })
    const onSubmit = async (data) => {
        setResponse(true)

        const formData = new FormData()
        formData.append("period", data.period)
        formData.append("level", data.level)

        const response = await postApi("periods/save", formData)
        setResponse(false)
        if (response.status == 422) {
            for (var key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] })
            }
            return null
        }
        addPeriod(response)
        reset()
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <ContainerInput>
                <Input name={"period"} control={control} type={"text"} placeholder={"Ingrese un periodo"} />
                <Validate error={errors.period} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput
                    name={"level"}
                    control={control}
                    options={option}
                    error={errors.level}
                />
                <Validate error={errors.level} />
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <Button type="button" name="reset" onClick={() => reset()}>
                    <span>Limpiar</span>
                </Button>
            </ContainerButton>
        </form>
    )
}
