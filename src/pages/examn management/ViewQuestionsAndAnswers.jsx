/* eslint-disable no-unused-vars */
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
  const [timeLeft, setTimeLeft] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const tiempoInicioRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_URL_IMAGES;
  const countdownRef = useRef(null);

  const getLocalLogKey = () => `exam_logs_${questionsData?.test_code}`;

  const registrarEnLocalStorage = (questionId, answerId, time) => {
    const key = getLocalLogKey();
    const currentLogs = JSON.parse(localStorage.getItem(key)) || [];
    const updatedLogs = currentLogs.filter(log => log.question_id !== questionId);
    updatedLogs.push({ question_id: questionId, answer_id: answerId, time });
    localStorage.setItem(key, JSON.stringify(updatedLogs));
  };

  const guardarEnBackend = async (questionId, answerId, time) => {
    if (!questionsData?.student_test_id) return;
    try {
      await postApi('logs_answers/save', {
        student_test_id: questionsData.student_test_id,
        question_id: questionId,
        answer_id: answerId,
        time,
      });
    } catch (err) {
      console.error('Error al guardar en backend:', err);
    }
  };

  const handleAnswerSelection = (questionId, answerId) => {
    const ahora = Date.now();
    const tiempoFormateado = getTiempoEnFormato(ahora);
    registrarEnLocalStorage(questionId, answerId, tiempoFormateado);
    if (currentQuestionId && currentQuestionId !== questionId) {
      const ultimaRespuesta = selectedAnswers[currentQuestionId];
      if (ultimaRespuesta) {
        const tiempoUltimaRespuesta = getTiempoEnFormato(tiempoInicioRef.current);
        guardarEnBackend(currentQuestionId, ultimaRespuesta, tiempoUltimaRespuesta);
      }
    }
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
    setCurrentQuestionId(questionId);
    tiempoInicioRef.current = ahora;
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (currentQuestionId && selectedAnswers[currentQuestionId]) {
      const tiempoFormateado = getTiempoEnFormato(tiempoInicioRef.current);
      await guardarEnBackend(currentQuestionId, selectedAnswers[currentQuestionId], tiempoFormateado);
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
      console.error('Error al guardar respuestas:', error);
      setAlreadyAnswered(error?.response?.status === 409);
      alert(error?.response?.data?.message || 'Ocurrió un error al enviar las respuestas.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      try {
        const fetchedStudentId = await getApi(`student_evaluations/list/${ci}`);
        setStudentId(fetchedStudentId);
        const response = await getStudentTestById(fetchedStudentId);
        const evaluation = await getApi(`student_evaluations/find/${response.evaluation_id}`);
        const answeredResp = await getApi(`student_answers/list/${response.student_test_id}`);
        if (!isMounted) return;
        
        setQuestionsData(response);
        setEvaluationTitle(evaluation.title);

        const ahoraServidor = Date.parse(evaluation.current_time);
        const inicioExamen = Date.parse(evaluation.start_time);
        const finExamen = Date.parse(evaluation.end_time);
        
        if (ahoraServidor < inicioExamen) {
          setError(`El examen comenzará a las ${getTiempoEnFormato(inicioExamen)}`);
          setTimeLeft(0);
          return;
        }

        const segundosRestantes = Math.max(
          Math.floor((finExamen - ahoraServidor) / 1000),
          0
        );
        setTimeLeft(segundosRestantes);

        const key = `exam_logs_${response.test_code}`;
        const savedLogs = JSON.parse(localStorage.getItem(key)) || [];
        let savedAnswers = {};

        if (savedLogs.length > 0) {
          savedLogs.forEach(log => {
            savedAnswers[log.question_id] = log.answer_id;
          });
        } else {
          try {
            const logsBackend = await getApi(`logs_answers/list/${response.student_test_id}`);
            logsBackend.forEach(log => {
              savedAnswers[log.question_id] = log.answer_id;
            });
            localStorage.setItem(key, JSON.stringify(logsBackend));
          } catch {
            console.error('Error al obtener logs desde el backend');
          }
        }
        setSelectedAnswers(savedAnswers);

        if (answeredResp?.answered) {
          setAlreadyAnswered(true);
          setFinalScore(Math.round(answeredResp.score));
        }
      } catch (err) {
        if (isMounted) {
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
    if (timeLeft !== null && !alreadyAnswered && timeLeft > 0) {
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownRef.current);
    }
  }, [timeLeft, alreadyAnswered]);

  if (loading) return <p>Cargando preguntas...</p>;
  if (error) return <p>{error}</p>;
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
            <h3 className="mb-1 d-flex align-items-center">
              <FaQuestionCircle className="me-2" />Evaluación: {evaluationTitle}
            </h3>
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
