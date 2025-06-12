/* eslint-disable react/prop-types */

import { useForm } from "react-hook-form"
import { Validate } from "../forms/components/Validate"
import { Button } from "../login/Button"
import { ContainerButton } from "../login/ContainerButton"
import { ContainerInput } from "../login/ContainerInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { AcademicSchema } from "../../models/schemas/AcademicSchema"
import { YearInput } from "../../components/forms/components/YearInput"
import { DateInput } from "../../components/forms/components/DateInput"
import { useContext, useEffect, useState     } from "react"
import { GestionContext } from "../../context/GestionProvider"
import { postApi } from "../../services/axiosServices/ApiService"
import CancelButton from "../forms/components/CancelButon"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { useFetchGestion } from "../../hooks/fetchGestion"

export const EditGestion = ({ data }) => {
    const [response, setResponse] = useState(false);
    const { updateGestion } = useContext(GestionContext)
    const { control, handleSubmit, reset, setValue, register, formState: { errors }, setError } = useForm({ resolver: zodResolver(AcademicSchema) })
    const { refreshGestions } = useFetchGestion()
    useEffect(() => {
        if (data) {
            setValue("year", data.year)
            setValue("initial_date", data.initial_date)
            setValue("end_date", data.end_date)
        }
    }, [data, setValue])
    const onSubmit = async (formData) => {
        setResponse(true);
        const requestData = new FormData();
        requestData.append("year", formData.year);
        requestData.append("initial_date", formData.initial_date);
        requestData.append("end_date", formData.end_date);

        try {
            const response = await postApi(`management/edit/${data.id}`, requestData);
            await refreshGestions();
            customAlert("Gestión Editada", "success");
            closeFormModal("editarGestion");
            updateGestion(response);
            reset();
        } catch (error) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                Object.entries(validationErrors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        setError(field, {
                            type: "custom",
                            message: messages[0]
                        });
                    }
                });
                customAlert(validationErrors.year[0], "error");
            } else if (error.response?.status === 403) {
                customAlert("No tienes permisos para realizar esta acción", "error");
                closeFormModal("editarGestion");
            } else {
                customAlert("Error al actualizar la gestión", "error");
                closeFormModal("editarGestion");
            }
        } finally {
            setResponse(false);
        }
    };
    const handleCancel = () => {
        closeFormModal("editarGestion");
    };
    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)}>
                <ContainerInput>
                    <YearInput errors={errors} register={register} label={"Año"} name={"year"} control={control} type={"date"} />
                    <Validate error={errors.year} />
                </ContainerInput>
                <ContainerInput>
                    <DateInput label={"Fecha de inicio"} name={"initial_date"} control={control} type={"date"} />
                    <Validate error={errors.initial_date} />
                </ContainerInput>
                <ContainerInput>
                    <DateInput label={"Fecha de fin"} name={"end_date"} control={control} type={"date"} />
                    <Validate error={errors.end_date} />
                </ContainerInput>
                <ContainerButton>
                    <Button type="submit" name="submit" disabled={response}>
                        <span>{response ? "Guardando..." : "Guardar"}</span>
                    </Button>
                    <CancelButton disabled={response} onClick={handleCancel} />
                </ContainerButton>
            </form>

        </>
    );
};
