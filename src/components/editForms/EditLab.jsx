/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { LabsContext } from "../../context/LabsProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LabSchema } from "../../models/schemas/LabsSchema";
import { updateApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "../forms/components/Validate";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "../forms/components/CancelButon";

export const EditLab = ({ data }) => {
    const { updateLab } = useContext(LabsContext);
    const [response, setResponse] = useState(false);
    const [labId, setLabId] = useState(null);
    const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({
        resolver: zodResolver(LabSchema)
    });

    useEffect(() => {
        if (data) {
            setValue("name", data.name);
            setValue("location", data.location);
            setValue("equipment_count", data.equipment_count);
            setLabId(data.id);
        }
    }, [data, setValue]);
    

    const onSubmit = async (data) => {
        setResponse(true)

        const requestData = new FormData();
        requestData.append("name", data.name);
        requestData.append("location", data.location);
        requestData.append("equipment_count", data.equipment_count);

        try {
            const response = await updateApi(`laboratories/edit/${labId}`, requestData);
            setResponse(false);

            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, {
                        type: "custom",
                        message: response.data.errors[key][0],
                    });
                }
                return
            }
            if (response) {
                updateLab(response)
                customAlert("Laboratorio editado con éxito", "success")
                closeFormModal("editLab")
                reset()
            } else {
                customAlert("Error al editar el laboratorio", "error")
            }
        } catch (error) {
            if (error.response.status === 403) {
                customAlert("No tienes permiso para editar el laboratorio", "error")
                closeFormModal("editLab")
            } else {
                customAlert(error.response?.data.errors?.message || "Error al editar el laboratorio", "error")
                closeFormModal("editLab")
            }
        } finally {
            setResponse(false)
        }
    };
    const handleCancel = () => {
        closeFormModal("editLab")
        reset()
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
                <Input control={control} name="equipment_count" placeholder="Ingrese la cantidad de equipos" type="number" min="1" />
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
