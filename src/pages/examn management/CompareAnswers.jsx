/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApi } from "../../services/axiosServices/ApiService";

export const CompareAnswers = () => {
    const { id } = useParams();
    const [evaluationData, setEvaluationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const data = await getApi(`student_evaluations/findAnswersCorrect/${id}`);
                setEvaluationData(data);
            } catch (err) {
                setError("Error al cargar las respuestas.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnswers();
    }, [id]);

    if (loading) return <p>Cargando respuestas...</p>;
    if (error) return <p>{error}</p>;

    const totalQuestions = evaluationData?.questions?.length || 0;
    const correctCount = evaluationData?.questions?.filter((q) => q.is_correct).length || 0;

    return (
        <div className="container mt-4">
            <h3>Comparación de Respuestas</h3>
            <p>
                <strong>Respuestas correctas:</strong> {correctCount} de {totalQuestions}
            </p>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-primary mb-3"
            >
                Volver a la Evaluación
            </button>
            {evaluationData?.questions?.map((q, index) => {
                const noRespuesta = q.student_answer === null;

                return (
                    <div key={q.question_id} className="card mb-4 shadow-sm border-0">
                        <div className={`card-header fw-bold d-flex justify-content-between align-items-center ${q.is_correct ? "bg-success text-white" : "bg-danger text-white"}`}>
                            <span>Pregunta {index + 1}</span>
                            <span>{q.is_correct ? "✔ Correcta" : "✘ Incorrecta"}</span>
                        </div>
                        <div className="card-body">
                            <p className="mb-3"><strong>{q.question}</strong></p>

                            <ul className="list-group mb-3">
                                {q.answers.map((a) => {
                                    const isSelected = a.id === Number(q.student_answer);
                                    const isCorrect = a.is_correct;

                                    let itemClass = "list-group-item d-flex justify-content-between align-items-center";
                                    if (isCorrect && isSelected) itemClass += " list-group-item-success"; // correcta y seleccionada
                                    else if (isCorrect) itemClass += " list-group-item-success";
                                    else if (isSelected) itemClass += " list-group-item-warning";

                                    return (
                                        <li key={a.id} className={itemClass}>
                                            <span>{a.answer}</span>
                                            <div>
                                                {isSelected && <span className="badge bg-warning text-dark me-1">Seleccionada</span>}
                                                {isCorrect && <span className="badge bg-success">Correcta</span>}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            {noRespuesta && (
                                <div className="alert alert-secondary py-2">El estudiante no respondió esta pregunta.</div>
                            )}

                            <div className="d-flex justify-content-end">
                                <small className="text-muted">Puntaje asignado: {q.score_assigned}</small>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
