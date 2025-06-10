/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react"
import { GroupContext } from "../../context/GroupsProvider"
import { zodResolver } from "@hookform/resolvers/zod"
import { GroupSchema } from "../../models/schemas/GroupSchema"
import { useForm } from "react-hook-form"
import { fetchLabs } from "../../hooks/fetchLabs"
import CancelButton from "../forms/components/CancelButon"
import { Button } from "../login/Button"
import { ContainerButton } from "../login/ContainerButton"
import { Validate } from "../forms/components/Validate"
import { SelectInput } from "../forms/components/SelectInput"
import { ContainerInput } from "../login/ContainerInput"
import { DateInput } from "../forms/components/DateInput"
import { Input } from "../login/Input"
import { updateApi } from "../../services/axiosServices/ApiService"
import { closeFormModal, customAlert } from "../../utils/domHelper"

export const EditGroup = ({data}) => {
    const { updateGroup } = useContext(GroupContext)
    const [response, setResponse] = useState(false)
    const [array, setArray] = useState([])
    const [groupId, setGroupId] = useState(null)
    const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({
        resolver: zodResolver(GroupSchema),
    })

    const { labs, getDataLabs } = fetchLabs()
    useEffect(() => {
        getDataLabs()
    }, [])

    useEffect(() => {
        if (labs.length > 0) {
            const array = labs.map((lab) => {
                return { value: lab.id, text: `${lab.name} - ${lab.location}` }
            })
            setArray(array)
        }
    }, [labs])
    useEffect(() => {
        if (data) {
            setValue("name", data.name)
            setValue("description", data.description)
            setValue("initial_time", data.initial_time)
            setValue("end_time", data.end_time)
            setValue("lab_id", data.lab_id)
            setGroupId(data.id)
        }
    }, [data, setValue])
    const onSubmit = async (data) => {
        setResponse(true)
        const requestData = new FormData()
        requestData.append("name", data.name)
        requestData.append("description", data.description)
        requestData.append("initial_time", data.initial_time)
        requestData.append("end_time", data.end_time)
        requestData.append("lab_id", data.lab_id)
        
        try {
            const response = await updateApi(`groups/edit/${groupId}`, requestData)
            setResponse(false)

            if(response.status === 422){
                for(let key in response.data.errors){
                    setError(key, {type: "custom", message: response.data.errors[key][0] })
                }
                return
            }
            if(response){
                updateGroup(response)
                customAlert("Grupo actualizado correctamente", "success")
                closeFormModal("editarGrupo")
                reset()
            }else{
                customAlert("Error al actualizar el grupo", "error")
            }
        }catch(error){
            if(error.response.status === 403){
                customAlert("No tienes permisos para realizar esta acción", "error")
                closeFormModal("editarGrupo")
                reset()
            }else{
                customAlert(error.response?.data.errors?.message ||"Error al actualizar el grupo", "error")
                closeFormModal("editarGrupo")
            }
        }finally{
            setResponse(false)
        }
    }

    const handleCancel = () => {
        closeFormModal("editarGrupo")
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <Input name="name" placeholder="Ingrese el Nombre del grupo" control={control} errors={errors} />
                <Validate errors={errors.name} />
            </ContainerInput>
            <ContainerInput>
                <Input name="description" placeholder="Ingrese la descripción del grupo" control={control} errors={errors} />
                <Validate errors={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <div style={{ display: "flex", gap: "10px" }}>
                    <DateInput label={"Hora de inicio"} name={"initial_time"} control={control} type={"time"} />
                </div>
                <Validate errors={errors.initial_date} />
            </ContainerInput>
            <ContainerInput>
                <div style={{ display: "flex", gap: "10px" }}>
                    <DateInput label={"Hora de Fin"} name={"end_time"} control={control} type={"time"} />
                </div>
                <Validate errors={errors.end_date} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput label="Seleccione un Ambiente" name="laboratory_id" options={array} control={control} />
                <Validate errors={errors.lab_id} />
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
