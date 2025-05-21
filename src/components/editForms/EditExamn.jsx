/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExmansSchema } from "../../models/schemas/ExmansSchema"
import { postApi } from "../../services/axiosServices/ApiService"
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

const arrayOption = [
    { value: "ocr", text: "OCR" },
    { value: "web", text: "WEB" },
    { value: "app", text: "APP" }
];

export const EditExamn = ({ data, closeModal }) => {
    const [response, setResponse] = useState(false)
    const { updateExamn } = useContext(ExamnsContext)
    const [array, setArray] = useState([])

    const { control, handleSubmit, reset, setValue, formState: { errors }, setError } = useForm({
        resolver: zodResolver(ExmansSchema),
    })
    
    const user = JSON.parse(localStorage.getItem('user'))
    const career_id = user?.career_id
    
    const { careerAssignments, getDataCareerAssignments } = useFetchCareerAssign(career_id)
    const { careerAssignmentsPeriods, getDataCareerAssignmentPeriods } = useFetchCareerAssignPeriod()

    useEffect(() => {
        const fetchData = async () => {
            if (career_id && !isNaN(career_id)) {
                await getDataCareerAssignments();
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
            const periodOptions = careerAssignmentsPeriods.map(period => ({
                value: period.id,
                text: `${period.period} (${new Date(period.initial_date).toLocaleDateString()} - ${new Date(period.end_date).toLocaleDateString()})`
            }));
            setArray(periodOptions);
        }
    }, [careerAssignmentsPeriods]);

    useEffect(() => {
        if (data) {
            reset({
                title: data.title,
                description: data.description,
                passing_score: String(data.passing_score), // Convertir a string
                date_of_realization: new Date(data.date_of_realization).toISOString().split('T')[0],
                type: data.type,
                time: data.time, // Agregar este campo si lo tienes en tu esquema de zod
                qualified_students: data.qualified_students,
                academic_management_period_id: String(data.academic_management_period_id) // Convertir a string
            });
        }
    }, [data, reset]);

    const onSubmit = async (formData) => {
        if (!formData.academic_management_period_id) {
            customAlert("Debe seleccionar un período académico", "error");
            return;
        }
        setResponse(true);
        
        const dataToSend = {
            ...formData,
            passing_score: Number(formData.passing_score),
            academic_management_period_id: Number(formData.academic_management_period_id),
            status: data.status, // Use existing status
            time: data.time, // Ensure it's converted to number
            qualified_students: Number(formData.qualified_students), // Ensure it's converted to number
            date_of_realization: formData.date_of_realization 
                ? new Date(formData.date_of_realization).toISOString().split('T')[0]
                : null    
        };

        try {
            const response = await postApi(`evaluations/edit/${data.id}`, dataToSend);
            
            if (response.status === 422) {
                for (const key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] });
                }
                return;
            }
            
            // Update the local state with the new data
            updateExamn({
                ...data,
                ...response.data || response,
                qualified_students: Number(formData.qualified_students)
            });
            
            customAlert("Examen actualizado con éxito", "success");
            closeFormModal("editarExamn");
        } catch (error) {
            if (error.response?.status === 403) {
                customAlert("No tienes permisos para realizar esta acción", "warning");
                closeModal("editarExamn");
            } else {
                customAlert("Error al actualizar el examen", "error");
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
                <Input name="title" control={control} type="text" placeholder="Ingrese un título" />
                <Validate error={errors.title} />
            </ContainerInput>
            <ContainerInput>
                <Input name="description" control={control} type="text" placeholder="Ingrese una descripción" />
                <Validate error={errors.description} />
            </ContainerInput>
            <ContainerInput>
                <Input name="passing_score" control={control} type="number" placeholder="Ingrese la calificacion de aprobacion" />
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
                <SelectInput label="Seleccione el tipo" name="type" options={arrayOption} control={control} error={errors.type} />
                <Validate error={errors.type} />
            </ContainerInput>
            <ContainerInput>
                <Input name="qualified_students" control={control} type="number" placeholder="Ingrese la cantidad de estudiantes habilitados" />
                <Validate error={errors.qualified_students} />
            </ContainerInput>
            <ContainerInput>
                <SelectInput label="Seleccione el periodo" name="academic_management_period_id" options={array} control={control} error={errors.academic_management_period_id} />
                <Validate error={errors.academic_management_period_id} />
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    {response ? "Actualizando..." : "Actualizar"}
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    )
}
