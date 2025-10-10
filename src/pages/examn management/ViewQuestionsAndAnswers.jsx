/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { getApi, postApi } from "../../services/axiosServices/ApiService";
import { usFetchStudentTest } from "../../hooks/fetchStudent";
import {
  removeExamLogsByTestCode,
  removeStudentTestId,
  removeTestCode,
} from "../../services/storage/storageStudent";
import { io } from "socket.io-client";
import LoadingComponent from "./components/LoadingComponent";
import ExamHeader from "./components/ExamHeader";
import QuestionCard from "./components/QuestionCard";
import SubmitSection from "./components/SubmitSection";
import { VITE_URL_IMAGES, VITE_URL_WEBSOCKET } from "../../utils/constants";
import { customAlert } from "../../utils/domHelper";
import ExamStatusMessage from "./components/ExamStatusMessage";
import { Link, useNavigate } from "react-router-dom";

const examStatuses = {
  WAITING: "pendiente",
  IN_PROGRESS: "en_progreso",
  PAUSED: "pausado",
  COMPLETED: "completado",
};

const ViewQuestionsAndAnswers = () => {
  const socketRef = useRef(null);
  const [questionsData, setQuestionsData] = useState(null);
  const [evaluationTitle, setEvaluationTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [stoppedByTeacher, setStoppedByTeacher] = useState(false);
  const { getStudentTestById } = usFetchStudentTest();
  const [closedByGroup, setClosedByGroup] = useState(false);
  const student = JSON.parse(localStorage.getItem("user"));
  const [studentId, setStudentId] = useState(null);
  const ci = student?.ci || null;
  const tiempoInicioRef = useRef(null);
  const API_BASE_URL = VITE_URL_IMAGES;
  const URL_SOCKET = VITE_URL_WEBSOCKET;

  const [socketTimeData, setSocketTimeData] = useState({
    started: false,
    timeLeft: null,
    timeFormatted: "00:00:00",
    serverTime: null,
    examStatus: examStatuses.WAITING,
  });

  // Nuevos estados para la selección de evaluación
  const [studentEvaluations, setStudentEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  // Registrar respuesta en localStorage
  const registrarEnLocalStorage = (questionId, answerId, time) => {
    const key = `exam_logs_${localStorage.getItem("test_code")}`;
    const currentLogs = JSON.parse(localStorage.getItem(key)) || [];

    const updatedLogs = currentLogs.filter((log) => log.question_id !== questionId);
    updatedLogs.push({
      question_id: Number(questionId),
      answer_id: answerId ?? null,
      time,
      finalize: false,
    });

    localStorage.setItem(key, JSON.stringify(updatedLogs));
  };

  const syncAnswersToBackend = async () => {
    if (alreadyAnswered || socketTimeData.examStatus === examStatuses.COMPLETED) return;
    if (!questionsData?.student_test_id) return;

    const key = `exam_logs_${localStorage.getItem("test_code")}`;
    const logs = JSON.parse(localStorage.getItem(key)) || [];
    const logsToSync = logs.filter((log) => log.answer_id !== null);

    if (logsToSync.length === 0) return;

    const payload = {
      student_test_id: Number(questionsData.student_test_id),
      answers: logsToSync.map((log) => ({
        question_id: Number(log.question_id),
        answer_id: log.answer_id ?? null,
        time: log.time,
      })),
      finalize: false,
    };

    try {
      await postApi("logs_answers/bulkSave", payload);
    } catch (err) {
      console.error("❌ Error al sincronizar respuestas:", err);
    }
  };

  const handleAnswerSelection = (questionId, answerId) => {
    if (socketTimeData.examStatus !== examStatuses.IN_PROGRESS) return;
    const ahora = Date.now();
    const tiempoFormateado = new Date(ahora).toLocaleTimeString("es-ES", { hour12: false });
    registrarEnLocalStorage(questionId, answerId, tiempoFormateado);
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    tiempoInicioRef.current = ahora;
  };

  const handleSubmit = async (e, isAutoSubmit = false) => {
    if (e) e.preventDefault();

    try {
      setLoading(true);
      await syncAnswersToBackend();

      const savedLogsKey = `exam_logs_${localStorage.getItem("test_code")}`;
      const logs = JSON.parse(localStorage.getItem(savedLogsKey)) || [];

      let answersArray = [];
      if (isAutoSubmit) {
        answersArray = logs.map((log) => ({
          question_id: Number(log.question_id),
          answer_id: log.answer_id ?? null,
          time: log.time,
        }));
      } else {
        answersArray = Object.entries(selectedAnswers).map(([question_id, answer_id]) => {
          const log = logs.find((l) => l.question_id === Number(question_id));
          return {
            question_id: Number(question_id),
            answer_id: answer_id ?? null,
            time: log?.time ?? "00:00:00",
          };
        });
      }

      const payload = {
        student_test_id: Number(localStorage.getItem("student_test_id")),
        answers: answersArray,
        finalize: isAutoSubmit || e?.type === "submit",
      };

      const response = await postApi("logs_answers/bulkSave", payload);
      setFinalScore(Math.floor(response.score));
      setAlreadyAnswered(true);

      removeExamLogsByTestCode(localStorage.getItem("test_code"));
      removeTestCode();
      removeStudentTestId();
    } catch (error) {
      setAlreadyAnswered(error?.response?.status === 409);
    } finally {
      setLoading(false);
    }
  };

  // Datos iniciales
  useEffect(() => {
    let isMounted = true;
    loadInitialExamData(isMounted);
    return () => { isMounted = false; };
  }, []);

  const loadInitialExamData = async (isMounted) => {
    setError(null);
    try {
      const evaluations = await getApi(`student_evaluations/list/${ci}`);
      if (!isMounted) return;

      if (!evaluations || evaluations.length === 0) {
        setError("No tienes evaluaciones asignadas.");
        setLoading(false);
        return;
      }

      setStudentEvaluations(evaluations);
      setStudentId(evaluations[0].student_id);
      setLoading(false);
    } catch (err) {
      if (isMounted) setError(err?.response?.data?.message || "Error al cargar datos");
      if (isMounted) setLoading(false);
    }
  };

  // Socket
  useEffect(() => {
    if (!questionsData?.student_test_id) return;

    const socket = io(URL_SOCKET, {
      transports: ["websocket"],
      query: { token: localStorage.getItem("jwt_token") },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Conectado al socket");
      const roomId = student.group?.toString();
      socket.emit("join", { roomId, role: "student" });
    });

    // 🟢 Evento de inicio de examen
    socket.on("start", (payload) => {
      console.log("🚀 START recibido:", payload);

      setSocketTimeData({
        started: true,
        timeLeft: payload.duration,
        timeFormatted: payload.timeFormatted,
        serverTime: payload.serverTime,
        examStatus: examStatuses.IN_PROGRESS,
      });
    });

    // 🟡 Evento de estado general ("msg")
    socket.on("msg", (payload) => {
      console.log("📨 MSG recibido:", payload);

      const status = payload.examStatus || examStatuses.WAITING;

      setSocketTimeData({
        started: status === examStatuses.IN_PROGRESS,
        timeLeft: payload.timeLeft ?? 0,
        timeFormatted: payload.timeFormatted ?? "00:00:00",
        serverTime: payload.serverTime,
        examStatus: status,
      });
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Socket desconectado del servidor");
    });

    return () => {
      socket.disconnect();
    };
  }, [questionsData?.student_test_id]);

  // Sincronización automática cada 30s
  useEffect(() => {
    if (!questionsData?.student_test_id) return;
    if (alreadyAnswered || socketTimeData.examStatus === examStatuses.COMPLETED) return;

    const interval = setInterval(syncAnswersToBackend, 30000);
    return () => clearInterval(interval);
  }, [questionsData?.student_test_id, alreadyAnswered, socketTimeData.examStatus]);

  // Cuando el estudiante selecciona una evaluación para empezar
  const handleSelectEvaluation = async (evaluation) => {
    console.log("Evaluación seleccionada:", evaluation);
    console.log("estado de la evaluacion:", socketTimeData.examStatus);
    setLoading(true);
    setSelectedEvaluation(evaluation); // Guardas el objeto seleccionado
    setError(null);

    try {
      // 👇 Aquí usas evaluation.evaluation_id (no evaluation.id)
      const response = await getStudentTestById(evaluation.student_id, evaluation.evaluation_id);

      setQuestionsData(response);
      localStorage.setItem("student_test_id", response.student_test_id);
      localStorage.setItem("test_code", response.test_code);
      setEvaluationTitle(evaluation.title);

      if (response?.examCompleted) {
        setAlreadyAnswered(true);
        setClosedByGroup(true);
      } else {
        const answeredResp = await getApi(`student_answers/list/${response.student_test_id}`);
        if (answeredResp?.answered) {
          setAlreadyAnswered(true);
          setFinalScore(Math.round(answeredResp.score));
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Error al cargar el examen seleccionado");
    } finally {
      setLoading(false);
    }
  }
  // Render
  if (loading) return <LoadingComponent title={evaluationTitle} />;
  if (error) return <p className="text-danger">{error}</p>;

  // Si aún no seleccionó evaluación
  if (!questionsData && studentEvaluations.length > 0) {
    return (
      <div className="container mt-4">
        <h4>Selecciona la evaluación que deseas rendir</h4>
        <ul className="list-group mt-3">
          {studentEvaluations.map((evalItem) => (
            <li
              key={evalItem.student_test_id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectEvaluation(evalItem)}
            >
              {evalItem.title}{" "}
              <span className="badge bg-secondary">{evalItem.status}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (alreadyAnswered) {
    return (
      <ExamStatusMessage
        closedByGroup={closedByGroup}
        stoppedByTeacher={stoppedByTeacher}
        finalScore={finalScore}
        studentId={studentId}
      />
    );
  }

  if (!questionsData?.questions) return <LoadingComponent title={evaluationTitle} />;
  if (socketTimeData.examStatus === examStatuses.WAITING)
    return (
      <div className="container mt-4 text-center">
        <Link to="/" className="btn btn-primary">
          Volver
        </Link>
        <h4>Esperando inicio del examen...</h4>
        <p>Permanece en esta ventana. El examen comenzará pronto.</p>
      </div>
    );

  if (socketTimeData.examStatus === examStatuses.PAUSED)
    return (
      <div className="container mt-4 text-center">
        <h4>El examen está pausado temporalmente</h4>
        <p>Espera a que el docente lo reanude.</p>
      </div>
    );

  return (
    <div className="container-fluid p-4">
      <ExamHeader
        evaluationTitle={evaluationTitle}
        testCode={questionsData?.test_code}
        socketTimeData={socketTimeData}
        examStarted={socketTimeData.started}
      />

      <div className="questions-container">
        {questionsData.questions.map((question, index) => (
          <QuestionCard
            key={question.question_id}
            question={question}
            index={index}
            API_BASE_URL={API_BASE_URL}
            selectedAnswers={selectedAnswers}
            examStarted={socketTimeData.started}
            handleAnswerSelection={handleAnswerSelection}
          />
        ))}
      </div>

      <SubmitSection
        loading={loading}
        socketTimeData={socketTimeData}
        examStarted={socketTimeData.started}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ViewQuestionsAndAnswers;

