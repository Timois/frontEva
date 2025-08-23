/* eslint-disable react/prop-types */
import { MdOutlineTimer } from "react-icons/md";

const TimerDisplay = ({ socketTimeData }) => (
  <div
    className="position-fixed top-20 end-0 bg-white text-dark px-3 py-2 rounded shadow border d-flex align-items-center"
    style={{ top: "80px", zIndex: 1050 }}
  >
    <MdOutlineTimer
      className={`me-2 fs-4 ${socketTimeData.timeLeft <= 300 ? "text-danger" : "text-primary"}`}
    />
    <strong>Tiempo restante:</strong>
    <span
      className={`ms-2 fw-bold fs-5 ${socketTimeData.timeLeft <= 300 ? "text-danger" : ""}`}
    >
      {socketTimeData.timeFormatted}
    </span>
    {socketTimeData.timeLeft <= 60 && socketTimeData.timeLeft > 0 && (
      <span className="ms-2 badge bg-danger">¡URGENTE!</span>
    )}
    {socketTimeData.timeLeft === 0 && (
      <span className="ms-2 badge bg-secondary">TIEMPO AGOTADO</span>
    )}
  </div>
);

export default TimerDisplay;
