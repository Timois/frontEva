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
                const correctAnswer = q.answers.find((a) => a.is_correct);
                const studentAnswer = q.answers.find((a) => a.id === q.student_answer);
                const noRespuesta = q.student_answer===null? "No respondió":null;

                return (
                    <div key={q.question_id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Pregunta {index + 1}</h5>
                            <p className="card-text">{q.question}</p>
                            <p>
                                <strong>Respuesta del estudiante:</strong>{" "}
                                {studentAnswer ? (
                                    <span className="text-primary">{studentAnswer}</span>
                                ) : (
                                    <span className="text-muted">{noRespuesta}</span>
                                )}
                            </p>
                            <ul className="list-group mb-3">
                                {q.answers.map((a) => (
                                    <li
                                        key={a.id}
                                        className={`list-group-item d-flex justify-content-between align-items-center
                      ${a.id === q.student_answer ? "list-group-item-info" : ""}
                      ${a.is_correct ? "list-group-item-success" : ""}
                    `}
                                    >
                                        {a.answer}
                                        <div>
                                            {a.id === q.student_answer && <span className="badge bg-primary me-1">Seleccionada</span>}
                                            {a.is_correct && <span className="badge bg-success">Correcta</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <p>
                                <strong>¿Respuesta correcta?</strong>{" "}
                                {q.is_correct ? (
                                    <span className="text-success">Sí</span>
                                ) : (
                                    <span className="text-danger">No</span>
                                )}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
