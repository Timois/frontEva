/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react"
import { SelectInput } from "../forms/components/SelectInput"
import { Validate } from "../forms/components/Validate"
import { Button } from "../login/Button"
import { ContainerButton } from "../login/ContainerButton"
import { ContainerInput } from "../login/ContainerInput"
import { Input } from "../login/Input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UnitSchema } from "../../models/schemas/UnitSchema"
import { postApi } from "../../services/axiosServices/ApiService"
import { UnitContext } from "../../context/UnitProvider"
import CancelButton from "../forms/components/CancelButon"

const arrayOption = [{ value: "unidad", text: "Unidad" }, { value: "facultad", text: "Facultad" }]
export const EditUnit = ({ data }) => {
    const [response, setResponse] = useState(false)
    const { updateUnit } = useContext(UnitContext)
    const [preview, setPreview] = useState(null)

    const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({
        resolver: zodResolver(UnitSchema),
    })
    useEffect(() => {
        if (data) {
            setValue("name", data.name)
            setValue("initials", data.initials)
            setValue("type", data.type)
            setPreview(data.logo)
        }
    }, [data, setValue])

    const onSubmit = async (formData) => {
        setResponse(true)

        const requestData = new FormData()
        requestData.append("name", formData.name)
        requestData.append("initials", formData.initials)
        requestData.append("type", formData.type)
        if (formData.logo && formData.logo[0]) {
            requestData.append("logo", formData.logo[0])
        }

        try {
            const response = await postApi(`unit/edit/${data.id}`, requestData)
            setResponse(false)

            console.log("::Form::", formData)
            console.log("::RESPONSE::", response)

            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] })
                }
                return
            }
            updateUnit(response)
            resetForm()
        } catch (error) {
            console.error("Error al actualizar unidad:", error)
            setResponse(false)
        }
    }
    const resetForm = () => {
        reset({ name: '', initials: '', type: '', logo: null });
        setPreview(null);  // Limpiar la vista previa de la imagen
    };

    const onChange = (e) => {
        setValue("logo", e.target.files)
        setPreview(URL.createObjectURL(e.target.files[0]))
    }
    const handleCancel = () => {
        resetForm();
    };
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
                <input
                    type="file"
                    onChange={onChange}
                />
                <Validate error={errors.logo} />
                {preview ? <img src={preview} alt="preview" width={80} height={80} /> : null}
            </ContainerInput>
            <ContainerInput>
                <SelectInput
                    label="Seleccione un tipo"
                    name="type"
                    options={arrayOption}
                    control={control}
                    error={errors.type}
                />
                <Validate error={errors.type} />
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
