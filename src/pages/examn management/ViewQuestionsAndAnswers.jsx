/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { getApi, postApi } from '../../services/axiosServices/ApiService';
import { usFetchStudentTest } from '../../hooks/fetchStudent';
import { FaCheck, FaClock, FaQuestionCircle } from 'react-icons/fa';
import { MdOutlineTimer } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { removeExamLogsByTestCode } from '../../services/storage/storageStudent';
import { socket } from '../../services/socketio/socketioClient';

const getTiempoEnFormato = (ms) => {
  const fecha = new Date(ms);
  return fecha.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const LoadingComponent = ({ title }) => {
  return (
    <div className="container mt-4">
      <div className="alert alert-warning text-center">
        <h4>Evaluación: {title}</h4>
        <div className="d-flex justify-content-center align-items-center mt-3">
          <FaClock className="me-2 fs-4" />
          <p className="mb-0">El examen está listo. Esperando que el instructor inicie la evaluación...</p>
        </div>
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Esperando...</span>
        </div>
      </div>
    </div>
  );
};

const ViewQuestionsAndAnswers = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const questionDataRef = useRef(null);
  const [evaluationTitle, setEvaluationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const { getStudentTestById } = usFetchStudentTest();
  const student = JSON.parse(localStorage.getItem('user'));
  const ci = student?.ci || null;
  const [studentId, setStudentId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const tiempoInicioRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_URL_IMAGES;

  // Estados para manejar el examen y datos del socket
  const [examStarted, setExamStarted] = useState(false);
  const [examDataLoaded, setExamDataLoaded] = useState(false);
  const [socketTimeData, setSocketTimeData] = useState(null); // {timeLeft: number, serverTime: string, etc}

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

  const handleSubmit = async (e, isAutoSubmit = false) => {
    if (e) e.preventDefault();

    // Si es auto-submit por tiempo agotado, mostrar mensaje
    else {
      console.log('Tiempo agotado. Las respuestas se están enviando automáticamente.');
    }
    
    console.log('108',currentQuestionId, selectedAnswers)

    if (currentQuestionId && selectedAnswers[currentQuestionId]) {
    console.log('--------------------------')

      const tiempoFormateado = getTiempoEnFormato(tiempoInicioRef.current);
      await guardarEnBackend(currentQuestionId, selectedAnswers[currentQuestionId], tiempoFormateado);
    }
    try {
      setLoading(true);
      console.log('116',questionDataRef.current)
      const payload = {
        student_test_id: questionsData.student_test_id,
        answers: Object.entries(selectedAnswers).map(([question_id, answer_id]) => ({
          question_id: Number(question_id),
          answer_id
        }))
      };

      console.log(payload)
      const response = await postApi('student_answers/save', payload);
      setFinalScore(Math.floor(response.total_score));
      setAlreadyAnswered(true);
      removeExamLogsByTestCode(questionsData.test_code);
    } catch (error) {
      console.error('Error al guardar respuestas:', error);
      setAlreadyAnswered(error?.response?.status === 409);
      console.log('l 133', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Función para cargar solo los datos básicos de la evaluación
  const loadInitialExamData = async (isMounted) => {
    setError(null);
    try {
      const fetchedStudentId = await getApi(`student_evaluations/list/${ci}`);
      console.log("151", fetchedStudentId)
      if (!isMounted) return;

      setStudentId(fetchedStudentId);
      const response = await getStudentTestById(fetchedStudentId);
      console.log("156", response)

      if (!isMounted) return;

      const evaluation = await getApi(`student_evaluations/find/${response.evaluation_id}`);
      console.log('161', evaluation)
      if (!isMounted) return;

      const answeredResp = await getApi(`student_answers/list/${response.student_test_id}`);
      console.log('165', answeredResp)
      if (!isMounted) return;
      if(!response)
        questionDataRef.current = response
      
      setQuestionsData(response);
      setEvaluationTitle(evaluation.title);

      // Cargar respuestas guardadas
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

      setExamDataLoaded(true);
    } catch (err) {
      if (isMounted) {
        setError(err?.response?.data?.message || 'Error al cargar datos');
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  // Función separada para manejar datos del socket (tiempo, estado, etc.)
  const handleSocketData = (payload) => {
    if (payload.isStarted === 'STARTED') {
      setExamStarted(true);

      // Actualizar datos de tiempo del socket
      setSocketTimeData({
        timeLeft: payload.timeLeft || 0,
        timeFormatted: payload.timeFormatted || '00:00:00',
        serverTime: payload.serverTime,
        examStatus: payload.isStarted,
        message: payload.message || 'Examen iniciado'
      })
    }

    // Actualizar tiempo durante el examen (mientras está STARTED)
    if (payload.isStarted === 'STARTED' && examStarted) {
      setSocketTimeData(prev => ({
        ...prev,
        timeLeft: payload.timeLeft,
        timeFormatted: payload.timeFormatted,
        serverTime: payload.serverTime,
        examStatus: payload.isStarted
      }));

      // Auto-submit cuando el tiempo se agota
      if (payload.timeLeft <= 0 && !alreadyAnswered) {
        console.log('Tiempo agotado, enviando respuestas automáticamente');
        handleSubmit(null, true);
      }
    }

    // Manejar cuando el examen se completa por tiempo agotado
    if (payload.isStarted === 'COMPLETED' && payload.examCompleted) {
      setSocketTimeData(prev => ({
        ...prev,
        timeLeft: 0,
        timeFormatted: '00:00:00',
        serverTime: payload.serverTime,
        examStatus: 'COMPLETED'
      }));

      if (!alreadyAnswered) {
        console.log('Examen completado por tiempo - Auto enviando respuestas');
        handleSubmit(null, true);
      }
    }
  };

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    let isMounted = true;
    loadInitialExamData(isMounted);
    return () => { isMounted = false; };
  }, [examStarted]);

  // Conectar al socket
  useEffect(() => {
    socket.emit('join', { roomId: student.group });
  }, []);

   useEffect(() => {
    console.log('272', questionsData)
  }, [questionsData]);

  // Escuchar eventos del socket
  useEffect(() => {
    // Escuchar evento de inicio y actualizaciones de tiempo
    socket.on('msg', handleSocketData);

    // Escuchar eventos específicos de tiempo (opcional)
    socket.on('timeUpdate', handleSocketData);

    // Cleanup
    return () => {
      socket.off('msg', handleSocketData);
      socket.off('timeUpdate', handleSocketData);
    };
  }, [examStarted, alreadyAnswered]); // Dependencias necesarias


  // Mostrar loading mientras se cargan los datos iniciales
  if (loading) return <p>Cargando evaluación...</p>;
  if (error) return <LoadingComponent title={evaluationTitle} />;

  if (!questionsData?.questions) return <LoadingComponent title={evaluationTitle} />

  // Mostrar que el examen está listo pero no ha comenzado
  if (!examStarted) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning text-center">
          <h4>Evaluación: {evaluationTitle}</h4>
          <div className="d-flex justify-content-center align-items-center mt-3">
            <FaClock className="me-2 fs-4" />
            <p className="mb-0">El examen está listo. Esperando que el instructor inicie la evaluación...</p>
          </div>
          <div className="spinner-border text-primary mt-3" role="status">
            <span className="visually-hidden">Esperando...</span>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar resultados si ya respondió
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
  // Mostrar la evaluación activa
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
          {socketTimeData?.timeFormatted && examStarted && (
            <div className="position-fixed top-20 end-0 bg-white text-dark px-3 py-2 rounded shadow border d-flex align-items-center" style={{ top: '80px', zIndex: 1050 }}>
              <MdOutlineTimer className={`me-2 fs-4 ${socketTimeData.timeLeft <= 300 ? 'text-danger' : 'text-primary'}`} />
              <strong>Tiempo restante:</strong>
              <span className={`ms-2 fw- bold fs-5 ${socketTimeData.timeLeft <= 300 ? 'text-danger' : ''}`}>
                {socketTimeData.timeFormatted}
              </span>
              {socketTimeData.timeLeft <= 60 && socketTimeData.timeLeft > 0 && (
                <span className="ms-2 badge bg-danger">¡URGENTE!</span>
              )}
              {socketTimeData.timeLeft === 0 && (
                <span className="ms-2 badge bg-secondary">TIEMPO AGOTADO</span>
              )}
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
                  className={`p-3 mb-3 rounded-3 cursor-pointer ${selectedAnswers[question.question_id] === answer.id ? 'bg-primary bg-opacity-10 border border-primary' : 'bg-light border'} ${!examStarted ? 'opacity-50' : ''}`}
                  onClick={() => examStarted && handleAnswerSelection(question.question_id, answer.id)}
                  role="button"
                  style={{ cursor: examStarted ? 'pointer' : 'not-allowed' }}
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
          disabled={loading || (socketTimeData?.timeLeft <= 0) || !examStarted}
          onClick={handleSubmit}
        >
          {!examStarted ? 'Esperando inicio del examen...' :
            (socketTimeData?.timeLeft <= 0) ? 'Tiempo Agotado' : loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            ) : 'Enviar Respuestas'}
        </button>

        {/* Información adicional del socket */}
        {socketTimeData && examStarted && (
          <div className="ms-3 d-flex flex-column justify-content-center">
            <small className="text-muted">
              Estado: <span className="text-primary">{socketTimeData.examStatus}</span>
            </small>
            {socketTimeData.serverTime && (
              <small className="text-muted">
                Hora servidor: {socketTimeData.serverTime}
              </small>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewQuestionsAndAnswers;