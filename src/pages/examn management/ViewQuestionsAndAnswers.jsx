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
import { VITE_URL_IMAGES, VITE_URL_WEBSOCKET } from "../../utils/constants";
import ExamStatusMessage from "./components/ExamStatusMessage";
import { useLocation, useNavigate } from "react-router-dom";
import WaitingExam from "./components/ExamStates/WaitingExam";
import PausedExam from "./components/ExamStates/PausedExam";
import ActiveExam from "./components/ActiveExam";
import { FaCheckCircle, FaClipboardList, FaClock } from "react-icons/fa";

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
  const location = useLocation();
  useEffect(() => {
    let isMounted = true;
    loadInitialExamData(isMounted);
    return () => { isMounted = false; };
  }, [location.pathname]);

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

  // --- Nueva función auxiliar ---
  const handleExamAutoFinish = async (reason = "unknown") => {
    try {
      await handleSubmit(null, true); // ✅ Llamamos a handleSubmit en modo automático
      setAlreadyAnswered(true);
      removeExamLogsByTestCode(localStorage.getItem("test_code"));
      removeTestCode();
      removeStudentTestId();

      if (reason === "stopped") {
        setStoppedByTeacher(true);
      } else if (reason === "timeup") {
        setClosedByGroup(true);
      }

      setSocketTimeData((prev) => ({
        ...prev,
        examStatus: examStatuses.COMPLETED,
        timeLeft: 0,
        timeFormatted: "00:00:00",
      }));
    } catch (err) {
      console.error("❌ Error al guardar automáticamente:", err);
    }
  };


  // --- Reemplaza TODO este useEffect ---
  useEffect(() => {
    if (!questionsData?.student_test_id) return;

    const socket = io(URL_SOCKET, {
      transports: ["websocket"],
      query: { token: localStorage.getItem("jwt_token") },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      const roomId = student.group?.toString();
      socket.emit("join", { roomId, role: "student" });
    });

    // 🟢 Evento de inicio de examen
    socket.on("start", (payload) => {
      setSocketTimeData({
        started: true,
        timeLeft: payload.duration,
        timeFormatted: payload.timeFormatted,
        serverTime: payload.serverTime,
        examStatus: examStatuses.IN_PROGRESS,
      });
    });

    // 🟡 Evento de estado general
    socket.on("msg", async (payload) => {
      const { examStatus, timeLeft, timeFormatted, reason } = payload;

      setSocketTimeData((prev) => ({
        ...prev,
        timeLeft: timeLeft ?? prev.timeLeft,
        timeFormatted: timeFormatted ?? prev.timeFormatted,
        examStatus: examStatus ?? prev.examStatus,
      }));

      // 🔴 Detectar finalización automática
      if (examStatus === examStatuses.COMPLETED) {
        if (reason === "stopped") {
          await handleExamAutoFinish("stopped");
        } else if (reason === "timeup") {
          await handleExamAutoFinish("timeup");
        }
      }
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

  const navigate = useNavigate();

  const handleSelectEvaluation = async (evaluation) => {
    setLoading(true);
    setSelectedEvaluation(evaluation);
    setError(null);

    try {
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
      navigate(`/estudiantes/exams/${evaluation.evaluation_id}`);

    } catch (err) {
      setError(err?.response?.data?.message || "Error al cargar el examen seleccionado");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingComponent title={evaluationTitle} />;
  if (error) return <p className="text-danger">{error}</p>;
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

  if (!questionsData && studentEvaluations.length > 0) {
    return (
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white text-center py-3 rounded-top">
            <h5 className="mb-0">Selecciona la evaluación que deseas rendir</h5>
          </div>
          <ul className="list-group list-group-flush">
            {studentEvaluations.map((evalItem) => {
              const rawStatus = (evalItem.group_status || "").toString().trim().toLowerCase();
              let statusBadge = "";
              let statusText = "";
              let statusIcon = null;

              switch (rawStatus) {
                case "pendiente":
                case "pending":
                  statusBadge = "bg-warning text-dark";
                  statusText = "Pendiente";
                  statusIcon = <FaClock className="me-1" />;
                  break;

                case "en_progreso":
                case "in_progress":
                  statusBadge = "bg-success";
                  statusText = "En progreso";
                  statusIcon = <FaClipboardList className="me-1" />;
                  break;

                case "completado":
                case "finalizado":
                case "completed":
                  statusBadge = "bg-secondary";
                  statusText = "Completado";
                  statusIcon = <FaCheckCircle className="me-1" />;
                  break;

                default:
                  statusBadge = "bg-light text-dark";
                  statusText = rawStatus || "Desconocido";
                  break;
              }

              return (
                <li
                  key={evalItem.student_test_id}
                  className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectEvaluation(evalItem)}
                >
                  <div>
                    <h6 className="mb-1 text-dark">{evalItem.title}</h6>
                    <small className="d-block text-muted text-capitalize">
                      <strong>Carrera:</strong> {evalItem.career_name} <br />
                      <strong>Periodo:</strong> {evalItem.period_name} <br />
                      <strong>Gestión:</strong> {evalItem.gestion_year}
                    </small>
                    <small className="text-muted d-block mt-1">
                      <strong>Estado:</strong>{" "}
                      <span className={`badge ${statusBadge}`}>
                        {statusIcon} {statusText}
                      </span>
                    </small>
                  </div>

                  <button className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-play-circle me-1"></i> Entrar
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  if (!questionsData?.questions) return <LoadingComponent title={evaluationTitle} />;

  switch (socketTimeData.examStatus) {
    case examStatuses.WAITING:
      return <WaitingExam />;
    case examStatuses.PAUSED:
      return <PausedExam />;
    default:
      return (
        <ActiveExam
          evaluationTitle={evaluationTitle}
          questionsData={questionsData}
          socketTimeData={socketTimeData}
          selectedAnswers={selectedAnswers}
          API_BASE_URL={API_BASE_URL}
          handleAnswerSelection={handleAnswerSelection}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      );
  }

};

export default ViewQuestionsAndAnswers;

