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

  // Registrar respuesta en localStorage
  const registrarEnLocalStorage = (questionId, answerId, time) => {
    const key = `exam_logs_${localStorage.getItem("test_code")}`;
    const currentLogs = JSON.parse(localStorage.getItem(key)) || [];
    const updatedLogs = currentLogs.filter((log) => log.question_id !== questionId);
    updatedLogs.push({ question_id: questionId, answer_id: answerId, time });
    localStorage.setItem(key, JSON.stringify(updatedLogs));
  };

  // Sincronizar todas las respuestas al backend
  const syncAnswersToBackend = async () => {
    if (!questionsData?.student_test_id) return;
    const key = `exam_logs_${localStorage.getItem("test_code")}`;
    const logs = JSON.parse(localStorage.getItem(key)) || [];
    const logsToSync = logs.filter((log) => log.answer_id !== null);
    if (logsToSync.length === 0) return;

    try {
      await postApi("logs_answers/bulkSave", {
        student_test_id: Number(questionsData.student_test_id), // 🔹 aquí
        logs: logsToSync,
      });
      console.log("✅ Respuestas sincronizadas con el backend");
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

      // Asegurarse de sincronizar todos los logs antes de enviar
      await syncAnswersToBackend();

      let answersArray = [];
      if (isAutoSubmit) {
        const savedLogs = `exam_logs_${localStorage.getItem("test_code")}`;
        const logs = JSON.parse(localStorage.getItem(savedLogs)) || [];
        answersArray = logs.map((log) => ({ question_id: log.question_id, answer_id: log.answer_id }));
      } else {
        answersArray = Object.entries(selectedAnswers).map(([question_id, answer_id]) => ({
          question_id: Number(question_id),
          answer_id,
        }));
      }

      const payload = {
        student_test_id: parseInt(localStorage.getItem("student_test_id")),
        answers: answersArray,
      };
      console.log(parseInt(localStorage.getItem("student_test_id")))
      const response = await postApi("student_answers/save", payload);

      setFinalScore(Math.floor(response.total_score));
      setAlreadyAnswered(true);

      removeExamLogsByTestCode(localStorage.getItem("test_code"));
      removeTestCode();
      removeStudentTestId();
    } catch (error) {
      console.error("Error al guardar respuestas:", error);
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
      const fetchedStudentId = await getApi(`student_evaluations/list/${ci}`);
      if (!isMounted) return;
      const response = await getStudentTestById(fetchedStudentId);
      if (!isMounted) return;
      localStorage.setItem("student_test_id", response.student_test_id);
      if (response?.examCompleted) {
        setAlreadyAnswered(true);
        setClosedByGroup(true);
        setQuestionsData(response);
        setLoading(false);
        return;
      }

      setQuestionsData(response);
      localStorage.setItem("test_code", response.test_code);

      const evaluation = await getApi(`student_evaluations/find/${response.evaluation_id}`);
      if (!isMounted) return;
      setEvaluationTitle(evaluation.title);

      const answeredResp = await getApi(`student_answers/list/${response.student_test_id}`);
      if (!isMounted) return;

      if (answeredResp?.answered) {
        setAlreadyAnswered(true);
        setFinalScore(Math.round(answeredResp.score));
      }

      setLoading(false);
    } catch (err) {
      if (isMounted) setError(err?.response?.data?.message || "Error al cargar datos");
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    if (!questionsData?.student_test_id) return;

    const token = localStorage.getItem("jwt_token");

    // Inicializar socket solo una vez
    if (!socketRef.current) {
      socketRef.current = io(URL_SOCKET, { transports: ["websocket"], query: { token } });
    }

    const socket = socketRef.current;

    // 🔹 Conexión
    socket.on("connect", () => {
      console.log("✅ Conectado al socket:", socket.id);
      socket.emit("join", { roomId: student.group.toString(), role: "student" });
    });

    // 🔹 Confirmación de join
    socket.on("joined", (payload) => {
      console.log("📌 Cliente se unió a sala:", payload);
    });

    // 🔹 Error de conexión
    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión al socket:", err);
      customAlert(err || "No se pudo conectar al servidor de examen", "error");
    });

    // 🔹 Evento start
    socket.on("start", (payload) => {
      console.log("🚀 Evento 'start' recibido:", payload);
      const duration = payload?.duration ?? payload?.time ?? 0;
      setSocketTimeData({
        started: true,
        timeLeft: duration,
        timeFormatted: payload?.timeFormatted ?? new Date(duration * 1000).toISOString().substr(11, 8),
        serverTime: payload?.serverTime ?? new Date().toLocaleTimeString("es-ES", { timeZone: "America/La_Paz" }),
        examStatus: examStatuses.IN_PROGRESS,
      });
    });

    // 🔹 Evento msg (actualización de tiempo y estado)
    socket.on("msg", async (payload) => {
      const serverStatus = payload?.examStatus ?? (payload?.isStarted ? examStatuses.IN_PROGRESS : examStatuses.PAUSED);

      if (serverStatus === examStatuses.COMPLETED || payload?.examCompleted) {
        setSocketTimeData({
          started: false,
          timeLeft: 0,
          timeFormatted: "00:00:00",
          serverTime: payload?.serverTime ?? new Date().toLocaleTimeString("es-ES", { timeZone: "America/La_Paz" }),
          examStatus: examStatuses.COMPLETED,
        });

        if (!alreadyAnswered) {
          await handleSubmit(null, true);
        }

        if (payload?.reason === "stopped") setStoppedByTeacher(true);
      } else {
        // Actualiza tiempo y estado
        setSocketTimeData((prev) => ({
          ...prev,
          examStatus: serverStatus,
          started: serverStatus === examStatuses.IN_PROGRESS,
          timeLeft: payload?.timeLeft ?? prev.timeLeft,
          timeFormatted: payload?.timeFormatted ?? prev.timeFormatted,
          serverTime: payload?.serverTime ?? prev.serverTime,
        }));
      }
    });

    // 🔹 Cleanup
    return () => {
      if (socketRef.current) {
        socket.off("start");
        socket.off("msg");
        socket.off("joined");
        socket.off("connect_error");
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [questionsData?.student_test_id, alreadyAnswered]);

  // 🔹 Sincronización automática cada 30s
  useEffect(() => {
    if (!questionsData?.student_test_id) return;
    const interval = setInterval(syncAnswersToBackend, 30000);
    return () => clearInterval(interval);
  }, [questionsData?.student_test_id]);

  // Render
  if (loading) return <LoadingComponent title={evaluationTitle} />;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (alreadyAnswered) {
    return (
      <ExamStatusMessage
        closedByGroup={closedByGroup}
        stoppedByTeacher={stoppedByTeacher}
        finalScore={finalScore}
        studentId={student?.id}
      />
    );
  }
  if (!questionsData?.questions) return <LoadingComponent title={evaluationTitle} />;
  if (socketTimeData.examStatus === examStatuses.WAITING)
    return (
      <div className="container mt-4 text-center">
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
