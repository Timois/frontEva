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
import { ContainerButton } from "../login/ContainerButton"
import { Button } from "../login/Button"
import CancelButton from "./components/CancelButon"
import { DateInput } from "./components/DateInput"
import { useFetchCareerAssign, useFetchCareerAssignPeriod } from "../../hooks/fetchCareers"

const arrayOption = [
    { value: "web", text: "WEB" }
];
const names = [{ value: "PSA 1", text: "PSA 1" }, { value: "PSA 2", text: "PSA 2" }, { value: "PSA 3", text: "PSA 3" }, { value: "PSA 4", text: "PSA 4" }, { value: "PSA 5", text: "PSA 5" }]
import { useParams } from "react-router-dom" // ✅ NUEVO
import { SelectInput } from "./components/SelectInput"
import { useExamns } from "../../hooks/fetchExamns"

export const FormExamn = () => {
    const [response, setResponse] = useState(false)
    const { refreshExamns } = useExamns() // Obtener las evaluaciones desde el contexto o desde una API, por ejemplo, fetchExamsByCareer() o useFetchExamsByCareer()

    const [selectedPeriod, setSelectedPeriod] = useState(null) // ✅ NUEVO
    const { id: periodId } = useParams(); // ✅ Obtener el id del período desde la URL

    const { control, handleSubmit, reset, formState: { errors }, setError, setValue } = useForm({
        resolver: zodResolver(ExmansSchema)
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
            const foundPeriod = careerAssignmentsPeriods.find(p => p.id === parseInt(periodId));
            if (foundPeriod) {
                setSelectedPeriod(foundPeriod); // ✅ Guardar período seleccionado
                setValue("academic_management_period_id", foundPeriod.id); // ✅ Preasignar al formulario
            }
        }
    }, [careerAssignmentsPeriods, periodId, setValue]);

    const onSubmit = async (data) => {
        if (!data.academic_management_period_id) {
            customAlert("error", "No se encontró un período académico válido.");
            return;
        }

        setResponse(true);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("passing_score", Number(data.passing_score));
        formData.append("date_of_realization", new Date(data.date_of_realization).toISOString().split('T')[0]);
        formData.append("type", "web");
        formData.append("time", Number(data.time));
        formData.append("places", Number(data.places));
        formData.append("status", "inactivo");
        formData.append("academic_management_period_id", periodId);

        try {
            const response = await postApi("evaluations/save", formData);
            if (!response) throw new Error('No response from server');

            if (response.status === 422) {
                for (let key in response.data.errors) {
                    setError(key, { type: "custom", message: response.data.errors[key][0] });
                }
                return;
            }

            customAlert("Examen creado con éxito", "success");
            closeFormModal("registerExamn");
            await refreshExamns(career_id);
            resetForm();

        } catch (error) {
            if (response?.status === 403) {
                customAlert("No tienes permisos para realizar esta acción", "error");
            } else {
                customAlert(error.response?.data.message || "Error al crear el examen", "error");
            }
            closeFormModal("registerExamn");
            resetForm();
        } finally {
            setResponse(false);
        }
    }

    const resetForm = () => {
        reset({
            title: "",
            description: "",
            passing_score: "",
            date_of_realization: "",
            places: "",
            type: "",
            time: "",
        })
    }

    const handleCancel = () => {
        resetForm();
        closeFormModal("registerExamn");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerInput>
                <SelectInput name="title" options={names} label="Seleccione una opcion" control={control} />
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
                <Input name="places" control={control} type="number" placeholder="Ingrese el número de plazas" />
                <Validate error={errors.places} />
            </ContainerInput>
            <ContainerButton>
                <Button type="submit" name="submit" disabled={response}>
                    <span>{response ? "Cargando..." : "Guardar"}</span>
                </Button>
                <CancelButton disabled={response} onClick={handleCancel} />
            </ContainerButton>
        </form>
    )
}

