import { useEffect, useState, useRef } from 'react';
import { getApi, postApi } from '../../services/axiosServices/ApiService';
import { usFetchStudentTest } from '../../hooks/fetchStudent';
import { FaCheck, FaClock, FaQuestionCircle } from 'react-icons/fa';
import { MdOutlineTimer } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { removeExamLogsByTestCode } from '../../services/storage/storageStudent';

const getTiempoEnFormato = (ms) => {
  const fecha = new Date(ms);
  return fecha.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

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
  const ci = student?.ci || null;
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const tiempoInicioRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_URL_IMAGES;

  const getLocalLogKey = () => `exam_logs_${questionsData?.test_code}`;

  const registrarEnLocalStorage = (questionId, answerId, time) => {
    const key = getLocalLogKey();
    const currentLogs = JSON.parse(localStorage.getItem(key)) || [];

    const updatedLogs = currentLogs.filter(log => log.question_id !== questionId);
    updatedLogs.push({ question_id: questionId, answer_id: answerId, time });

    localStorage.setItem(key, JSON.stringify(updatedLogs));
  };

  const guardarEnBackend = async (questionId, answerId, time) => {
    if (!questionsData?.student_test_id) {
      console.error('Error: student_test_id no está definido');
      return;
    }

    try {
      await postApi('logs_answers/save', {
        student_test_id: questionsData.student_test_id,
        question_id: questionId, // Cambiado de questionId a question_id
        answer_id: answerId, // Cambiado de answerId a answer_id para consistencia
        time,
      });
    } catch (err) {
      console.error('Error al guardar en backend:', {
        message: err?.response?.data?.message || err.message,
        status: err?.response?.status,
        data: err?.response?.data,
      });
    }
  };

  const handleAnswerSelection = (questionId, answerId) => {
    const ahora = Date.now();
    const tiempoFormateado = getTiempoEnFormato(ahora);

    // Guardar la respuesta en localStorage inmediatamente
    registrarEnLocalStorage(questionId, answerId, tiempoFormateado);

    // Guardar en el backend solo si se cambia de pregunta
    if (currentQuestionId && currentQuestionId !== questionId) {
      const ultimaRespuesta = selectedAnswers[currentQuestionId];
      if (ultimaRespuesta) {
        const tiempoUltimaRespuesta = getTiempoEnFormato(tiempoInicioRef.current);
        guardarEnBackend(currentQuestionId, ultimaRespuesta, tiempoUltimaRespuesta);
      }
    }

    // Actualizar el estado
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
    setCurrentQuestionId(questionId);
    tiempoInicioRef.current = ahora;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentQuestionId && selectedAnswers[currentQuestionId]) {
      const tiempoFormateado = getTiempoEnFormato(tiempoInicioRef.current);
      guardarEnBackend(currentQuestionId, selectedAnswers[currentQuestionId], tiempoFormateado);
    }

    try {
      setLoading(true);
      const payload = {
        student_test_id: questionsData.student_test_id,
        answers: Object.entries(selectedAnswers).map(([question_id, answer_id]) => ({
          question_id: Number(question_id),
          answer_id
        }))
      };
      const response = await postApi('student_answers/save', payload);
      setFinalScore(Math.floor(response.total_score));
      setAlreadyAnswered(true);
      removeExamLogsByTestCode(questionsData.test_code);
    } catch (error) {
      setAlreadyAnswered(error?.response?.status === 409);
      console.error('Error al guardar respuestas:', error);
      alert(error?.response?.data?.message || 'Ocurrió un error al enviar las respuestas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        const fetchedStudentId = await getApi(`student_evaluations/list/${ci}`);
        if (!fetchedStudentId) throw new Error('No se encontró ninguna evaluación para este estudiante');

        setStudentId(fetchedStudentId);
        const response = await getStudentTestById(fetchedStudentId);
        const evaluation = await getApi(`student_evaluations/find/${response.evaluation_id}`);
        const answeredResp = await getApi(`student_answers/list/${response.student_test_id}`);

        if (!isMounted) return;

        setQuestionsData(response);
        setEvaluationTitle(evaluation.title);
        setTimer(evaluation.time);

        // Cargar respuestas previas desde localStorage
        const key = `exam_logs_${response.test_code}`;
        const savedLogs = JSON.parse(localStorage.getItem(key)) || [];
        const savedAnswers = {};
        savedLogs.forEach(log => {
          savedAnswers[log.question_id] = log.answer_id;
        });
        setSelectedAnswers(savedAnswers);

        if (answeredResp?.answered) {
          setAlreadyAnswered(true);
          setFinalScore(Math.round(answeredResp.score));
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error al cargar datos:', err);
          setError(err?.response?.data?.message || 'Error al cargar datos');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();
    return () => { isMounted = false; };
  }, [ci]);

  useEffect(() => {
    if (timer && !alreadyAnswered) {
      setTimeLeft(timer * 60);
      const interval = setInterval(() => {
        setTimeLeft(prev => {
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

  if (loading) return <p>Cargando preguntas...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!questionsData?.questions) return <p>No se encontraron preguntas para esta prueba.</p>;

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
        <Link to={`${studentId}/compareAnswers`} className="btn btn-primary">Comparar Respuestas</Link>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 mb-4 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 rounded-top d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-1 d-flex align-items-center"><FaQuestionCircle className="me-2" />Evaluación: {evaluationTitle}</h3>
            {questionsData?.test_code && <span className="mb-1">Código de Examen: {questionsData.test_code}</span>}
          </div>
          {timeLeft !== null && (
            <div className="position-fixed top-20 end-0 bg-white text-dark px-3 py-2 rounded shadow border d-flex align-items-center" style={{ top: '80px', zIndex: 1050 }}>
              <MdOutlineTimer className="me-2 fs-4 text-primary" />
              <strong>Tiempo restante:</strong>
              <span className="ms-2 fw-bold">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
        <div className="card-body bg-light">
          <p><FaClock className="me-2 text-primary" /><strong>Duración total:</strong> {timer} minutos</p>
        </div>
      </div>

      <div className="questions-container">
        {questionsData.questions.map((question, index) => (
          <div key={question.question_id} className="card shadow-sm border-0 rounded-3 mb-4 overflow-hidden">
            <div className="card-header bg-light py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="badge bg-primary bg-opacity-10 text-primary me-3 py-2 px-3">Pregunta {index + 1}</span>
                <strong>{question.question}</strong>
              </h5>
              <span>{question.description}</span>
            </div>
            <div className="card-body">
              {question.image && (
                <div className="mb-3 text-center">
                  <img src={`${API_BASE_URL}${question.image}`} alt="Imagen" className="img-fluid rounded shadow-sm border" style={{ maxHeight: '200px' }} />
                </div>
              )}
              <h6 className="mb-3 text-muted">Selecciona una respuesta:</h6>
              {question.answers.map((answer, i) => (
                <div key={answer.id}
                  className={`p-3 mb-3 rounded-3 cursor-pointer ${selectedAnswers[question.question_id] === answer.id ? 'bg-primary bg-opacity-10 border border-primary' : 'bg-light border'}`}
                  onClick={() => handleAnswerSelection(question.question_id, answer.id)}
                  role="button"
                >
                  <div className="d-flex align-items-center">
                    <div className={`me-3 ${selectedAnswers[question.question_id] === answer.id ? 'text-primary' : 'text-muted'}`}>
                      {selectedAnswers[question.question_id] === answer.id ? <FaCheck className="fs-5" /> : <strong>{String.fromCharCode(65 + i)}.</strong>}
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
        <button className="btn btn-primary px-5 py-3 rounded-pill fw-bold"
          disabled={loading || timeLeft === 0}
          onClick={handleSubmit}
        >
          {timeLeft === 0 ? 'Tiempo Agotado' : loading ? (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          ) : 'Enviar Respuestas'}
        </button>
      </div>
    </div>
  );
};

export default ViewQuestionsAndAnswers;