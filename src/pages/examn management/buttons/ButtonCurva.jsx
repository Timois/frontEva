/* eslint-disable react/prop-types */
import { FaChartLine } from "react-icons/fa";

export const ButtonCurva = ({ modalId }) => {
  return (
    <button
      type="button"
      className="btn btn-secondary justify-content-start w-25"
      style={{ backgroundColor: "#2d6806", color: "white" }}
      data-bs-toggle="modal"
      data-bs-target={`#${modalId}`}
    >
      <FaChartLine className="me-2" />
      Curva mínima
    </button>
  );
};
