import CancelButton from "./components/CancelButon"
import { SelectInput } from "./components/SelectInput"
import { Button } from "../login/Button"
import { ContainerButton } from "../login/ContainerButton"
import { ContainerInput } from "../login/ContainerInput"
import PropTypes from 'prop-types'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { postApi } from "../../services/axiosServices/ApiService"
import { AsignGestionSchema } from "../../models/schemas/AsignGestion"
import { useState } from "react"

export const RegisterManagement = ({ data }) => {
    const [response, setResponse] = useState(false)
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: zodResolver(AsignGestionSchema)
    })
    const onSubmit = async (data) => {
        setResponse(true)
        const formData = new FormData()
        formData.append("career_id", data.career_id)
        formData.append("academic_management_id", data.academic_management_id)

        reset({
            career_id: "",
            academic_management_id: ""
        })
        try {

            const response = await postApi("careers/assignManagement", formData)

            if (response.status == 422) {
                for (var key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] })
                }
                return null
            }

            customAlert("Gestion Registrada", "success")
            closeFormModal("asignarGestion")
        } catch (error) {
            if (error.response.status == 403) {
                customAlert("No tienes permisos para realizar esta acción", "error")
                closeFormModal("asignarGestion")
            } else {
                customAlert(error.response?.data.message || "Error al registrar la gestion", "error")
                closeFormModal("asignarGestion")
            }
        } finally {
            setResponse(false)
        }
    };

    const onError = (errors, e) => console.log(errors, e)
    const handleCancel = () => {
        reset({
            career_id: "",
            academic_management_id: ""
        })
    }
    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <ContainerInput>
                <SelectInput
                    label="Seleccione una carrera"
                    name="career_id"
                    options={data?.careers}
                    control={control}
                    errors={errors.career_id}
                />
            </ContainerInput>
            <ContainerInput>
                <SelectInput
                    label="Seleccione una gestion"
                    name="academic_management_id"
                    options={data?.academic_managements}
                    control={control}
                    error={errors.academic_management_id}
                />
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>Guardar</Button>
                <CancelButton onClick={handleCancel} disabled={response} />
            </ContainerButton>
        </form>
    )
}

RegisterManagement.propTypes = {
    data: PropTypes.object.isRequired
};