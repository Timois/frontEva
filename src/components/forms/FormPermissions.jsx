import { useContext, useState } from "react"
import { PermissionsContext } from "../../context/PermissionsProvider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PermissionsSchema } from "../../models/schemas/PermissionsSchema"
import { postApi } from "../../services/axiosServices/ApiService"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { ContainerInput } from "../login/ContainerInput"
import { Input } from "../login/Input"
import { Validate } from "./components/Validate"
import { ContainerButton } from "../login/ContainerButton"
import { Button } from "../login/Button"
import CancelButton from "./components/CancelButon"


export const FormPermissions = () => {
    const { addPermission } = useContext(PermissionsContext)
    const [response, setResponse] = useState(false)
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({ resolver: zodResolver(PermissionsSchema) })

    const onSubmit = async (data) => {
        setResponse(true)

        const formData = new FormData()
        formData.append("name", data.name)

        const response = await postApi("permissions/save", formData)
        setResponse(false)
        if (response.status == 422) {
            for (var key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] })
            }
            return null
        }
        customAlert("Permiso Guardado", "success");
        closeFormModal("registerPermission");
        addPermission(response)
        resetForm()
    }

    const resetForm = () => {
        reset({ name: '' });
    }

    const handleCancel = () => {
        resetForm();
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <ContainerInput>
                <Input name={"name"} type={"text"} placeholder={"Nombre"} control={control} errors={errors} />
                <Validate error={errors.name} />
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
