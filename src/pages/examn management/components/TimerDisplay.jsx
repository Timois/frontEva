/* eslint-disable react/prop-types */
import { MdOutlineTimer } from "react-icons/md";

const TimerDisplay = ({ socketTimeData }) => {
  const { timeLeft, timeFormatted, examStatus } = socketTimeData || {};
  return (
    <div
      className="position-fixed top-20 end-0 bg-white text-dark px-3 py-2 rounded shadow border d-flex flex-column align-items-start"
      style={{ top: "80px", zIndex: 1050, minWidth: "220px" }}
    >
      {/* ⏱ Ícono + tiempo */}
      <div className="d-flex align-items-center">
        <MdOutlineTimer
          className={`me-2 fs-4 ${timeLeft <= 300 ? "text-danger" : "text-primary"}`}
        />
        <strong>Tiempo restante:</strong>
      </div>

      {/* 🕐 Tiempo dinámico */}
      <div className="mt-1">
        <span className={`fw-bold fs-5 ${timeLeft <= 300 ? "text-danger" : ""}`}>
          {timeFormatted}
        </span>
        {timeLeft <= 60 && timeLeft > 0 && (
          <span className="ms-2 badge bg-danger">¡URGENTE!</span>
        )}
        {timeLeft === 0 && (
          <span className="ms-2 badge bg-secondary">TIEMPO AGOTADO</span>
        )}
      </div>

      {/* 📘 Estado del examen */}
      {examStatus && (
        <div className="mt-2">
          <small className="text-muted">
            Estado:{" "}
            <span
              className={
                examStatus === "en_progreso"
                  ? "text-success fw-bold"
                  : examStatus === "pausado"
                  ? "text-warning fw-bold"
                  : examStatus === "completado"
                  ? "text-secondary fw-bold"
                  : "text-primary fw-bold"
              }
            >
              {examStatus.replace("_", " ")}
            </span>
          </small>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
