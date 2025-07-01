/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { getApi, postApi } from '../../services/axiosServices/ApiService';
import { usFetchStudentTest } from '../../hooks/fetchStudent';
import { FaCheck, FaClock, FaQuestionCircle, FaUserGraduate } from 'react-icons/fa';
import { MdOutlineTimer } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ViewQuestionsAndAnswers = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const [evaluationTitle, setEvaluationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const { getStudentTestById } = usFetchStudentTest();
  const student = JSON.parse(localStorage.getItem('user'));
  const ci = student ? student.ci : null;
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_URL_IMAGES;
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    if (timer && !alreadyAnswered) {
      setTimeLeft(timer * 60);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmit({ preventDefault: () => { } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, alreadyAnswered]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelection = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      student_test_id: questionsData.student_test_id,
      answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        question_id: Number(questionId),
        answer_id: answerId,
      })),
    };

    try {
      setLoading(true);
      const response = await postApi('student_answers/save', payload);
      const totalScore = Math.floor(response.total_score);
      setFinalScore(totalScore);
      setAlreadyAnswered(true);
    } catch (error) {
      console.error('Error al guardar respuestas:', error);
      if (error?.response?.status === 409) {
        setAlreadyAnswered(true);
        setFinalScore(null);
      } else {
        alert(error?.response?.data?.message || 'Ocurrió un error al enviar las respuestas.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      if (!ci) {
        setError('No se encontró información del estudiante');
        setLoading(false);
        return;
      }

      try {
        const fetchedStudentId = await getApi(`student_evaluations/list/${ci}`);
       
        if (!isMounted || !fetchedStudentId) {
          setError('No se encontró ninguna evaluación para este estudiante');
          return;
        }
        setStudentId(fetchedStudentId);
        const response = await getStudentTestById(fetchedStudentId);

        if (!isMounted || !response) {
          setError('No se encontró la prueba asignada al estudiante.');
          return;
        }
        setQuestionsData(response);
        const evaluationResponse = await getApi(`student_evaluations/find/${response.evaluation_id}`);
        if (!isMounted || !evaluationResponse) return;
        setEvaluationTitle(evaluationResponse.title);
        setTimer(evaluationResponse.time);
        const answeredResp = await getApi(`student_answers/list/${response.student_test_id}`);
        if (answeredResp?.answered) {
          setAlreadyAnswered(true);
          setFinalScore(Math.round(answeredResp.score));
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error:', err);
          setError(err?.response?.data?.message || 'Error al cargar datos');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllData();
    return () => { isMounted = false; };
  }, [ci]);

  if (loading) return <p>Cargando preguntas...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!questionsData || !questionsData.questions) {
    return <p>No se encontraron preguntas para esta prueba.</p>;
  }

  if (alreadyAnswered) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info text-center">
          <h4>Ya has respondido esta evaluación.</h4>
          {finalScore !== null ? (
            <p>Tu nota final es: <strong>{finalScore}</strong></p>
          ) : (
            <p>No puedes volver a enviar tus respuestas.</p>
          )}
        </div>
        <div>
          <Link to={`${studentId}/compareAnswers`} className="btn btn-primary">
            Comparar Respuestas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 mb-4 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-1 d-flex align-items-center">
                <FaQuestionCircle className="me-2" />
                Evaluación: {evaluationTitle}
              </h3>
              {questionsData?.test_code && (
                <span className="mb-1 d-flex align-items-center">
                  Código de Examen: {questionsData.test_code}
                </span>
              )}
            </div>
            {timeLeft !== null && (
              <div
                className="position-fixed top-20 end-0 bg-white text-dark px-3 py-2 rounded shadow border d-flex align-items-center"
                style={{ zIndex: 1050, top: '80px' }}
              >
                <MdOutlineTimer className="me-2 fs-4 text-primary" />
                <strong>Tiempo restante:</strong>
                <span className="ms-2 fw-bold">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="card-body bg-light">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-3"><FaClock className="me-2 text-primary" /><strong>Duración total:</strong> {timer} minutos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preguntas */}
      <div className="questions-container">
        {questionsData.questions.map((question, index) => (
          <div key={question.question_id} className="card shadow-sm border-0 rounded-3 mb-4 overflow-hidden">
            <div className="card-header bg-light py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="badge bg-primary bg-opacity-10 text-primary me-3 py-2 px-3">
                  Pregunta {index + 1}
                </span>
                <strong className="me-2">{question.question}</strong>
              </h5>
              <span>{question.description}</span>
            </div>

            <div className="card-body">
              {question.image && (
                <div className="mb-3 text-center">
                  <img
                    src={`${API_BASE_URL}${question.image}`}
                    alt="Imagen"
                    className="img-fluid rounded shadow-sm border"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}

              <h6 className="mb-3 text-muted">Selecciona una respuesta:</h6>
              {question.answers.map((answer, i) => (
                <div
                  key={answer.id}
                  className={`p-3 mb-3 rounded-3 cursor-pointer ${selectedAnswers[question.question_id] === answer.id
                    ? 'bg-primary bg-opacity-10 border border-primary'
                    : 'bg-light border'
                    }`}
                  onClick={() => handleAnswerSelection(question.question_id, answer.id)}
                  role="button"
                >
                  <div className="d-flex align-items-center">
                    <div className={`me-3 ${selectedAnswers[question.question_id] === answer.id ? 'text-primary' : 'text-muted'
                      }`}>
                      {selectedAnswers[question.question_id] === answer.id ? (
                        <FaCheck className="fs-5" />
                      ) : (
                        <strong>{String.fromCharCode(65 + i)}.</strong>
                      )}
                    </div>
                    <div>{answer.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center mb-4">
        <button
          type="submit"
          className="btn btn-primary px-5 py-3 rounded-pill fw-bold"
          disabled={loading || timeLeft === 0}
          onClick={handleSubmit}
        >
          {timeLeft === 0 ? 'Tiempo Agotado' : loading ? (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          ) : 'Enviar Respuestas'}
        </button>
      </div>
    </div>
  );
};

export default ViewQuestionsAndAnswers;
