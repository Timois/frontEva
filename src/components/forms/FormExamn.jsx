/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react"
import { ExamnsContext } from "../../context/ExamnsProvider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExmansSchema } from "../../models/schemas/ExmansSchema"
import { postApi } from "../../services/axiosServices/ApiService"
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { ContainerInput } from "../login/ContainerInput"
import { Input } from "../login/Input"
import { Validate } from "./components/Validate"
import { SelectInput } from "./components/SelectInput"
import { ContainerButton } from "../login/ContainerButton"
import { Button } from "../login/Button"
import CancelButton from "./components/CancelButon"
import { DateInput } from "./components/DateInput"
import { useFetchCareerAssign, useFetchCareerAssignPeriod } from "../../hooks/fetchCareers"

const arrayOption = [
    { value: "web", text: "WEB" }
];

export const FormExamn = () => {
    const [response, setResponse] = useState(false)
    const { addExamn } = useContext(ExamnsContext)
    const [array, setArray] = useState([])

    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: zodResolver(ExmansSchema)
    })
    
    const user = JSON.parse(localStorage.getItem('user'))
    const career_id = user?.career_id

    const { careerAssignments, getDataCareerAssignments } = useFetchCareerAssign(career_id)
    const { careerAssignmentsPeriods, getDataCareerAssignmentPeriods } = useFetchCareerAssignPeriod()

    // Obtienes los datos de la carrera asignada
    useEffect(() => {
        const fetchData = async () => {
            if (career_id && !isNaN(career_id)) {
                await getDataCareerAssignments();
            }
        }
        fetchData();
    }, [career_id])

    // Cuando careerAssignments esté listo, saco el id de la tabla intermedia
    useEffect(() => {
        const fetchPeriods = async () => {
            if (careerAssignments.length > 0) {
                const { academic_management_career_id } = careerAssignments[0];  // Desestructuramos directamente
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

    const onSubmit = async (data) => {
        if (!data.academic_management_period_id) {
            customAlert("error", "Debe seleccionar un período académico");
            return;
        }
        setResponse(true);
        const formData = new FormData();
        formData.append("title", data.title)
        formData.append("description", data.description)
        formData.append("passing_score", Number(data.passing_score))  // Convertir a número
        formData.append("date_of_realization", new Date(data.date_of_realization).toISOString().split('T')[0])  // Formatear fecha
        formData.append("qualified_students", data.qualified_students)
        formData.append("type", data.type)
        formData.append("time", Number(data.time))
        formData.append("status", "inactivo")
        formData.append("academic_management_period_id", String(data.academic_management_period_id))

        try {
            const response = await postApi("evaluations/save", formData)
            if (!response) {
                throw new Error('No response from server')
            }
            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] })
                }
                return
            }
            customAlert("Examen creado con éxito", "success")
            closeFormModal("registerExamn")
            addExamn(response)
            resetForm()
        } catch (e) {
            console.error('Error details:', e) // Para debug
            customAlert("Error al crear el examen", "error")
        } finally {
            setResponse(false)
        }
    }
    const resetForm = () => {
        reset({
            title: "",
            description: "",
            passing_score: "",
            date_of_realization: "",
            qualified_students: "",
            disqualified_students: "",
            type: "",
            time: "",
            academic_management_period_id: "",
        })
    }

    const handleCancel = () => {
        resetForm()
        closeFormModal("registerExamn")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Tus inputs siguen igual */}
            <ContainerInput>
                <Input name="title" control={control} type="text" placeholder="Ingrese un título" />
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
            {array.length === 0 && (
                <div style={{ color: 'orange', fontSize: '14px', marginBottom: '10px' }}>
                    No se encontraron periodos disponibles para esta carrera.
                </div>
            )}
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    {response ? "Cargando..." : "Guardar"}
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    )
}
