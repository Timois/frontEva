import { useContext, useEffect, useState } from "react"
import { useFetchPermission } from "../../hooks/fetchPermissions"
import { RolContext } from "../../context/RolesProvider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RolSchema } from "../../models/schemas/RolSchema"
import { postApi } from "../../services/axiosServices/ApiService"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { ContainerInput } from "../login/ContainerInput"
import { Input } from "../login/Input"
import { Validate } from "./components/Validate"
import { SelectInput } from "./components/SelectInput"
import { ContainerButton } from "../login/ContainerButton"
import { Button } from "../login/Button"
import CancelButton from "./components/CancelButon"

const arrayOption = [{ value: "permisos", text: "Permisos" }]
export const FormRol = () => {
    const { getData } = useFetchPermission()
    const [response, setResponse] = useState([])
    const { addRol } = useContext(RolContext)
    const { control, handleSubmit, reset, formState: { errors }, setError } =
        useForm({ resolver: zodResolver(RolSchema) });

    useEffect(() => {
        getData()
    }, [])

    const onSubmit = async (data) => {
        setResponse(true)
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("permissions", JSON.stringify(data.permissions))
        const response = await postApi("roles/save", formData)
        setResponse(false)
        if (response.status == 422) {
            for (var key in response.data.errors) {
                setError(key, { type: "custom", message: response.data.errors[key][0] })
            }
            return null
        }
        addRol(response)
        customAlert("Rol Guardado", "success");
        closeFormModal("registerRol");
        resetForm()
    }
    const resetForm = () => {
        reset({ name: '', permissions: [] });
    }

    const handleCancel = () => {
        resetForm();
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <Input name="name" type="text" placeholder="Ingrese el nombre del rol" control={control} />
                <Validate error={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput name="permissions" options={arrayOption} control={control} label={"Permisos"} />
                <Validate error={errors.permissions} />
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit">
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    )
}
