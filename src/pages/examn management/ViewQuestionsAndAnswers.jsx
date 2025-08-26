/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { getApi, postApi } from "../../services/axiosServices/ApiService";
import { usFetchStudentTest } from "../../hooks/fetchStudent";
import { Link } from "react-router-dom";
import { removeExamLogsByTestCode, removeStudentTestId, removeTestCode } from "../../services/storage/storageStudent";
import { socket } from "../../services/socketio/socketioClient";
import LoadingComponent from "./components/LoadingComponent";
import ExamHeader from "./components/ExamHeader";
import QuestionCard from "./components/QuestionCard";
import SubmitSection from "./components/SubmitSection";

const getTiempoEnFormato = (ms) => {
  const fecha = new Date(ms);
  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const ViewQuestionsAndAnswers = () => {
  const [questionsData, setQuestionsData] = useState(null)
  const [evaluationTitle, setEvaluationTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const { getStudentTestById } = usFetchStudentTest();
  const student = JSON.parse(localStorage.getItem("user"));
  const ci = student?.ci || null;
  const [studentId, setStudentId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const tiempoInicioRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_URL_IMAGES;

  // Estados para examen y socket
  const [examStarted, setExamStarted] = useState(false);
  const [examDataLoaded, setExamDataLoaded] = useState(false);
  const [socketTimeData, setSocketTimeData] = useState(null);

  // const getLocalLogKey = () => `exam_logs_${questionsData?.test_code}`;

  const registrarEnLocalStorage = (questionId, answerId, time) => {
    const key = `exam_logs_${localStorage.getItem('test_code')}`;
    const currentLogs = JSON.parse(localStorage.getItem(key)) || [];
    const updatedLogs = currentLogs.filter((log) => log.question_id !== questionId);
    updatedLogs.push({ question_id: questionId, answer_id: answerId, time });
    localStorage.setItem(key, JSON.stringify(updatedLogs));
  };

  const guardarEnBackend = async (questionId, answerId, time) => {
    if (!questionsData?.student_test_id) return;
    try {
      await postApi("logs_answers/save", {
        student_test_id: questionsData.student_test_id,
        question_id: questionId,
        answer_id: answerId,
        time,
      });
    } catch (err) {
      console.error("Error al guardar en backend:", err);
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
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    setCurrentQuestionId(questionId);
    tiempoInicioRef.current = ahora;
  };

  const handleSubmit = async (e, isAutoSubmit = false) => {
    if (e) e.preventDefault();
    // Guardar última respuesta activa en backend si aplica
    if (currentQuestionId && selectedAnswers[currentQuestionId]) {
      const tiempoFormateado = getTiempoEnFormato(tiempoInicioRef.current);
      await guardarEnBackend(
        currentQuestionId,
        selectedAnswers[currentQuestionId],
        tiempoFormateado
      );
    }

    try {
      setLoading(true);

      let answersArray;

      if (isAutoSubmit) {

        const savedLogs = `exam_logs_${localStorage.getItem('test_code')}`
        const answersPlainArray = localStorage.getItem(savedLogs)
        if (answersPlainArray)
          answersArray = JSON.parse(answersPlainArray).map((log) => ({
            question_id: log.question_id,
            answer_id: log.answer_id,
          }))
        else {
          answersArray = []
        }

      } else {
        answersArray = Object.entries(selectedAnswers).map(([question_id, answer_id]) => ({
          question_id: Number(question_id),
          answer_id,
        }));
      }

      // ⚡ Payload correcto para el backend
      const payload = {
        student_test_id: parseInt(localStorage.getItem("student_test_id")),
        answers: answersArray,
      };

      // Enviar al backend
      const response = await postApi("student_answers/save", payload);

      setFinalScore(Math.floor(response.total_score));
      setAlreadyAnswered(true);

      removeExamLogsByTestCode(localStorage.getItem('test_code'));
      removeTestCode();
      removeStudentTestId();
    } catch (error) {
      console.error("Error al guardar respuestas:", error);
      setAlreadyAnswered(error?.response?.status === 409);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  const loadInitialExamData = async (isMounted) => {
    setError(null);
    try {
      const fetchedStudentId = await getApi(`student_evaluations/list/${ci}`);
      if (!isMounted) return;
      setStudentId(fetchedStudentId);

      const response = await getStudentTestById(fetchedStudentId);
      if (!isMounted) return;
      setQuestionsData(response);
      localStorage.setItem('test_code', response.test_code)

      const evaluation = await getApi(`student_evaluations/find/${response.evaluation_id}`);
      if (!isMounted) return;
      setEvaluationTitle(evaluation.title);

      const answeredResp = await getApi(`student_answers/list/${response.student_test_id}`);
      if (!isMounted) return;
      // Respuestas guardadas (local o backend)
      const key = `exam_logs_${response.test_code}`;
      const savedLogs = JSON.parse(localStorage.getItem(key)) || [];
      let savedAnswers = {};

      if (savedLogs.length > 0) {
        savedLogs.forEach((log) => {
          savedAnswers[log.question_id] = log.answer_id;
        });
      } else {
        try {
          const logsBackend = await getApi(`logs_answers/list/${response.student_test_id}`);
          logsBackend.forEach((log) => {
            savedAnswers[log.question_id] = log.answer_id;
          });
          localStorage.setItem(key, JSON.stringify(logsBackend));
        } catch {
          console.error("Error al obtener logs desde el backend");
        }
      }
      setSelectedAnswers(savedAnswers);

      if (answeredResp?.answered) {
        setAlreadyAnswered(true);
        setFinalScore(Math.round(answeredResp.score));
      }

      setExamDataLoaded(true);
    } catch (err) {
      if (isMounted) setError(err?.response?.data?.message || "Error al cargar datos");
    } finally {
      if (isMounted) setLoading(false);
    }
  };
  useEffect(() => {
    if (questionsData?.student_test_id) {
      // Guardar en localStorage
      localStorage.setItem("student_test_id", questionsData.student_test_id);
    }
  }, [questionsData]);

  // Manejo socket
  const handleSocketData = (payload) => {
    if (payload.isStarted === "STARTED") {
      setExamStarted(true);
      setSocketTimeData({
        timeLeft: payload.timeLeft || 0,
        timeFormatted: payload.timeFormatted || "00:00:00",
        serverTime: payload.serverTime,
        examStatus: payload.isStarted,
        message: payload.message || "Examen iniciado",
      });
    }

    if (payload.isStarted === "STARTED" && examStarted) {
      setSocketTimeData((prev) => ({
        ...prev,
        timeLeft: payload.timeLeft,
        timeFormatted: payload.timeFormatted,
        serverTime: payload.serverTime,
        examStatus: payload.isStarted,
      }));

      if (payload.timeLeft <= 0 && !alreadyAnswered) {
        handleSubmit(null, true);
      }
    }

    if (payload.isStarted === "COMPLETED" && payload.examCompleted) {
      setSocketTimeData((prev) => ({
        ...prev,
        timeLeft: 0,
        timeFormatted: "00:00:00",
        serverTime: payload.serverTime,
        examStatus: "COMPLETED",
      }));

      if (!alreadyAnswered) {
        handleSubmit(null, true);
      }
    }
  };

  // efectos
  useEffect(() => {
    let isMounted = true;
    loadInitialExamData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [examStarted]);

  useEffect(() => {
    socket.emit("join", { roomId: student.group });
  }, []);

  useEffect(() => {
    socket.on("msg", handleSocketData);
    socket.on("timeUpdate", handleSocketData);
    return () => {
      socket.off("msg", handleSocketData);
      socket.off("timeUpdate", handleSocketData);
    };
  }, [examStarted, alreadyAnswered]);

  // Renderizado
  if (loading) return <p>Cargando evaluación...</p>;
  if (error) return <LoadingComponent title={evaluationTitle} />;


  if (alreadyAnswered) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info text-center">
          <h4>Ya has respondido esta evaluación.</h4>
          {finalScore !== null ? (
            <p>
              Tu nota final es: <strong>{finalScore}</strong>
            </p>
          ) : (
            <p>No puedes volver a enviar tus respuestas.</p>
          )}
        </div>
        <Link to={`${studentId}/compareAnswers`} className="btn btn-primary">
          Comparar Respuestas
        </Link>
      </div>
    );
  }
  if (!questionsData?.questions) return <LoadingComponent title={evaluationTitle} />;

  if (!examStarted) return <LoadingComponent title={evaluationTitle} />;
  return (
    <div className="container-fluid p-4">
      {/* Cabecera */}
      <ExamHeader
        evaluationTitle={evaluationTitle}
        testCode={questionsData?.test_code}
        socketTimeData={socketTimeData}
        examStarted={examStarted}
      />

      <div className="questions-container">
        {questionsData.questions.map((question, index) => (
          <QuestionCard
            key={question.question_id}
            question={question}
            index={index}
            API_BASE_URL={API_BASE_URL}
            selectedAnswers={selectedAnswers}
            examStarted={examStarted}
            handleAnswerSelection={handleAnswerSelection}
          />
        ))}
      </div>

      {/* Envío */}
      <SubmitSection
        loading={loading}
        socketTimeData={socketTimeData}
        examStarted={examStarted}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ViewQuestionsAndAnswers;
