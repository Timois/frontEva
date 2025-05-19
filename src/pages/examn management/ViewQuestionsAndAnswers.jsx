/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { getApi, postApi } from '../../services/axiosServices/ApiService';
import { useFetchStudent } from '../../hooks/fetchStudent';
import { FaCheck, FaClock, FaQuestionCircle, FaUserGraduate } from 'react-icons/fa';
import { MdOutlineTimer } from 'react-icons/md';


const ViewQuestionsAndAnswers = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const [evaluationTitle, setEvaluationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const { getTestStudent } = useFetchStudent();
  const student = JSON.parse(localStorage.getItem('user'));
  const ci = student ? student.ci : null;
  const [studentName] = useState(student ? student.nombre_completo : '');
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (timer && !alreadyAnswered) {
      setTimeLeft(timer * 60); // Convertir minutos a segundos
      
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleSubmit({ preventDefault: () => {} }); // Auto-submit cuando se acaba el tiempo
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, alreadyAnswered]);

  // Función para formatear el tiempo
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const handleAnswerSelection = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      student_test_id: questionsData.student_test_id,
      answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        question_id: Number(questionId),
        answer_id: answerId
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
        setFinalScore(null); // O puedes hacer un fetch de la nota si está disponible
      } else {
        alert(
          error?.response?.data?.message ||
          'Ocurrió un error al enviar las respuestas. Intenta nuevamente.'
        );
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
        const studentId = await getApi(`student_evaluations/list/${ci}`);
        if (!isMounted) return;

        if (!studentId) {
          setError('No se encontró ninguna evaluación para este estudiante');
          return;
        }

        const response = await getTestStudent(studentId);
        if (!isMounted) return;

        setQuestionsData(response);
        // Eliminamos esta línea ya que el nombre lo obtenemos del localStorage
        // setStudentName('');

        const evaluationResponse = await getApi(`student_evaluations/find/${response.evaluation_id}`);
        if (!isMounted) return;

        setEvaluationTitle(evaluationResponse.title);
        setTimer(evaluationResponse.time);
        // 🔍 CONSULTAR SI YA RESPONDIÓ
        const answeredResp = await getApi(`student_answers/list/${response.student_test_id}`);
        if (!isMounted) return;

        if (answeredResp.answered) {
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

    return () => {
      isMounted = false;
    };
  }, [ci]);


  if (loading) return <p>Cargando preguntas...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!questionsData || !questionsData.questions) {
    return <p>No se encontraron preguntas para esta prueba.</p>;
  }

  const API_BASE_URL = import.meta.env.VITE_URL_IMAGES;

  // Mostrar mensaje si ya respondió el examen
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
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Encabezado de la evaluación */}
      <div className="card shadow-lg border-0 rounded-3 mb-4 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">
              <FaQuestionCircle className="me-2" />
              Evaluación: {evaluationTitle}
            </h3>
            {timeLeft !== null && (
              <div className="d-flex align-items-center bg-white text-dark px-3 py-2 rounded">
                <MdOutlineTimer className="me-2 fs-4 text-primary" />
                <strong>Tiempo restante: </strong>
                <span className="ms-2 fw-bold">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="card-body bg-light">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-3">
                <FaUserGraduate className="me-2 text-primary" />
                <strong>Estudiante:</strong> 
                <span className="ms-2">{studentName}</span>
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-3">
                <FaClock className="me-2 text-primary" />
                <strong>Duración total:</strong> 
                <span className="ms-2">{timer} minutos</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de preguntas */}
      <div className="questions-container">
        {questionsData.questions.map((question, index) => (
          <div key={question.id} className="card shadow-sm border-0 rounded-3 mb-4 overflow-hidden">
            <div className="card-header bg-light py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="badge bg-primary bg-opacity-10 text-primary me-3 py-2 px-3">
                  Pregunta {index + 1}
                </span>
                <span>{question.question}</span>
              </h5>
            </div>
            
            <div className="card-body">
              {/* Imagen y descripción */}
              <div className="row mb-4">
                {question.image && (
                  <div className="col-md-4 mb-3 mb-md-0">
                    <img
                      src={`${API_BASE_URL}${question.image}`}
                      alt="Imagen de la pregunta"
                      className="img-fluid rounded shadow-sm border"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
                <div className={`${question.image ? 'col-md-8' : 'col-12'}`}>
                  {question.description && (
                    <div className="p-3 bg-light rounded-3">
                      <p className="text-muted mb-0">{question.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Respuestas */}
              <div className="answers-container">
                <h6 className="mb-3 text-muted">Selecciona una respuesta:</h6>
                {question.bank_answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`p-3 mb-3 rounded-3 cursor-pointer transition-all ${
                      selectedAnswers[question.id] === answer.id
                        ? 'bg-primary bg-opacity-10 border border-primary'
                        : 'bg-light border'
                    }`}
                    onClick={() => handleAnswerSelection(question.id, answer.id)}
                    role="button"
                  >
                    <div className="d-flex align-items-center">
                      <div className={`flex-shrink-0 me-3 ${
                        selectedAnswers[question.id] === answer.id 
                          ? 'text-primary' 
                          : 'text-muted'
                      }`}>
                        {selectedAnswers[question.id] === answer.id ? (
                          <FaCheck className="fs-5" />
                        ) : (
                          <span className="fw-bold">{String.fromCharCode(65 + question.bank_answers.indexOf(answer))}.</span>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        {answer.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de enviar */}
      <div className="d-flex justify-content-center mb-4">
        <button
          type="submit"
          className="btn btn-primary px-5 py-3 rounded-pill fw-bold"
          disabled={loading || timeLeft === 0}
          onClick={handleSubmit}
        >
          {timeLeft === 0 ? (
            'Tiempo Agotado'
          ) : loading ? (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          ) : (
            'Enviar Respuestas'
          )}
        </button>
      </div>

      {/* Vista cuando ya se respondió */}
      {alreadyAnswered && (
        <div className="card shadow-lg border-0 rounded-3 overflow-hidden mt-4">
          <div className="card-header bg-info text-white py-3 rounded-top">
            <h4 className="mb-0 text-center">
              <FaCheck className="me-2" />
              Evaluación Completada
            </h4>
          </div>
          <div className="card-body text-center py-5">
            <div className="d-flex flex-column align-items-center">
              <FaCheck className="fs-1 text-success mb-3" />
              <h5 className="mb-3">Ya has respondido esta evaluación</h5>
              {finalScore !== null && (
                <div className="bg-light rounded-3 p-4 d-inline-block">
                  <p className="mb-1 text-muted">Tu puntuación final es:</p>
                  <h2 className="text-primary fw-bold mb-0">{finalScore}</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewQuestionsAndAnswers;
