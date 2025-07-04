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
import CancelButton from './components/CancelButon'
import { closeFormModal, customAlert } from '../../utils/domHelper'

const option = [{ value: "1", text: "periodo1" }, { value: "2", text: "periodo2" }, { value: "3", text: "periodo3" }, { value: "4", text: "periodo4" }, { value: "5", text: "periodo5" }]
export const FormPeriod = () => {

    const [response, setResponse] = useState(false)
    const { addPeriod } = useContext(PeriodContext)
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({ resolver: zodResolver(PeriodSchema) })
    const [preview, setPreview] = useState(null)
    const onSubmit = async (data) => {
        setResponse(true)

        const formData = new FormData()
        formData.append("period", data.period)
        formData.append("level", data.level)
        try {
        const response = await postApi("periods/save", formData)
        setResponse(false)
        if (response.status == 422) {
            for (var key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] })
            }
            return null
        }
        customAlert("Periodo Guardado", "success");
        closeFormModal("registerPeriod");
        addPeriod(response)
        resetForm()
        } catch (error) {
            if (error.response?.status == 403) {
                customAlert("No tienes permisos para realizar esta acción", "error");
                closeFormModal("registerPeriod");
            } else{
                customAlert(error.response?.data?.errors?.message || "Error al registrar el periodo", "error");
                closeFormModal("registerPeriod");
            }
        }finally{
            setResponse(false)
        }
    }

    const resetForm = () => {
        reset({ period: '', level: '' });
        setPreview(null);  // Limpiar la vista previa de la imagen
    };
    const handleCancel = () => {
        resetForm();
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <ContainerInput>
                <Input name={"period"} control={control} type={"text"} placeholder={"Ingrese un periodo"} />
                <Validate error={errors.period} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput
                    label="Seleccione un nivel"
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
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    )
}
