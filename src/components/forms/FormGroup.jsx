import { useContext, useState } from "react"
import { GroupContext } from "../../context/GroupsProvider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { GroupSchema } from "../../models/schemas/GroupSchema"
import { postApi } from "../../services/axiosServices/ApiService"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { ContainerInput } from "../login/ContainerInput"
import { Input } from "../login/Input"
import { Validate } from "./components/Validate"
import { ContainerButton } from "../login/ContainerButton"
import { Button } from "../login/Button"
import CancelButton from "./components/CancelButon"
import { DateInput } from "./components/DateInput"

export const FormGroup = ({ evaluationId }) => {
    const [response, setResponse] = useState(false)
    const { addGroup } = useContext(GroupContext)
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(GroupSchema)
    })
    const onSubmit = async (data) => {
        setResponse(true)
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('evaluation_id', evaluationId)
        formData.append('start_time', data.start_time)
        formData.append('end_time', data.end_time)
        try {
            const response = await postApi("groups/save", formData)
            if (!response) {
                throw new Error("No se pudo guardar el grupo")
            }
            if (response.status === 200) {
                for (let key in response.data) {
                    setError(key, { type: "custom", message: response.data[key][0] })
                }
                return
            }
            customAlert("Grupo guardado correctamente", "success")
            closeFormModal("registerGroup")
            addGroup(response)
        } catch (error) {
            if (response.status === 403) {
                customAlert("No tienes permisos para guardar el grupo", "error")
                closeFormModal("registerGroup")
                resetForm()
            } else {
                customAlert(error.response?.data.errors?.message || "No se pudo guardar el grupo", "error")
                closeFormModal("registerGroup")
                resetForm()
            }
        } finally {
            setResponse(false)
        }
    }
    const resetForm = () => {
        reset({
            name: "",
            description: "",
            start_time: "",
            end_time: "",
        })
    }
    const handleCancel = () => {
        resetForm()
        closeFormModal("registerGroup")
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <Input name="name" label="Ingrese el Nombre del grupo" control={control} errors={errors} />
                <Validate errors={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input name="description" label="Ingrese la descripción del grupo" control={control} errors={errors} />
                <Validate errors={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <div style={{ display: "flex", gap: "10px" }}>
                    <DateInput label={"Fecha de inicio"} name={"initial_date"} control={control} type={"date"} />
                    <DateInput label={"Hora de inicio"} name={"initial_time"} control={control} type={"time"} />
                </div>
                <Validate errors={errors.initial_date} />
            </ContainerInput>
            <ContainerInput>
                <div style={{ display: "flex", gap: "10px" }}>
                    <DateInput label={"Fecha de Fin"} name={"end_date"} control={control} type={"date"} />
                    <DateInput label={"Hora de Fin"} name={"end_time"} control={control} type={"time"} />
                </div>
                <Validate errors={errors.end_date} />
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
