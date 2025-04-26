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
import { useFetchCareerAssignPeriod } from "../../hooks/fetchCareers"

const arrayOption = [
    { value: "ocr", text: "OCR" },
    { value: "web", text: "WEB" },
    { value: "app", text: "APP" }
];

export const FormExamn = () => {
    const [response, setResponse] = useState(false)
    const { addExam } = useContext(ExamnsContext)
    const [array, setArray] = useState([])

    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: zodResolver(ExmansSchema)
    })

    const user = JSON.parse(localStorage.getItem('user'))
    const career_id = user?.career_id

    const { careerAssignmentsPeriods, getDataCareerAssignmentPeriods } = useFetchCareerAssignPeriod()

    useEffect(() => {
        if (career_id && !isNaN(career_id)) {
            getDataCareerAssignmentPeriods(career_id)
        } else {
            console.warn("career_id no válido:", career_id)
        }
    }, [career_id])

    useEffect(() => {
        if (careerAssignmentsPeriods.length > 0) {
            const periodOptions = careerAssignmentsPeriods.map(period => ({
                value: period.id,
                text: `${period.period}${period.level ? ` (Nivel ${period.level})` : ''}`
            }))
            setArray(periodOptions)
        }
    }, [careerAssignmentsPeriods])

    const onSubmit = async (data) => {
        setResponse(true)

        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.description)
        formData.append("total_score", data.total_score)
        formData.append("passing_score", data.passing_score)
        formData.append("date_of_realization", data.date_of_realization)
        formData.append("type", data.type)
        formData.append("academic_management_period_id", data.academic_management_period_id)

        try {
            const response = await postApi("evaluations/save", formData)
            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] })
                }
                return
            }
            customAlert("success", "Examen creado con éxito")
            closeFormModal("registerExamn")
            addExam(response.data)
            resetForm()
        } catch (e) {
            if (e.response?.status === 403) {
                customAlert("warning", "No tienes permisos para realizar esta acción")
                closeFormModal("registerExamn")
            } else {
                customAlert("error", "Ocurrió un error al crear el examen")
            }
        } finally {
            setResponse(false)
        }
    }

    const resetForm = () => {
        reset({
            title: "",
            description: "",
            total_score: "",
            passing_score: "",
            date_of_realization: "",
            type: "",
            academic_management_period_id: "",
        })
    }

    const handleCancel = () => {
        resetForm()
        closeFormModal("registerExamn")
    }

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
                <Input name="total_score" control={control} type="number" placeholder="Ingrese la calificación total" />
                <Validate error={errors.total_score} />
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
                <SelectInput label="Seleccione el tipo" name="type" options={arrayOption} control={control} error={errors.type} />
                <Validate error={errors.type} />
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
