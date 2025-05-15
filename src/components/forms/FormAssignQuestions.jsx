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
import { closeFormModal, customAlert } from "../../utils/domHelper"
import { useFetchAreasByCareer } from "../../hooks/fetchAreas"
import { postApi } from "../../services/axiosServices/ApiService"
import { useFetchExamns } from "../../hooks/fetchExamns"
import { useNavigate } from "react-router-dom"

export const FormAssignQuestions = ({ data }) => {
    const [response, setResponse] = useState(false)
    const [totalAssignedScore, setTotalAssignedScore] = useState(0)
    const { areas, getData } = useFetchAreasByCareer()
    const isLoading = useRef(false)
    const navigate = useNavigate()
    const [percentages, setPercentages] = useState({
        facil: 0,
        media: 0,
        dificil: 0
    });
    const [calculatedScores, setCalculatedScores] = useState({});
    const { fetchDisponibles } = useFetchExamns()
    const [disponibles, setDisponibles] = useState([])

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

    const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
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
                    puntajeTotal: 0,
                    porcentajeFacil: percentages.facil,
                    porcentajeMedia: percentages.media,
                    porcentajeDificil: percentages.dificil
                }))
            }
            reset(defaultValues)
        }
    }, [areas])

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name && name.startsWith('areas') && name.endsWith('puntajeTotal')) {
                const scores = value.areas?.map(area => Number(area.puntajeTotal) || 0) || [];
                const total = scores.reduce((sum, score) => sum + score, 0);
                setTotalAssignedScore(total);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    const handleAreaPercentageChange = (index, type, value) => {
        const newValue = Math.max(0, Math.min(100, Number(value)));
        setValue(`areas.${index}.porcentaje${type}`, newValue);

        const otherTypes = ['Facil', 'Media', 'Dificil'].filter(t => t !== type);
        const otherValues = otherTypes.map(t => Number(watch(`areas.${index}.porcentaje${t}`) || 0));
        const otherSum = otherValues.reduce((sum, val) => sum + val, 0);

        if (otherSum > 0) {
            const remaining = 100 - newValue;
            const factor = remaining / otherSum;
            otherTypes.forEach((t, i) => {
                const adjustedValue = Math.round(otherValues[i] * factor);
                setValue(`areas.${index}.porcentaje${t}`, adjustedValue);
            });
        } else {
            const remaining = 100 - newValue;
            const share = Math.floor(remaining / otherTypes.length);
            otherTypes.forEach((t, i) => {
                setValue(`areas.${index}.porcentaje${t}`, i === otherTypes.length - 1 ? remaining - share * (otherTypes.length - 1) : share);
            });
        }

        recalculateScores(index);
    };

    const recalculateScores = (index) => {
        const area = watch(`areas.${index}`);
        const totalScore = Number(area.puntajeTotal) || 0;
        const cantidadFacil = Number(area.cantidadFacil) || 0;
        const cantidadMedia = Number(area.cantidadMedia) || 0;
        const cantidadDificil = Number(area.cantidadDificil) || 0;

        const scores = calculateScoresByDifficulty(
            totalScore,
            cantidadFacil,
            cantidadMedia,
            cantidadDificil,
            Number(area.porcentajeFacil),
            Number(area.porcentajeMedia),
            Number(area.porcentajeDificil)
        );

        setCalculatedScores(prev => ({
            ...prev,
            [index]: scores
        }));
    };

    const watchedAreas = watch("areas");

    useEffect(() => {
        if (watchedAreas?.length > 0) {
            watchedAreas.forEach((_, index) => {
                recalculateScores(index);
            });
        }
    }, [watchedAreas]);

    const onSubmit = async (formData) => {
        if (totalAssignedScore !== Number(data.total_score)) {
            customAlert(`La suma de puntajes (${totalAssignedScore}) debe ser igual al puntaje total del examen (${data.total_score})`, "error")
            return
        }

        const questionsPerArea = {}
        formData.areas.forEach(area => {
            const cantidadTotal = Number(area.cantidadFacil || 0) + Number(area.cantidadMedia || 0) + Number(area.cantidadDificil || 0)

            if (cantidadTotal > 0) {
                questionsPerArea[area.area_id] = {
                    quantity: cantidadTotal,
                    score: Number(area.puntajeTotal),
                    porcentajes: {
                        facil: Number(area.porcentajeFacil),
                        media: Number(area.porcentajeMedia),
                        dificil: Number(area.porcentajeDificil)
                    }
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
            navigate("/administracion/examns")
        } catch (error) {
            customAlert("Error al realizar la asignación", "error")
        } finally {
            setResponse(false)
        }
    }

    const calculateScoresByDifficulty = (
        totalScore,
        cantidadFacil,
        cantidadMedia,
        cantidadDificil,
        porcentajeFacil,
        porcentajeMedia,
        porcentajeDificil
    ) => {
        const facilPorcentaje = porcentajeFacil / 100;
        const mediaPorcentaje = porcentajeMedia / 100;
        const dificilPorcentaje = porcentajeDificil / 100;

        const puntajeFacil = cantidadFacil > 0 ? (totalScore * facilPorcentaje) / cantidadFacil : 0;
        const puntajeMedia = cantidadMedia > 0 ? (totalScore * mediaPorcentaje) / cantidadMedia : 0;
        const puntajeDificil = cantidadDificil > 0 ? (totalScore * dificilPorcentaje) / cantidadDificil : 0;

        return {
            puntajeFacil: puntajeFacil.toFixed(2),
            puntajeMedia: puntajeMedia.toFixed(2),
            puntajeDificil: puntajeDificil.toFixed(2),
            puntajeTotalFacil: (totalScore * facilPorcentaje).toFixed(2),
            puntajeTotalMedia: (totalScore * mediaPorcentaje).toFixed(2),
            puntajeTotalDificil: (totalScore * dificilPorcentaje).toFixed(2)
        };
    }

    const resetForm = () => {
        reset({
            evaluation_id: data?.id || '',
            total_score: data?.total_score || '',
        })
    }

    const handleCancel = () => {
        closeFormModal()
        resetForm()
        navigate("/administracion/examns")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="alert alert-info mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <span>ID de Evaluación: {data?.id}</span>
                    <span>Puntaje Total del Examen: {data?.total_score}</span>
                    <span>Puntaje Asignado: {totalAssignedScore}</span>
                    {totalAssignedScore !== Number(data.total_score) && (
                        <p className="text-danger text-sm mt-2">
                            ⚠️ La suma de puntajes asignados no coincide con el puntaje total.
                        </p>
                    )}
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
                                            name={`areas.${index}.puntajeTotal`}
                                            type="number"
                                            placeholder="Puntaje total del área"
                                            control={control}
                                            onChange={() => recalculateScores(index)}
                                        />
                                        <Validate error={errors?.areas?.[index]?.puntajeTotal} />
                                    </ContainerInput>

                                    <div className="mb-2">
                                        <label>Distribución de porcentajes:</label>
                                        <div className="d-flex gap-2">
                                            {['Facil', 'Media', 'Dificil'].map(tipo => (
                                                <Input
                                                    key={tipo}
                                                    name={`areas.${index}.porcentaje${tipo}`}
                                                    type="number"
                                                    placeholder={`${tipo} %`}
                                                    control={control}
                                                    onChange={(e) => handleAreaPercentageChange(index, tipo, e.target.value)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label>Cantidades por dificultad:</label>
                                        <div className="d-flex gap-2">
                                            <Input name={`areas.${index}.cantidadFacil`} type="number" placeholder="Fácil" control={control} onChange={() => recalculateScores(index)} />
                                            <Input name={`areas.${index}.cantidadMedia`} type="number" placeholder="Media" control={control} onChange={() => recalculateScores(index)} />
                                            <Input name={`areas.${index}.cantidadDificil`} type="number" placeholder="Difícil" control={control} onChange={() => recalculateScores(index)} />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p><strong>Disponibilidad de preguntas:</strong></p>
                                        <ul>
                                            <li>Fácil: {disponibles?.[area.id]?.facil || 0}</li>
                                            <li>Media: {disponibles?.[area.id]?.media || 0}</li>
                                            <li>Difícil: {disponibles?.[area.id]?.dificil || 0}</li>
                                        </ul>
                                    </div>
                                    {calculatedScores[index] && (
                                        <div className="alert alert-secondary mt-2">
                                            <strong>Puntajes calculados:</strong>
                                            <ul className="mb-0">
                                                <li>Fácil: {calculatedScores[index].puntajeFacil} (Total: {calculatedScores[index].puntajeTotalFacil})</li>
                                                <li>Media: {calculatedScores[index].puntajeMedia} (Total: {calculatedScores[index].puntajeTotalMedia})</li>
                                                <li>Difícil: {calculatedScores[index].puntajeDificil} (Total: {calculatedScores[index].puntajeTotalDificil})</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ContainerButton>
            <button
                    type={"submit"}
                    name={"submit"}
                    disabled={response}
                    className="btn rounded-0 btn-lg"
                    style={{ backgroundColor: "#070785", color: "white" }}
                >
                    <span>{response ? "Guardando..." : "Guardar"}</span>
                </button>
                <CancelButton onClick={handleCancel} />
            </ContainerButton>
        </form>
    )
}
