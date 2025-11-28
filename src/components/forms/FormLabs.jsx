import { useContext, useState } from "react"
import { LabsContext } from "../../context/LabsProvider"
import { useForm } from "react-hook-form"
import { LabSchema } from "../../models/schemas/LabsSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { postApi } from "../../services/axiosServices/ApiService"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { ContainerInput } from "../login/ContainerInput"
import { Input } from "../login/Input"
import { Validate } from "./components/Validate"
import { ContainerButton } from "../login/ContainerButton"
import CancelButton from "./components/CancelButon"
import { Button } from "../login/Button"

export const FormLabs = () => {
    const [response, setResponse] = useState(false)
    const { addLab } = useContext(LabsContext)
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: zodResolver(LabSchema),
    })
    const user = localStorage.getItem('user')
    const careerId = JSON.parse(user).career_id
    
    const onSubmit = async (data) => {
        setResponse(true)
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('location', data.location)
        formData.append('equipment_count', data.equipment_count)
        formData.append('career_id', careerId)
        try {
            const response = await postApi("laboratories/save", formData)
            if (!response) {
                customAlert("Error al registrar el laboratorio", "error")
            }
            if (response.status === 200) {
                for (let key in response.data) {
                    setError(key, { message: response.data[key][0] })
                }
                return
            }
            customAlert("Laboratorio registrado correctamente", "success")
            closeFormModal("registerLab")
            addLab(response)
            resetForm()
        } catch (error) {
            if (error.response.status === 403) {
                customAlert("No tienes permiso para registrar laboratorios", "error")
                closeFormModal("registerLab")
                resetForm()
            } else {
                customAlert(error.response?.data.errors?.message || "Error al registrar el laboratorio", "error")
                closeFormModal("registerLab")
                resetForm()
            }
        } finally {
            setResponse(false)
        }
    }
    const resetForm = () => {
        reset({
            name: '',
            location: '',
            equipment_count: '',
        })
    }
    const handleCancel = () => {
        resetForm()
        closeFormModal("registerLab")
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <Input control={control} name="name" placeholder="Ingrese el laboratorio" type="text" />
                <Validate errors={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input control={control} name="location" placeholder="Ingrese la ubicación" type="text" />
                <Validate errors={errors.location} />
            </ContainerInput>
            <ContainerInput>
                <Input control={control} name="equipment_count" placeholder="Ingrese la cantidad de equipos" type="number" min="1"/>
                <Validate errors={errors.equipment_count} />
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
