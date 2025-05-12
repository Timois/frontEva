
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import { ContainerButton } from '../login/ContainerButton'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AcademicSchema } from '../../models/schemas/AcademicSchema'
import { ContainerInput } from '../login/ContainerInput'
import { Button } from '../login/Button'
import { YearInput } from './components/YearInput'
import { Validate } from './components/Validate'
import { DateInput } from './components/DateInput'
import { GestionContext } from '../../context/GestionProvider'
import { postApi } from '../../services/axiosServices/ApiService'
import CancelButton from './components/CancelButon'
import { closeFormModal, customAlert } from '../../utils/domHelper'
import { Error422 } from '../../pages/errors/Error422';

export const FormAcademic = () => {
    const [response, setResponse] = useState(false)
    const [showError422, setShowError422] = useState(false);
    const { addGestion } = useContext(GestionContext)
    const { control, handleSubmit, reset, register, formState: { errors }, setError } = useForm({ resolver: zodResolver(AcademicSchema) })

    const [preview, setPreview] = useState(null)
    const onSubmit = async (data) => {
        setResponse(true);
        setShowError422(false);
        const formData = new FormData();
        formData.append("year", data.year);
        formData.append("initial_date", data.initial_date);
        formData.append("end_date", data.end_date);
        try {
            const response = await postApi("management/save", formData);

            customAlert("Gestion Guardada", "success");
            addGestion(response);
            resetForm();
            closeFormModal("resgistroGestion");
        } catch (error) {
            if (error.response?.status === 422) {
                setShowError422(true);
                // Manejar el formato específico del error
                if (error.response.data.errors) {
                    const errorMessages = [];
                    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                        if (Array.isArray(messages)) {
                            setError(field, {
                                type: "custom",
                                message: messages[0]
                            });
                            errorMessages.push(messages[0]);
                        }
                    });
                    // Mostrar todos los errores en una alerta
                    customAlert(errorMessages.join(', '), "error");
                }
            } else if (error.response?.status === 403) {
                customAlert("No tienes permisos para realizar esta acción", "error");
            } else {
                customAlert("Error al registrar la gestión", "error");
            }
            closeFormModal("resgistroGestion");
        } finally {
            setResponse(false);
        }
    };
    const resetForm = () => {
        reset({ year: '', initial_date: '', end_date: '' });
        setPreview(null);  // Limpiar la vista previa de la imagen
    };
    const handleCancel = () => {
        resetForm();
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
}
