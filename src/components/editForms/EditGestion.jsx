/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useForm } from "react-hook-form"
import { Validate } from "../forms/components/Validate"
import { Button } from "../login/Button"
import { ContainerButton } from "../login/ContainerButton"
import { ContainerInput } from "../login/ContainerInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { AcademicSchema } from "../../models/schemas/AcademicSchema"
import { YearInput } from "../../components/forms/components/YearInput"
import { DateInput } from "../../components/forms/components/DateInput"
import { useContext, useEffect, useState } from "react"
import { GestionContext } from "../../context/GestionProvider"
import { postApi } from "../../services/axiosServices/ApiService"
import CancelButton from "../forms/components/CancelButon"

export const EditGestion = ({ data, closeModal }) => {
    const [response, setResponse] = useState(false)
    const { updateGestion } = useContext(GestionContext)
    const { control, handleSubmit, reset, setValue, register, formState: { errors }, setError } = useForm({ resolver: zodResolver(AcademicSchema) })

    useEffect(() => {
        if (data) {
            setValue("year", data.year)
            setValue("initial_date", data.initial_date)
            setValue("end_date", data.end_date)
        }
    }, [data, setValue])
    const onSubmit = async (formData) => {
        setResponse(true)

        const requestData = new FormData()
        requestData.append("year", formData.year)
        requestData.append("initial_date", formData.initial_date)
        requestData.append("end_date", formData.end_date)

        try {
            const response = await postApi(`management/edit/${data.id}`, requestData)
            setResponse(false)

            console.log("::Form::", formData)
            console.log("::RESPONSE::", response)

            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] })
                }
                return
            }
            updateGestion(response)
            reset()
        } catch (error) {
            console.error("Error al actualizar gestion:", error)
            setResponse(false)
        }
    }
    const handleCancel = () => {
        closeModal(); // Close the modal
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <YearInput errors={errors} register={register} label={"Año"} name={"year"} control={control} type={"date"} />
                <Validate error={errors.year} />
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
                <CancelButton disabled={response} onClick={handleCancel}/>
            </ContainerButton>
        </form>
    )
}
