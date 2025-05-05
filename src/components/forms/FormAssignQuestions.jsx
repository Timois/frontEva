/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { ContainerInput } from "../login/ContainerInput"
import { Input } from "../login/Input"
import { Validate } from "./components/Validate"
import { Button } from "../login/Button"
import { ContainerButton } from "../login/ContainerButton"
import CancelButton from "./components/CancelButon"
import { customAlert } from "../../utils/domHelper"
import { useFetchAreasByCareer } from "../../hooks/fetchAreas"
import { postApi } from "../../services/axiosServices/ApiService"
import { useFetchExamns } from "../../hooks/fetchExamns"

export const FormAssignQuestions = ({ data }) => {
    const [response, setResponse] = useState(false)
    const [totalAssignedScore, setTotalAssignedScore] = useState(0)
    const { areas, getData } = useFetchAreasByCareer()
    const isLoading = useRef(false)
    useEffect(() => {
        const loadAreas = async () => {
            if (isLoading.current) return

            const user = JSON.parse(localStorage.getItem('user'))
            const careerIdFromStorage = user ? user.career_id : null

            if (careerIdFromStorage) {
                try {
                    isLoading.current = true
                    await getData(careerIdFromStorage)
                } finally {
                    isLoading.current = false
                }
            }
        }
        loadAreas()
    }, [])
    const { fetchDisponibles } = useFetchExamns()
    const [disponibles, setDisponibles] = useState([])

    useEffect(() => {
        const loadDisponibles = async () => {
            const disponiblesPorArea = {}
            for (const area of areas) {
                try {
                    const disponibles = await fetchDisponibles(area.id)
                    if (disponibles) {
                        disponiblesPorArea[area.id] = disponibles
                    }
                } catch (error) {
                    console.error(`Error al cargar preguntas del área ${area.id}:`, error)
                }
            }
            setDisponibles(disponiblesPorArea)
        }
        if (areas.length > 0) {
            loadDisponibles()
        }
    }, [areas])

    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            evaluation_id: '',
            total_score: '',
            areas: []
        }
    })
    useEffect(() => {
        if (areas.length > 0) {
            const defaultValues = {
                evaluation_id: data?.id || '',
                total_score: data?.total_score || '',
                areas: areas.map(area => ({
                    area_id: area.id,
                    cantidadFacil: 0,
                    cantidadMedia: 0,
                    cantidadDificil: 0,
                    puntajeTotal: 0
                }))
            }
            reset(defaultValues)
        }
    }, [areas])
    const areaScores = watch('areas')?.map(area => Number(area.puntajeTotal) || 0) || []
    useEffect(() => {
        const total = areaScores.reduce((sum, score) => sum + score, 0)
        setTotalAssignedScore(total)
    }, [areaScores])
    const onSubmit = async (formData) => {
        if (totalAssignedScore !== Number(data.total_score)) {
            customAlert(`La suma de puntajes (${totalAssignedScore}) debe ser igual al puntaje total del examen (${data.total_score})`, "error")
            return
        }
        const questionsPerArea = {}
        formData.areas.forEach(area => {
            const cantidadTotal =
                Number(area.cantidadFacil || 0) +
                Number(area.cantidadMedia || 0) +
                Number(area.cantidadDificil || 0)

            if (cantidadTotal > 0) {
                questionsPerArea[area.area_id || area.id] = {
                    quantity: cantidadTotal,
                    score: Number(area.puntajeTotal)
                }
            }
        })
        const payload = {
            evaluation_id: Number(formData.evaluation_id),
            questions_per_area: questionsPerArea
        }
        setResponse(true)
        try {
            await postApi("question_evaluations/assign", payload)
            customAlert("Asignación realizada con éxito", "success")
        } catch (error) {
            customAlert("Error al realizar la asignación", "error")
        } finally {
            setResponse(false)
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="alert alert-info mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <span>ID de Evaluación: {data?.id}</span>
                    <span>Puntaje Total del Examen: {data?.total_score}</span>
                    <span>Puntaje Asignado: {totalAssignedScore}</span>
                </div>
            </div>
            {isLoading.current ? (
                <div>Cargando áreas...</div>
            ) : (
                <div className="row">
                    {areas?.map((area, index) => (
                        <div key={area.id} className="col-md-6 mb-4">
                            <div className="card">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">{area.name}</h5>
                                </div>
                                <div className="card-body">
                                    <ContainerInput>
                                        <Input
                                            name={`areas.${index}.cantidadFacil`}
                                            type="number"
                                            placeholder="Cantidad preguntas fáciles"
                                            control={control}
                                        />
                                        <small className="text-muted">
                                            Disponibles: {disponibles[area.id]?.facil ?? 0}
                                        </small>
                                        {Number(watch(`areas.${index}.cantidadFacil`) || 0) > (disponibles[area.id]?.facil ?? 0) && (
                                            <div className="text-danger">Excede las disponibles</div>
                                        )}
                                        <Validate error={errors?.areas?.[index]?.cantidadFacil} />
                                    </ContainerInput>
                                    <ContainerInput>
                                        <Input
                                            name={`areas.${index}.cantidadMedia`}
                                            type="number"
                                            placeholder="Cantidad preguntas medias"
                                            control={control}
                                        />
                                        <small className="text-muted">
                                            Disponibles: {disponibles[area.id]?.media ?? 0}
                                        </small>
                                        {Number(watch(`areas.${index}.cantidadMedia`) || 0) > (disponibles[area.id]?.media ?? 0) && (
                                            <div className="text-danger">Excede las disponibles</div>
                                        )}
                                        <Validate error={errors?.areas?.[index]?.cantidadMedia} />
                                    </ContainerInput>
                                    <ContainerInput>
                                        <Input
                                            name={`areas.${index}.cantidadDificil`}
                                            type="number"
                                            placeholder="Cantidad preguntas difíciles"
                                            control={control}
                                        />
                                        <small className="text-muted">
                                            Disponibles: {disponibles[area.id]?.dificil ?? 0}
                                        </small>
                                        {Number(watch(`areas.${index}.cantidadDificil`) || 0) > (disponibles[area.id]?.dificil ?? 0) && (
                                            <div className="text-danger">Excede las disponibles</div>
                                        )}
                                        <Validate error={errors?.areas?.[index]?.cantidadDificil} />
                                    </ContainerInput>

                                    <div className="alert alert-secondary">
                                        Total preguntas: {
                                            Number(watch(`areas.${index}.cantidadFacil`) || 0) +
                                            Number(watch(`areas.${index}.cantidadMedia`) || 0) +
                                            Number(watch(`areas.${index}.cantidadDificil`) || 0)
                                        }
                                    </div>

                                    <ContainerInput>
                                        <Input
                                            name={`areas.${index}.puntajeTotal`}
                                            type="number"
                                            placeholder="Puntaje total del área"
                                            control={control}
                                        />
                                        <Validate error={errors?.areas?.[index]?.puntajeTotal} />
                                    </ContainerInput>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ContainerButton>
                <Button type="submit" disabled={response || isLoading.current}>
                    {response ? "Guardando..." : "Guardar"}
                </Button>
                <CancelButton disabled={response || isLoading.current} />
            </ContainerButton>
        </form>
    )
}
