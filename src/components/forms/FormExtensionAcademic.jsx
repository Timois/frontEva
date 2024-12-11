/* eslint-disable no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ExtensionAcademicSchema } from '../../models/schemas/ExtensionAcademicSchema'
import { ContainerButton } from '../login/ContainerButton'
import { Button } from '../login/Button'
import { ContainerInput } from '../login/ContainerInput'
import { Validate } from './components/Validate'
import { DateInput } from './components/DateInput'
import { SelectInput } from './components/SelectInput'
import { GestionContext } from '../../context/GestionProvider'
import { useFetchGestion } from '../../hooks/fetchGestion'
import { postApi } from '../../services/axiosServices/ApiService'
import { GestionExtensionContext } from '../../context/ExtensionGestionProvider'

export const FormExtensionAcademic = () => {
    const { getData } = useFetchGestion()
    const { gestions } = useContext(GestionContext)
    const [response, setResponse] = useState(false)
    const { addGestionExtension } = useContext(GestionExtensionContext)
    const [array, setArray] = useState([])
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({ resolver: zodResolver(ExtensionAcademicSchema) })

    const onSubmit = async (data) => {
        setResponse(true)

        const formData = new FormData()
        formData.append("date_extension", data.date_extension)
        formData.append("academic_management_id", data.academic_management_id)

        const response = await postApi("management_extension/save", formData)
        setResponse(false)

        if (response.status == 422) {
            for (var key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] })
            }
            return null
        }
        addGestionExtension(response)
        reset()
    }
    const formatData = () => {
        const newArray = gestions.map(element =>
        ({
            value: element.id, text: element.year
        })
        )
        setArray(newArray)
    }

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        formatData()
    }, [gestions])
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <DateInput label={"Fecha"} name={"date_extension"} control={control} type={"date"} />
                <Validate error={errors.initial_date} />
            </ContainerInput>

            <ContainerInput>
                <SelectInput
                    name="academic_management_id"
                    options={array}
                    control={control}
                    error={errors.type}
                />
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <Button type="button" name="reset" onClick={() => reset()}>
                    <span>Ver Extensions</span>
                </Button>
            </ContainerButton>
        </form>
    )
}
