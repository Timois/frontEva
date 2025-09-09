/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { getApi, postApi } from "../../services/axiosServices/ApiService";
import { usFetchStudentTest } from "../../hooks/fetchStudent";
import { Link } from "react-router-dom";
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

// Estados unificados (igual que en la BD)
const examStatuses = {
  WAITING: "pendiente",
  IN_PROGRESS: "en_progreso",
  PAUSED: "pausado",
  COMPLETED: "completado",
};

const ViewQuestionsAndAnswers = () => {
  const [questionsData, setQuestionsData] = useState(null);
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

  // Estado unificado del examen
  const [socketTimeData, setSocketTimeData] = useState({
    started: false,
    timeLeft: null,
    timeFormatted: "00:00:00",
    serverTime: null,
    examStatus: examStatuses.WAITING, // por defecto pendiente
  });

  const registrarEnLocalStorage = (questionId, answerId, time) => {
    const key = `exam_logs_${localStorage.getItem("test_code")}`;
    const currentLogs = JSON.parse(localStorage.getItem(key)) || [];
    const updatedLogs = currentLogs.filter(
      (log) => log.question_id !== questionId
    );
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
    // Solo seleccionar si examen está en curso
    if (socketTimeData.examStatus !== examStatuses.IN_PROGRESS) return;

    const ahora = Date.now();
    const tiempoFormateado = new Date(ahora).toLocaleTimeString("es-ES", {
      hour12: false,
    });

    registrarEnLocalStorage(questionId, answerId, tiempoFormateado);

    if (currentQuestionId && currentQuestionId !== questionId) {
      const ultimaRespuesta = selectedAnswers[currentQuestionId];
      if (ultimaRespuesta) {
        const tiempoUltimaRespuesta = new Date(
          tiempoInicioRef.current
        ).toLocaleTimeString("es-ES", { hour12: false });
        guardarEnBackend(
          currentQuestionId,
          ultimaRespuesta,
          tiempoUltimaRespuesta
        );
      }
    }

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    setCurrentQuestionId(questionId);
    tiempoInicioRef.current = ahora;
  };

  const handleSubmit = async (e, isAutoSubmit = false) => {
    if (e) e.preventDefault();
    if (currentQuestionId && selectedAnswers[currentQuestionId]) {
      const tiempoFormateado = new Date(
        tiempoInicioRef.current
      ).toLocaleTimeString("es-ES", { hour12: false });
      await guardarEnBackend(
        currentQuestionId,
        selectedAnswers[currentQuestionId],
        tiempoFormateado
      );
    }

    try {
      setLoading(true);

      let answersArray = [];

      if (isAutoSubmit) {
        const savedLogs = `exam_logs_${localStorage.getItem("test_code")}`;
        const logs = JSON.parse(localStorage.getItem(savedLogs)) || [];
        answersArray = logs.map((log) => ({
          question_id: log.question_id,
          answer_id: log.answer_id,
        }));
      } else {
        answersArray = Object.entries(selectedAnswers).map(
          ([question_id, answer_id]) => ({
            question_id: Number(question_id),
            answer_id,
          })
        );
      }

      const payload = {
        student_test_id: parseInt(localStorage.getItem("student_test_id")),
        answers: answersArray,
      };

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

  // Cargar datos iniciales
  useEffect(() => {
    let isMounted = true;
    loadInitialExamData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const loadInitialExamData = async (isMounted) => {
    setError(null);
    try {
      const fetchedStudentId = await getApi(`student_evaluations/list/${ci}`);
      if (!isMounted) return;
      setStudentId(fetchedStudentId);

      const response = await getStudentTestById(fetchedStudentId);
      if (!isMounted) return;
      setQuestionsData(response);
      localStorage.setItem("test_code", response.test_code);

      const evaluation = await getApi(
        `student_evaluations/find/${response.evaluation_id}`
      );
      if (!isMounted) return;
      setEvaluationTitle(evaluation.title);

      const answeredResp = await getApi(
        `student_answers/list/${response.student_test_id}`
      );
      if (!isMounted) return;

      const key = `exam_logs_${response.test_code}`;
      const savedLogs = JSON.parse(localStorage.getItem(key)) || [];
      let savedAnswers = {};

      if (savedLogs.length > 0) {
        savedLogs.forEach((log) => {
          savedAnswers[log.question_id] = log.answer_id;
        });
      } else {
        try {
          const logsBackend = await getApi(
            `logs_answers/list/${response.student_test_id}`
          );
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

      setLoading(false);
    } catch (err) {
      if (isMounted)
        setError(err?.response?.data?.message || "Error al cargar datos");
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  // Conectar socket y escuchar eventos
  // Conectar socket y escuchar eventos
  useEffect(() => {
    if (questionsData?.student_test_id) {
      localStorage.setItem("student_test_id", questionsData.student_test_id);
    }

    const token = localStorage.getItem("jwt_token");

    const socketClient = io("http://127.0.0.1:3000", {
      transports: ["websocket"],
      query: { token },
    });

    socketClient.on("connect", () => {
      socketClient.emit("join", {
        roomId: student.group.toString(),
        role: "student",
      });
    });

    // Si el backend emite un "start" con duration
    socketClient.on("start", (payload) => {
      const duration = payload?.duration ?? payload?.time ?? 0;
      setSocketTimeData((prev) => ({
        ...prev,
        started: true,
        timeLeft: duration,
        timeFormatted: payload?.timeFormatted,
        serverTime:
          payload?.serverTime ??
          new Date().toLocaleTimeString("es-ES", {
            timeZone: "America/La_Paz",
          }),
        examStatus: examStatuses.IN_PROGRESS,
      }));
    });

    // Evento principal: backend envía { examStatus, timeLeft, timeFormatted, serverTime, examCompleted? }
    socketClient.on("msg", (payload) => {
      let serverStatus =
        payload?.examStatus ??
        (payload?.isStarted !== undefined
          ? (payload.isStarted
            ? examStatuses.IN_PROGRESS
            : examStatuses.PAUSED)
          : null);

      // 🔹 Normalizar estados que vienen como string desde el backend
      if (serverStatus === "pausado") serverStatus = examStatuses.PAUSED;
      if (serverStatus === "en_progreso") serverStatus = examStatuses.IN_PROGRESS;
      if (serverStatus === "completado") serverStatus = examStatuses.COMPLETED;
      if (serverStatus === "pendiente") serverStatus = examStatuses.WAITING;

      if (serverStatus === examStatuses.IN_PROGRESS) {
        setSocketTimeData((prev) => {
          const newTimeLeft = payload?.timeLeft ?? prev?.timeLeft ?? 0;
          return {
            ...prev,
            started: true,
            timeLeft: newTimeLeft,
            timeFormatted: payload?.timeFormatted,
            serverTime:
              payload?.serverTime ??
              new Date().toLocaleTimeString("es-ES", {
                timeZone: "America/La_Paz",
              }),
            examStatus: examStatuses.IN_PROGRESS,
          };
        });
        return;
      }

      if (serverStatus === examStatuses.PAUSED) {
        setSocketTimeData((prev) => ({
          ...prev,
          started: false,
          examStatus: examStatuses.PAUSED,
        }));
        return;
      }

      if (serverStatus === examStatuses.COMPLETED || payload?.examCompleted) {
        setSocketTimeData((prev) => ({
          ...prev,
          started: false,
          timeLeft: 0,
          timeFormatted: "00:00:00",
          serverTime:
            payload?.serverTime ??
            new Date().toLocaleTimeString("es-ES", {
              timeZone: "America/La_Paz",
            }),
          examStatus: examStatuses.COMPLETED,
        }));
        if (!alreadyAnswered) handleSubmit(null, true);
        return;
      }
    });

    return () => {
      socketClient.off("start");
      socketClient.off("msg");
      socketClient.disconnect();
    };
  }, [student.group, alreadyAnswered, questionsData]);


  // Renderizado
  if (loading) return <LoadingComponent title={evaluationTitle} />;
  if (error) return <p className="text-danger">Error: {error}</p>;

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

  if (!questionsData?.questions)
    return <LoadingComponent title={evaluationTitle} />;

  // Estado esperando inicio
  if (socketTimeData.examStatus === examStatuses.WAITING) {
    return (
      <div className="container mt-4 text-center">
        <h4>Esperando inicio del examen...</h4>
        <p>Permanece en esta ventana. El examen comenzará pronto.</p>
      </div>
    );
  }

  // Estado pausado
  if (socketTimeData.examStatus === examStatuses.PAUSED) {
    return (
      <div className="container mt-4 text-center">
        <h4>El examen está pausado temporalmente</h4>
        <p>Espera a que el docente lo reanude.</p>
      </div>
    );
  }

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
