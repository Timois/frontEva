/* eslint-disable react/prop-types */

import { FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ButtonAssignQuestions = ({ examnId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/administracion/examns/${examnId}/assignQuestions`);
  };

  return (
    <button
      type="button"
      className="btn btn-primary btn-sm ms-2"
      title="Asignar preguntas"
      onClick={handleClick}
    >
      <FaClipboardList />
    </button>
  );
};

export default ButtonAssignQuestions;
