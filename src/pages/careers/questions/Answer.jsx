import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchAnswerByIdQuestion } from '../../../hooks/fetchAnswer';
import { getApi } from '../../../services/axiosServices/ApiService';
import { MdArrowBack } from 'react-icons/md';
import { FaReply, FaReplyAll } from 'react-icons/fa';

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
    <div className="container-fluid p-4">
        {/* Botón de volver */}
        <button 
            className="btn btn-outline-primary mb-3 d-flex align-items-center"
            onClick={() => navigate(-1)}
        >
            <MdArrowBack className="me-1" /> Volver
        </button>

        {/* Tarjeta principal */}
        <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
            {/* Encabezado */}
            <div className="card-header bg-primary text-white py-3 rounded-top">
                <h3 className="mb-0">
                    <FaReply className="me-2" />
                    Respuestas de la Pregunta
                </h3>
            </div>

            {/* Detalles de la pregunta */}
            {questionDetails && (
                <div className="card-body border-bottom bg-light">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-2">
                                <strong className="text-primary">Pregunta:</strong> 
                                <span className="ms-2">{questionDetails.question}</span>
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p className="mb-2">
                                <strong className="text-primary">Dificultad:</strong>
                                <span className={`badge ${
                                    questionDetails.dificulty === 'Fácil' ? 'bg-success' : 
                                    questionDetails.dificulty === 'Media' ? 'bg-warning' : 'bg-danger'
                                } bg-opacity-10 ${
                                    questionDetails.dificulty === 'Fácil' ? 'text-success' : 
                                    questionDetails.dificulty === 'Media' ? 'text-warning' : 'text-danger'
                                } py-2 px-3 ms-2`}>
                                    {questionDetails.dificulty}
                                </span>
                            </p>
                        </div>
                        {questionDetails.description && (
                            <div className="col-12">
                                <p className="mb-0">
                                    <strong className="text-primary">Descripción:</strong> 
                                    <span className="ms-2 text-muted">{questionDetails.description}</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Lista de respuestas */}
            <div className="card-body">
                {questionAnswers.length > 0 ? (
                    <div className="list-group">
                        {questionAnswers.map((answer, index) => (
                            <div
                                key={answer.id || index}
                                className={`list-group-item border-0 mb-2 rounded-3 transition-all ${
                                    answer.is_correct 
                                        ? 'bg-success bg-opacity-10 border-start border-success border-3' 
                                        : 'bg-danger bg-opacity-10 border-start border-danger border-3'
                                }`}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <span className="fw-bold text-muted me-3">{index + 1}.</span>
                                        <span className={answer.is_correct ? 'text-success' : 'text-danger'}>
                                            {answer.answer}
                                        </span>
                                    </div>
                                    <span
                                        className={`badge ${
                                            answer.is_correct 
                                                ? 'bg-success bg-opacity-25 text-success' 
                                                : 'bg-danger bg-opacity-25 text-danger'
                                        } py-2 px-3`}
                                    >
                                        {answer.is_correct ? '✓ Correcta' : '✗ Incorrecta'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <div className="d-flex flex-column align-items-center text-muted">
                            <FaReplyAll className="fs-1 mb-2" />
                            No hay respuestas disponibles para esta pregunta
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);
};
