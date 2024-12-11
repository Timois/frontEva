/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import { ContainerButton } from '../login/ContainerButton'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AcademicSchema } from '../../models/schemas/AcademicSchema'
import { ContainerInput } from '../login/ContainerInput'
import { Button } from '../login/Button'
import { YearInput } from './components/YearInput'
import { Validate } from './components/Validate'
import { DateInput } from './components/DateInput'
import { GestionContext } from '../../context/GestionProvider'
import { postApi } from '../../services/axiosServices/ApiService'

export const  FormAcademic = () => {
    const [response, setResponse] = useState(false)
    const {addGestion} = useContext(GestionContext)
    const { control, handleSubmit, reset, register, formState: { errors }, setError } = useForm({ resolver: zodResolver(AcademicSchema) })

    const onSubmit = async (data) => {
        setResponse(true)

        const formData = new FormData()
        formData.append("year", data.year)
        formData.append("initial_date", data.initial_date)
        formData.append("end_date", data.end_date)
        
        const response = await postApi("management/save", formData)
        setResponse(false)

        if (response.status == 422) {
            for(var key in response.data.errors){
                setError(key, {type: "custom", message: response.data.errors[key][0]})
            }
            return null
        }
        addGestion(response)
        reset()
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
