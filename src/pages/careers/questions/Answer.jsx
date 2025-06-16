import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchAnswerByIdQuestion } from '../../../hooks/fetchAnswer';
import { MdArrowBack } from 'react-icons/md';
import { FaReply, FaReplyAll } from 'react-icons/fa';
import { useFetchQuestionById } from '../../../hooks/fetchQuestions';

export const Answer = () => {
    const { id } = useParams()
    const {question, getQuestion} = useFetchQuestionById();
    const { getAnswer, answers } = useFetchAnswerByIdQuestion();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getQuestion(id);
    }, [id]);
    useEffect(() => {
        getAnswer(id);
    }, [id]); // solo id
    
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }
    
    const navigate = useNavigate();
    return (
        <div className="container-fluid p-4">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-outline-primary mb-3 w-auto d-inline-flex align-items-center px-3 py-2"
                style={{ height: '40px' }}
            >
                <MdArrowBack className="me-1" /> Volver
            </button>
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-primary text-white py-3 rounded-top">
                    <h3 className="mb-0">
                        <FaReply className="me-2" />
                        Respuestas de la Pregunta
                    </h3>
                </div>

                {/* Detalles de la pregunta */}
                {question && (
                    <div className="card-body border-bottom bg-light">
                        <div className="row">
                            <div className="col-md-6">
                                <p className="mb-2">
                                    <strong className="text-primary">Pregunta:</strong>
                                    <span className="ms-2">{question.question}</span>
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="mb-2">
                                    <strong className="text-primary">Dificultad:</strong>
                                    <span className={`badge ${question.dificulty === 'Fácil' ? 'bg-success' :
                                            question.dificulty === 'Media' ? 'bg-warning' : 'bg-danger'
                                        } bg-opacity-10 ${question.dificulty === 'Fácil' ? 'text-success' :
                                            question.dificulty === 'Media' ? 'text-warning' : 'text-danger'
                                        } py-2 px-3 ms-2`}>
                                        {question.dificulty}
                                    </span>
                                </p>
                            </div>
                            {question.description && (
                                <div className="col-12">
                                    <p className="mb-0">
                                        <strong className="text-primary">Descripción:</strong>
                                        <span className="ms-2 text-muted">{question.description}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="card-body">
                    {answers.length > 0 ? (
                        <div className="list-group">
                            {answers.map((answer, index) => (
                                <div
                                    key={answer.id || index}
                                    className={`list-group-item border-0 mb-2 rounded-3 transition-all ${answer.is_correct
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
                                            className={`badge ${answer.is_correct
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
