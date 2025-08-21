/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExmansSchema } from "../../models/schemas/ExmansSchema"
import { updateApi } from "../../services/axiosServices/ApiService"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { ContainerInput } from "../login/ContainerInput"
import { Input } from "../login/Input"
import { Validate } from "../forms/components/Validate"
import { SelectInput } from "../forms/components/SelectInput"
import { ContainerButton } from "../login/ContainerButton"
import { Button } from "../login/Button"
import CancelButton from "../forms/components/CancelButon"
import { DateInput } from "../forms/components/DateInput"
import { useFetchCareerAssign, useFetchCareerAssignPeriod } from "../../hooks/fetchCareers"
import { ExamnsContext } from "../../context/ExamnsProvider"
import { useParams } from "react-router-dom"
import { useExamns } from "../../hooks/fetchExamns"
const names = [{ value: "PSA 1", text: "PSA 1" }, { value: "PSA 2", text: "PSA 2" }, { value: "PSA 3", text: "PSA 3" }, { value: "PSA 4", text: "PSA 4" }, { value: "PSA 5", text: "PSA 5" }]

export const EditExamn = ({ data, closeModal }) => {
    const [response, setResponse] = useState(false)
    const { updateExamn } = useContext(ExamnsContext)
    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const { id: periodId } = useParams()
    const { refreshExamns } = useExamns()
    
    const { control, handleSubmit, reset, setValue, formState: { errors }, setError, register } = useForm({
        resolver: zodResolver(ExmansSchema),
    })
    
    const user = JSON.parse(localStorage.getItem('user'))
    const career_id = user?.career_id

    const { careerAssignments, getDataCareerAssignments } = useFetchCareerAssign()
    const { careerAssignmentsPeriods, getDataCareerAssignmentPeriods } = useFetchCareerAssignPeriod()

    useEffect(() => {
        const fetchData = async () => {
            if (career_id && !isNaN(career_id)) {
                await getDataCareerAssignments(career_id);
            }
        }
        fetchData();
    }, [career_id])
    useEffect(() => {
        const fetchPeriods = async () => {
            if (careerAssignments.length > 0) {
                const { academic_management_career_id } = careerAssignments[0];
                await getDataCareerAssignmentPeriods(academic_management_career_id);
            }
        }
        fetchPeriods();
    }, [careerAssignments]);

    useEffect(() => {
        if (careerAssignmentsPeriods.length > 0) {
            const foundPeriod = careerAssignmentsPeriods.find(p => p.id === parseInt(periodId));
            if (foundPeriod) {
                setSelectedPeriod(foundPeriod);
                setValue("academic_management_period_id", foundPeriod.id);
            }
        }
    }, [careerAssignmentsPeriods, periodId, setValue]);

    useEffect(() => {
        if (data) {
            reset({
                title: data.title,
                description: data.description,
                passing_score: data.passing_score, // Agregar este campo si lo tienes en tu esquema de zod
                date_of_realization: new Date(data.date_of_realization).toISOString().split('T')[0],
                type: data.type,
                time: data.time, // Agregar este campo si lo tienes en tu esquema de zod
                places: data.places, // Agregar este campo si lo tienes en tu esquema de zod
                academic_management_period_id: data.academic_management_period_id // Convertir a string
            });
        }
    }, [data, reset]);


    const onSubmit = async (formData) => {
        if (!formData.academic_management_period_id) {
            customAlert("Debe seleccionar un período académico", "error");
            return;
        }
        setResponse(true);
        const requestData = new FormData();
        requestData.append("title", formData.title);
        requestData.append("description", formData.description);
        requestData.append("passing_score", formData.passing_score);
        requestData.append("date_of_realization", formData.date_of_realization);
        requestData.append("type", "web");
        requestData.append("time", Number(formData.time));
        requestData.append("places", Number(formData.places));
        try {
            const response = await updateApi(`evaluations/edit/${data.id}`, requestData);

            if (response.status === 422) {
                for (const key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] });
                }
                return;
            }
            customAlert("Examen actualizado con éxito", "success");
            closeFormModal("editarExamn");
            updateExamn(response)
            await refreshExamns(career_id)
        } catch (error) {
            if (error.response?.status === 403) {
                customAlert("No tienes permisos para realizar esta acción", "warning");
                closeModal("editarExamn");
            } else {
                closeFormModal("editarExamn");
                customAlert(error.response?.data?.message || "Error al actualizar el examen", "error");
            }
        } finally {
            setResponse(false);
        }
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <SelectInput label="Seleccione una opcion" name="title" options={names} control={control} />
                <Validate error={errors.title} />
            </ContainerInput>
            <ContainerInput>
                <Input name="description" control={control} type="text" placeholder="Ingrese una descripción" />
                <Validate error={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <Input name="passing_score" control={control} type="number" placeholder="Ingrese la calificación mínima" />
                <Validate error={errors.passing_score} />
            </ContainerInput>
            <ContainerInput>
                <DateInput label="Fecha de realización" name="date_of_realization" control={control} type="date" />
                <Validate error={errors.date_of_realization} />
            </ContainerInput>
            <ContainerInput>
                <Input name="time" control={control} type="number" placeholder="Ingrese el tiempo en minutos" />
                <Validate error={errors.time} />
            </ContainerInput>
            <ContainerInput>
                <Input name="places" control={control} type="number" placeholder="Ingrese el número de lugares" />
                <Validate error={errors.places} />
            </ContainerInput>
            <input
                type="hidden"
                {...register("academic_management_period_id", { valueAsNumber: true })}
                value={parseInt(periodId)}
            />
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Cargando..." : "Guardar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    )
}
