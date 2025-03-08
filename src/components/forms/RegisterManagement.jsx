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

export const RegisterManagement = ({ data }) => {
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: zodResolver(AsignGestionSchema)
    })

    const onSubmit = async (data) => {
        const formData = new FormData()
        formData.append("career_id", data.career_id)
        formData.append("academic_management_id", data.academic_management_id)

        reset({
            career_id: "",
            academic_management_id: ""
        })

        const response = await postApi("career/assignManagement", formData)

        if (response.status == 422) {
            for (var key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] })
            }
            return null
        }

        customAlert("Gestion Registrada", "success")
        closeFormModal("asignarGestion")
    };

    const onError = (errors, e) => console.log(errors, e)

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
                <Button type="submit" name="submit">Guardar</Button>
                <CancelButton />
            </ContainerButton>
        </form>
    )
}

RegisterManagement.propTypes = {
    data: PropTypes.object.isRequired
};