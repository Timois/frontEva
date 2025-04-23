import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchAnswerByIdQuestion } from '../../../hooks/fetchAnswer';
import { getApi } from '../../../services/axiosServices/ApiService';
import { MdArrowBack } from 'react-icons/md';

export const Answer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questionAnswers, setQuestionAnswers] = useState([]);
    const [questionDetails, setQuestionDetails] = useState(null);
    const { getAnswer } = useFetchAnswerByIdQuestion();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const questionResponse = await getApi(`bank_questions/find/${id}`);
                setQuestionDetails(questionResponse);

                const answersResponse = await getAnswer(id);
                setQuestionAnswers(answersResponse.answers || []);
            } catch (error) {
                if (error.response?.status === 429) {
                    console.warn('Demasiadas peticiones. Intenta más tarde.');
                } else {
                    console.error('Error fetching data:', error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]); // solo id

    // En el render, antes de mostrar los datos
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <button
                className="btn btn-warning mb-3"
                onClick={() => navigate(-1)}
            >
                <MdArrowBack /> Volver
            </button>

            <div className="card bg-dark text-white">
                <div className="card-header">
                    <h4>Respuestas de la Pregunta</h4>
                    {questionDetails && (
                        <div className="mt-2">
                            <p className="mb-1"><strong>Pregunta:</strong> {questionDetails.question}</p>
                            <p className="mb-1"><strong>Descripción:</strong> {questionDetails.description}</p>
                            <p className="mb-0"><strong>Dificultad:</strong> {questionDetails.dificulty}</p>
                        </div>
                    )}
                </div>
                <div className="card-body">
                    {questionAnswers.length > 0 ? (
                        <div className="list-group">
                            {questionAnswers.map((answer, index) => (
                                <div
                                    key={answer.id || index}
                                    className="list-group-item bg-dark text-white border border-warning mb-2"
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="answer-text">
                                            <span className="me-2">{index + 1}.</span>
                                            {answer.answer}
                                        </div>
                                        <span
                                            className={`badge ${answer.is_correct ? 'bg-success' : 'bg-danger'}`}
                                        >
                                            {answer.is_correct ? '✓ Correcta' : '✗ Incorrecta'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-warning">
                            No hay respuestas disponibles para esta pregunta
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
